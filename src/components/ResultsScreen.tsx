"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Category } from "@/data/categories";
import { START_LIVES, formatTime, type Period, type RunState } from "@/lib/game";
import { S } from "@/strings";
import { EuropeMap } from "./EuropeMap";
import { CrownIcon } from "./Icons";

export interface RunResult {
  run: RunState;
  banners: string[];
  positions: { period: Period; pos: number; of: number }[] | null;
}

export function ResultsScreen({ category, result, onAgain }: { category: Category; result: RunResult; onAgain: () => void }) {
  const { run, banners, positions } = result;
  const challenge = run.mode === "challenge";
  const total = run.questions.length;
  const misses = run.answers.filter((a) => !a.correct);
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    titleRef.current?.focus();
  }, []);

  const title = !challenge ? S.results.practiceDone : run.lives > 0 ? S.results.allDone : S.results.gameOver;
  const sub = !challenge
    ? S.results.practiceSub
    : `${run.lives > 0 ? S.results.livesLeft(run.lives) : S.results.noLives(START_LIVES)} ${S.results.totalTime(formatTime(run.totalTimeMs))}`;

  return (
    <section className="flex flex-col gap-4">
      <div className="card score">
        <span className="eyebrow outline-none" tabIndex={-1} ref={titleRef}>
          {title}
        </span>
        <div className="big">
          {run.score}
          <small>/{total}</small>
        </div>
        <p className="muted">{sub}</p>
      </div>

      {banners.map((b) => (
        <div key={b} className="banner" role="status">
          <CrownIcon />
          <b>{b}</b>
        </div>
      ))}

      {positions && (
        <div className="card">
          <h2 className="text-[1.3rem]">{S.results.yourPosition}</h2>
          <div className="ranks">
            {positions.map((p) => (
              <div key={p.period} className="rk">
                <span>{S.periods[p.period]}</span>
                <b>{S.results.positionOf(p.pos, p.of)}</b>
              </div>
            ))}
          </div>
        </div>
      )}

      {misses.length > 0 && (
        <div className="card">
          <h2 className="text-[1.3rem]">{S.results.review}</h2>
          <ul className="miss">
            {misses.map((m) => {
              const item = category.items.find((i) => i.id === m.itemId)!;
              return (
                <li key={m.itemId}>
                  <div className="thumb">
                    <EuropeMap countryId={m.itemId} zoom />
                  </div>
                  <span>{item.answer}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="grid gap-2.5">
        <button className="btn block" onClick={onAgain}>
          {challenge ? S.results.playAgain : S.results.practiceAgain}
        </button>
        <Link className="btn sec block" href={`/c/${category.id}#ranking`}>
          {S.results.viewRanking}
        </Link>
      </div>
    </section>
  );
}
