import type { ReactNode } from "react";
import type { Item } from "@/lib/game";

/**
 * Best Picture preset. Each card is an ORIGINAL flat illustration of an iconic
 * object or setting from the film plus its release year. No poster artwork,
 * logos or likenesses are reproduced (SPEC 10.3).
 * Wrong options come from films released in nearby years (map-style neighbours on a timeline).
 */

interface Film {
  id: string;
  title: string;
  year: number;
  bg: string;
  ink: string;
  art: ReactNode;
}

const k = { dark: "#1E2A47", white: "#FFFFFF" };

export const FILMS: Film[] = [
  {
    id: "titanic",
    title: "Titanic",
    year: 1997,
    bg: "#1D3557",
    ink: "#F1FAEE",
    art: (
      <>
        <circle cx="160" cy="40" r="14" fill="#F1FAEE" opacity=".9" />
        <rect y="140" width="200" height="60" fill="#0B2545" />
        <polygon points="10,140 34,92 48,112 62,140" fill="#E8F4FA" />
        <polygon points="34,92 48,112 40,140 24,140" fill="#BFD7EA" />
        <rect x="88" y="92" width="11" height="26" fill="#F4A261" />
        <rect x="88" y="92" width="11" height="6" fill={k.dark} />
        <rect x="108" y="92" width="11" height="26" fill="#F4A261" />
        <rect x="108" y="92" width="11" height="6" fill={k.dark} />
        <rect x="128" y="92" width="11" height="26" fill="#F4A261" />
        <rect x="128" y="92" width="11" height="6" fill={k.dark} />
        <rect x="148" y="92" width="11" height="26" fill="#F4A261" />
        <rect x="148" y="92" width="11" height="6" fill={k.dark} />
        <rect x="78" y="116" width="96" height="10" fill="#F1FAEE" />
        <polygon points="70,126 190,126 182,146 80,146" fill={k.dark} />
        <rect x="76" y="140" width="110" height="5" fill="#C1121F" />
      </>
    ),
  },
  {
    id: "godfather",
    title: "The Godfather",
    year: 1972,
    bg: "#14110F",
    ink: "#F2E8CF",
    art: (
      <>
        <ellipse cx="100" cy="132" rx="78" ry="16" fill="#3D3530" />
        <path d="M48 130 C50 82 70 66 100 66 C130 66 150 82 152 130 Z" fill="#4A403A" />
        <path d="M70 76 C86 86 114 86 130 76 L132 84 C114 94 86 94 68 84 Z" fill="#2A2420" />
        <rect x="52" y="112" width="96" height="12" fill="#1C1815" />
        <path d="M150 150 C140 170 128 178 116 186" stroke="#2D6A4F" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M136 168 C146 162 154 164 156 170 C148 174 140 174 136 168 Z" fill="#40916C" />
        <circle cx="152" cy="146" r="13" fill="#C1121F" />
        <path d="M143 142 C148 134 158 136 160 144 C154 140 148 142 146 148 Z" fill="#9D0208" />
        <circle cx="152" cy="146" r="4" fill="#9D0208" />
      </>
    ),
  },
  {
    id: "forrest-gump",
    title: "Forrest Gump",
    year: 1994,
    bg: "#A8DADC",
    ink: k.dark,
    art: (
      <>
        <rect y="150" width="200" height="50" fill="#8AB17D" />
        <rect x="30" y="118" width="140" height="10" rx="3" fill="#8D5B3E" />
        <rect x="30" y="102" width="140" height="10" rx="3" fill="#8D5B3E" />
        <rect x="30" y="134" width="140" height="8" rx="3" fill="#A0693F" />
        <rect x="40" y="134" width="8" height="30" fill="#5C3A21" />
        <rect x="152" y="134" width="8" height="30" fill="#5C3A21" />
        <rect x="112" y="116" width="40" height="18" rx="3" fill="#6F1D1B" />
        <rect x="112" y="116" width="40" height="6" rx="3" fill="#BB9457" />
        <g transform="rotate(-30 70 60)">
          <path d="M70 20 C84 36 84 74 70 98 C56 74 56 36 70 20 Z" fill={k.white} />
          <path d="M70 26 L70 108" stroke="#C9CED6" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </>
    ),
  },
  {
    id: "gladiator",
    title: "Gladiator",
    year: 2000,
    bg: "#D9A35B",
    ink: k.dark,
    art: (
      <>
        <rect y="150" width="200" height="50" fill="#B5793A" />
        <path d="M60 150 C58 80 76 50 100 50 C124 50 142 80 140 150 Z" fill="#8D99AE" />
        <path d="M100 34 C116 40 124 48 126 58 L100 58 Z" fill="#C1121F" />
        <path d="M100 34 C84 40 76 48 74 58 L100 58 Z" fill="#9D0208" />
        <rect x="74" y="86" width="52" height="54" rx="8" fill="#2B2D42" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={`v${i}`} x={80 + i * 10} y="88" width="3" height="50" fill="#8D99AE" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect key={`h${i}`} x="76" y={96 + i * 11} width="48" height="3" fill="#8D99AE" />
        ))}
        <rect x="96" y="58" width="8" height="28" fill="#6C7689" />
      </>
    ),
  },
  {
    id: "lotr-rotk",
    title: "The Return of the King",
    year: 2003,
    bg: "#2B1D14",
    ink: "#F6BD60",
    art: (
      <>
        <polygon points="20,170 90,60 110,60 180,170" fill="#40302A" />
        <polygon points="90,60 110,60 104,74 96,74" fill="#E85D04" />
        <path d="M100 74 C96 96 104 110 98 130" stroke="#E85D04" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M100 56 C92 40 110 30 100 14" stroke="#6B5B53" strokeWidth="8" fill="none" strokeLinecap="round" opacity=".7" />
        <ellipse cx="100" cy="158" rx="34" ry="20" fill="none" stroke="#F6BD60" strokeWidth="10" />
        <ellipse cx="100" cy="155" rx="34" ry="20" fill="none" stroke="#FFD97D" strokeWidth="4" />
      </>
    ),
  },
  {
    id: "silence-lambs",
    title: "The Silence of the Lambs",
    year: 1991,
    bg: "#EDE0D4",
    ink: "#3D2C2E",
    art: (
      <>
        <path d="M98 70 C70 30 22 40 26 84 C30 116 70 112 98 96 Z" fill="#7F5539" />
        <path d="M102 70 C130 30 178 40 174 84 C170 116 130 112 102 96 Z" fill="#7F5539" />
        <path d="M98 98 C70 110 44 140 64 160 C80 172 96 140 100 110 Z" fill="#9C6644" />
        <path d="M102 98 C130 110 156 140 136 160 C120 172 104 140 100 110 Z" fill="#9C6644" />
        <circle cx="60" cy="74" r="12" fill="#DDB892" />
        <circle cx="140" cy="74" r="12" fill="#DDB892" />
        <circle cx="60" cy="74" r="5" fill="#3D2C2E" />
        <circle cx="140" cy="74" r="5" fill="#3D2C2E" />
        <ellipse cx="100" cy="100" rx="8" ry="40" fill="#3D2C2E" />
        <path d="M96 62 C88 44 80 40 74 40 M104 62 C112 44 120 40 126 40" stroke="#3D2C2E" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "rocky",
    title: "Rocky",
    year: 1976,
    bg: "#F4A261",
    ink: k.dark,
    art: (
      <>
        <circle cx="100" cy="80" r="34" fill="#FFD166" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={10 + i * 8} y={150 - i * 12} width={180 - i * 16} height="12" fill={i % 2 ? "#9C8B7A" : "#B8A894"} />
        ))}
        <g transform="translate(72 0)">
          <ellipse cx="0" cy="84" rx="24" ry="27" fill="#C1121F" />
          <ellipse cx="-20" cy="92" rx="9" ry="13" fill="#9D0208" />
          <path d="M-8 66 C0 62 10 66 14 74" stroke="#E5383B" strokeWidth="5" fill="none" strokeLinecap="round" />
          <rect x="-16" y="106" width="32" height="18" rx="5" fill="#FFFFFF" />
          <path d="M0 57 L0 20" stroke="#6D597A" strokeWidth="3" />
        </g>
        <g transform="translate(128 0) scale(-1 1)">
          <ellipse cx="0" cy="84" rx="24" ry="27" fill="#C1121F" />
          <ellipse cx="-20" cy="92" rx="9" ry="13" fill="#9D0208" />
          <path d="M-8 66 C0 62 10 66 14 74" stroke="#E5383B" strokeWidth="5" fill="none" strokeLinecap="round" />
          <rect x="-16" y="106" width="32" height="18" rx="5" fill="#FFFFFF" />
          <path d="M0 57 L0 20" stroke="#6D597A" strokeWidth="3" />
        </g>
      </>
    ),
  },
  {
    id: "casablanca",
    title: "Casablanca",
    year: 1942,
    bg: "#4A4E69",
    ink: "#F2E9E4",
    art: (
      <>
        <rect y="150" width="200" height="50" fill="#22223B" />
        <ellipse cx="120" cy="140" rx="90" ry="14" fill="#9A8C98" opacity=".5" />
        <path d="M60 120 L180 120 L186 126 L60 128 Z" fill="#C9ADA7" />
        <path d="M112 120 L96 96 L110 96 L136 120 Z M112 128 L96 150 L110 150 L136 128 Z" fill="#C9ADA7" />
        <path d="M166 120 L172 104 L180 104 L180 122 Z" fill="#C9ADA7" />
        <rect x="34" y="40" width="5" height="112" fill="#22223B" />
        <path d="M24 40 L49 40 L44 26 L29 26 Z" fill="#22223B" />
        <circle cx="36.5" cy="44" r="6" fill="#F2CC8F" />
        <path d="M36 44 L10 150 L64 150 Z" fill="#F2CC8F" opacity=".25" />
      </>
    ),
  },
  {
    id: "braveheart",
    title: "Braveheart",
    year: 1995,
    bg: "#005EB8",
    ink: k.white,
    art: (
      <>
        <path d="M0 0 L30 0 L200 170 L200 200 L170 200 L0 30 Z M200 0 L200 30 L30 200 L0 200 L0 170 L170 0 Z" fill={k.white} opacity=".9" />
        <rect y="160" width="200" height="40" fill="#2D6A4F" />
        <rect x="94" y="30" width="12" height="118" rx="2" fill="#CED4DA" />
        <polygon points="94,148 106,148 100,164" fill="#CED4DA" />
        <rect x="70" y="24" width="60" height="8" rx="4" fill="#6C757D" />
        <rect x="96" y="2" width="8" height="22" fill="#5C3A21" />
        <circle cx="100" cy="2" r="5" fill="#6C757D" />
      </>
    ),
  },
  {
    id: "schindlers-list",
    title: "Schindler's List",
    year: 1993,
    bg: "#BDBDBD",
    ink: "#212121",
    art: (
      <>
        <rect y="150" width="200" height="50" fill="#8E8E8E" />
        {[20, 46, 150, 176].map((x, i) => (
          <g key={i} fill="#5E5E5E">
            <circle cx={x} cy={112} r="7" />
            <rect x={x - 7} y="120" width="14" height="34" rx="4" />
          </g>
        ))}
        <circle cx="100" cy="104" r="9" fill="#6E6E6E" />
        <path d="M86 118 L114 118 L120 154 L80 154 Z" fill="#D00000" />
        <rect x="90" y="154" width="6" height="12" fill="#4A4A4A" />
        <rect x="104" y="154" width="6" height="12" fill="#4A4A4A" />
      </>
    ),
  },
  {
    id: "sound-of-music",
    title: "The Sound of Music",
    year: 1965,
    bg: "#BDE0FE",
    ink: k.dark,
    art: (
      <>
        <polygon points="-10,140 50,50 110,140" fill="#6A994E" />
        <polygon points="50,50 64,72 50,66 38,70" fill={k.white} />
        <polygon points="70,140 140,40 210,140" fill="#386641" />
        <polygon points="140,40 156,64 140,58 126,62" fill={k.white} />
        <rect y="136" width="200" height="64" fill="#A7C957" />
        {[24, 52, 160, 182].map((x, i) => (
          <circle key={i} cx={x} cy={160 + (i % 2) * 14} r="4" fill={i % 2 ? "#F28482" : "#FFD166"} />
        ))}
        <g transform="rotate(-25 104 150)">
          <rect x="100" y="70" width="8" height="64" fill="#5C3A21" />
          <circle cx="104" cy="148" r="22" fill="#BC6C25" />
          <circle cx="104" cy="126" r="16" fill="#BC6C25" />
          <circle cx="104" cy="140" r="6" fill="#3A2213" />
          <rect x="96" y="62" width="16" height="12" rx="3" fill="#3A2213" />
        </g>
      </>
    ),
  },
  {
    id: "parasite",
    title: "Parasite",
    year: 2019,
    bg: "#CAD2C5",
    ink: k.dark,
    art: (
      <>
        <rect y="150" width="200" height="50" fill="#84A98C" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={120 + i * 14} y={150 - i * 14} width={80 - i * 14} height="14" fill="#52796F" />
        ))}
        <path d="M30 150 C20 128 30 104 46 100 C54 82 76 84 80 100 C96 104 98 132 88 150 Z" fill="#6C757D" />
        <circle cx="48" cy="118" r="5" fill="#495057" />
        <circle cx="70" cy="128" r="4" fill="#495057" />
        <circle cx="62" cy="106" r="3" fill="#495057" />
        <circle cx="110" cy="118" r="20" fill="#F4A6A0" />
        <path d="M110 98 C104 108 104 128 110 138" stroke="#E07A5F" strokeWidth="2" fill="none" />
        <path d="M110 98 C118 88 128 88 132 92 C124 98 116 98 110 98 Z" fill="#6A994E" />
      </>
    ),
  },
  {
    id: "slumdog",
    title: "Slumdog Millionaire",
    year: 2008,
    bg: "#3C096C",
    ink: "#FFD166",
    art: (
      <>
        <circle cx="100" cy="70" r="40" fill="#5A189A" />
        <text x="100" y="88" textAnchor="middle" fontSize="54" fontWeight="700" fill="#FFD166" style={{ fontFamily: "var(--font-display)" }}>
          ₹
        </text>
        {[0, 1, 2, 3].map((i) => (
          <polygon
            key={i}
            points={`${(i % 2) * 96 + 10},${126 + Math.floor(i / 2) * 28} ${(i % 2) * 96 + 20},${116 + Math.floor(i / 2) * 28} ${(i % 2) * 96 + 86},${116 + Math.floor(i / 2) * 28} ${(i % 2) * 96 + 96},${126 + Math.floor(i / 2) * 28} ${(i % 2) * 96 + 86},${136 + Math.floor(i / 2) * 28} ${(i % 2) * 96 + 20},${136 + Math.floor(i / 2) * 28}`}
            fill={i === 3 ? "#F77F00" : "#10002B"}
            stroke="#C77DFF"
            strokeWidth="2"
          />
        ))}
      </>
    ),
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    year: 2023,
    bg: "#0B090A",
    ink: "#FFBA08",
    art: (
      <>
        <rect y="160" width="200" height="40" fill="#3D2B1F" />
        <circle cx="100" cy="100" r="66" fill="#9D0208" />
        <circle cx="100" cy="100" r="48" fill="#E85D04" />
        <circle cx="100" cy="100" r="30" fill="#FFBA08" />
        <circle cx="100" cy="100" r="14" fill="#FFF3B0" />
        <ellipse cx="100" cy="100" rx="86" ry="22" fill="none" stroke="#FFF3B0" strokeWidth="2.5" opacity=".7" />
        <ellipse cx="100" cy="100" rx="86" ry="22" fill="none" stroke="#FFF3B0" strokeWidth="2.5" opacity=".7" transform="rotate(60 100 100)" />
        <ellipse cx="100" cy="100" rx="86" ry="22" fill="none" stroke="#FFF3B0" strokeWidth="2.5" opacity=".7" transform="rotate(-60 100 100)" />
      </>
    ),
  },
  {
    id: "ben-hur",
    title: "Ben-Hur",
    year: 1959,
    bg: "#E9C46A",
    ink: k.dark,
    art: (
      <>
        <rect y="150" width="200" height="50" fill="#D4A373" />
        <ellipse cx="60" cy="160" rx="50" ry="10" fill="#E6CCB2" opacity=".8" />
        <circle cx="100" cy="100" r="58" fill="none" stroke="#7F5539" strokeWidth="10" />
        {[0, 30, 60, 90, 120, 150].map((a) => (
          <rect key={a} x="97" y="46" width="6" height="108" fill="#9C6644" transform={`rotate(${a} 100 100)`} />
        ))}
        <circle cx="100" cy="100" r="14" fill="#B08968" />
        <circle cx="100" cy="100" r="6" fill="#7F5539" />
      </>
    ),
  },
  {
    id: "amadeus",
    title: "Amadeus",
    year: 1984,
    bg: "#F1FAEE",
    ink: k.dark,
    art: (
      <>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x="14" y={110 + i * 10} width="172" height="2" fill="#457B9D" />
        ))}
        {[
          [40, 140, 0],
          [70, 125, 1],
          [100, 135, 0],
          [130, 115, 1],
          [160, 130, 0],
        ].map(([x, y, up], i) => (
          <g key={i} fill={k.dark}>
            <ellipse cx={x} cy={y} rx="7" ry="5" transform={`rotate(-20 ${x} ${y})`} />
            <rect x={x + 5} y={up ? y - 34 : y - 34} width="2.5" height="34" />
          </g>
        ))}
        <g transform="rotate(35 120 60)">
          <path d="M120 10 C140 30 140 70 122 100 L118 100 C104 70 104 30 120 10 Z" fill="#E63946" />
          <path d="M120 16 L120 112" stroke="#9D0208" strokeWidth="2" />
          <polygon points="117,100 123,100 120,116" fill="#1D3557" />
        </g>
      </>
    ),
  },
  {
    id: "chicago",
    title: "Chicago",
    year: 2002,
    bg: "#0B0B0B",
    ink: "#F6BD60",
    art: (
      <>
        <polygon points="80,0 120,0 180,200 20,200" fill="#F6BD60" opacity=".22" />
        <ellipse cx="100" cy="176" rx="64" ry="10" fill="#F6BD60" opacity=".35" />
        <rect x="70" y="62" width="60" height="62" rx="4" fill="#1B1B1B" stroke="#F6BD60" strokeWidth="2" />
        <rect x="70" y="108" width="60" height="9" fill="#C1121F" />
        <ellipse cx="100" cy="126" rx="48" ry="9" fill="#1B1B1B" stroke="#F6BD60" strokeWidth="2" />
        <g transform="rotate(20 140 140)">
          <rect x="138" y="100" width="6" height="76" fill="#E9ECEF" />
          <path d="M141 100 C141 84 162 84 162 98" stroke="#E9ECEF" strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
        {[30, 170, 44, 160].map((x, i) => (
          <circle key={i} cx={x} cy={30 + i * 22} r="2.5" fill="#F6BD60" />
        ))}
      </>
    ),
  },
  {
    id: "eeaao",
    title: "Everything Everywhere All at Once",
    year: 2022,
    bg: "#FDF0D5",
    ink: k.dark,
    art: (
      <>
        <circle cx="96" cy="112" r="56" fill="#3D2B1F" />
        <circle cx="96" cy="112" r="18" fill="#FDF0D5" />
        {[
          [70, 80], [120, 82], [140, 110], [124, 146], [80, 150], [56, 120], [100, 72], [64, 100], [130, 130],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill="#F2E8CF" />
        ))}
        <circle cx="150" cy="56" r="26" fill={k.white} stroke={k.dark} strokeWidth="3" />
        <circle cx="158" cy="64" r="12" fill={k.dark} />
        <circle cx="50" cy="40" r="10" fill="#E76F51" />
        <circle cx="34" cy="168" r="8" fill="#2A9D8F" />
      </>
    ),
  },
  {
    id: "lawrence-arabia",
    title: "Lawrence of Arabia",
    year: 1962,
    bg: "#F4A261",
    ink: k.dark,
    art: (
      <>
        <circle cx="130" cy="78" r="40" fill="#FFE8A3" />
        <path d="M0 130 C50 110 90 112 130 128 C160 140 180 136 200 126 L200 200 L0 200 Z" fill="#E76F51" />
        <path d="M0 160 C60 140 120 150 200 160 L200 200 L0 200 Z" fill="#C8553D" />
        <g fill="#3D2B1F">
          <ellipse cx="62" cy="116" rx="20" ry="11" />
          <circle cx="58" cy="102" r="7" />
          <path d="M80 112 C88 104 90 94 96 92 L100 96 C96 100 92 110 84 118 Z" />
          <rect x="46" y="120" width="4" height="22" />
          <rect x="54" y="122" width="4" height="20" />
          <rect x="68" y="122" width="4" height="20" />
          <rect x="76" y="120" width="4" height="22" />
          <path d="M54 96 L62 96 L60 84 L56 84 Z" />
        </g>
      </>
    ),
  },
  {
    id: "nomadland",
    title: "Nomadland",
    year: 2020,
    bg: "#264653",
    ink: "#F4A261",
    art: (
      <>
        <circle cx="150" cy="60" r="22" fill="#F4A261" />
        <path d="M0 120 L40 96 L70 112 L110 88 L150 110 L200 92 L200 140 L0 140 Z" fill="#2A9D8F" opacity=".6" />
        <rect y="136" width="200" height="64" fill="#E9C46A" />
        <polygon points="86,200 114,200 104,136 96,136" fill="#6D6875" />
        <rect x="40" y="104" width="92" height="40" rx="8" fill="#F1FAEE" />
        <rect x="40" y="124" width="92" height="6" fill="#E76F51" />
        <rect x="104" y="110" width="22" height="12" rx="3" fill="#A8DADC" />
        <rect x="50" y="110" width="16" height="10" rx="2" fill="#A8DADC" />
        <circle cx="62" cy="146" r="9" fill="#1B1B1B" />
        <circle cx="114" cy="146" r="9" fill="#1B1B1B" />
      </>
    ),
  },
];

const BY_ID = Object.fromEntries(FILMS.map((f) => [f.id, f]));

export function filmItems(): Item[] {
  // pos.x = release year, so the "nearest neighbours" are films from nearby years.
  return FILMS.map((f) => ({ id: f.id, answer: f.title, pos: { x: f.year, y: 0 } }));
}

export function FilmArt({ id }: { id: string }) {
  const f = BY_ID[id];
  if (!f) return null;
  return (
    <svg className="poster" viewBox="0 0 200 250" role="img" aria-label={`Illustration from a film released in ${f.year}`}>
      <rect width="200" height="250" fill={f.bg} />
      <svg x="0" y="0" width="200" height="200" viewBox="0 0 200 200" overflow="hidden">
        {f.art}
      </svg>
      <rect y="200" width="200" height="50" fill={f.bg} />
      <text
        x="100"
        y="236"
        textAnchor="middle"
        fontSize="30"
        fontWeight="700"
        letterSpacing="3"
        fill={f.ink}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {f.year}
      </text>
    </svg>
  );
}
