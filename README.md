# Simple TODO App (React + TypeScript + Vite)

A minimal TODO application with add, toggle complete, edit, delete, filter (All/Active/Completed), and clear completed. Data is persisted in localStorage.

## Getting started

- Install dependencies (if you haven't already):
  - pnpm install
- Start the dev server:
  - pnpm run dev
- Open the app at the URL printed by the dev server (usually http://localhost:5173)

## Features
- Add todos via the input field and Add button
- Toggle completion with the checkbox
- Edit a todo by clicking Edit or double-clicking the title
- Delete a todo
- Filter: All / Active / Completed
- Clear completed todos
- Persists to localStorage

## Project structure
- src/App.tsx: Main TODO app logic and UI
- src/App.css: Styles scoped to the app
- src/main.tsx: App bootstrap
- index.html: App entry

## Notes
- This is intentionally simple, with no routing and no backend.
- IDs are generated client-side for demo purposes only.
