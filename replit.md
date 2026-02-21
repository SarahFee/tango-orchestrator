# TangoFlow - Milonga Set Planning Tool

## Overview
TangoFlow is a visual milonga set planning tool for Argentine tango DJs. It helps DJs plan 3.5-hour tango dance evenings by organizing "tandas" (sets of 3-4 songs from the same orchestra) into a timeline, visualizing energy flow, providing smart warnings based on tango DJ best practices, and offering an orchestra reference database.

## Current State
Fully functional MVP with dark tango theme, 3 main pages (Home, Set Planner, Orchestra Reference), PostgreSQL persistence, drag-and-drop timeline, energy curve visualization, smart warnings system, and export functionality.

## Architecture

### Stack
- **Frontend**: React + TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Key Libraries**: @dnd-kit (drag-and-drop), @tanstack/react-query, wouter (routing)

### Project Structure
```
shared/schema.ts          - Drizzle schema + TypeScript types (MilongaSet, Tanda, Orchestra interfaces)
server/storage.ts         - Database storage layer (IStorage interface)
server/routes.ts          - REST API endpoints
server/seed.ts            - Sample data seeding
server/db.ts              - Database connection
client/src/App.tsx         - Root component with routing and navbar
client/src/pages/Home.tsx  - Set list with create new set
client/src/pages/SetPlanner.tsx - Main 3-column planner (library | timeline | stats)
client/src/pages/OrchestraReference.tsx - Browsable orchestra database
client/src/components/     - Reusable UI components
client/src/lib/orchestraData.ts - 20+ orchestra profiles with detailed metadata
client/src/lib/warnings.ts - 10+ validation rules for DJ best practices
client/src/lib/tangoColors.ts - Color system for types, styles, and energy
```

### API Routes
- `GET /api/sets` - List all sets
- `POST /api/sets` - Create a set
- `GET /api/sets/:id` - Get a set
- `PATCH /api/sets/:id` - Update a set
- `DELETE /api/sets/:id` - Delete a set
- `GET /api/sets/:id/tandas` - Get tandas for a set
- `POST /api/sets/:id/tandas` - Create a tanda in a set
- `PATCH /api/tandas/:id` - Update a tanda
- `DELETE /api/tandas/:id` - Delete a tanda

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
- Export to text and JSON
- Orchestra reference with filtering by style, energy, search

## Recent Changes (Feb 2026)
- Initial build: complete schema, backend, frontend, seed data
