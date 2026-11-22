# rushi-kohak

Personal portfolio for Rushi Kohak — final-year IT student, backend and systems work.
Built with Astro (static output), Tailwind CSS v4, and a small amount of vanilla JS.
No UI library, no client framework, no runtime backend.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the built output
npm run check    # astro check — types and .astro diagnostics
```

## Where the content lives

Nothing on this site needs a layout file edited to change words. Everything is either
JSON or Markdown.

| What | File |
| --- | --- |
| Name, hero, links, resumes, about, skills, timeline, now, writing teaser, contact, gallery captions, SEO description | `src/content/site/site.json` |
| Project cards and case studies | `src/content/projects/*.md` |
| Blog posts | `src/content/blog/*.md` |
| Photos | `src/assets/photos/` |
| Resume PDFs, favicon, OG image, robots | `public/` |
| Colours, type scale, spacing | `src/styles/global.css` (`@theme` block at the top) |

The shape of `site.json` is enforced by `src/content.config.ts`. If a field is missing or
the wrong type, the build fails with the exact path — it will not ship a half-rendered page.

### Adding a project

Create `src/content/projects/my-project.md`:

```yaml
---
title: My Project
summary: One sentence for the card.
domain: Web / SDE          # or AI / ML
year: "2026"               # quote it — an unquoted year parses as a number and fails
featured: false            # featured items get a full-width block on the home page
order: 7                   # lower sorts first
role: Backend
timeframe: "3 weeks"
stack: [Java, PostgreSQL]
links:
  - label: GitHub
    href: https://github.com/...
---
Markdown case study body. `##` headings get a rule above them.
```

### Adding a post

Create `src/content/blog/my-post.md` with `title`, `description`, `date` (`2026-11-04`),
and optional `tags`. Add `draft: true` to keep it out of every listing and the sitemap
while you finish it.

### Swapping the photos

Replace the three files in `src/assets/photos/` and keep the filenames:

- `hero.jpg` — portrait-shaped, sits beside your name.
- `bottom-1.jpg`, `bottom-2.jpg` — the two "life outside code" frames.

Astro re-encodes each one to WebP at several widths on build, so drop in the original
camera/phone files rather than pre-shrinking them. Update the `alt` text and captions in
`site.json` under `gallery.photos` — the `file` value must stay `bottom-1` or `bottom-2`.

### Resumes

`public/resume-sde.pdf` and `public/resume-aiml.pdf` are the real resume exports. Replace them
(keeping those exact names) if you update either one. The nav dropdown and hero button read
their labels and page counts from `site.json` → `resumes`.

## Before you publish

- [ ] Real photos in `src/assets/photos/`
- [ ] Everything marked `[ADD: …]` in `site.json` and the shorter project pages
- [ ] Web3Forms key (below)
- [ ] Final domain (below)

## Contact form

The form posts to [Web3Forms](https://web3forms.com), which relays it to your inbox — no
server of your own and no build-time secret exposed anywhere but your own form.

1. Get a free access key from web3forms.com, verified against the email you want messages sent to.
2. Paste it into `src/content/site/site.json` → `contact.accessKey`.
3. Rebuild.

Until a real key is present the submit button renders disabled and a note explains why, so
a visitor can never type a message into a form that goes nowhere.

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel: **Add New → Project**, import the repo. It detects Astro on its own.
3. Framework preset: **Astro**. Build command `npm run build`, output directory `dist`.
   No environment variables are needed.
4. Deploy. Every push to the default branch redeploys; pull requests get preview URLs.

### Changing the domain

Two places, both hardcoded on purpose so the sitemap and share cards stay absolute:

- `astro.config.mjs` → `site`
- `public/robots.txt` → the `Sitemap:` line

Set them to the final URL (custom domain or `*.vercel.app`), rebuild, redeploy.

## Design notes

- One accent colour (`#D9B382`) and it is used sparingly: markers, hovers, focus rings.
- All motion is a single fade-up on scroll, defined once in `global.css` and disabled under
  `prefers-reduced-motion: reduce`.
- Tokens are in the `@theme` block of `src/styles/global.css`. Change a colour or the type
  scale there, not in components.
- Fonts are self-hosted via Fontsource — no requests to Google Fonts, no layout shift.
