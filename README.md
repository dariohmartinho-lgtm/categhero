# Categhero

A quiz game about being the best in one category. See `SPEC.md` for the full product spec.

## Status: M1 (test build)

- Countries of Europe, playable end to end: Challenge (3 lives, 10 s per map, shuffled items and options, wrong options from the 8 nearest neighbours) and Practice.
- Results with positions in Total / Monthly / Weekly, leadership banner and a review grid of missed maps.
- Sign-in asks for a **name only** (no email) for this test phase. Players and runs are stored in the browser (`localStorage`). Entering the same name again continues as that player, so several people can test on one device.
- Light and dark themes follow the system setting. Installable as a PWA (manifest, icons, service worker).

Accounts, server-side runs and shared rankings come in M2 (Supabase).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests for the game rules (Vitest)
npm run build      # production build
```

## Layout

| Path | What |
|---|---|
| `src/lib/game.ts` | Pure game logic: shuffling, options, run state, scoring, tiebreak, rankings, leadership changes |
| `src/lib/game.test.ts` | Unit tests for SPEC 2.1 to 2.4 |
| `src/lib/store.ts` | Browser storage for the player and runs (replaced by Supabase in M2) |
| `src/strings.ts` | Every UI string |
| `src/data/europe.json` | Projected map paths; regenerate with `scripts/build-europe-map.mjs` |
| `src/components/` | Screens: sign-in, home, category with ranking, game, results |
| `public/sw.js` | Service worker |
