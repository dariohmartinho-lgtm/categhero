import type { Item } from "@/lib/game";
import { bookItems } from "./books";
import { europeItems } from "./europe";
import { filmItems } from "./films";
import { flagItems } from "./flags";

/** How an item's image is drawn. Community categories (M3) will add "upload". */
export type ArtKind = "europe" | "flag" | "film" | "book";

export interface Category {
  id: string;
  kind: "preset" | "community";
  art: ArtKind;
  title: string;
  blurb: string;
  /** Question shown above the image during a run. */
  prompt: string;
  /** Words used in the rules card ("map", "maps"). */
  unit: string;
  units: string;
  /** Items shown on the home card. */
  coverItemIds: string[];
  ownerId: string | null;
  items: Item[];
}

export const CATEGORIES: Category[] = [
  {
    id: "europe",
    kind: "preset",
    art: "europe",
    title: "Countries of Europe",
    blurb: "20 maps. One country lights up and you pick its name out of 4.",
    prompt: "Which country is highlighted?",
    unit: "map",
    units: "maps",
    coverItemIds: ["Italy"],
    ownerId: null,
    items: europeItems(),
  },
  {
    id: "flags",
    kind: "preset",
    art: "flag",
    title: "World flags",
    blurb: "20 flags, many of them look-alikes. Spot the country behind each one.",
    prompt: "Which country's flag is this?",
    unit: "flag",
    units: "flags",
    coverItemIds: ["ireland", "japan", "norway"],
    ownerId: null,
    items: flagItems(),
  },
  {
    id: "best-picture",
    kind: "preset",
    art: "film",
    title: "Best Picture winners",
    blurb: "20 Oscar winners, each drawn as one iconic scene plus the year it came out.",
    prompt: "Which Best Picture winner is this?",
    unit: "film",
    units: "films",
    coverItemIds: ["titanic", "rocky", "oppenheimer"],
    ownerId: null,
    items: filmItems(),
  },
  {
    id: "authors",
    kind: "preset",
    art: "book",
    title: "Who wrote it?",
    blurb: "20 books, from classics to bestsellers. Read the cover and name the author.",
    prompt: "Who wrote this book?",
    unit: "book",
    units: "books",
    coverItemIds: ["moby-dick", "1984", "alchemist"],
    ownerId: null,
    items: bookItems(),
  },
];

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
