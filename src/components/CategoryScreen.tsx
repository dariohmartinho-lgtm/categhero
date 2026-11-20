"use client";
import Link from "next/link";
import type { Category } from "@/data/categories";
import { useRuns, type Player } from "@/lib/store";
import { S } from "@/strings";
import { BackIcon } from "./Icons";
import { LeaderLine, RankingCard } from "./Ranking";

export function CategoryScreen({ category, player }: { category: Category; player: Player }) {
  const runs = useRuns();
  return (
    <section className="stack">
      <Link className="back" href="/">
        <BackIcon />
        {S.category.back}
      </Link>
      <div className="mb-3.5 mt-1 flex flex-col gap-1.5">
        <span className="eyebrow">{S.category.eyebrow}</span>
        <h1 className="text-[1.8rem]">{category.title}</h1>
        <LeaderLine category={category} runs={runs} />
      </div>
      <div className="cta">
        <Link className="btn" href={`/c/${category.id}/play?mode=challenge`}>
          {S.category.challenge}
        </Link>
        <Link className="btn sec" href={`/c/${category.id}/play?mode=practice`}>
          {S.category.practice}
        </Link>
      </div>
      <div className="card">
        <ul className="rules">
          {S.category.rules(category.items.length, category.units, category.unit).map((r) => (
            <li key={r.icon}>
              <span className="ic" aria-hidden="true">
                {r.icon}
              </span>
              <p>
                {r.strong && <b>{r.strong} </b>}
                {r.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <RankingCard category={category} runs={runs} playerId={player.id} />
    </section>
  );
}
