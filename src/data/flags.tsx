import type { ReactNode } from "react";
import type { Item } from "@/lib/game";

/**
 * World flags preset. National flags are public-domain designs, drawn here in a
 * 3:2 box (300 x 200). Wrong options are hand-picked look-alikes so the choice
 * stays plausible, while near-identical pairs (Romania/Chad, Netherlands/Luxembourg)
 * are avoided as unfair.
 */

const W = 300;
const H = 200;

const vertical = (...colors: string[]) =>
  colors.map((c, i) => <rect key={i} x={(W / colors.length) * i} y={0} width={W / colors.length + 0.5} height={H} fill={c} />);

const horizontal = (...colors: string[]) =>
  colors.map((c, i) => <rect key={i} x={0} y={(H / colors.length) * i} width={W} height={H / colors.length + 0.5} fill={c} />);

/** Nordic cross. `x` = left edge of the vertical bar, `w` = bar width. */
const nordic = (bg: string, cross: string, x: number, w: number, border?: { color: string; w: number }) => (
  <>
    <rect width={W} height={H} fill={bg} />
    {border && (
      <>
        <rect x={x - border.w} y={0} width={w + 2 * border.w} height={H} fill={border.color} />
        <rect x={0} y={(H - w) / 2 - border.w} width={W} height={w + 2 * border.w} fill={border.color} />
      </>
    )}
    <rect x={x} y={0} width={w} height={H} fill={cross} />
    <rect x={0} y={(H - w) / 2} width={W} height={w} fill={cross} />
  </>
);

/** Five-pointed star centred on (cx, cy) with outer radius r. */
function star(cx: number, cy: number, r: number, rot = -90) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? r * 0.382 : r;
    const a = ((rot + i * 36) * Math.PI) / 180;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

interface Flag {
  id: string;
  name: string;
  wrong: string[];
  art: ReactNode;
}

export const FLAGS: Flag[] = [
  { id: "italy", name: "Italy", wrong: ["Ireland", "Ivory Coast", "France"], art: vertical("#009246", "#ffffff", "#ce2b37") },
  { id: "ireland", name: "Ireland", wrong: ["Ivory Coast", "Italy", "France"], art: vertical("#169b62", "#ffffff", "#ff883e") },
  { id: "ivory-coast", name: "Ivory Coast", wrong: ["Ireland", "Italy", "Romania"], art: vertical("#f77f00", "#ffffff", "#009e60") },
  { id: "france", name: "France", wrong: ["Netherlands", "Russia", "Italy"], art: vertical("#002395", "#ffffff", "#ed2939") },
  { id: "belgium", name: "Belgium", wrong: ["Germany", "Romania", "France"], art: vertical("#000000", "#fdda24", "#ef3340") },
  { id: "romania", name: "Romania", wrong: ["Belgium", "Colombia", "France"], art: vertical("#002b7f", "#fcd116", "#ce1126") },
  { id: "germany", name: "Germany", wrong: ["Belgium", "Colombia", "Netherlands"], art: horizontal("#000000", "#dd0000", "#ffce00") },
  { id: "netherlands", name: "Netherlands", wrong: ["Russia", "France", "Germany"], art: horizontal("#ae1c28", "#ffffff", "#21468b") },
  { id: "russia", name: "Russia", wrong: ["Netherlands", "France", "Poland"], art: horizontal("#ffffff", "#0039a6", "#d52b1e") },
  { id: "poland", name: "Poland", wrong: ["Japan", "Denmark", "Ukraine"], art: horizontal("#ffffff", "#dc143c") },
  { id: "ukraine", name: "Ukraine", wrong: ["Sweden", "Colombia", "Romania"], art: horizontal("#0057b7", "#ffd700") },
  {
    id: "colombia",
    name: "Colombia",
    wrong: ["Romania", "Ukraine", "Belgium"],
    art: (
      <>
        <rect width={W} height={H / 2} fill="#fcd116" />
        <rect y={H / 2} width={W} height={H / 4 + 0.5} fill="#003893" />
        <rect y={(H * 3) / 4} width={W} height={H / 4} fill="#ce1126" />
      </>
    ),
  },
  {
    id: "japan",
    name: "Japan",
    wrong: ["Bangladesh", "Turkey", "Poland"],
    art: (
      <>
        <rect width={W} height={H} fill="#ffffff" />
        <circle cx={W / 2} cy={H / 2} r={H * 0.3} fill="#bc002d" />
      </>
    ),
  },
  {
    id: "bangladesh",
    name: "Bangladesh",
    wrong: ["Japan", "Ireland", "Italy"],
    art: (
      <>
        <rect width={W} height={H} fill="#006a4e" />
        <circle cx={W * 0.45} cy={H / 2} r={H * 0.33} fill="#f42a41" />
      </>
    ),
  },
  {
    id: "turkey",
    name: "Turkey",
    wrong: ["Japan", "Denmark", "Poland"],
    art: (
      <>
        <rect width={W} height={H} fill="#e30a17" />
        <circle cx={105} cy={100} r={50} fill="#ffffff" />
        <circle cx={117.5} cy={100} r={40} fill="#e30a17" />
        <polygon points={star(170, 100, 25, 180)} fill="#ffffff" />
      </>
    ),
  },
  { id: "denmark", name: "Denmark", wrong: ["Norway", "Finland", "Poland"], art: nordic("#c8102e", "#ffffff", 86, 28) },
  { id: "sweden", name: "Sweden", wrong: ["Finland", "Iceland", "Ukraine"], art: nordic("#006aa7", "#fecc02", 94, 37) },
  { id: "finland", name: "Finland", wrong: ["Sweden", "Iceland", "Denmark"], art: nordic("#ffffff", "#002f6c", 82, 55) },
  {
    id: "norway",
    name: "Norway",
    wrong: ["Iceland", "Denmark", "Finland"],
    art: nordic("#ba0c2f", "#00205b", 86, 27, { color: "#ffffff", w: 14 }),
  },
  {
    id: "iceland",
    name: "Iceland",
    wrong: ["Norway", "Sweden", "Finland"],
    art: nordic("#02529c", "#dc1e35", 86, 27, { color: "#ffffff", w: 14 }),
  },
];

const BY_ID = Object.fromEntries(FLAGS.map((f) => [f.id, f]));

export function flagItems(): Item[] {
  return FLAGS.map((f) => ({ id: f.id, answer: f.name, wrongAnswers: f.wrong }));
}

export function FlagArt({ id }: { id: string }) {
  const f = BY_ID[id];
  if (!f) return null;
  return (
    <svg className="flag" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="A national flag">
      {f.art}
    </svg>
  );
}
