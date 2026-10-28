## 1. Implementation

- [x] 1.1 `index.html`: inline preloader styles and markup, Telegram script moved after it — verify: `npm run build`, preloader visible on a throttled reload in dev
- [x] 1.2 `App.tsx`: no «Загрузка…»; hide preloader after load + fonts + 0.4 s with fade; also on error — verify in dev: home appears in Montserrat after fade

## 2. Docs & verification

- [x] 2.1 Update `.ai/guidelines/modules/telegram.md` and CLAUDE.md
- [x] 2.2 Run `npm run lint && npm run typecheck && npm run build` in `web/` — verify: no errors
- [x] 2.3 `openspec validate app-preloader --strict` passes
