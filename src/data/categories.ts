import type { Item } from "@/lib/game";
import { europeItems } from "./europe";

export interface Category {
  id: string;
  kind: "preset" | "community";
  title: string;
  blurb: string;
  /** Words used in the rules card ("map", "maps"). */
  unit: string;
  units: string;
  ownerId: string | null;
  items: Item[];
}

const europe: Category = {
  id: "europe",
  kind: "preset",
  title: "Countries of Europe",
  blurb: "20 maps. One country lights up and you pick its name out of 4.",
  unit: "map",
  units: "maps",
  ownerId: null,
  items: europeItems(),
};

export const CATEGORIES: Category[] = [europe];

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
