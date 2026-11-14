# vasikarlas.ai

Portfolio site for Satish Vasikarla. Next.js 16 (App Router), React 19, plain CSS.

## Run

```bash
npm install
npm run dev
```

`npm run build` prerenders every page; `npm run lint` must stay clean.

## Adding or changing a project

Everything shown on the site comes from `src/data/projects.js`. Add an object there and it
appears on `/work`, gets its own `/work/<id>` page, and shows up in search (⌘K) and the sitemap.

- `tier` — `flagship`, `product`, `research` or `heritage`; decides the group on `/work`.
- `status` — `live` (public URL), `private` (invite-only or private deployment), `source` (repo only).
- `shipped` — `YYYY-MM` of the last production deploy.
- `screenshot` — path under `public/screenshots/`. Without one, the card shows the `highlights` instead.
- `caseStudy` — optional long-form sections for the project page.
- Architecture diagrams live in `src/data/architecture.js`, skill proofs in `src/data/skills.js`.

Only add a number if the product itself can show where it comes from.

## Environment variables (all optional)

| Variable | Purpose |
|---|---|
| `VERCEL_API_TOKEN`, `VERCEL_TEAM_ID` | Refresh each project's `shipped` date from Vercel hourly. Never adds projects. |
| `ANTHROPIC_API_KEY`, `GROQ_API_KEY` | Power the "Try it live" demos on NLSQL Pro, CorePragya and ConceptForge. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata and the sitemap. |

## Layout

- `src/app` — routes: `/`, `/work`, `/work/[slug]`, `/about` (`/projects` redirects to `/work`).
- `src/components` — UI. Pages are server components; only interactive pieces are client components.
- `src/app/globals.css` — tokens and base styles; `src/app/portfolio.css` — nav, cards, work and case-study layout.
- `scripts/` — Playwright scripts that capture app screenshots and build the recorded tours in `public/demos`.
