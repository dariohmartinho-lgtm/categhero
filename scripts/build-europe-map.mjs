// Regenerates src/data/europe.json. Run from the project root:
//   npm i --no-save world-atlas topojson-client d3-geo && node scripts/build-europe-map.mjs
import fs from "node:fs";
import { feature } from "topojson-client";
import { geoConicConformal, geoPath, geoCentroid } from "d3-geo";

const topo = JSON.parse(fs.readFileSync("node_modules/world-atlas/countries-50m.json", "utf8"));
const all = feature(topo, topo.objects.countries).features;

const TARGETS = Object.fromEntries(
  [
    "Portugal",
    "Spain",
    "France",
    "Italy",
    "Germany",
    "Poland",
    "United Kingdom",
    "Ireland",
    "Norway",
    "Sweden",
    "Finland",
    "Greece",
    "Romania",
    "Hungary",
    "Austria",
    "Croatia",
    "Bulgaria",
    "Ukraine",
    "Iceland",
    "Denmark",
  ].map((n) => [n, n]),
);

const inRegion = (poly) => {
  const [lon, lat] = geoCentroid({ type: "Feature", geometry: { type: "Polygon", coordinates: poly } });
  return lon > -25 && lon < 50 && lat > 30 && lat < 73;
};

function clip(f) {
  const g = f.geometry;
  if (g.type === "Polygon") return inRegion(g.coordinates) ? f : null;
  const polys = g.coordinates.filter(inRegion);
  if (!polys.length) return null;
  return { type: "Feature", properties: f.properties, geometry: { type: "MultiPolygon", coordinates: polys } };
}

const clipped = all.map(clip).filter(Boolean);
const targets = clipped.filter((f) => TARGETS[f.properties.name]);
const missing = Object.keys(TARGETS).filter((n) => !targets.find((f) => f.properties.name === n));
if (missing.length) { console.error("MISSING", missing); process.exit(1); }

const W = 640, H = 600;
const proj = geoConicConformal().parallels([40, 65]).rotate([-14, 0]);
proj.fitExtent([[8, 8], [W - 8, H - 8]], { type: "FeatureCollection", features: targets });
const path = geoPath(proj).digits(1);

const context = clipped
  .filter((f) => !TARGETS[f.properties.name])
  .map((f) => path(f))
  .filter((d) => d && d.length > 10);

const out = {
  W, H,
  context,
  countries: targets.map((f) => {
    const c = path.centroid(f);
    return { id: f.properties.name, name: TARGETS[f.properties.name], d: path(f), cx: +c[0].toFixed(1), cy: +c[1].toFixed(1) };
  }),
};
const OUT = "src/data/europe.json";
fs.writeFileSync(OUT, JSON.stringify(out));
console.log("countries", out.countries.length, "context", context.length, "bytes", fs.statSync(OUT).size);
