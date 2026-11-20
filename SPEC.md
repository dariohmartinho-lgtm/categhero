# Categhero: Product and Build Specification

Version 1.0 · Written for Claude Code · Owner: Dario

This document is the single source of truth for building Categhero. Game rules in sections 2 and 3 were playtested in a prototype and are **locked**. Section 12 lists decisions that are still open; ask the owner before settling any of them.

---

## 1. Product summary

Categhero is a quiz game about being the best in one category. A player opens a category, sees an image, and picks the right answer from four options. Every category has its own ranking, and the player at the top is the category's hero.

Players are not matched against each other live. A player finishes a run, posts a score, and may hold the top of a category's ranking for three hours or three months until someone beats it. Losing the top spot triggers a notification, which is the main reason to come back.

**Inspiration:** the TV show and game *The Floor*, reduced to its core: one category, one person trying to be the best at it. There is no territory, no duel and no multiplayer grid.

**Name:** Categhero. Check domain and trademark availability before launch.

**Two kinds of category:**
- **Preset categories** are made by the owner. They use flat, colourful illustrations in the app's own visual identity, not photographs. The first is "Countries of Europe", drawn from public-domain map data.
- **Community categories** are created by any player. They upload their own images and write the correct answer for each.

---

## 2. Game rules (locked)

### 2.1 Challenge mode (counts for the ranking)
- The player starts with **3 lives**.
- Each item shows one image and **4 answer options**; exactly one is correct.
- **10 seconds** per item. When time runs out the item counts as a wrong answer.
- A wrong answer or a timeout removes one life.
- The run ends when the player has **0 lives** or when **all items in the category have been answered**. It does not restart or loop.
- **Score** = number of correct answers.
- **Tiebreak** = lowest total answer time. A timed-out item counts as 10 000 ms.
- Item order and option order are **shuffled on every run**.

### 2.2 Practice mode (does not count)
- No timer, no lives, no ranking entry.
- Shows the correct answer after each item, with a "Continue" button.
- Ends after all items.

### 2.3 Options (wrong answers)
- By default the three wrong options are drawn automatically from the correct answers of **other items in the same category**.
- For map categories, wrong options are drawn from the **8 nearest neighbours** of the target on the map, so options stay plausible (see the prototype, `makeOptions`).
- In community categories the creator may optionally type manual wrong answers for any item. Manual ones are used first and the rest are filled automatically.
- A category needs **at least 20 items** to be played in Challenge mode. Below that, wrong options repeat too often.

### 2.4 Rankings
Every category has a ranking with three tabs:

| Tab | Window |
|---|---|
| Total | all time |
| Monthly | last 30 days |
| Weekly | last 7 days |

- Each tab shows the **best run of each player** in that window, ordered by score descending, then total time ascending, then earliest finish time.
- The ranking shows the top 10. If the current player ranks lower, a separator and their own row appear below.
- Nothing is ever reset. Weekly and monthly tabs simply look at a sliding window.
- **The creator of a community category does not appear in that category's ranking.** They can still play it. They know every answer, so a place at the top would mean nothing.
- Preset categories have no creator, so everyone ranks.

### 2.5 Leadership change
When a finished Challenge run takes the #1 position in any of the three tabs from another player, the player who lost it receives a notification (section 8). The results screen of the winning player shows a banner such as "You took the lead from Marta in Weekly."

---

## 3. Accounts

- Sign-up requires a **name** (2 to 24 characters) and an **email**. Both are mandatory.
- The display name is shown in rankings. The email is never shown to other players.
- Supabase Auth handles authentication. Sign-in method is an open decision (section 12).
- Players can delete their account. Deleting removes their runs, their private categories and their personal data. Public community categories they created are either deleted or transferred to a "deleted user" owner; ask the owner which.

---

## 4. Platform and stack

**Chosen by the owner:** installable web app (PWA), Supabase for backend.
**Language:** English only. All UI strings live in one place (for example `src/strings.ts`) so a future translation is possible, but ship English only.

**Proposed defaults.** Claude Code may replace anything below with a justified alternative; flag the change in the PR description.

