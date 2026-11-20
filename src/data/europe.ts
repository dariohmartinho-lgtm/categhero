import raw from "./europe.json";
import type { Item } from "@/lib/game";

/**
 * Projected map of Europe (Natural Earth via world-atlas, public domain).
 * Regenerate with scripts/build-europe-map.mjs.
 */
export interface EuropeMap {
  W: number;
  H: number;
  context: string[];
  countries: { id: string; name: string; d: string; cx: number; cy: number }[];
}

export const EUROPE = raw as EuropeMap;

export const COUNTRY_BY_ID: Record<string, EuropeMap["countries"][number]> = Object.fromEntries(
  EUROPE.countries.map((c) => [c.id, c]),
);

export function europeItems(): Item[] {
  return EUROPE.countries.map((c) => ({ id: c.id, answer: c.name, pos: { x: c.cx, y: c.cy } }));
}
