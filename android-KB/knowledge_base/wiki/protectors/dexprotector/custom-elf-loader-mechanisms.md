---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/26-01-dexprotector/
tags: [android, dexprotector, elf-loader, reverse-engineering]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2026-01-04
reproducibility: unverified
llm_summary: "Analysis of the custom ELF loader libdexprotector.so, identifying payload signatures (DPLF) and segment-based packing strategies."
---

# Custom ELF Loader Mechanisms

[Hub]([[wiki/protectors/dexprotector-hub]]) | [Prev]([[wiki/protectors/dexprotector/bootstrap-loading-chain]]) | [Next]([[wiki/protectors/dexprotector/key-derivation-binding]])

## This Article Answers
- How is the protected payload stored within `libdexprotector.so`?
- What file signatures can be used to identify DexProtector's packed libraries?

## Key Takeaways
- [TECHNIQUE] Identifying packed payloads via the `DPLF` magic bytes. [V]
- [TECHNIQUE] Detecting payloads stored in the final `PT_LOAD` segment of `libdexprotector.so`. [V]
- [TECHNIQUE] Using a custom header structure instead of the standard `Elf64_Ehdr`. [V]
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Magic Bytes | Payload Start | `DPLF` (`44 50 4c 46`) | Found in some versions |
| ELF Segment | Packed Data | Final `PT_LOAD` | Often the largest segment with RW flags |
| Original Name | Loader Lib | `liblinker.so` | Internal name for `libdexprotector.so` |
| Original Name | Unpacked Lib | `libdp.so` | Internal name for the decrypted payload |

## In-Depth Walkthrough
- **Payload Location Strategies**
  - **Magic-based**: In some versions, the packed library starts with the header `DPLF`. [V]
  - **Segment-based**: In other versions (e.g., Revolut), the payload is appended to or contained within the last `PT_LOAD` segment. This segment typically has `RW` flags and a significantly large `FileSiz`. [V]
- **Custom Header Logic**
  - `libdexprotector.so` does not use standard `Elf64_Ehdr` for its inner payload.
  - It decrypts a custom header followed by segment descriptions that it then maps manually into memory. [V]
  - This prevents standard tools like `readelf` or `objdump` from processing the packed binary.
- **Dynamic Table Sanitization**
  - During loading, the loader clears regions referenced in the dynamic table (e.g., `DT_ANDROID_RELA`). [V]
  - If dumped post-load, critical relocation data will be missing (all zeros). [V]

## Low-Level Technical Details [V]

### DPLF Magic Header
> **[Image extracted — HEX_DUMP | confidence: high]**
> ```text
> 0000fac0  44 50 4c 46 c0 b1 f2 ea e1 c6 0d 5b 45 6e fd e5  DPLF.......[En..
> ```
> *Context: Hex dump of the packed payload starting with DPLF magic.*

### Segment Identification
> **[Image extracted — TOOL_OUTPUT | confidence: high]**
> ```bash
> LOAD           0x003630 0x000000000000f630 0x000000000000f630 0x057535 0x057535 RW  0x4000
> ```
> *Context: Identifying the large RW LOAD segment containing the packed library.*

## What This Article Does NOT Cover
- The specific mapping algorithm used by the custom loader.
- Details of the custom segment structure.
