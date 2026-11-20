import type { ReactNode } from "react";
import type { Item } from "@/lib/game";

/**
 * "Who wrote it?" preset. Every cover is an ORIGINAL design in the app's style:
 * the book's title (a fact, not artwork) plus a simple motif. Real cover art is
 * never reproduced (SPEC 10.3). The answer is the author.
 */

interface Book {
  id: string;
  title: string;
  lines: string[];
  author: string;
  bg: string;
  ink: string;
  art: ReactNode;
}

const dark = "#1E2A47";

export const BOOKS: Book[] = [
  {
    id: "don-quixote",
    title: "Don Quixote",
    lines: ["Don Quixote"],
    author: "Miguel de Cervantes",
    bg: "#E9C46A",
    ink: dark,
    art: (
      <>
        <rect y="160" width="200" height="40" fill="#A3B18A" />
        <polygon points="84,160 116,160 108,80 92,80" fill="#F2E8CF" />
        <polygon points="88,80 112,80 100,64" fill="#BC6C25" />
        <rect x="96" y="132" width="8" height="28" fill="#6F4518" />
        <g transform="rotate(20 100 82)">
          {[0, 90, 180, 270].map((a) => (
            <g key={a} transform={`rotate(${a} 100 82)`}>
              <rect x="97" y="22" width="6" height="60" fill="#6F4518" />
              <rect x="103" y="26" width="16" height="50" fill="#FEFAE0" stroke="#6F4518" strokeWidth="2" />
            </g>
          ))}
        </g>
        <circle cx="100" cy="82" r="6" fill="#6F4518" />
      </>
    ),
  },
  {
    id: "1984",
    title: "Nineteen Eighty-Four",
    lines: ["Nineteen", "Eighty-Four"],
    author: "George Orwell",
    bg: "#2B2D42",
    ink: "#EF233C",
    art: (
      <>
        <path d="M20 100 C60 40 140 40 180 100 C140 160 60 160 20 100 Z" fill="#EDF2F4" />
        <circle cx="100" cy="100" r="34" fill="#EF233C" />
        <circle cx="100" cy="100" r="16" fill="#2B2D42" />
        <circle cx="108" cy="92" r="5" fill="#EDF2F4" />
      </>
    ),
  },
  {
    id: "harry-potter",
    title: "Harry Potter and the Philosopher's Stone",
    lines: ["Harry Potter", "and the", "Philosopher's Stone"],
    author: "J.K. Rowling",
    bg: "#7B2CBF",
    ink: "#FFD166",
    art: (
      <>
        <polygon points="110,20 80,96 104,96 84,170 132,80 106,80 128,20" fill="#FFD166" />
        <g transform="rotate(-35 70 140)">
          <rect x="20" y="136" width="110" height="9" rx="4" fill="#6F4518" />
          <rect x="20" y="136" width="34" height="9" rx="4" fill="#3A2213" />
        </g>
      </>
    ),
  },
  {
    id: "alchemist",
    title: "The Alchemist",
    lines: ["The", "Alchemist"],
    author: "Paulo Coelho",
    bg: "#F4A261",
    ink: dark,
    art: (
      <>
        <circle cx="140" cy="60" r="26" fill="#FFE8A3" />
        <polygon points="30,160 90,70 150,160" fill="#E9C46A" />
        <polygon points="90,70 150,160 110,160" fill="#D4A373" />
        <path d="M0 160 C60 150 140 150 200 160 L200 200 L0 200 Z" fill="#E76F51" />
        <polygon points="160,160 176,128 192,160" fill="#E9C46A" />
      </>
    ),
  },
  {
    id: "pride-prejudice",
    title: "Pride and Prejudice",
    lines: ["Pride and", "Prejudice"],
    author: "Jane Austen",
    bg: "#F7D6E0",
    ink: "#6D2E46",
    art: (
      <>
        <ellipse cx="100" cy="160" rx="70" ry="12" fill="#E5989B" />
        <path d="M50 90 L150 90 C150 130 130 154 100 154 C70 154 50 130 50 90 Z" fill={"#FFFFFF"} stroke="#6D2E46" strokeWidth="3" />
        <path d="M150 104 C176 104 176 134 146 134" stroke="#6D2E46" strokeWidth="5" fill="none" />
        <path d="M60 112 C80 120 120 120 140 112" stroke="#B5838D" strokeWidth="5" fill="none" />
        <path d="M84 70 C78 60 90 54 84 42 M112 70 C106 60 118 54 112 42" stroke="#B5838D" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "moby-dick",
    title: "Moby-Dick",
    lines: ["Moby-Dick"],
    author: "Herman Melville",
    bg: "#1D3557",
    ink: "#F1FAEE",
    art: (
      <>
        <rect y="130" width="200" height="70" fill="#457B9D" />
        <path d="M100 140 C96 110 98 90 100 80 C110 64 140 50 168 56 C150 66 120 80 108 96 C106 110 106 124 108 140 Z" fill="#F1FAEE" />
        <path d="M100 140 C96 110 94 96 92 88 C80 70 50 58 26 64 C44 72 74 84 86 100 C90 114 92 126 92 140 Z" fill="#F1FAEE" />
        <path d="M30 150 C50 142 70 158 90 150 M110 160 C130 152 150 168 170 160" stroke="#A8DADC" strokeWidth="4" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "great-gatsby",
    title: "The Great Gatsby",
    lines: ["The Great", "Gatsby"],
    author: "F. Scott Fitzgerald",
    bg: "#0B132B",
    ink: "#F6BD60",
    art: (
      <>
        <rect y="130" width="200" height="70" fill="#1C2541" />
        <rect x="140" y="80" width="6" height="56" fill="#3A506B" />
        <circle cx="143" cy="78" r="9" fill="#06D6A0" />
        <circle cx="143" cy="78" r="22" fill="#06D6A0" opacity=".25" />
        <path d="M143 140 L143 196" stroke="#06D6A0" strokeWidth="4" opacity=".5" strokeDasharray="6 6" />
        <rect x="0" y="136" width="110" height="8" fill="#3A506B" />
        {[10, 40, 70, 100].map((x) => (
          <rect key={x} x={x} y="136" width="5" height="26" fill="#3A506B" />
        ))}
        {[30, 60, 90, 170].map((x, i) => (
          <circle key={x} cx={x} cy={30 + (i % 2) * 20} r="2" fill="#F6BD60" />
        ))}
      </>
    ),
  },
  {
    id: "solitude",
    title: "One Hundred Years of Solitude",
    lines: ["One Hundred", "Years of", "Solitude"],
    author: "Gabriel García Márquez",
    bg: "#2A9D8F",
    ink: "#FFF3B0",
    art: (
      <>
        {[
          [60, 70, 1.2, -15],
          [130, 50, 0.9, 20],
          [110, 120, 1.4, 5],
          [50, 150, 0.8, -30],
          [160, 150, 1, 15],
        ].map(([x, y, s, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
            <path d="M0 0 C-20 -24 -34 -6 -22 6 C-30 18 -14 26 0 6 Z" fill="#FFD60A" />
            <path d="M0 0 C20 -24 34 -6 22 6 C30 18 14 26 0 6 Z" fill="#FFC300" />
            <rect x="-1.5" y="-10" width="3" height="20" rx="1.5" fill="#3D2B1F" />
          </g>
        ))}
      </>
    ),
  },
  {
    id: "hobbit",
    title: "The Hobbit",
    lines: ["The", "Hobbit"],
    author: "J.R.R. Tolkien",
    bg: "#606C38",
    ink: "#FEFAE0",
    art: (
      <>
        <path d="M0 200 L0 110 C40 80 160 80 200 110 L200 200 Z" fill="#283618" />
        <circle cx="100" cy="140" r="52" fill="#DDA15E" />
        <circle cx="100" cy="140" r="44" fill="#2D6A4F" />
        {[-30, -15, 0, 15, 30].map((dx) => (
          <rect key={dx} x={100 + dx - 1} y="98" width="2" height="84" fill="#1B4332" />
        ))}
        <circle cx="100" cy="140" r="6" fill="#FFD166" />
      </>
    ),
  },
  {
    id: "frankenstein",
    title: "Frankenstein",
    lines: ["Frankenstein"],
    author: "Mary Shelley",
    bg: "#14213D",
    ink: "#A7C957",
    art: (
      <>
        <path d="M40 20 C70 20 80 40 60 50 C90 50 100 70 70 76" stroke="#6C757D" strokeWidth="18" fill="none" strokeLinecap="round" opacity=".6" />
        <polygon points="112,30 72,110 100,110 78,180 138,90 108,90 132,30" fill="#FCA311" />
        <rect x="36" y="150" width="128" height="40" rx="6" fill="#3A3A3A" />
        <circle cx="64" cy="170" r="8" fill="#A7C957" />
        <circle cx="100" cy="170" r="8" fill="#E5E5E5" />
        <circle cx="136" cy="170" r="8" fill="#E63946" />
      </>
    ),
  },
  {
    id: "romeo-juliet",
    title: "Romeo and Juliet",
    lines: ["Romeo and", "Juliet"],
    author: "William Shakespeare",
    bg: "#6A040F",
    ink: "#FFE5EC",
    art: (
      <>
        <path d="M80 190 C84 150 76 120 82 90" stroke="#2D6A4F" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M80 140 C60 130 52 140 50 150 C64 152 74 148 80 140 Z" fill="#40916C" />
        <path d="M81 120 C98 108 108 114 112 122 C100 128 90 126 81 120 Z" fill="#40916C" />
        <circle cx="82" cy="70" r="30" fill="#E5383B" />
        <path d="M62 64 C70 46 96 46 102 64 C92 56 76 58 70 74 Z" fill="#BA181B" />
        <path d="M74 80 C76 64 92 62 96 74 C90 70 82 72 80 84 Z" fill="#A4161A" />
        <rect x="136" y="128" width="14" height="14" rx="2" fill="#FFE5EC" />
        <path d="M130 142 L156 142 C166 152 166 182 143 186 C120 182 120 152 130 142 Z" fill="#7B2CBF" stroke="#FFE5EC" strokeWidth="3" />
        <path d="M128 166 C136 162 150 170 158 166" stroke="#C77DFF" strokeWidth="3" fill="none" />
      </>
    ),
  },
  {
    id: "little-prince",
    title: "The Little Prince",
    lines: ["The Little", "Prince"],
    author: "Antoine de Saint-Exupéry",
    bg: "#023E8A",
    ink: "#FFE8A3",
    art: (
      <>
        {[
          [30, 30], [170, 40], [150, 90], [20, 120], [180, 170], [60, 80],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill="#FFE8A3" />
        ))}
        <circle cx="100" cy="150" r="56" fill="#90E0EF" />
        <circle cx="80" cy="140" r="8" fill="#48CAE4" />
        <circle cx="120" cy="170" r="6" fill="#48CAE4" />
        <path d="M100 96 L100 70" stroke="#2D6A4F" strokeWidth="4" />
        <path d="M100 84 C108 80 112 84 110 88" stroke="#2D6A4F" strokeWidth="3" fill="none" />
        <circle cx="100" cy="62" r="11" fill="#E63946" />
        <path d="M92 58 C96 52 104 52 108 58" stroke="#9D0208" strokeWidth="2" fill="none" />
      </>
    ),
  },
  {
    id: "blindness",
    title: "Blindness",
    lines: ["Blindness"],
    author: "José Saramago",
    bg: "#F8F9FA",
    ink: "#212529",
    art: (
      <>
        <circle cx="100" cy="100" r="70" fill="#E9ECEF" />
        <path d="M30 100 C60 54 140 54 170 100 C140 146 60 146 30 100 Z" fill={"#FFFFFF"} stroke="#ADB5BD" strokeWidth="4" />
        <circle cx="100" cy="100" r="24" fill="#F1F3F5" stroke="#CED4DA" strokeWidth="3" />
        <rect x="20" y="92" width="160" height="16" rx="8" fill="#212529" />
      </>
    ),
  },
  {
    id: "lusiads",
    title: "The Lusiads",
    lines: ["The", "Lusiads"],
    author: "Luís de Camões",
    bg: "#0077B6",
    ink: "#FFFFFF",
    art: (
      <>
        <rect y="150" width="200" height="50" fill="#03045E" />
        <path d="M40 140 L160 140 L148 162 L52 162 Z" fill="#8D5B3E" />
        <rect x="98" y="40" width="5" height="100" fill="#5C3A21" />
        <rect x="64" y="70" width="5" height="70" fill="#5C3A21" />
        <path d="M70 50 C100 46 130 50 136 56 C134 80 136 100 134 118 C110 112 90 112 72 118 C74 96 74 72 70 50 Z" fill="#FEFAE0" />
        <path d="M95 70 L111 70 M103 62 L103 96" stroke="#D00000" strokeWidth="6" />
        <path d="M40 80 L64 78 L64 120 L44 124 Z" fill="#FEFAE0" />
        <path d="M30 170 C50 160 70 178 90 168 M110 180 C130 170 150 186 170 176" stroke="#90E0EF" strokeWidth="3" fill="none" />
      </>
    ),
  },
  {
    id: "crime-punishment",
    title: "Crime and Punishment",
    lines: ["Crime and", "Punishment"],
    author: "Fyodor Dostoevsky",
    bg: "#370617",
    ink: "#F8F9FA",
    art: (
      <>
        <g transform="rotate(-30 100 100)">
          <rect x="96" y="40" width="10" height="140" rx="4" fill="#8D5B3E" />
          <path d="M92 44 L60 30 C50 50 50 70 60 90 L92 76 Z" fill="#ADB5BD" />
          <path d="M60 30 C50 50 50 70 60 90" stroke="#F8F9FA" strokeWidth="3" fill="none" />
        </g>
        <circle cx="150" cy="160" r="5" fill="#D00000" />
        <circle cx="166" cy="148" r="3" fill="#D00000" />
      </>
    ),
  },
  {
    id: "war-peace",
    title: "War and Peace",
    lines: ["War and", "Peace"],
    author: "Leo Tolstoy",
    bg: "#CAF0F8",
    ink: "#03045E",
    art: (
      <>
        <rect y="150" width="200" height="50" fill={"#FFFFFF"} />
        <g transform="rotate(-12 100 120)">
          <rect x="60" y="104" width="100" height="22" rx="10" fill="#343A40" />
          <rect x="150" y="100" width="14" height="30" rx="4" fill="#212529" />
        </g>
        <circle cx="76" cy="146" r="22" fill="none" stroke="#6F4518" strokeWidth="6" />
        <circle cx="76" cy="146" r="4" fill="#6F4518" />
        {[
          [30, 40], [80, 24], [140, 50], [170, 20], [110, 80], [40, 90],
        ].map(([x, y], i) => (
          <g key={i} stroke="#0077B6" strokeWidth="2.5" strokeLinecap="round">
            <path d={`M${x - 7} ${y} L${x + 7} ${y} M${x} ${y - 7} L${x} ${y + 7} M${x - 5} ${y - 5} L${x + 5} ${y + 5} M${x + 5} ${y - 5} L${x - 5} ${y + 5}`} />
          </g>
        ))}
      </>
    ),
  },
  {
    id: "mockingbird",
    title: "To Kill a Mockingbird",
    lines: ["To Kill a", "Mockingbird"],
    author: "Harper Lee",
    bg: "#FFE8D6",
    ink: "#6B705C",
    art: (
      <>
        <path d="M0 150 C60 130 120 140 200 120" stroke="#6F4518" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M130 134 C140 120 160 118 170 110" stroke="#6F4518" strokeWidth="4" fill="none" />
        <ellipse cx="164" cy="104" rx="10" ry="6" fill="#A5A58D" transform="rotate(-20 164 104)" />
        <path d="M70 136 C60 120 70 96 96 92 C110 90 122 98 126 106 L140 104 L126 114 C120 132 100 140 84 138 L50 150 Z" fill="#8D99AE" />
        <path d="M80 112 C92 104 110 106 116 118 C104 126 88 124 80 112 Z" fill="#5C677D" />
        <circle cx="114" cy="100" r="3" fill="#212529" />
        <rect x="88" y="138" width="3" height="10" fill="#212529" />
        <rect x="98" y="136" width="3" height="10" fill="#212529" />
      </>
    ),
  },
  {
    id: "da-vinci-code",
    title: "The Da Vinci Code",
    lines: ["The Da Vinci", "Code"],
    author: "Dan Brown",
    bg: "#3D2B1F",
    ink: "#E9C46A",
    art: (
      <>
        <circle cx="100" cy="100" r="76" fill="none" stroke="#E9C46A" strokeWidth="2" opacity=".5" />
        <rect x="34" y="34" width="132" height="132" fill="none" stroke="#E9C46A" strokeWidth="2" opacity=".5" />
        <rect x="30" y="80" width="140" height="40" rx="6" fill="#B08968" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect x={44 + i * 23} y="78" width="18" height="44" rx="3" fill="#7F5539" />
            <text x={53 + i * 23} y="106" textAnchor="middle" fontSize="16" fontWeight="700" fill="#E9C46A" style={{ fontFamily: "var(--font-display)" }}>
              {"VERUM"[i]}
            </text>
          </g>
        ))}
        <rect x="20" y="86" width="12" height="28" rx="3" fill="#E9C46A" />
        <rect x="168" y="86" width="12" height="28" rx="3" fill="#E9C46A" />
      </>
    ),
  },
  {
    id: "old-man-sea",
    title: "The Old Man and the Sea",
    lines: ["The Old Man", "and the Sea"],
    author: "Ernest Hemingway",
    bg: "#48CAE4",
    ink: "#03045E",
    art: (
      <>
        <circle cx="160" cy="40" r="20" fill="#FFD166" />
        <rect y="120" width="200" height="80" fill="#0077B6" />
        <path d="M60 120 L140 120 L130 136 L70 136 Z" fill="#8D5B3E" />
        <path d="M98 120 L98 70 L124 112 Z" fill="#FEFAE0" />
        <rect x="96" y="66" width="4" height="56" fill="#5C3A21" />
        <g stroke="#F1FAEE" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M30 168 L170 168" />
          {[50, 70, 90, 110, 130, 150].map((x) => (
            <path key={x} d={`M${x} 156 L${x} 180`} />
          ))}
          <path d="M170 168 L190 154 M170 168 L190 182" />
        </g>
        <path d="M10 160 C14 150 30 152 30 168 C30 184 14 186 10 176 Z" fill="#F1FAEE" />
      </>
    ),
  },
  {
    id: "alice",
    title: "Alice's Adventures in Wonderland",
    lines: ["Alice's", "Adventures in", "Wonderland"],
    author: "Lewis Carroll",
    bg: "#BDE0FE",
    ink: "#3A0CA3",
    art: (
      <>
        <rect x="94" y="28" width="12" height="16" rx="3" fill="#BC6C25" />
        <circle cx="100" cy="24" r="8" fill="none" stroke="#BC6C25" strokeWidth="4" />
        <circle cx="100" cy="104" r="62" fill="#DDA15E" />
        <circle cx="100" cy="104" r="52" fill="#FEFAE0" />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x="98.5" y="56" width="3" height="10" fill="#3A0CA3" transform={`rotate(${i * 30} 100 104)`} />
        ))}
        <rect x="98" y="66" width="4" height="40" rx="2" fill="#3A0CA3" />
        <rect x="98" y="102" width="4" height="30" rx="2" fill="#3A0CA3" transform="rotate(-60 100 104)" />
        <circle cx="100" cy="104" r="5" fill="#E63946" />
        <path d="M30 190 L50 170 L60 190 Z M150 190 L162 168 L176 190 Z" fill="#E63946" />
      </>
    ),
  },
];

