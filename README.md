# TangoFlow

A visual milonga planning tool for tango DJs — map the emotional arc of your sets and discover how your music choices flow from one tanda to the next.

Whether you're building your first milonga or you've been spinning for years, TangoFlow gives you a clear, honest picture of your set: its energy shape, its balance, and the invisible threads that connect each tanda to the next.

## What It Does

**For DJs finding their voice**

Visualize the energy curve of your entire evening at a glance. See whether your set breathes — rises, falls, builds — or whether it stays flat. Get gentle nudges when something feels off: two tandas from the same orchestra back to back, three tangos in a row, a first hour with no vals.

**For experienced DJs**

Go deeper. Over time, TangoFlow reveals your instincts: the orchestras you return to, the energy shapes you naturally gravitate toward, the way you move through styles and moods. Not as a judgment — as a mirror.

## Features

- **Drag-and-drop set builder** — arrange tandas on a timeline, reorder freely
- **Live energy curve** — smooth SVG visualization of your set's emotional arc
- **Intelligent warnings** — back-to-back orchestras, type imbalances, energy jumps
- **Orchestra reference database** — detailed profiles with energy, danceability, complexity, mood, and DJ notes
- **Tanda library** — build and manage your personal collection of tandas
- **Set statistics** — type breakdown, estimated duration, unique orchestras, average energy
- **Export options** — JSON backup, plain text, and print-ready PDF view
- **Community-driven database** — orchestra profiles live in a shared Google Sheet that any DJ can improve
- **Multilingual** — English, French, Spanish
- **Dark mode** — tango-inspired gold and bronze color scheme

## The Orchestra Database — Open & Collaborative

TangoFlow's orchestra profiles are not locked inside the app. They live in a public Google Sheet that the tango DJ community can read, correct, and expand:

