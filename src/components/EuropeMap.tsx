import { COUNTRY_BY_ID, EUROPE } from "@/data/europe";
import { S } from "@/strings";

const BASE_ID = "eu-base";

/** Shared map geometry, rendered once in the layout and reused with <use>. */
export function EuropeMapDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <g id={BASE_ID}>
          <rect className="sea" x="-2000" y="-2000" width="4000" height="4000" />
          {EUROPE.context.map((d, i) => (
            <path key={i} className="land" d={d} />
          ))}
          {EUROPE.countries.map((c) => (
            <path key={c.id} className="land" d={c.d} />
          ))}
        </g>
      </defs>
    </svg>
  );
}

/** Map of Europe with one country highlighted. `zoom` crops around it (review grid). */
export function EuropeMap({ countryId, zoom = false }: { countryId: string; zoom?: boolean }) {
  const c = COUNTRY_BY_ID[countryId];
  if (!c) return null;
  const viewBox = zoom ? `${c.cx - 125} ${c.cy - 115} 250 230` : `0 0 ${EUROPE.W} ${EUROPE.H}`;
  return (
    <svg
      className="map"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={zoom ? S.game.zoomLabel(c.name) : S.game.mapLabel}
    >
      <use href={`#${BASE_ID}`} />
      <path className="hi" d={c.d} />
    </svg>
  );
}
