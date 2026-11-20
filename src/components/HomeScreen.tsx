"use client";
import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { useRuns, type Player } from "@/lib/store";
import { S } from "@/strings";
import { EuropeMap } from "./EuropeMap";
import { LeaderLine } from "./Ranking";

export function HomeScreen({ player }: { player: Player }) {
  const runs = useRuns();
  return (
    <section>
      <h1 className="mb-1.5 text-[1.7rem]">{S.homeScreen.greeting(player.name.split(" ")[0])}</h1>
      <p className="muted">{S.homeScreen.lead}</p>
      <div className="mt-[18px] grid gap-3.5">
        {CATEGORIES.map((c) => (
          <article key={c.id} className="card cat">
            <div className="art">
              <EuropeMap countryId="Italy" />
            </div>
            <div className="flex flex-col gap-3 p-4">
              <h2 className="text-[1.35rem]">{c.title}</h2>
              <p className="muted small">{c.blurb}</p>
              <LeaderLine category={c} runs={runs} />
              <Link className="btn block" href={`/c/${c.id}`}>
                {S.homeScreen.play}
              </Link>
            </div>
          </article>
        ))}
        <div className="soon">
          {S.homeScreen.soon.map((t) => (
            <div key={t} className="tile">
              <span className="tag">{S.homeScreen.comingSoon}</span>
              <b>{t}</b>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
