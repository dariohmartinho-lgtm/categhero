"use client";
import { HomeScreen } from "@/components/HomeScreen";
import { RequirePlayer } from "@/components/Shell";

export default function Page() {
  return <RequirePlayer>{(player) => <HomeScreen player={player} />}</RequirePlayer>;
}
