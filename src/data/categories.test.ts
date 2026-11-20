import { describe, expect, it } from "vitest";
import { MIN_CHALLENGE_ITEMS, createRun, makeOptions, nearestNeighbours, seededRng } from "@/lib/game";
import { CATEGORIES } from "./categories";
import { FILMS } from "./films";

describe.each(CATEGORIES.map((c) => [c.id, c] as const))("category %s", (_, c) => {
  it("has enough items for Challenge, with unique ids and answers", () => {
    expect(c.items.length).toBeGreaterThanOrEqual(MIN_CHALLENGE_ITEMS);
    expect(new Set(c.items.map((i) => i.id)).size).toBe(c.items.length);
    expect(new Set(c.items.map((i) => i.answer.toLowerCase())).size).toBe(c.items.length);
  });

  it("cover items exist", () => {
    for (const id of c.coverItemIds) expect(c.items.some((i) => i.id === id)).toBe(true);
  });

  it("every question gets 4 distinct options with the answer among them", () => {
    for (let seed = 0; seed < 5; seed++) {
      for (const q of createRun(c.items, "challenge", seededRng(seed)).questions) {
        expect(q.options).toHaveLength(4);
        expect(new Set(q.options.map((o) => o.label.toLowerCase())).size).toBe(4);
        expect(q.options.filter((o) => o.id === q.itemId)).toHaveLength(1);
      }
    }
  });

  it("manual wrong answers never repeat the item's own answer", () => {
    for (const it of c.items) {
      for (const w of it.wrongAnswers ?? []) expect(w.toLowerCase()).not.toBe(it.answer.toLowerCase());
    }
  });
});

describe("flags", () => {
  it("wrong options are the hand-picked look-alikes", () => {
    const flags = CATEGORIES.find((c) => c.id === "flags")!;
    const italy = flags.items.find((i) => i.id === "italy")!;
    const labels = makeOptions(italy, flags.items, seededRng(1)).map((o) => o.label).sort();
    expect(labels).toEqual(["France", "Ireland", "Italy", "Ivory Coast"]);
  });
});

describe("best picture", () => {
  it("wrong options come from films released in nearby years", () => {
    const films = CATEGORIES.find((c) => c.id === "best-picture")!;
    const oppenheimer = films.items.find((i) => i.id === "oppenheimer")!;
    const near = nearestNeighbours(oppenheimer, films.items).map((i) => i.id);
    expect(near).not.toContain("casablanca");
    expect(near).toContain("eeaao");
    const year = (id: string) => FILMS.find((f) => f.id === id)!.year;
    for (const id of near) expect(Math.abs(year(id) - 2023)).toBeLessThan(30);
  });
});
