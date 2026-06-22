---
type: blog
topic: wiki/rasp/_index
source: "https://www.romaintrace.fr/post/20-09-r2con-obfuscated-whitebox-part1/"
tags: [android, rasp, integrity-checking, plt, floating-point]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2020-09-20
reproducibility: unverified
llm_summary: "Analysis of r2-pay's code and library integrity checks, focusing on .plt verification and floating-point instruction probes."
---

# r2-pay Integrity Checks

[Hub]([[wiki/challenges/r2-pay/r2-pay-challenge-hub]]) | [Prev]([[wiki/challenges/r2-pay/anti-frida-checks]]) | [Next]([[wiki/challenges/r2-pay/bypass-strategies]])

## This Article Answers
- How does r2-pay verify that the system's `libc.so` hasn't been hooked?
- What anti-emulation tricks are used to verify AArch64 floating-point support?

## Key Takeaways
- [TECHNIQUE] Verifying the `.plt` section of `/system/lib64/libc.so`. [V]
- [TECHNIQUE] Using `tan()` function probes to verify correct floating-point instruction execution. [V]
- [TECHNIQUE] Background code integrity monitoring of the native library's own `.text` section. [V]
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Library | System Target | `/system/lib64/libc.so` | Integrity source |
| Section | Verification | `.plt` | Procedure Linkage Table |
| Math Probe | Function | `tan()` | Verifies `FCMP` / `FMOV` support |
| Signal | Anti-Patch | Crash on .text modify | Implicit integrity on own code |

## In-Depth Walkthrough
- **PLT Integrity Check**
  - Performed early in the **first ELF constructor** (`sub_9080`). [V]
  - Iterates over `/proc/self/maps` to find libc.
  - Manually parses the ELF header and sections table to find the `.plt`. [V]
  - Reads the `.plt` content and verifies no trampolines or hooks are present. [V]
- **Floating-Point Probes**
  - The monitor thread calls `tan(0.)` and `tan(-7832.0)`. [V]
  - Logic [I]: Detects analysis tools that fail to correctly emulate or handle floating-point instructions (`FCMP`, `FMOV`).
- **Code Integrity**
  - The library monitors its own `.text` section. [V]
  - Patching a syscall (e.g., at `0x0d718c`) causes a crash elsewhere because the integrity checksum no longer matches. [V]

## Code Snippets
### FP Probe Logic
```text
0x01b774: tan(0.): 0.
0x01b79c: tan(-7832.0): -0.00951489
```
> **Context:** Ensuring the execution environment handles complex math correctly. [V]

## Known Bypass & Mitigation Vectors
### Vector 1: Selective Hooking
*   **Action:** Hook `openat` for the libc path and redirect it to a clean, on-disk copy of `libc.so` rather than the in-memory version.

### Vector 2: Integrity Check NOPing
*   **Action:** Identify the basic block calculating the checksum (via Stalker/QBDI) and NOP out the comparison. [V]
*   **Target Offset:** `0xB64D0`. [V]

## What This Article Does NOT Cover
- Internal O-LLVM string decryption logic.
- Whitebox implementation details (see Part 2).
