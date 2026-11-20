/**
 * Pure game logic for Categhero. No DOM, no storage, no clock: callers pass
 * in randomness (`rng`) and time, so every rule here is unit-testable.
 * Rules come from SPEC sections 2.1 to 2.4.
 */

export const TIME_LIMIT_MS = 10_000;
export const START_LIVES = 3;
export const OPTION_COUNT = 4;
export const NEIGHBOUR_POOL = 8;
export const MIN_CHALLENGE_ITEMS = 20;
export const DAY_MS = 86_400_000;

export type Rng = () => number;

export interface Item {
  id: string;
  answer: string;
  /** Optional manual wrong answers (community categories), used first. */
  wrongAnswers?: string[];
  /** Map position (map presets). When present, wrong options come from the nearest neighbours. */
  pos?: { x: number; y: number };
}

export interface Option {
  /** Item id for auto options, `manual:<n>` for typed wrong answers. */
  id: string;
  label: string;
}

export interface Question {
  itemId: string;
  answer: string;
  options: Option[];
}

export type Mode = "challenge" | "practice";

export interface AnswerRecord {
  itemId: string;
  chosenId: string | null;
  correct: boolean;
  timedOut: boolean;
  elapsedMs: number;
}

export interface RunState {
  mode: Mode;
  questions: Question[];
  index: number;
  lives: number;
  score: number;
  totalTimeMs: number;
  answers: AnswerRecord[];
  finished: boolean;
}

/* ---------- randomness ---------- */