| Concern | Default |
|---|---|
| Frontend | Next.js (App Router) with TypeScript |
| Styling | Tailwind CSS with the design tokens in section 9 |
| Backend | Supabase: Postgres, Auth, Storage, Row Level Security |
| Game logic | Postgres functions (RPC), see 6.1 |
| PWA | Web manifest and a service worker for installability and Web Push |
| Push | Web Push with VAPID keys |
| Hosting | Vercel for the frontend |
| Tests | Vitest for logic, Playwright for end-to-end |

The app is mobile-first. It must work at 360 px width and scale up to a centred column on desktop (the prototype uses a 580 px column).

---

## 5. Screens

1. **Sign up / sign in.** Name and email fields, validation messages, one primary button.
2. **Home.** Greeting, preset categories as cards with a map or illustration, the current leader on each card, and a Play button. A row of "Coming soon" tiles can stay until more presets exist.
3. **Explore.** Public community categories, searchable, with a featured section.
4. **Category.** Title, creator (community only), current leader, the **Challenge** and **Practice** buttons, a short rules card, and the ranking with Total, Monthly and Weekly tabs.
5. **Game.** Top bar with exit button, progress bar and hearts (Challenge) or a "Practice" tag. Timer bar under it in Challenge. Large image, four options in a 2x2 grid, a feedback strip. Keys 1 to 4 pick an option on desktop. The exit button opens an in-page confirmation and pauses the timer; it never uses `confirm()`.
6. **Results.** Score out of total, total time, remaining lives, the player's position in each tab, a leadership banner if earned, and a "Review" grid with the missed items and their correct answers. Buttons: play again, view ranking.
7. **Create category.** Title, description, cover image, then items (image plus correct answer plus optional wrong answers). Shows a progress indicator toward the 20-item minimum. Visibility selector: private, link only, public.
8. **My categories.** Categories the user created, with edit, visibility and delete.
9. **Notifications.** In-app list of leadership changes, with unread badge.
10. **Profile and settings.** Display name, email, notification toggle, delete account.

The prototype implements screens 1, 2, 4, 5 and 6 for the Europe category. It is the visual and behavioural reference.

---

## 6. Architecture

### 6.1 Server-side run integrity (required)
Rankings are competitive. The client must **never** submit its own score or time. The server owns the run.

Flow, implemented as Postgres functions called through Supabase RPC:

1. `start_run(category_id)` creates a `runs` row with status `active`, picks the shuffled item order and option sets, stores them, and returns the first question **without** the correct answer flag.
2. `answer_question(run_id, option_id)` finds the open question, measures elapsed time from the server timestamp at which the question was issued, applies the 10 s limit with a small configurable grace for network latency (default 1 s), records the result, updates lives and score, and returns `{correct, correct_option_id, lives, next_question | finished}`.
3. A timeout is sent by the client when its timer reaches 10 s (`option_id = null`). The server also expires a question lazily: if the next call arrives after the limit plus grace, the question counts as a timeout.
4. `finish_run` is implicit when lives reach 0 or items run out. It sets `finished_at`, computes `total_time_ms`, and triggers the leadership check (section 8).

Practice mode does not need to be recorded. It can be served client-side with the correct answers included.

### 6.2 Ranking query
A function `category_ranking(category_id, period)` returns the best finished Challenge run per player in the window, excluding the category owner, sorted by `score desc, total_time_ms asc, finished_at asc`. Index on `(category_id, finished_at)` and `(category_id, user_id, score desc, total_time_ms)`. If it gets slow, move to a materialised view refreshed on run completion.

### 6.3 Row Level Security
- `profiles`: users read all display names, read and update only their own row. Emails live in `auth.users` and are never exposed.
- `categories`: public rows readable by everyone; link-only rows readable by id; private rows only by the owner. Only the owner can insert, update or delete.
- `items`: readable with the parent category rules, **but the correct answer column is never readable by clients for Challenge runs**. Expose items through the RPC functions, not direct table reads. Owners can read and write their own items.
- `runs` and run answers: users read their own; writes only through the RPC functions.
- `notifications` and `push_subscriptions`: own rows only.

---

## 7. Data model (first draft)

