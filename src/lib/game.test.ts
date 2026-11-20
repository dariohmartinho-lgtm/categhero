import { describe, expect, it } from "vitest";
import {
  DAY_MS,
  START_LIVES,
  TIME_LIMIT_MS,
  answerQuestion,
  compareRuns,
  createRun,
  currentQuestion,
  formatTime,
  leadChanges,
  makeOptions,
  nearestNeighbours,
  positionOf,
  ranking,
  seededRng,
  shuffle,
  type Item,
  type RunRecord,
  type RunState,
} from "./game";
import { europeItems } from "@/data/europe";

const plain = (n: number): Item[] =>
  Array.from({ length: n }, (_, i) => ({ id: `i${i}`, answer: `Answer ${i}` }));

/** Answer the current question correctly or wrongly. */
const right = (s: RunState, ms = 1000) => answerQuestion(s, currentQuestion(s)!.itemId, ms);
const wrong = (s: RunState, ms = 1000) => {
  const q = currentQuestion(s)!;
  return answerQuestion(s, q.options.find((o) => o.id !== q.itemId)!.id, ms);
};

describe("shuffle", () => {
  it("keeps every element and does not mutate the input", () => {
    const a = [1, 2, 3, 4, 5, 6];
    const b = shuffle(a, seededRng(1));
    expect(a).toEqual([1, 2, 3, 4, 5, 6]);
    expect([...b].sort()).toEqual(a);
  });

  it("produces different orders for different runs", () => {
    const items = plain(20);
    const orders = new Set(
      [1, 2, 3, 4, 5].map((seed) => createRun(items, "challenge", seededRng(seed)).questions.map((q) => q.itemId).join()),
    );
    expect(orders.size).toBeGreaterThan(1);
  });
});

describe("makeOptions", () => {
  it("returns 4 unique options with exactly one correct", () => {
    const items = plain(20);
    for (let seed = 0; seed < 50; seed++) {
      const opts = makeOptions(items[3], items, seededRng(seed));
      expect(opts).toHaveLength(4);
      expect(opts.filter((o) => o.id === "i3")).toHaveLength(1);
      expect(new Set(opts.map((o) => o.label.toLowerCase())).size).toBe(4);
    }
  });

  it("shuffles the position of the correct option", () => {
    const items = plain(20);
    const spots = new Set(
      Array.from({ length: 40 }, (_, seed) => makeOptions(items[0], items, seededRng(seed)).findIndex((o) => o.id === "i0")),
    );
    expect(spots.size).toBe(4);
  });

  it("draws map options only from the 8 nearest neighbours", () => {
    const items = europeItems();
    for (const target of items) {
      const near = new Set(nearestNeighbours(target, items).map((x) => x.id));
      expect(near.size).toBe(8);
      for (let seed = 0; seed < 10; seed++) {
        for (const o of makeOptions(target, items, seededRng(seed))) {
          if (o.id !== target.id) expect(near.has(o.id)).toBe(true);
        }
      }
    }
  });

  it("picks plausible neighbours for Portugal", () => {
    const items = europeItems();
    const pt = items.find((i) => i.id === "Portugal")!;
    const near = nearestNeighbours(pt, items).map((x) => x.id);
    expect(near[0]).toBe("Spain");
    expect(near).not.toContain("Ukraine");
  });

  it("uses manual wrong answers first and fills the rest automatically", () => {
    const items = plain(20);
    items[0] = { ...items[0], wrongAnswers: ["Decoy A"] };
    const opts = makeOptions(items[0], items, seededRng(7));
    expect(opts.map((o) => o.label)).toContain("Decoy A");
    expect(opts).toHaveLength(4);
  });

  it("uses all three manual wrong answers when given", () => {
    const items = plain(20);
    items[0] = { ...items[0], wrongAnswers: ["X", "Y", "Z"] };
    const labels = makeOptions(items[0], items, seededRng(2)).map((o) => o.label).sort();
    expect(labels).toEqual(["Answer 0", "X", "Y", "Z"]);
  });

  it("ignores manual wrong answers that repeat the correct answer", () => {
    const items = plain(20);
    items[0] = { ...items[0], wrongAnswers: ["answer 0", "Other"] };
    const labels = makeOptions(items[0], items, seededRng(2)).map((o) => o.label.toLowerCase());
    expect(labels.filter((l) => l === "answer 0")).toHaveLength(1);
  });

  it("skips other items whose answer duplicates the correct one", () => {
    const items = plain(20);
    items[1] = { ...items[1], answer: "Answer 0" };
    for (let seed = 0; seed < 30; seed++) {
      const labels = makeOptions(items[0], items, seededRng(seed)).map((o) => o.label);
      expect(labels.filter((l) => l === "Answer 0")).toHaveLength(1);
    }
  });
});