export function shuffle<T>(arr: readonly T[], rng: Rng = Math.random): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Deterministic PRNG for tests and reproducible runs. */
export function seededRng(seed: number): Rng {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- options ---------- */

const norm = (s: string) => s.trim().toLowerCase();

/** The k items closest to `target` on the map, nearest first. */
export function nearestNeighbours(target: Item, items: readonly Item[], k = NEIGHBOUR_POOL): Item[] {
  const p = target.pos;
  if (!p) return [];
  return items
    .filter((x) => x.id !== target.id && x.pos)
    .map((x) => ({ x, d: (x.pos!.x - p.x) ** 2 + (x.pos!.y - p.y) ** 2 }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
    .map((o) => o.x);
}

/**
 * Four options with exactly one correct, in random order.
 * Order of sources for wrong options: manual wrong answers, then map neighbours
 * (if the item has a position), then any other item of the category.
 * Labels never repeat (case-insensitive).
 */
export function makeOptions(target: Item, items: readonly Item[], rng: Rng = Math.random): Option[] {
  const used = new Set([norm(target.answer)]);
  const wrong: Option[] = [];
  const add = (o: Option) => {
    if (wrong.length >= OPTION_COUNT - 1) return;
    const key = norm(o.label);
    if (!key || used.has(key)) return;
    used.add(key);
    wrong.push(o);
  };

  (target.wrongAnswers ?? []).forEach((label, n) => add({ id: `manual:${n}`, label }));
  for (const x of shuffle(nearestNeighbours(target, items), rng)) add({ id: x.id, label: x.answer });
  for (const x of shuffle(items.filter((x) => x.id !== target.id), rng)) add({ id: x.id, label: x.answer });

  return shuffle([{ id: target.id, label: target.answer }, ...wrong], rng);
}

/* ---------- run ---------- */

export function createRun(items: readonly Item[], mode: Mode, rng: Rng = Math.random): RunState {
  const questions = shuffle(items, rng).map((it) => ({
    itemId: it.id,
    answer: it.answer,
    options: makeOptions(it, items, rng),
  }));
  return {
    mode,
    questions,
    index: 0,
    lives: START_LIVES,
    score: 0,
    totalTimeMs: 0,
    answers: [],
    finished: questions.length === 0,
  };
}

export function currentQuestion(s: RunState): Question | null {
  return s.finished ? null : s.questions[s.index] ?? null;
}

/**
 * Apply one answer. `chosenId === null` is a timeout.
 * Challenge: a wrong answer or a timeout costs a life; elapsed time is clamped to
 * the limit and a timeout counts as the full limit. Practice: no lives, no time.
 */
export function answerQuestion(s: RunState, chosenId: string | null, elapsedMs: number): RunState {
  const q = currentQuestion(s);
  if (!q) return s;
  const challenge = s.mode === "challenge";
  const timedOut = challenge && (chosenId === null || elapsedMs >= TIME_LIMIT_MS);
  const correct = !timedOut && chosenId === q.itemId;
  const spent = !challenge ? 0 : timedOut ? TIME_LIMIT_MS : Math.max(0, Math.min(TIME_LIMIT_MS, Math.round(elapsedMs)));
  const lives = challenge && !correct ? s.lives - 1 : s.lives;
  const index = s.index + 1;
  return {
    ...s,
    index,
    lives,
    score: s.score + (correct ? 1 : 0),
    totalTimeMs: s.totalTimeMs + spent,
    answers: [...s.answers, { itemId: q.itemId, chosenId, correct, timedOut, elapsedMs: spent }],
    finished: (challenge && lives <= 0) || index >= s.questions.length,
  };
}

/* ---------- rankings ---------- */

export type Period = "total" | "month" | "week";
export const PERIODS: Period[] = ["total", "month", "week"];
export const PERIOD_DAYS: Record<Period, number | null> = { total: null, month: 30, week: 7 };

export interface RunRecord {
  id: string;
  playerId: string;
  playerName: string;
  categoryId: string;
  score: number;
  totalTimeMs: number;
  finishedAt: number;
}

/** Score desc, then total time asc, then earliest finish. */
export function compareRuns(a: RunRecord, b: RunRecord): number {
  return b.score - a.score || a.totalTimeMs - b.totalTimeMs || a.finishedAt - b.finishedAt;
}

export interface RankingQuery {
  categoryId: string;
  period: Period;
  now: number;
  /** Category creator, never ranked in their own category. */
  excludePlayerId?: string | null;
}

/** Best finished run of each player in the sliding window, sorted. */
export function ranking(runs: readonly RunRecord[], q: RankingQuery): RunRecord[] {
  const days = PERIOD_DAYS[q.period];
  const since = days === null ? -Infinity : q.now - days * DAY_MS;
  const best = new Map<string, RunRecord>();
  for (const r of runs) {
    if (r.categoryId !== q.categoryId || r.finishedAt < since || r.finishedAt > q.now) continue;
    if (q.excludePlayerId && r.playerId === q.excludePlayerId) continue;
    const b = best.get(r.playerId);
    if (!b || compareRuns(r, b) < 0) best.set(r.playerId, r);
  }
  return [...best.values()].sort(compareRuns);
}

/** 1-based position of a player, or 0 when absent. */
export function positionOf(list: readonly RunRecord[], playerId: string): number {
  return list.findIndex((r) => r.playerId === playerId) + 1;
}

export interface LeadChange {
  period: Period;
  previous: RunRecord;
}

/**
 * Tabs where `playerId` holds #1 after the run and someone else held it before.
 * Passing someone below #1 never counts (SPEC 2.5, 8).
 */
export function leadChanges(
  before: readonly RunRecord[],
  newRun: RunRecord,
  q: Omit<RankingQuery, "period" | "now">,
  now: number,
): LeadChange[] {
  const out: LeadChange[] = [];
  for (const period of PERIODS) {
    const prev = ranking(before, { ...q, period, now })[0];
    const next = ranking([...before, newRun], { ...q, period, now })[0];
    if (prev && next && next.playerId === newRun.playerId && prev.playerId !== newRun.playerId) {
      out.push({ period, previous: prev });
    }
  }
  return out;
}

/* ---------- formatting ---------- */

/** m:ss */
export function formatTime(ms: number): string {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
