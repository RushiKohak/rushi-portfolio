# Portfolio — build plan

**Phase 1 deliverable.** Plan, file tree, design tokens, content model. Nothing is built yet.

## The bet

Recruiters skim. The page has to answer three questions in under 30 seconds: *what does he
build, is it real work, can I contact him*. So: one screen of hero, then the three case
studies get most of the visual weight, everything else stays quiet underneath. No sections
that only exist because portfolios are supposed to have them.

## Stack decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Framework | Astro 5, `output: 'static'` | Zero JS by default; only the scroll-reveal and the contact form ship script |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` | v4 config lives in CSS, so design tokens are one file, not two |
| Type | TypeScript for content schemas + small helpers | Catches a bad frontmatter field at build time |
| Fonts | Fontsource, self-hosted: `instrument-serif`, `dm-sans`, `jetbrains-mono` | No third-party font requests; latin subset only |
| Images | `astro:assets` `<Image>` from `src/assets/photos/` | AVIF/WebP + width descriptors + lazy below the fold |
| Content | Content collections: `projects` (md), `blog` (md), `site` (json) | All copy editable without touching layout |
| Contact | Web3Forms, plain `fetch` POST | No backend, no build-time secret; access key is a public form key |
| Deploy | Vercel static | `astro build` → `dist/`, no adapter needed |

One deviation from your brief worth flagging: Astro's image pipeline needs source images
inside `src/`, so the photos live in `src/assets/photos/` and are emitted optimized. Your
`/public/photos/*.jpg` paths are still the URLs the HTML resolves to, so nothing about the
design changes. I'll copy your files into place at the start of Phase 2 and keep your
filenames.

## File tree

```
.
├─ astro.config.mjs
├─ package.json
├─ tsconfig.json
├─ README.md
├─ PLAN.md
├─ public/
│  ├─ favicon.svg
│  ├─ og-default.jpg
│  ├─ robots.txt
│  ├─ resume-sde.pdf
│  └─ resume-aiml.pdf
├─ src/
│  ├─ assets/photos/
│  │  ├─ hero.jpg
│  │  ├─ bottom-1.jpg
│  │  └─ bottom-2.jpg
│  ├─ styles/global.css          ← design tokens + base layer
│  ├─ content.config.ts          ← zod schemas for all collections
│  ├─ content/
│  │  ├─ site/site.json          ← name, links, skills, timeline, now, gallery order
│  │  ├─ projects/
│  │  │  ├─ respd.md
│  │  │  ├─ walletledger.md
│  │  │  ├─ callpilot.md
│  │  │  ├─ deeppacketinspection.md
│  │  │  ├─ your-own-ai.md
│  │  │  └─ investiq.md
│  │  └─ blog/
│  │     ├─ placeholder-one.md
│  │     └─ placeholder-two.md
│  ├─ layouts/BaseLayout.astro   ← head, OG, skip link, nav, footer
│  ├─ components/
│  │  ├─ Nav.astro
│  │  ├─ Footer.astro
│  │  ├─ Hero.astro
│  │  ├─ SectionHeading.astro
│  │  ├─ FeaturedProject.astro
│  │  ├─ ProjectCard.astro
│  │  ├─ About.astro
│  │  ├─ Skills.astro
│  │  ├─ Timeline.astro
│  │  ├─ Now.astro
│  │  ├─ Gallery.astro
│  │  ├─ Writing.astro
│  │  ├─ ContactForm.astro
│  │  └─ Reveal.astro            ← the only motion primitive
│  ├─ lib/content.ts             ← sort/filter helpers
│  └─ pages/
│     ├─ index.astro
│     ├─ work/[slug].astro
│     ├─ blog/index.astro
│     ├─ blog/[slug].astro
│     └─ 404.astro
└─ dist/                         ← build output (gitignored)
```

## Design tokens

```css
@theme {
  /* surfaces */
  --color-bg:      #181715;
  --color-surface: #201E1B;
  --color-border:  #2C2925;
  /* text */
  --color-text:    #ECE7DF;
  --color-muted:   #A39B8F;
  /* the one accent */
  --color-accent:  #D9B382;

  --font-serif: "Instrument Serif", Georgia, serif;
  --font-sans:  "DM Sans", system-ui, sans-serif;
  --font-mono:  "JetBrains Mono", ui-monospace, monospace;

  --text-hero: clamp(2.75rem, 7vw, 5rem);   /* h1 */
  --text-h2:   clamp(1.75rem, 3.5vw, 2.5rem);
  --text-h3:   1.25rem;
  --text-body: 1.0625rem;
  --text-meta: 0.75rem;                     /* mono labels, tracked +0.08em */

  --leading-body: 1.7;
  --measure: 62ch;                          /* reading width */
  --container: 68rem;
  --gutter: clamp(1.25rem, 5vw, 2.5rem);
  --section-y: clamp(4.5rem, 10vw, 8rem);
}
```

Contrast check for the two pairs that matter: `#ECE7DF` on `#181715` ≈ 13.6:1,
`#A39B8F` on `#181715` ≈ 6.3:1, `#D9B382` on `#181715` ≈ 8.4:1. All pass AA at body size.
Muted text is never used below 14px, and mono labels at 12px are set in `--color-muted`
only against `--color-bg`, which still clears 4.5:1.

Motion: one token set — `--ease: cubic-bezier(.2,.6,.2,1)`, `--dur: 500ms`, translateY(12px)
→ 0 plus opacity 0 → 1, triggered once by IntersectionObserver. Everything inside
`@media (prefers-reduced-motion: reduce)` is `animation: none; transition: none; opacity: 1`.

## Content model (what you edit)

`projects` markdown frontmatter:

```yaml
title, summary, domain: "Web / SDE" | "AI / ML", year,
featured: true|false, order: 1,
role, timeline, stack: string[],
links: [{ label, href, note? }]
```

Body sections are plain `## Problem`, `## Approach`, `## Architecture`, `## Result` —
case-study template renders the headings, so the shape is consistent without a rigid schema.

`site.json` holds: name, title line, hero copy, about paragraphs, roles sought, skills
({confident, learning}), timeline entries, now ({building, learning, updated}), links,
and `gallery` order so photos are rearranged by editing a list of two keys.

Blog frontmatter: `title, description, date, draft, tags`.

## Phases

1. **Plan** ← you are here
2. Shell: Astro init, tokens, fonts, BaseLayout, nav, hero, footer, images in place
3. Projects: index sections + `/work/[slug]` case studies with real content
4. About, skills, timeline, now, gallery
5. Blog index + post pages, contact form (Web3Forms)
6. Polish: a11y pass, reduced-motion audit, 375/768/1280, OG/sitemap/favicon, README, Vercel notes

## What I need from you (placeholders are marked `[ADD]` until then)

Benchmark numbers for RESPD, result/notes for walletledger, descriptions + stacks for the
three cards, your title line, roles you want, about draft, skills lists, achievements,
LinkedIn URL, email, coding profiles, and the three photos + two PDFs.

Nothing blocks Phase 2 — I'll ship it with clearly marked placeholders you can swap later.
