---
title: "Idempotency is a product decision, not a database trick"
description: "The payments ledger only started behaving once I stopped treating duplicate requests as a bug and started treating them as the normal case."
date: 2026-10-12
tags: ["Backend", "Java"]
---

Everyone who builds a payments system eventually writes the same sentence in a design doc: "The API will be idempotent." It sounds like a property you turn on. In practice it's a series of small, uncomfortable decisions about what your users are allowed to retry, and what the system is allowed to forget.

I learned this the slow way, by building a ledger that was correct in the happy path and quietly wrong everywhere else.

## The retry is not the anomaly

My first mental model was: a request arrives, it succeeds, done. Duplicate requests were an error case I'd handle later. That model lasted until I actually thought about a flaky phone network. A client sends a transfer, the response is lost, the client retries. From the server's side both requests are identical and both look legitimate. If you process both, somebody's balance is wrong and nobody can prove it.

The fix is a client-supplied key that says "this is the same intent as before", plus a record of what that intent produced. Once a key is seen, the second request gets the first request's answer instead of a new transaction. Boring, effective, and completely dependent on one thing: the key has to be stored in the same transaction as the money movement. Otherwise you have a window where the record exists and the transfer doesn't, which is worse than no protection at all.

## Ordering is the second shoe

Balances are a running total, so the order you apply entries in matters. Two transfers that arrive at the same moment can both read a balance, both decide it's sufficient, and both write — and now the ledger says something no single client ever asked for.

Serialising per account is the honest answer. It costs throughput and it's tempting to skip until you watch a double-spend happen in a test you wrote yourself. I'd rather explain a lock to an interviewer than explain why my balance went negative.

## What the ledger taught me about design

The interesting part wasn't the Java. It was realising that "retry" is a product behaviour, not an infrastructure detail. Someone decided the retry button should exist. Someone decided the client shouldn't have to check whether the last attempt worked. My job was to make that decision safe.

That framing changed what I built. Instead of an endpoint that moves money, I ended up with an endpoint that accepts an intent and returns its outcome, however many times you ask. The endpoint got slightly more annoying to call and dramatically harder to corrupt. For money, that's the right trade.
