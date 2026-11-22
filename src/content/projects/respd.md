---
title: RESPD
summary: A Redis-compatible key-value server in C++17 — one thread, one epoll loop, and persistence that survives a restart.
domain: Web / SDE
year: "2026"
featured: true
order: 1
role: Solo — design, implementation, benchmarking
timeframe: "2026"
stack: ["C++17", "epoll", "RESP2", "AOF + snapshot", "Linux"]
links:
  - label: Repository
    href: https://github.com/RushiKohak/RESPD
  - label: Design notes
    href: https://github.com/RushiKohak/RESPD/blob/main/DESIGN.md
  - label: Benchmarks
    href: https://github.com/RushiKohak/RESPD/blob/main/BENCHMARKS.md
---

## Problem

Every Redis client already speaks RESP2, so the hard part isn't storing a value in a hash map. It's
keeping the promises those clients assume: pipelined commands answered in order, keys that expire on
their own, and data that is still there after the process is killed mid-write.

I wanted to find out how much of that contract you can honour yourself, and where it actually gets
difficult. It gets difficult in three places — a command split across two TCP reads, a pipelined batch
arriving faster than you can reply, and the process dying between two writes.

## Approach

**One thread, one event loop.** No locks, no thread pool, no cache-line ping-pong. Every connection is
a socket with a read buffer. The loop drains whatever is readable, parses everything it can, and
queues the replies. Because there is only one thread, the parser and the keyspace can never disagree
about what happened.

**An incremental parser.** A command can arrive in pieces: the first packet might end in the middle of
an argument. The parser keeps its state between reads and waits for the rest instead of dropping the
connection. That same mechanism is what makes pipelining work — a client can send fifty commands and
gets fifty replies back in order.

**TTL with lazy expiry.** An expired key disappears the moment something touches it, and a periodic
sweep clears out the keys nobody ever asks for again. That keeps memory bounded without a timer per
key.

**Hybrid persistence.** The append-only file records every write as it happens; the snapshot rewrites
the dataset compactly from scratch. Recovery loads the snapshot first, then replays the AOF tail, so a
crash costs you at most the writes since the last flush.

## Architecture

```
client sockets
      │
  epoll_wait()                ← single thread, level-triggered
      │
  read buffers
      │
  RESP2 parser (stateful)     ← survives partial reads, drains pipelined batches
      │
  command dispatch
      │
  ┌───┴─────────────┬──────────────────┐
keyspace          TTL table        AOF buffer
(strings, lists,                    │
 hashes, sets,               append → snapshot rewrite
 sorted sets)
```

Five data types — strings, lists, hashes, sets and sorted sets — each with its own command surface and
its own edge cases around empty collections and overwrites.

## Result

Correctness came before speed, so the numbers are the last thing I collected, not the first. They live
in [BENCHMARKS.md](https://github.com/RushiKohak/RESPD/blob/main/BENCHMARKS.md) next to the exact
`redis-benchmark` flags and machine specs.

`[ADD: throughput for SET/GET at N clients, p99 latency, and the redis-server comparison on the same box.]`

What I actually learned: protocol servers are mostly bookkeeping. The interesting failures are all in
the boundaries — partial reads, half-written files, and the moment a client disappears mid-pipeline.

## What I'd do next

Replication is the obvious missing piece, and it would force the write path to be replayable rather
than just durable. `[ADD: anything else you'd change.]`
