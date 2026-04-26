# Hermes Project X Template

Reusable Next.js landing page template for `hopper-hermes projectx <url>`.

This repo contains only the landing-page template. Hermes Core owns scraping, profile rendering, contrast validation, deploy orchestration, env generation, and runtime deployment.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Rendering Flow

Hermes Core copies this template into the generated Project X source repo, renders `src/lib/config.ts` and `src/app/globals.css` from the scraped client profile, validates color contrast, then builds and deploys the rendered site.

Core entrypoint:

```bash
bash scripts/hopper-hermes projectx <url>
```

## Contrast Contract

Generated brand palettes must pass the Project X landing contrast gate before deployment. The gate lives in Hermes Core at `scripts/projectx/landing-contrast.js` and currently enforces WCAG AA normal text contrast for core foreground/background pairs.
