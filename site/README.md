# Peyton Pulliam · Portfolio

The portfolio is built with the existing Astro and Tailwind setup. The published pages are static HTML and CSS.

From the repository root:

```sh
npm --prefix site ci
npm --prefix site run dev -- --background
npm --prefix site run build
node --test site/test/portfolio.test.mjs
```

Use a Node.js version that meets the engine requirement in `site/package.json`.

- Profile copy, projects, and field notes are in `src/data/portfolio.ts`.
- Reusable document components are in `src/components/`. Routes are in `src/pages/`.
- Add your résumé as `public/resume.pdf` to switch navigation to the PDF. Until then, the link opens a printable profile.
- Project write-ups are explicitly marked as drafts until a prototype or its measurements can be shared.

The root `vercel.json` builds this subdirectory when Vercel's Root Directory is the repository root. If the Vercel project already uses `site` as its Root Directory, Astro's standard build and `dist/` output still apply. No custom-domain changes are required.
