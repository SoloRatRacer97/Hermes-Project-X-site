# Project X Locked Landing Template

Default locked Next.js landing template for `hopper-hermes projectx <url>`.

This repository backs the Project X template URL:

```bash
https://github.com/SoloRatRacer97/Hermes-Project-X-template.git
```

Hermes Core clones this repo for each Project X run, copies it into `~/workspace-hermes-projectx/landing-site`, hydrates `app/project-x-config.ts` from the scraped business profile, builds it, and pushes the rendered landing site to the Project X site remote.

## What is included

- Sticky navigation
- Hero section with background image and front-loaded contact form
- About Us section
- Why Choose This section
- Industry-agnostic blue-collar image carousel
- Contact section
- Footer
- Local image assets in `public/images`
- Locked instance configuration in `app/project-x-config.ts`
- Responsive CSS in `app/globals.css`

## Run locally

```bash
npm install
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## Build for production

```bash
npm run typecheck
npm run build
npm run start
```

## Where to edit

- Controlled Project X instance settings: `app/project-x-config.ts`
- Main page: `app/page.tsx`
- Global styles: `app/globals.css`
- SEO metadata: `app/layout.tsx`
- Images: `public/images`

## Project X Template Contract

Project X instances should keep the same layout, section order, component structure, and form fields. Per-business changes are limited to:

- Brand labels in `projectXConfig.brand`
- Hero, contact, and carousel images in `projectXConfig.images`
- Service chips and form options in `projectXConfig.industries`
- Zapier webhook and form source in `projectXConfig.integration`

The blue Project X visual system is fixed because the current imagery and overlays are designed around it. Do not fork the page into unrelated layouts per business. The goal is a consistent professional Hopper-Hermes demo surface with client-specific business name, service, image, and form-routing inputs.

## Hydrating From A Business Site

From `~/workspace-hermes-core`, run:

```bash
node scripts/projectx/hydrate-local-landing.js https://example-service-business.com/ --landing-dir ~/workspace-hermes-projectx-template
```

Preview without writing:

```bash
node scripts/projectx/hydrate-local-landing.js https://example-service-business.com/ --dry-run --json
```

The hydrator updates this file only:

```bash
app/project-x-config.ts
```

The form posts the existing Project X Zapier payload shape and requires visible SMS consent before submission. During normal Project X runs, Hermes Core binds `formWebhookUrl` and `formSource` from the shared Project X integration configuration.

## Connecting the form

If `projectXConfig.integration.formWebhookUrl` is blank, the form captures data client-side and logs it with:

```ts
console.info(`${brand.name} landing page lead`, formState);
```

Replace that section in `handleSubmit()` with one of these:

- A Next.js API route
- A Next.js Server Action
- A Zapier webhook
- Your CRM endpoint
- Your Hopper-Hermes intake endpoint

## Image assets

The generated images are already included locally:

- `hero-blue-collar-team.png`
- `hvac-plumbing.png`
- `cleaning-pool.png`
- `construction-handyman.png`
- `service-handshake.png`
