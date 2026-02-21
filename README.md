# TangoFlow

A visual milonga planning tool for tango DJs — map the emotional arc of your sets and discover how your music choices flow from one tanda to the next.

Whether you're building your first milonga or you've been spinning for years, TangoFlow gives you a clear, honest picture of your set: its energy shape, its balance, and the invisible threads that connect each tanda to the next.

---

## What It Does

### For DJs finding their voice
Visualize the energy curve of your entire evening at a glance. See whether your set breathes — rises, falls, builds — or whether it stays flat. Get gentle nudges when something feels off: two tandas from the same orchestra back to back, three tangos in a row, a first hour with no vals.

### For experienced DJs
Go deeper. Over time, TangoFlow reveals your instincts: the orchestras you return to, the energy shapes you naturally gravitate toward, the way you move through styles and moods. Not as a judgment — as a mirror.

---

## Features

- **Drag-and-drop set builder** — arrange tandas on a timeline, reorder freely
- **Live energy curve** — smooth SVG visualization of your set's emotional arc
- **Intelligent warnings** — back-to-back orchestras, type imbalances, energy jumps
- **Orchestra reference database** — detailed profiles with energy, danceability, complexity, mood, and DJ notes
- **Tanda library** — build and manage your personal collection of tandas
- **Set statistics** — type breakdown, estimated duration, unique orchestras, average energy
- **Export options** — JSON backup, plain text, and print-ready PDF view
- **Multilingual** — English, French, Spanish
- **Dark mode** — tango-inspired gold and bronze color scheme

---

## Tech Stack

| Layer | Technology |
|---|---|
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

---

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

Then open `.env` and fill in your Firebase credentials from the [Firebase Console](https://console.firebase.google.com) → Project Settings → Your apps.

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

---

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

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run check` | TypeScript type check |
| `npm run db:push` | Push schema to database |

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## License

MIT
