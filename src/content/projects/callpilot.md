---
title: CallPilot
summary: A live assistant for cold calls — it follows the conversation through eight stages and tells you the next useful thing to say.
domain: AI / ML
year: "2026"
featured: true
order: 3
role: Solo — frontend, API, prompt and workflow design
timeframe: "2026"
stack: ["React", "Vite", "Node / Express", "Supabase", "Ollama Cloud"]
links:
  - label: Live demo
    href: https://call-pilot-rouge.vercel.app
    note: The free Render backend sleeps when idle, so the first load can take about 30 seconds to wake.
  - label: Repository
    href: https://github.com/RushiKohak/CallPilot
---

## Problem

Cold calls go badly for a boring reason: you're thinking about three things at once — what they just
said, what you're supposed to ask next, and how not to sound like a script. Most people freeze and
default to reading the script badly.

I wanted a second pair of eyes in the room. Something that knows which stage the call is in, listens to
what's being said, and offers one line you could actually say out loud.

## Approach

**A stage machine, not a chatbot.** The call is modelled as eight stages, each with its own goal and
its own common failure. The app knows where you are and what a good next move looks like, which is a
much narrower and more useful question than "reply to this transcript". `[ADD: the eight stage names,
if you want them public.]`

**Coaching in the margin.** Suggestions appear beside the transcript, never in place of it. The point
is to keep the human talking, not to automate the call.

**Transcript as the single source of truth.** Every suggestion is derived from the stored conversation,
so a reload doesn't lose the thread of the call.

## Architecture

```
React + Vite  ──►  Express API  ──►  Supabase (Postgres + auth)
     │                  │
     └── transcript ────┴──►  Ollama Cloud (coaching)
```

The frontend only ever talks to my own API. The model key stays server-side, and Supabase row-level
security keeps one user's calls out of another user's account.

## Result

It's deployed and it works: `[ADD: what a session actually looks like, and one thing a tester said.]`

Two things I'd change. The free backend's cold start is a real cost for a demo — the loading state has
to do the work of keeping someone on the page for thirty seconds. And the stage machine wants to be
configurable, because every sales team argues about the stages. `[ADD: anything else.]`