describe("challenge run", () => {
  it("starts with 3 lives, score 0, all items queued", () => {
    const s = createRun(plain(20), "challenge", seededRng(1));
    expect(s.lives).toBe(START_LIVES);
    expect(s.score).toBe(0);
    expect(s.questions).toHaveLength(20);
    expect(new Set(s.questions.map((q) => q.itemId)).size).toBe(20);
  });

  it("score counts correct answers", () => {
    let s = createRun(plain(20), "challenge", seededRng(1));
    s = right(s);
    s = right(s);
    s = wrong(s);
    expect(s.score).toBe(2);
    expect(s.lives).toBe(2);
  });

  it("a timeout costs a life and counts as 10 000 ms", () => {
    let s = createRun(plain(20), "challenge", seededRng(1));
    s = answerQuestion(s, null, 10_000);
    expect(s.lives).toBe(2);
    expect(s.totalTimeMs).toBe(TIME_LIMIT_MS);
    expect(s.answers[0]).toMatchObject({ timedOut: true, correct: false, elapsedMs: 10_000 });
  });

  it("an answer arriving after the limit counts as a timeout", () => {
    let s = createRun(plain(20), "challenge", seededRng(1));
    s = answerQuestion(s, currentQuestion(s)!.itemId, 12_000);
    expect(s.score).toBe(0);
    expect(s.lives).toBe(2);
    expect(s.totalTimeMs).toBe(10_000);
  });

  it("ends when lives reach 0", () => {
    let s = createRun(plain(20), "challenge", seededRng(1));
    s = right(s);
    s = wrong(s);
    s = wrong(s);
    expect(s.finished).toBe(false);
    s = wrong(s);
    expect(s.finished).toBe(true);
    expect(s.lives).toBe(0);
    expect(currentQuestion(s)).toBeNull();
    expect(answerQuestion(s, "i0", 100)).toBe(s);
  });

  it("ends after all items without looping", () => {
    let s = createRun(plain(20), "challenge", seededRng(1));
    for (let i = 0; i < 20; i++) s = right(s, 2000);
    expect(s.finished).toBe(true);
    expect(s.score).toBe(20);
    expect(s.totalTimeMs).toBe(40_000);
    expect(s.answers).toHaveLength(20);
  });

  it("total time sums answer times", () => {
    let s = createRun(plain(20), "challenge", seededRng(1));
    s = right(s, 1234.4);
    s = wrong(s, 2000);
    expect(s.totalTimeMs).toBe(3234);
  });
});

describe("practice run", () => {
  it("has no lives lost, no time, and covers every item", () => {
    let s = createRun(plain(20), "practice", seededRng(1));
    for (let i = 0; i < 20; i++) s = wrong(s, 50_000);
    expect(s.finished).toBe(true);
    expect(s.lives).toBe(START_LIVES);
    expect(s.totalTimeMs).toBe(0);
    expect(s.score).toBe(0);
  });
});

const run = (p: string, score: number, t: number, ago: number, now: number, cat = "c"): RunRecord => ({
  id: `${p}-${score}-${t}-${ago}`,
  playerId: p,
  playerName: p.toUpperCase(),
  categoryId: cat,
  score,
  totalTimeMs: t,
  finishedAt: now - ago,
});

