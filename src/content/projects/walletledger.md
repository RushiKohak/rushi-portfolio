---
title: walletledger
summary: A double-entry wallet and payments ledger in Java 21 and Spring Boot, built so a retried request can't move money twice.
domain: Web / SDE
year: "2026"
featured: true
order: 2
role: Solo — schema, API, tests
timeframe: "2026"
stack: ["Java 21", "Spring Boot", "PostgreSQL", "Docker"]
links:
  - label: Repository
    href: https://github.com/RushiKohak/walletledger
---

## Problem

A wallet is the easiest place to lose money quietly. If a transfer debits one account and the credit
fails, the balances no longer add up. If a client times out and retries, the customer is charged
twice. Both bugs are invisible until someone reconciles the numbers weeks later.

I wanted a ledger where those states are impossible to reach — not because the code is careful, but
because the database refuses to store them.

## Approach

**Every movement is two rows.** A debit and a credit, written in the same transaction, always summing
to zero. A balance is the sum of the entries that point at an account, never a stored column that can
drift out of sync with history.

**ACID transfers.** The transfer runs inside one transaction with row-level locks on both accounts,
taken in a fixed order so two opposite transfers can't deadlock each other. `[ADD: the isolation level
you settled on and why.]`

**Idempotency keys.** The client sends an `Idempotency-Key` header. A unique constraint on that key
means the second attempt doesn't execute again — it reads back the response the first attempt stored.
Retries become safe by default instead of by convention.

**Money as integers.** Amounts are stored in minor units. No floats anywhere near a balance.

## Architecture

```
POST /transfers
      │
      ├─ idempotency lookup ──► return the stored response
      │
      └─ @Transactional
           ├─ lock account rows (ordered by id)
           ├─ insert debit entry
           ├─ insert credit entry
           ├─ update idempotency record
           └─ commit
                 │
             PostgreSQL
```

Spring Boot owns the API and the transaction boundary, PostgreSQL owns correctness, and a Docker
Compose file brings up the database and the app together so the whole thing runs with one command.

## Result

The integration tests are the part I'm proud of: concurrent transfers against the same balance, and
replayed requests that must not charge twice.

`[ADD: test count, what the concurrency test proves, and any throughput or latency numbers.]`

## What I'd do next

An outbox table so ledger events can be published to other services without risking a message that
exists without the transfer that caused it. `[ADD: anything else.]`
