# Pulse — Personalized Content Dashboard

A responsive content discovery dashboard built with Next.js App Router, TypeScript, Tailwind CSS, Redux Toolkit, and RTK Query. It combines news and movie discovery.

## Features

- Responsive dashboard, navigation, search, trending, favorites, and preferences screens
- Personalized news across selected categories and movie recommendations via RTK Query
- Debounced cross-source search and incremental feed pagination
- Redux Toolkit state for preferences, theme, favorites, and drag-reordered feed layout
- Local persistence for preferences, theme, favorites, and card order
- Server-side Next.js API routes so provider keys are not exposed to the browser
- Light and dark themes
- Content cards with save actions and external links
- Keyboard- and pointer-accessible drag-and-drop ordering
- Unit tests for preference and favorite reducers
- Playwright coverage for search, pagination, preferences, reorder, and persistence

## Requirements

- Node.js 20.9 or newer
- npm

## Setup

```bash
npm install
cp .env.example .env.local
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env.local
```

Add API keys to `.env.local`:

```env
NEWS_API_KEY=your_news_api_key
TMDB_API_KEY=your_tmdb_api_key
```

Do not commit `.env.local`. The `.env.example` file should contain placeholders only.

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000.

## API notes

- News route: `/api/news?category=technology,business` (comma-separated categories)
- Movies route: `/api/movies`
- The NewsAPI developer plan may restrict production deployment and headlines use. Check the provider's current terms before using it in a public demo.
- TMDB requires an API key. Follow TMDB attribution and branding requirements.

## Tests

```bash
npm test
npm run test:e2e
npm run lint
npm run build
```

Playwright may require browser installation on a fresh machine:

```bash
npx playwright install chromium
```

## Next improvements

- Add more API-state integration tests
- Add a dedicated trending endpoint and better empty/error UI
- Verify keyboard accessibility and responsive layouts before submission
