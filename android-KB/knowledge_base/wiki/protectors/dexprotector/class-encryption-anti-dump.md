---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/26-01-dexprotector/
tags: [android, dexprotector, dex-encryption, anti-dump]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2026-01-04
reproducibility: unverified
llm_summary: "Analysis of DexProtector's class encryption via classes.dex.dat and its memory-unmapping anti-dump mechanism."
---

# Class Encryption & Anti-Dump

[Hub]([[wiki/protectors/dexprotector-hub]]) | [Prev]([[wiki/protectors/dexprotector/key-derivation-binding]]) | [Next]([[wiki/protectors/dexprotector/string-encryption-integrity]])

## This Article Answers
- How does DexProtector protect DEX files from static analysis?
- How does the anti-dump mechanism work to prevent memory extraction of DEX files?

## Key Takeaways
- [TECHNIQUE] Bundling encrypted/compressed DEX files into `assets/classes.dex.dat`. [V]
- [TECHNIQUE] Dynamic loading of DEX files from memory using internal Android APIs. [V]
- [TECHNIQUE] Unmapping unused regions of in-memory DEX files to trigger `SEGV_MAPERR` during dumping. [V]
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| File Path | Encrypted DEX | `assets/classes.dex.dat` | Container for all protected DEX data |
| File Format | DEX Container | Encrypted + Compressed | Header typically at the end of the file |
| Signal | Anti-Dump | `SEGV_MAPERR` | Triggered by access to unmapped regions |
| Config Tag | XML | `<classEncryption>` | Defines filters for protected classes |

## In-Depth Walkthrough
- **`classes.dex.dat` Structure**
  - All protected `classes<N>.dex` files are encrypted, compressed, and merged into this asset. [V]
  - A metadata header is located at the **end** of the file. [V]
  - At runtime, `libdp.so` decrypts/decompresses these and loads them dynamically.
- **Anti-Dump Mechanism**
  - To prevent full-range memory dumping (e.g., via Frida `Memory.readByteArray`), DexProtector unmaps (`munmap`) unused or specific regions of the mapped DEX file. [V]
  - Example: For a DEX mapped at `[0x60000, 0x70000]`, the region `[0x64000, 0x68000]` might be unmapped.
  - Any attempt to read the entire range triggers a segmentation fault (`SEGV_MAPERR`), effectively blocking most generic dumpers. [V]

## Known Bypass & Mitigation Vectors
### Vector 1: Selective Dumping
*   **Action:** Identify the unmapped regions (via `/proc/self/maps`) and dump only the valid sub-regions, then reconstruct the DEX file. [V]
*   **Result:** Recovery of "unprotected" DEX files that still contain lower-level obfuscation (string encryption, etc.).

## What This Article Does NOT Cover
- Detailed breakdown of the `classes.dex.dat` header format.
- Specific JNI calls used for dynamic DEX loading (e.g., `InMemoryDexClassLoader` or native equivalents).
