---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/22-08-singpass-rasp-analysis/
tags: [ios, rasp, integrity-checking, mach-o, hashing]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2022-08-29
reproducibility: unverified
llm_summary: "Detection of unauthorized library injection (EVT_APP_LOADED_LIBRARIES) by hashing Mach-O dependencies using a MurmurHash variant and comparing against hardcoded expected hashes."
---

# Library Integrity (EVT_APP_LOADED_LIBRARIES)

[Hub]([[wiki/rasp/singpass-rasp-analysis-hub]]) | [Prev]([[wiki/rasp/singpass/thread-state-pc-check]]) | [Next]([[wiki/rasp/singpass/code-system-lib-integrity]])

## This Article Answers
- How does SingPass detect injected libraries like `FridaGadget.dylib`?
- What hashing algorithm is used for dependency integrity?

## Key Takeaways
- [TECHNIQUE] Iterating over `LC_ID_DYLIB`-like commands to extract dependency paths. [V]
- [TECHNIQUE] Computing 32-bit hashes of library paths using a MurmurHash variant. [V]
- [TECHNIQUE] Comparing dynamic hashes against a hardcoded list of expected values. [V]
- [GOTCHA] The check is duplicated at different offsets to prevent easy patching. [V]
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Algorithm | Hashing | MurmurHash (variant) | 32-bit output |
| Register | Optimization | `X11` / `X12` | 64-bit registers used to hold two 32-bit hashes |
| Hash Table Size | Dependencies | `0x6d` (109) | Number of libraries tracked |
| Address Range | Check 1 | `0x100E4CF38` | First instance of hash comparison |
| Address Range | Check 2 | `0x100E55678` | Second instance (duplication) |
| Event Code | RASP | `0x40` | `EVT_APP_LOADED_LIBRARIES` |

## In-Depth Walkthrough
- **Dependency Extraction**
  - The app accesses the Mach-O header via `dladdr`. [V]
  - It iterates through Load Commands to find all library dependencies (e.g., `/System/Library/...`, `@rpath/...`). [V]
- **Hashing Process**
  - For each dependency name, it calculates a 32-bit hash.
  - The hashes are stored in a table (`uint32_t TABLE[0x6d]`). [V]
- **Verification**
  - The computed table is compared against hardcoded hashes.
  - The compiler optimizes this by comparing two hashes at once using 64-bit registers (`X11`, `X12`). [V]
  - If a library like `FridaGadget.dylib` is injected, the dynamically computed hash will not match the hardcoded values, triggering `EVT_APP_LOADED_LIBRARIES`. [V]

## Low-Level Technical Details [V]

### Hash Comparison (Fig 4)
> **[Image extracted — DISASSEMBLY | confidence: high]**
> ```asm
> __text:0000000100E4CF48  MOV  X11, #0x1D2A29E0195DDC1 ; Two 32-bit hashes
> __text:0000000100E4CF58  MOV  X12, #0x4AA0A7902C19769 ; Next two 32-bit hashes
> __text:0000000100E4CF68  STP  X11, X12, [SP, #...]     ; Store for comparison
> ```
> *Context: Hardcoded hashes referenced during the integrity check.*

## Known Bypass & Mitigation Vectors
### Vector 1: Static Patching
*   **Action:** Patch both instances of the check (`0x100E4CF38` and `0x100E55678`) to skip the comparison or always return "match".

## What This Article Does NOT Cover
- The exact seed and implementation details of the MurmurHash variant.
- The full list of hardcoded hashes.