**→ [View & Edit the Orchestra Database](https://docs.google.com/spreadsheets/d/1yXR2Xayajkt8vuXE0zswcCzz4v95Jk2x2Xf16b1eLMM/edit?gid=1820784714#gid=1820784714)**

The app fetches this sheet on every page load, so any change you make is reflected immediately for all users.

### What's in the sheet

The database contains 80+ singer-specific orchestra profiles. Each row represents a unique combination of orchestra + singer + era — because the same orchestra can feel completely different depending on who's singing. D'Arienzo with Echagüe (energy 9, driving) is a different animal from D'Arienzo with Mauré (energy 7, romantic). Biagi with Ortiz (energy 8, rhythmic peak) is not the same tanda as Biagi with Amor (energy 6, romantic interlude).

### How to contribute

- **Correct a score** — If you think Di Sarli's energy should be 6 instead of 5, change it. Use the "Your Correction" column if you prefer to suggest rather than edit directly.
- **Add a missing orchestra** — Know an orchestra or singer combination that's missing? Add a row following the existing format.
- **Improve DJ notes** — The notes are meant to help DJs who don't know an orchestra yet. Make them more useful.
- **Add context** — The "Your Notes" column is yours. Add what you know.

The sheet is organized into sections: The Big Four, Major Golden Age, Old Guard, Transitional, Modern Dance, and Neo-Tango. Please add new entries in the right section.

## How Energy Scoring Works

Every orchestra profile in TangoFlow has an **energy score from 1 to 10**. This is the heart of the app — it's what draws the curve, triggers the warnings, and helps you see the shape of your evening.

### What energy means

Energy is *physical* energy on the dance floor — how much the music drives movement, not how beautiful or emotional it is. A Pugliese tanda can be deeply moving (high emotion) while also being physically intense (high energy). A Di Sarli vocal tanda can be heartbreaking (high emotion) but calm in the body (moderate energy).

| Score | Feel | Think of... |
|-------|------|-------------|
| 1–3 | Subdued, gentle, walking | Carabelli, early Canaro, Fresedo |
| 4–5 | Moderate, smooth, warm | Di Sarli, Demare, D'Agostino-Vargas |
| 6–7 | Building, rhythmic, engaged | Troilo, Laurenz, Tanturi-Castillo, De Angelis |
| 8–9 | Driving, intense, peak | D'Arienzo, Biagi, Pugliese |
| 10 | Maximum floor energy | D'Arienzo milonga at midnight |

### How tanda energy is calculated

The final energy of a tanda combines three factors:

```
Base energy (from orchestra profile in the database)
  + Type modifier:
      Tango:    +0    (baseline)
      Vals:     −1    (waltzes breathe lighter)
      Milonga:  +1.5  (milongas are the energy peak)
  + User adjustment: ±1 (your override)
  = Final energy (clamped to 1–10)
```

So a Troilo instrumental tango has energy 7, but a Troilo vals drops to 6 (breathing room), and a Troilo milonga jumps to 8.5 (floor on fire).

### Why singer-specific?

The same orchestra changes character depending on who sings. These are real differences that experienced DJs feel instinctively, and that TangoFlow makes visible:

| Orchestra | Singer A | Energy | Singer B | Energy | Δ |
|-----------|----------|--------|----------|--------|---|
| D'Arienzo | Echagüe | 9 | Mauré | 7 | −2 |
| Biagi | Ortiz | 8 | Amor | 6 | −2 |
| Tanturi | Castillo | 7 | Campos | 5 | −2 |
| Pugliese | Chanel | 8 | Morán | 7 | −1 |

These aren't abstract numbers — they're the difference between a peak tanda and a cool-down tanda. Getting this right is what separates a good milonga from a great one.

### The energy curve

When you place tandas on the timeline, TangoFlow draws a smooth curve through their energy values. A well-shaped evening looks something like:

```
     ╭──╮         ╭──╮
    ╱    ╲       ╱    ╲
   ╱      ╲     ╱      ╲
  ╱        ╲   ╱        ╲
 ╱          ╰─╯          ╲
╱                          ╲
warm-up → build → peak → cool → peak → wind-down
```

The app doesn't force you into this shape. It shows you what shape you're making, and lets you decide if that's what you want.

### What triggers warnings

The smart warnings system watches for common pitfalls:

- Same orchestra back-to-back — dancers notice, it breaks variety
- Three or more consecutive tangos — the floor needs a vals or milonga to breathe
- No vals in the first 8 tandas — variety too late
- Energy jump greater than 4 points — feels jarring to the dancers' bodies
- Pugliese or Biagi in the first 3 slots — too complex before the floor is warm
- Any orchestra appearing more than 3 times — spread the love
- Tango percentage outside 50–75% — the balance is off

These are guidelines, not rules. Every warning can be dismissed. Your milonga, your call.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Framer Motion |
| UI Components | Radix UI, shadcn/ui |
| Drag & Drop | @dnd-kit |
| Charts | Recharts |
| Routing | Wouter |
| Forms | React Hook Form + Zod |
| Backend | Express.js |
| Database | PostgreSQL + Drizzle ORM |
| Auth / Config | Firebase |
| Orchestra Data | Google Sheets (public CSV) |

## Getting Started

### Prerequisites

- Node.js v18+
- npm
- PostgreSQL (optional — the app works with localStorage without it)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/tango-orchestrator.git
cd tango-orchestrator

# Install dependencies
npm install
```

### Environment Setup

```bash
# Copy the example env file
cp .env.example .env
```

Then open `.env` and fill in your Firebase credentials from the **Firebase Console** → Project Settings → Your apps.

### Database (optional)

If you want server-side persistence with PostgreSQL:

```bash
npm run db:push
```

Otherwise the app will use browser localStorage automatically.

### Run in Development

```bash
npm run dev
```

Opens at `http://localhost:5000` with hot reload.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── client/                  # React frontend
│   └── src/
│       ├── pages/           # Home, SetPlanner, OrchestraReference
│       ├── components/      # EnergyCurve, TandaCard, WarningsBar, SetStats…
│       ├── lib/             # Storage, orchestra service, warnings, translations
│       └── hooks/           # Custom React hooks
├── server/                  # Express backend
│   ├── routes.ts            # API endpoints
│   ├── storage.ts           # DB operations
│   └── db.ts               # Drizzle ORM setup
├── shared/
│   └── schema.ts            # Shared TypeScript types and Zod schemas
├── .env.example             # Environment variable template
└── README.md
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run check` | TypeScript type check |
| `npm run db:push` | Push schema to database |

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

The easiest way to contribute is through the [Orchestra Database Google Sheet](https://docs.google.com/spreadsheets/d/1yXR2Xayajkt8vuXE0zswcCzz4v95Jk2x2Xf16b1eLMM/edit?gid=1820784714#gid=1820784714) — no code required.

## License

MIT
