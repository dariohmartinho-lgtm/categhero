import type { ArtKind } from "@/data/categories";
import { BookArt } from "@/data/books";
import { FilmArt } from "@/data/films";
import { FlagArt } from "@/data/flags";
import { EuropeMap } from "./EuropeMap";

/** Draws one item's image. `thumb` crops maps around the target (review grid). */
export function ItemArt({ art, id, thumb = false }: { art: ArtKind; id: string; thumb?: boolean }) {
  switch (art) {
    case "europe":
      return <EuropeMap countryId={id} zoom={thumb} />;
    case "flag":
      return <FlagArt id={id} />;
    case "film":
      return <FilmArt id={id} />;
    case "book":
      return <BookArt id={id} />;
  }
}

/** Frame around the image: sea-blue for maps, neutral for everything else. */
export function artFrameClass(art: ArtKind) {
  return art === "europe" ? "map" : `pic pic-${art}`;
}
