---
title: DeepPacketInspection
summary: A C++17 engine that reads PCAP captures, works out which application and domain each flow belongs to, and applies blocking rules — with the parsing spread across threads.
domain: Web / SDE
year: "2026"
featured: false
order: 4
role: Solo
timeframe: "2026"
stack: ["C++17", "PCAP", "multithreading", "networking"]
links:
  - label: Repository
    href: https://github.com/RushiKohak/DeepPacketInspection
---

## Problem

A packet capture tells you bytes and port numbers. It doesn't tell you that this flow is a video call
and that one is a DNS lookup somebody should probably block.

## Approach

Parse the PCAP format, walk each packet down the stack, reassemble enough of the flow to recognise the
application, and evaluate configurable rules against it. Work is distributed across threads, since
packet processing is embarrassingly parallel once each flow has a clear owner.

## Result

`[ADD: what it detects, how fast it processes a capture, and what you'd improve.]`
