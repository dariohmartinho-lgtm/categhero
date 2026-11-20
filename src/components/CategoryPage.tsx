"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getCategory } from "@/data/categories";
import { S } from "@/strings";
import { CategoryScreen } from "./CategoryScreen";
import { GameScreen } from "./GameScreen";
import { RequirePlayer } from "./Shell";

/** Client wrappers: the category is looked up by id so no data crosses the server boundary. */
export function CategoryPage({ id }: { id: string }) {
  const category = getCategory(id)!;
  return <RequirePlayer>{(player) => <CategoryScreen category={category} player={player} />}</RequirePlayer>;
}

export function PlayPage({ id }: { id: string }) {
  return (
    <Suspense fallback={<p className="muted">{S.loading}</p>}>
      <Play id={id} />
    </Suspense>
  );
}

function Play({ id }: { id: string }) {
  const category = getCategory(id)!;
  const mode = useSearchParams().get("mode") === "practice" ? "practice" : "challenge";
  return (
    <RequirePlayer>
      {(player) => <GameScreen key={mode} category={category} mode={mode} player={player} />}
    </RequirePlayer>
  );
}