```
profiles        id (= auth user id), display_name, created_at, notifications_enabled
categories      id, owner_id (null for presets), kind ('preset' | 'community'),
                title, description, cover_path, visibility ('private' | 'link' | 'public'),
                status ('draft' | 'published' | 'removed'), item_count, created_at
items           id, category_id, image_path (or illustration_id), answer_text,
                wrong_answers text[] (optional, 0..3), position_hint jsonb (map presets: cx, cy), created_at
runs            id, user_id, category_id, mode, status ('active' | 'finished' | 'abandoned'),
                score, lives_left, total_time_ms, started_at, finished_at,
                question_order uuid[], current_index, current_issued_at
run_answers     id, run_id, item_id, options uuid[], chosen_item_id, correct bool, elapsed_ms
notifications   id, user_id, type ('lost_lead'), category_id, period, by_user_id, created_at, read_at
push_subscriptions  id, user_id, endpoint, keys jsonb, created_at
reports         id, reporter_id, category_id, item_id, reason, created_at, handled_at
```

Storage buckets: `category-covers` and `item-images`, public read for published content. Private and link-only categories should use signed URLs.

---

## 8. Leadership notifications

- After a Challenge run finishes, compute the leader of each tab **before** and **after** the run. If the new run took #1 from a different player, create a `lost_lead` notification for the previous leader with the category, the period and the name of the new leader.
- Deliver through **Web Push** if the user granted permission, and always through the **in-app list** with an unread badge.
- On iOS, Web Push only works when the PWA is installed to the home screen (iOS 16.4 or later). The app must offer a clear "Install" prompt and the in-app list covers everyone else.
- Throttle: at most one push per user per category per period per 24 hours. Default; confirm with the owner.
- Notification text example: "Tiago took your #1 spot in Countries of Europe (Weekly). Take it back."
- No notification when someone passes the user without taking #1.

---

## 9. Visual identity and design system

Style: **flat, colourful, friendly illustration** with chunky rounded shapes and buttons that have a darker bottom edge. The inspiration is Duolingo's feel, with the app's own palette.

Fonts (Google Fonts): **Fredoka** for headings, buttons and numbers; **Nunito** for body text.

Tokens (light / dark). The prototype `categhero-prototype.html` has the exact CSS.

| Token | Light | Dark |
|---|---|---|
| bg | #F3F6FB | #0F1626 |
| surface | #FFFFFF | #1A2338 |
| ink | #1E2A47 | #E9EEFC |
| muted | #66718C | #9AA7C4 |
| line | #DCE3F0 | #2A3553 |
| sea (map water) | #CFE7F8 | #16304A |
| land | #F1EBDC | #33405C |
| highlight (target country) | #FF8F3F | #FF9A4D |
| accent (primary buttons) | #3E6FE6 | #7C9DFF |
| ok | #2DB36B | #46C887 |
| bad | #EE5A55 | #FF7B76 |

Both themes ship from day one, following the system setting.

Components: primary, secondary, ok and bad buttons (2 px border, 5 px bottom border, press moves down 3 px); option buttons; rounded cards; hearts; timer bar (turns red in the last 3 seconds); ranking rows with a crown on #1 and a highlighted "you" row; tabs.

Respect `prefers-reduced-motion`. Every control needs a visible focus state.

**Copy voice for the English UI:** short, direct, affirmative. Lead with what the player gains. Avoid "not X, but Y" constructions and avoid repeating one word three times in a row ("every X, every Y, every Z"). Name problems plainly.

---

## 10. Illustrations and content

### 10.1 Preset: Countries of Europe (built)
Each question shows a map of Europe with one country highlighted. Geometry comes from **Natural Earth** (public domain) through the `world-atlas` npm package, projected with `d3-geo`. The script `build-europe-map.mjs` produces `europe.json`; reuse it. Projection: conic conformal, parallels 40 and 65, rotated to -14, fitted to the 20 target countries in a 640 x 600 box. Overseas territories are dropped by filtering polygons outside lon -25..50 and lat 30..73.

The 20 items: Portugal, Spain, France, Italy, Germany, Poland, United Kingdom, Ireland, Norway, Sweden, Finland, Greece, Romania, Hungary, Austria, Croatia, Bulgaria, Ukraine, Iceland, Denmark. The prototype shows them in Portuguese; the app uses the English names.

