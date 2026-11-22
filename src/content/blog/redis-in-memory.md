---
title: "What rebuilding Redis taught me about memory"
description: "I thought I understood pointers until I had to free a few million keys while a client was still reading them."
date: 2026-11-04
tags: ["C++", "Systems"]
---

A Redis-compatible server sounds like a weekend project until you write the second line. The first line is a TCP socket. The second is a decision about who owns the bytes you just read, and that decision follows you through every file you touch afterwards.

I didn't pick this project because I wanted to write a database. I picked it because I wanted to stop guessing what "fast" meant. Tutorials hand you a hash map and a stopwatch and call it done. What they leave out is everything that happens after the demo stops: expiry, fragmentation, partial writes, and the fact that a client can vanish halfway through a reply.

## The part tutorials skip

Most examples keep keys forever. Real caches don't. Adding a TTL means running a clock next to your data, and now you have two things mutating the same structures from different places. My first version did the obvious thing — a background thread sweeping the map — and it worked, right up until the sweep freed a value that a connection thread was midway through serializing.

The fix wasn't clever. It was accepting that a key has a lifetime beyond its entry in the map: someone may still hold a reference to its bytes while the key itself is already gone. Once I stopped thinking of deletion as "remove from the map" and started thinking of it as "the map forgets, the reader finishes", the crashes went away.

## Where it actually broke

Three things, in order of how long they cost me:

- **Partial reads.** TCP gives you bytes, not messages. A command can arrive in two pieces, and the number of bugs that hides behind that fact is humbling.
- **Expiry during iteration.** Sweeping while serving means deciding what a half-expired keyspace looks like to a client that just asked for it.
- **Growth you can't see.** Memory doesn't leak in one big jump. It drifts, and by the time you notice, the only useful question is which allocation you're not counting.

I fixed each one by making the failure reproducible first. A test I could run in a loop beat a theory I could argue about.

## What I'd do differently

I'd write the failure tests before the features. Not because tests are virtuous, but because "the client disconnects mid-reply" is a specification, and I only found that out by hitting it at the worst moment.

The other thing I'd change: I'd read the actual protocol spec earlier. I kept discovering edge cases by accident that were documented plainly in a file I'd skimmed. Being surprised by something you were told is a special kind of embarrassment.