describe("rankings", () => {
  const now = 1_800_000_000_000;

  it("sorts by score desc, then time asc, then earliest finish", () => {
    const a = run("a", 15, 90_000, 5000, now);
    const b = run("b", 15, 80_000, 1000, now);
    const c = run("c", 16, 120_000, 0, now);
    const d = run("d", 15, 80_000, 9000, now);
    const list = ranking([a, b, c, d], { categoryId: "c", period: "total", now });
    expect(list.map((r) => r.playerId)).toEqual(["c", "d", "b", "a"]);
    expect(compareRuns(d, b)).toBeLessThan(0);
  });

  it("keeps only the best run of each player", () => {
    const list = ranking(
      [run("a", 10, 1, 0, now), run("a", 12, 99_000, 0, now), run("a", 12, 50_000, 0, now)],
      { categoryId: "c", period: "total", now },
    );
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ score: 12, totalTimeMs: 50_000 });
  });

  it("weekly and monthly use sliding windows", () => {
    const runs = [
      run("old", 20, 1, 40 * DAY_MS, now),
      run("month", 19, 1, 10 * DAY_MS, now),
      run("week", 18, 1, 2 * DAY_MS, now),
    ];
    const ids = (period: "total" | "month" | "week") =>
      ranking(runs, { categoryId: "c", period, now }).map((r) => r.playerId);
    expect(ids("total")).toEqual(["old", "month", "week"]);
    expect(ids("month")).toEqual(["month", "week"]);
    expect(ids("week")).toEqual(["week"]);
  });

  it("a player's weekly best can differ from their all-time best", () => {
    const runs = [run("a", 20, 1, 20 * DAY_MS, now), run("a", 12, 1, DAY_MS, now)];
    expect(ranking(runs, { categoryId: "c", period: "total", now })[0].score).toBe(20);
    expect(ranking(runs, { categoryId: "c", period: "week", now })[0].score).toBe(12);
  });

  it("ignores other categories and excludes the creator", () => {
    const runs = [run("a", 5, 1, 0, now), run("owner", 20, 1, 0, now), run("x", 20, 1, 0, now, "other")];
    const list = ranking(runs, { categoryId: "c", period: "total", now, excludePlayerId: "owner" });
    expect(list.map((r) => r.playerId)).toEqual(["a"]);
  });

  it("positionOf is 1-based and 0 when absent", () => {
    const list = ranking([run("a", 5, 1, 0, now), run("b", 6, 1, 0, now)], { categoryId: "c", period: "total", now });
    expect(positionOf(list, "b")).toBe(1);
    expect(positionOf(list, "a")).toBe(2);
    expect(positionOf(list, "z")).toBe(0);
  });
});

describe("leadership changes", () => {
  const now = 1_800_000_000_000;
  const q = { categoryId: "c" };

  it("reports the tabs where the lead was taken from someone else", () => {
    const before = [run("marta", 19, 100_000, 40 * DAY_MS, now), run("rui", 15, 90_000, DAY_MS, now)];
    const mine = run("me", 17, 80_000, 0, now);
    const changes = leadChanges(before, mine, q, now);
    expect(changes.map((c) => [c.period, c.previous.playerId])).toEqual([
      ["month", "rui"],
      ["week", "rui"],
    ]);
  });

  it("no change when the player already led", () => {
    const before = [run("me", 15, 100_000, DAY_MS, now), run("rui", 10, 1, DAY_MS, now)];
    expect(leadChanges(before, run("me", 18, 1, 0, now), q, now)).toEqual([]);
  });

  it("no change when passing someone without taking #1", () => {
    const before = [run("top", 20, 1, DAY_MS, now), run("rui", 10, 1, DAY_MS, now)];
    expect(leadChanges(before, run("me", 15, 1, 0, now), q, now)).toEqual([]);
  });

  it("a tie on score is won by lower time", () => {
    const before = [run("rui", 15, 90_000, DAY_MS, now)];
    expect(leadChanges(before, run("me", 15, 89_999, 0, now), q, now)).toHaveLength(3);
    expect(leadChanges(before, run("me", 15, 90_000, 0, now), q, now)).toHaveLength(0);
  });

  it("no change in an empty ranking", () => {
    expect(leadChanges([], run("me", 3, 1, 0, now), q, now)).toEqual([]);
  });
});

describe("formatTime", () => {
  it("formats m:ss", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(65_400)).toBe("1:05");
    expect(formatTime(200_000)).toBe("3:20");
  });
});