### 10.2 More preset categories
The owner wants more presets in the same illustrated style, with no photographs. Candidates (to confirm, section 12): world flags, European capitals on a map, landmarks, animals. The illustration pipeline for non-map categories is undecided.

### 10.3 Copyright
No film posters, album covers, logos, characters or other third-party artwork in presets. Community uploads put the legal responsibility on the uploader, so the upload screen asks the user to confirm they have the right to use each image, and the terms say so.

---

## 11. Community categories: limits and moderation

- Images: JPEG, PNG or WebP. Resize in the browser to a maximum of 1024 px on the long side before upload. Maximum 2 MB per image after resizing.
- Items per category: minimum 20, maximum 200 (default; confirm).
- Answer text: 1 to 60 characters. Wrong answers: 0 to 3 per item, each 1 to 60 characters.
- Rate limits on category creation and uploads per user per day.
- **Report** button on every community category and item. Reports go to the `reports` table and an admin view.
- Admin role (a flag on profiles) can set a category to `removed`.
- Public categories appear in Explore immediately but only appear in the **featured** section after a manual review. Start with private and link-only sharing if moderation is not ready.
- Optional automated image screening is an open decision.

---

## 12. Open decisions (ask the owner before choosing)

1. **Sign-in method.** Email magic link or one-time code, versus email and password. Suggested default: magic link plus display name set at sign-up.
2. **Ranking windows.** The prototype uses sliding windows (7 and 30 days). Confirm, or switch to calendar week and calendar month.
3. **Notification throttle.** One push per category per period per day is the default.
4. **Which preset categories come after Europe**, and how their illustrations are produced.
5. **Account deletion and public categories.** Delete them, or keep them under a "deleted user" owner.
6. **Moderation tooling.** Manual only, or automated screening of uploaded images.
7. **Limits** in section 11.
8. **Name and domain.** Trademark and domain availability for "Categhero".
9. **Analytics.** None, or a privacy-friendly tool.

---

## 13. Build plan

Each milestone ends in a working, deployable app. Do not start the next one until the owner has tried the current one.

**M1: Foundation and local game.**
Project scaffold, design tokens, both themes, PWA manifest. The Europe category playable end to end with Challenge and Practice, hearts, the 10 s timer, shuffling, nearest-neighbour options, results with review. Logic in a pure module with unit tests for scoring, tiebreak and option generation. Data from `europe.json`.
*Done when:* all rules in section 2.1 to 2.3 pass their tests and the game matches the prototype.

**M2: Accounts, server runs and rankings.**
Supabase project, sign-up with name and email, `profiles`, the RPC functions in 6.1, the ranking function in 6.2, RLS in 6.3, the Category screen with the three tabs, the results positions, the leadership banner.
*Done when:* two accounts can compete, a client cannot read correct answers or post a score, and the tiebreak and windows behave correctly in tests.

**M3: Community categories.**
Create and edit screens, image upload with resizing, validation, visibility, My categories, Explore, creator excluded from own ranking, report button and admin removal.
*Done when:* a user can build a 20-item category, share it by link, and another user can play and rank in it.

**M4: Notifications.**
Leadership check, `notifications` table, in-app list and badge, Web Push with VAPID, install prompt, throttling.
*Done when:* losing #1 in a tab produces a notification for the previous leader, delivered by push on a device that allowed it.

**M5: More presets and polish.**
Additional illustrated preset categories, accessibility pass, performance pass, empty and error states, terms and privacy pages, account deletion and data export.

---

## 14. Reference files

- `categhero-prototype.html`: the playable prototype. Behaviour, copy structure and CSS are the reference for M1.
- `europe.json`: projected map paths for the 20 countries plus 43 context shapes, with centroids (`cx`, `cy`) used for neighbour options.
- `build-europe-map.mjs`: regenerates `europe.json` (`npm i world-atlas topojson-client d3-geo`).

The prototype is in Portuguese and stores everything in the browser. The rankings it shows are made-up players. Treat it as a behavioural and visual reference only, not as code to ship.
