---
type: blog
topic: wiki/rasp/_index
source: "https://www.romaintrace.fr/post/20-09-r2con-obfuscated-whitebox-part1/"
tags: [android, rasp, bypass, lief, static-patching, qbdi]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2020-09-20
reproducibility: unverified
llm_summary: "Comprehensive bypass strategies for r2-pay using static patching with LIEF and dynamic instrumentation with QBDI."
---

# r2-pay Bypass Strategies

[Hub]([[wiki/challenges/r2-pay/r2-pay-challenge-hub]]) | [Prev]([[wiki/challenges/r2-pay/integrity-checks]])

## This Article Answers
- How can we neutralize RASP threads in r2-pay?
- What tools are best suited for patching obfuscated Android libraries?

## Key Takeaways
- [TECHNIQUE] Disabling monitor threads by patching `pthread_create` in the `.plt`. [V]
- [TECHNIQUE] Using **LIEF** to apply multi-point static patches to the binary. [V]
- [TECHNIQUE] Using **QBDI** for dynamic syscall instrumentation and spoofing. [V]
- [GOTCHA] Static patches may trigger hidden code integrity checks. [V]
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Tool | Static Patching | LIEF | ELF manipulation library |
| Tool | Dynamic Instrumentation| QBDI | DBI framework |
| Memory Offset | `pthread_create` | `0x5870` | .plt entry target |
| Patch Bytes | `mov x0, xzr; ret` | `[0xe0, 0x03, 0x1f, 0xaa, 0xc0, 0x03, 0x5f, 0xd6]` | Neutralizes thread spawn |

## In-Depth Walkthrough
- **Neutralizing Monitor Threads**
  - All RASP logic runs in threads spawned via `pthread_create`.
  - Strategy: Patch the `.plt` entry for `pthread_create` to simply return 0. [V]
  - Result: No monitor threads are started, but main execution continues.
- **Handling Main Function Checks**
  - Detections are repeated in the JNI function `gXftm3iswpkVgBNDUp`. [V]
  - These must be dynamically bypassed using Stalker or QBDI callbacks on syscall instructions (`SVC #0`). [V]
- **Bypassing Code Integrity**
  - Patch the comparison basic block at `0xB64D0` to `NOP` (`0x1f, 0x20, 0x03, 0xd5`). [V]

## Code Snippets
### LIEF Patching Script
```python
import lief
lib = lief.parse("./libnative-lib.so")
# Patch pthread_create
lib.patch_address(0x5870, [0xe0, 0x03, 0x1f, 0xaa]) # mov x0, xzr
lib.patch_address(0x5874, [0xc0, 0x03, 0x5f, 0xd6]) # ret
# Disable self-integrity
lib.patch_address(0xB64D0, [0x1f, 0x20, 0x03, 0xd5]) # nop
lib.write("libnative-lib-patched.so")
```
> **Context:** Complete static neutralization of early RASP logic. [V]

## Known Bypass & Mitigation Vectors
### Vector 1: Call Array Processing
*   **Action:** Hook `call_array` in the system linker (`/system/bin/linker64`) to selectively skip or instrument the ELF constructors (`sub_9080`, `sub_77D14`). [V]

## What This Article Does NOT Cover
- Breaking the whitebox crypto (see Part 2).
- Advanced control-flow deobfuscation.
