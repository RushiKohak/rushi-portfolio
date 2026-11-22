---
title: Your-OWN-AI
summary: A local knowledge assistant in C++ that runs on your own machine — documents go in, embeddings are searched with vector similarity, and Ollama answers from what it found.
domain: AI / ML
year: "2026"
featured: false
order: 5
role: Solo
timeframe: "2026"
stack: ["C++17", "Ollama", "vector search", "RAG"]
links:
  - label: Repository
    href: https://github.com/RushiKohak/Your-OWN-AI
---

## Problem

Asking a hosted model about your own notes means sending your notes to somebody else's computer.

## Approach

Index the documents locally, embed them, retrieve the closest passages with vector search, and pass
only those passages to a model running through Ollama. The retrieval is the part that decides whether
the answer is grounded or invented, so that's where most of the work went.

## Result

`[ADD: corpus size, retrieval approach, and how you measured answer quality.]`
