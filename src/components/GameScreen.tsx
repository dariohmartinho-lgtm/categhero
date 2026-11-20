"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/data/categories";
import {
  PERIODS,
  START_LIVES,
  TIME_LIMIT_MS,
  answerQuestion,
  createRun,
  currentQuestion,
  leadChanges,
  positionOf,
  ranking,
  type Mode,
  type Period,
  type RunRecord,
  type RunState,
} from "@/lib/game";
import { getRuns, saveRun, type Player } from "@/lib/store";
import { S } from "@/strings";
import { EuropeMap } from "./EuropeMap";
import { CloseIcon, HeartIcon } from "./Icons";
import { ResultsScreen, type RunResult } from "./ResultsScreen";

const NEXT_DELAY_OK = 750;
const NEXT_DELAY_BAD = 1600;
const LOW_TIME_MS = 3000;

interface Feedback {
  chosenId: string | null;
  correct: boolean;
  timedOut: boolean;
}

export function GameScreen({ category, mode, player }: { category: Category; mode: Mode; player: Player }) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<RunResult | null>(null);
  const restart = () => {
    setResult(null);
    setAttempt((n) => n + 1);
  };
  if (result) return <ResultsScreen category={category} result={result} onAgain={restart} />;
  return <Round key={attempt} mode={mode} category={category} player={player} onDone={setResult} />;
}

