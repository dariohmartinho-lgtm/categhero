"use client";
import { useState } from "react";
import { PERIODS, formatTime, ranking, type Period, type RunRecord } from "@/lib/game";
import type { Category } from "@/data/categories";
import { S } from "@/strings";
import { CrownIcon } from "./Icons";

const TOP = 10;

export function LeaderLine({ category, runs }: { category: Category; runs: RunRecord[] }) {
  const leader = ranking(runs, { categoryId: category.id, period: "total", now: Date.now(), excludePlayerId: category.ownerId })[0];
  if (!leader) return <p className="leader">{S.category.noLeader}</p>;
  return (
    <div className="leader">
      <CrownIcon />
      <span>
        {S.category.leader}: <b className="text-ink">{leader.playerName}</b>{" "}
        {S.category.leaderLine(leader.score, category.items.length, formatTime(leader.totalTimeMs))}
      </span>
    </div>
  );
}

export function RankingCard({
  category,
  runs,
  playerId,
  initialPeriod = "total",
}: {
  category: Category;
  runs: RunRecord[];
  playerId: string;
  initialPeriod?: Period;
}) {
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const list = ranking(runs, { categoryId: category.id, period, now: Date.now(), excludePlayerId: category.ownerId });
  const me = list.findIndex((r) => r.playerId === playerId);
  const total = category.items.length;

  const row = (r: RunRecord, i: number) => {
    const you = r.playerId === playerId;
    return (
      <li key={r.playerId} className={`row${i === 0 ? " first" : ""}${you ? " you" : ""}`}>
        <span className="pos" aria-label={`#${i + 1}`}>
          {i === 0 ? <CrownIcon /> : i + 1}
        </span>
        <span className="nm">
          {r.playerName}
          {you && <em>{S.rank.you}</em>}
        </span>
        <span className="sc">
          {r.score}/{total}
        </span>
        <span className="tm">{formatTime(r.totalTimeMs)}</span>
      </li>
    );
  };

  const onKey = (e: React.KeyboardEvent) => {
    const i = PERIODS.indexOf(period);
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    const next = PERIODS[(i + step + PERIODS.length) % PERIODS.length];
    setPeriod(next);
    document.getElementById(`tab-${next}`)?.focus();
  };

  return (
    <div className="card" id="ranking">
      <h2 className="mb-3 text-[1.3rem]">{S.category.ranking}</h2>
      <div className="tabs" role="tablist" onKeyDown={onKey}>
        {PERIODS.map((p) => (
          <button
            key={p}
            id={`tab-${p}`}
            role="tab"
            aria-selected={p === period}
            aria-controls="rank-panel"
            tabIndex={p === period ? 0 : -1}
            onClick={() => setPeriod(p)}
          >
            {S.periods[p]}
          </button>
        ))}
      </div>
      <p className="muted small mt-2.5">{S.periodNote[period]}</p>
      <ol className="rank" id="rank-panel" role="tabpanel" aria-labelledby={`tab-${period}`}>
        {list.length === 0 ? (
          <li className="empty">{S.rank.empty}</li>
        ) : (
          <>
            {list.slice(0, TOP).map(row)}
            {me >= TOP && (
              <>
                <li className="gap" aria-hidden="true">
                  ···
                </li>
                {row(list[me], me)}
              </>
            )}
            {me < 0 && <li className="empty">{S.rank.notYou}</li>}
          </>
        )}
      </ol>
    </div>
  );
}
