# TangoFlow - Milonga Set Planning Tool

## Overview
TangoFlow is a visual milonga set planning tool for Argentine tango DJs. It helps DJs plan 3.5-hour tango dance evenings by organizing "tandas" (sets of 3-4 songs from the same orchestra) into a timeline, visualizing energy flow, providing smart warnings based on tango DJ best practices, and offering an orchestra reference database.

## Current State
Fully functional static SPA with dark tango theme, 3 main pages (Home, Set Planner, Orchestra Reference), localStorage persistence, drag-and-drop timeline, energy curve visualization, smart warnings system, JSON import/export, and deployable as static files (GitHub Pages compatible).

## Architecture

### Stack
- **Frontend**: React + TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Storage**: Browser localStorage (no backend required)
- **Build**: Static files via Vite (deployable to GitHub Pages, Netlify, etc.)
- **Key Libraries**: @dnd-kit (drag-and-drop), wouter (routing)

### Important: This is a fully static client-side app
- NO backend server, NO database, NO API calls
- All data persisted in browser localStorage
- Orchestra database embedded as JSON constants
- Build output is pure HTML/CSS/JS

### Project Structure
```
shared/schema.ts          - Plain TypeScript types (MilongaSet, Tanda, Orchestra interfaces)
client/src/lib/storage.ts  - localStorage CRUD + import/export + seed data
client/src/App.tsx         - Root component with routing and navbar
client/src/pages/Home.tsx  - Set list with create, import, export backup
client/src/pages/SetPlanner.tsx - Main 3-column planner (library | timeline | stats)
client/src/pages/OrchestraReference.tsx - Browsable orchestra database
client/src/components/     - Reusable UI components
client/src/lib/orchestraData.ts - 20+ orchestra profiles with detailed metadata
client/src/lib/warnings.ts - 10+ validation rules for DJ best practices
client/src/lib/tangoColors.ts - Color system for types, styles, and energy
server/index.ts            - Dev server entry (starts Vite dev server)
build.js                   - Static build script
```

### localStorage Keys
- `tangoflow_sets` - Array of MilongaSet objects
- `tangoflow_tandas` - Array of Tanda objects

### Design Tokens
- Dark theme with warm gold (#c9a84c) primary
- Font: Playfair Display (serif headings) + DM Sans (body)
- Type colors: Red (tango), Blue (vals), Green (milonga)
- Energy gradient: Green (low) → Yellow → Orange → Red (high)

### Key Features
- Drag-and-drop timeline editing with @dnd-kit
- Energy curve visualization (SVG with bezier smoothing)
- TTVTTM pattern guidance (Tango-Tango-Vals-Tango-Tango-Milonga)
- Smart warnings: back-to-back orchestras, energy jumps, type distribution, placement rules
- Export individual sets to JSON/text for sharing
- Import/Export full backup for data portability
- Orchestra reference with filtering by style, energy, search
- Auto-seeds sample data on first visit

## Running / Building
- Dev: `npm run dev` (runs Vite dev server via server/index.ts)
- Build: `node build.js` (outputs static files to dist/public/)
- The build output can be deployed to any static hosting

## Recent Changes (Feb 2026)
- Architecture change: Converted from Express+PostgreSQL to fully static SPA
- Removed all backend dependencies (database, API routes, server storage)
- Added localStorage-based persistence
- Added JSON import/export for backup/restore
- Build now produces static files deployable anywhere
