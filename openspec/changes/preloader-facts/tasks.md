## 1. Content

- [x] 1.1 Collect, verify and merge facts into `content/facts.json` — verify: `node scripts/check-content.mjs`
- [x] 1.2 `check-content.mjs`: facts length (≤ 12 EN / ≤ 14 RU words), no duplicates

## 2. Implementation

- [x] 2.1 `vite.config.ts`: plugin inlining facts into `index.html`
- [x] 2.2 `index.html`: gradient background, fact markup, shuffle-bag script, font fade-in, reduced motion
- [x] 2.3 `App.tsx`: minimum 2.5 s, tap closes early after load

## 3. Docs & verification

- [x] 3.1 Update `telegram.md`, `content.md`, CLAUDE.md
- [x] 3.2 `npm run lint && npm run typecheck && npm run build` in `web/` — verify: no errors, facts in `dist/index.html`
- [x] 3.3 `openspec validate preloader-facts --strict` passes