const BY_ID = Object.fromEntries(BOOKS.map((b) => [b.id, b]));

export function bookItems(): Item[] {
  return BOOKS.map((b) => ({ id: b.id, answer: b.author }));
}

export function bookTitle(id: string): string {
  return BY_ID[id]?.title ?? "";
}

export function BookArt({ id }: { id: string }) {
  const b = BY_ID[id];
  if (!b) return null;
  const size = b.lines.length > 2 ? 17 : 21;
  const top = b.lines.length > 2 ? 34 : 40;
  return (
    <svg className="cover" viewBox="0 0 180 250" role="img" aria-label={`Book cover: ${b.title}`}>
      <rect width="180" height="250" rx="6" fill={b.bg} />
      <rect width="14" height="250" fill="#000" opacity=".18" />
      <rect x="14" width="3" height="250" fill="#fff" opacity=".18" />
      <text
        x="97"
        y={top}
        textAnchor="middle"
        fontSize={size}
        fontWeight="700"
        fill={b.ink}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {b.lines.map((l, i) => (
          <tspan key={i} x="97" dy={i === 0 ? 0 : size * 1.12}>
            {l}
          </tspan>
        ))}
      </text>
      <svg x="27" y="98" width="140" height="140" viewBox="0 0 200 200" overflow="hidden">
        {b.art}
      </svg>
    </svg>
  );
}
