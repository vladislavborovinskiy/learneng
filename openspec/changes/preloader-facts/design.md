## Context

The preloader lives in `index.html` with inline styles so it paints before the bundle. `App.tsx`
fades it out after progress, fonts and a minimum delay.

## Decisions

- **Facts in the HTML, not the bundle.** A Vite plugin (`transformIndexHtml`) replaces a
  placeholder in the inline script with `[[en, ru], …]` from `content/facts.json`. Importing the
  facts from React would show them only after the bundle loads. ~150 facts add ~25 KB before gzip.
- **Shuffle bag.** `localStorage['preloader-facts'] = { size, order, at }`; reshuffled when the bag
  is used up or the fact count changes. Without storage a random fact is shown each time.
- **Gradient.** One `linear-gradient` of the three accents at ~30 % alpha over `#0b0d12`,
  `background-size` 300 %, `background-position` animated 10 s ease-in-out alternate — no blur
  layers, cheap on phones.
- **Font.** In the production build the CSS bundle with Montserrat `@font-face` is a blocking
  `<link>` in `<head>`, so the inline script can `document.fonts.load('300 1em Montserrat')` and
  fade the text in when ready; no duplicate font declaration.
- **Minimum 2.5 s with tap to skip.** Reading 10–12 words takes ~2–3 s; a tap after loading closes
  the preloader immediately so a returning learner is not forced to wait.

## Risks

- Every launch is at least 2.5 s unless tapped — accepted for now, easy to tune.
