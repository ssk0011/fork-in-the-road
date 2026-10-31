# Fork In the Road

Client-only React app. See `README.md` for product decisions and `DESIGN.md` for visual ones.

## Commands

- `npm run dev`: local server
- `npm test`: engine, data, storage and reducer tests (Vitest)
- `npm run test:e2e`: browser flow, axe checks and screenshots in `test-results/shots` (Playwright)
- `npm run lint`, `npm run typecheck`, `npm run format:check`
- `npm run build`: type-check and production build

## Conventions

- `src/engine` is pure: no React, no browser APIs, no direct imports of the dish data. Randomness comes from `session.seed`.
- `src/ui/appReducer.ts` owns session flow. Time and random seeds arrive through actions, so the reducer stays pure.
- `src/storage` is the only code that touches `localStorage`. Every read is validated.
- External links are built only in `src/ui/links.ts`. No analytics, third-party scripts or network calls.
- Plain CSS with variables in `src/ui/styles.css`. No UI library.
- Tool versions are pinned for Node 18.17, so check Node support before upgrading Vite, Vitest, ESLint or typescript-eslint.
- Reasons are a fixed list. Never add free-text input.