function Round({
  mode,
  category,
  player,
  onDone,
}: {
  mode: Mode;
  category: Category;
  player: Player;
  onDone: (r: RunResult) => void;
}) {
  const router = useRouter();
  const [initial] = useState(() => createRun(category.items, mode));
  const [run, setRun] = useState(initial);
  const [shown, setShown] = useState(initial); // state before the latest answer, so the question stays on screen
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [paused, setPaused] = useState(false);
  const challenge = run.mode === "challenge";
  const q = currentQuestion(shown)!;
  const total = run.questions.length;

  const qStart = useRef(0);
  const pausedAt = useRef(0);
  const barRef = useRef<HTMLElement>(null);
  const keepRef = useRef<HTMLButtonElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const nextTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const finish = useCallback(
    (final: RunState) => {
      if (final.mode === "practice") {
        onDone({ run: final, banners: [], positions: null });
        return;
      }
      const now = Date.now();
      const record: RunRecord = {
        id: crypto.randomUUID(),
        playerId: player.id,
        playerName: player.name,
        categoryId: category.id,
        score: final.score,
        totalTimeMs: final.totalTimeMs,
        finishedAt: now,
      };
      const before = getRuns();
      const scope = { categoryId: category.id, excludePlayerId: category.ownerId };
      const taken = leadChanges(before, record, scope, now);
      const prevLeaders = Object.fromEntries(
        PERIODS.map((p) => [p, ranking(before, { ...scope, period: p, now })[0]?.playerId]),
      ) as Record<Period, string | undefined>;
      saveRun(record);
      const after = [...before, record];
      const positions = PERIODS.map((period) => {
        const list = ranking(after, { ...scope, period, now });
        return { period, pos: positionOf(list, player.id), of: list.length };
      });
      const byPlayer = new Map<string, { name: string; periods: string[] }>();
      for (const c of taken) {
        const g = byPlayer.get(c.previous.playerId) ?? { name: c.previous.playerName, periods: [] };
        g.periods.push(S.periods[c.period]);
        byPlayer.set(c.previous.playerId, g);
      }
      const banners = [...byPlayer.values()].map((g) => S.results.tookLead(g.name, g.periods));
      if (!banners.length) {
        const kept = positions.find((p) => p.pos === 1 && prevLeaders[p.period] === player.id);
        if (kept) banners.push(S.results.keptLead(S.periods[kept.period]));
      }
      onDone({ run: final, banners, positions });
    },
    [category, onDone, player],
  );

  const next = useCallback(() => {
    clearTimeout(nextTimer.current);
    if (run.finished) return finish(run);
    setShown(run);
    setFeedback(null);
  }, [finish, run]);

  const answer = useCallback(
    (chosenId: string | null) => {
      if (feedback || paused) return;
      const elapsed = performance.now() - qStart.current;
      const after = answerQuestion(shown, chosenId, chosenId === null ? TIME_LIMIT_MS : elapsed);
      const rec = after.answers[after.answers.length - 1];
      setRun(after);
      setFeedback({ chosenId, correct: rec.correct, timedOut: rec.timedOut });
    },
    [feedback, paused, shown],
  );

  // New question: reset the clock.
  useEffect(() => {
    qStart.current = performance.now();
  }, [shown]);

  // Challenge auto-advance after feedback; practice waits for Continue.
  useEffect(() => {
    if (!feedback) return;
    if (!challenge) {
      continueRef.current?.focus();
      return;
    }
    nextTimer.current = setTimeout(next, feedback.correct ? NEXT_DELAY_OK : NEXT_DELAY_BAD);
    return () => clearTimeout(nextTimer.current);
  }, [feedback, challenge, next]);

  // Timer loop (Challenge only). Updates the bar directly to avoid re-rendering at 60 fps.
  useEffect(() => {
    if (!challenge || feedback || paused) return;
    let raf = 0;
    const tick = () => {
      const el = performance.now() - qStart.current;
      const bar = barRef.current;
      if (bar) {
        bar.style.transform = `scaleX(${Math.max(0, 1 - el / TIME_LIMIT_MS)})`;
        bar.classList.toggle("low", el > TIME_LIMIT_MS - LOW_TIME_MS);
      }
      if (el >= TIME_LIMIT_MS) return answer(null);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [challenge, feedback, paused, answer, shown]);

  // Keys 1 to 4 pick an option; Escape opens or closes the exit sheet.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape") {
        if (paused) resume();
        else askQuit();
        return;
      }
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 4 && !paused && !feedback) {
        const o = q.options[n - 1];
        if (o) answer(o.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const askQuit = () => {
    if (feedback || paused) return;
    pausedAt.current = performance.now();
    setPaused(true);
  };
  const resume = () => {
    qStart.current += performance.now() - pausedAt.current;
    setPaused(false);
  };
  useEffect(() => {
    if (paused) keepRef.current?.focus();
  }, [paused]);

  const answeredCount = run.answers.length;
  const lives = feedback ? run.lives : shown.lives;
  const optClass = (id: string) => {
    if (!feedback) return "opt";
    if (id === q.itemId) return "opt ok";
    if (id === feedback.chosenId) return "opt bad";
    return "opt dim";
  };

  return (
    <section>
      <div className="gbar">
        <button className="x" onClick={askQuit} disabled={!!feedback} aria-label={S.game.exit}>
          <CloseIcon />
        </button>
        <div className="prog" aria-hidden="true">
          <i style={{ width: `${(answeredCount / total) * 100}%` }} />
        </div>
        {challenge ? (
          <div className="lives" role="img" aria-label={S.game.lives(lives)}>
            {Array.from({ length: START_LIVES }, (_, i) => (
              <HeartIcon
                key={i}
                className={[i >= lives ? "gone" : "", feedback && !feedback.correct && i === lives ? "hit" : ""].join(" ").trim()}
              />
            ))}
          </div>
        ) : (
          <span className="tag">{S.game.practiceTag}</span>
        )}
      </div>
      {challenge && (
        <div className="timer" aria-hidden="true">
          <i ref={barRef} />
        </div>
      )}
      <p className="qline">
        {S.game.question}{" "}
        <span className="muted small font-body">{S.game.progress(shown.index + 1, total)}</span>
      </p>
      <div className="mapcard">
        <EuropeMap countryId={q.itemId} />
      </div>
      <div className="opts">
        {q.options.map((o, j) => (
          <button key={o.id} className={optClass(o.id)} disabled={!!feedback || paused} onClick={() => answer(o.id)}>
            <kbd>{j + 1}</kbd>
            <span>{o.label}</span>
          </button>
        ))}
      </div>
      <div className={`feed${feedback ? ` show ${feedback.correct ? "ok" : "bad"}` : ""}`} aria-live="polite">
        {feedback && (
          <>
            <div>
              <b>{feedback.correct ? S.game.correct : feedback.timedOut ? S.game.timeout : S.game.wrong}</b>
              {!feedback.correct && <span>{S.game.itWas(q.answer)}</span>}
            </div>
            {!challenge && (
              <button ref={continueRef} className={`btn ${feedback.correct ? "ok" : "bad"}`} onClick={next}>
                {run.finished ? S.game.seeResults : S.game.continue}
              </button>
            )}
          </>
        )}
      </div>
      {paused && (
        <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="quit-title">
          <div className="card">
            <h2 id="quit-title">{S.game.quitTitle}</h2>
            <p className="muted">{challenge ? S.game.quitChallenge : S.game.quitPractice}</p>
            <button ref={keepRef} className="btn block" onClick={resume}>
              {S.game.keepPlaying}
            </button>
            <button className="btn sec block" onClick={() => router.push(`/c/${category.id}`)}>
              {S.game.leave}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
