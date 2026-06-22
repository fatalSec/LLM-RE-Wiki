---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/22-08-singpass-rasp-analysis/
tags: [ios, rasp, dyld-shared-cache, integrity-checking]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2022-08-29
reproducibility: unverified
llm_summary: "System library integrity verification (EVT_CODE_SYSTEM_LIB) via byte-per-byte comparison of in-memory __TEXT segments against the on-disk dyld shared cache."
---

# System Library Integrity (EVT_CODE_SYSTEM_LIB)

[Hub]([[wiki/rasp/singpass-rasp-analysis-hub]]) | [Prev]([[wiki/rasp/singpass/app-loaded-libraries-integrity]]) | [Next]([[wiki/rasp/singpass/rasp-design-weaknesses-bypass]])

## This Article Answers
- How does SingPass verify that system libraries (e.g., `libsystem_kernel.dylib`) haven't been patched in memory?
- What is the relationship between `vm_region_recurse_64` and RASP integrity checks?

## Key Takeaways
- [TECHNIQUE] Using `SYS_shared_region_check_np` to locate the dyld shared cache base. [V]
- [TECHNIQUE] Iterating over memory regions via `vm_region_recurse_64` to identify executable system code. [V]
- [TECHNIQUE] Performing a byte-per-byte comparison between the in-memory `__TEXT` segment and the original on-disk shared cache file. [V]
- [GOTCHA] The check uses `pages_swapped_out` as a trigger for in-depth inspection. [V]
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Syscall | Shared Region | `SYS_shared_region_check_np` | Locate shared cache base |
| Function | Iteration | `iterate_system_region` | Wraps `vm_region_recurse_64` |
| Function | Callback | `check_region_cbk` | Address: `0x100ED5E0C` |
| Struct | `dyld_cache_header` | `header->imagesTextCount` | Used for range limit calculation |
| Path | Shared Cache | `/System/Library/Caches/com.apple.dyld/dyld_shared_cache_arm64e` | Target for `mmap` |
| Address Range | Loop | `0x100ED6C58 - 0x100ED6C70` | Byte comparison loop |
| Event Code | RASP | `0x1000` | `EVT_CODE_SYSTEM_LIB` |

## In-Depth Walkthrough
- **Locating the Shared Cache**
  - The app uses `SYS_shared_region_check_np` to get the base address of the dyld shared cache. [V]
  - It reads the `dyld_shared_cache` header to determine memory ranges and image counts. [V]
- **Filtering Memory Regions**
  - It iterates over regions using `vm_region_recurse_64`.
  - A region is flagged for inspection if:
    - `info.pages_swapped_out != 0` OR
    - `(info.pages_swapped_out == 0 && (info.protection & VM_PROT_EXECUTE))` [V]
- **Byte-per-Byte Verification (`check_region_cbk`)**
  - For suspicious regions, the callback `check_region_cbk` (at `0x100ED5E0C`) is called. [V]
  - It retrieves the library base via `dladdr`.
  - It reads the in-memory `__TEXT` segment via `vm_read`. [V]
  - It `mmap`s the corresponding slice from the on-disk `dyld_shared_cache` file. [V]
  - It compares the two byte-for-byte. If they differ, the `EVT_CODE_SYSTEM_LIB` event is triggered. [V]

## Low-Level Technical Details [V]

### Inspection Trigger Logic
> **[Image extracted — DIAGRAM | confidence: high]**
> ```cpp
> if (info.pages_swapped_out != 0 || 
>    (info.pages_swapped_out == 0 && (info.protection & VM_PROT_EXECUTE))) {
>     bool integrity_failed = check_region_cbk(address);
> }
> ```
> *Context: Logic used to selectively inspect memory regions to minimize performance impact.*

## Known Bypass & Mitigation Vectors
### Vector 1: Forcing Results
*   **Action:** Hook `vm_region_recurse_64` to always return `pages_swapped_out = 0` and non-executable protection for the shared cache range.

## What This Article Does NOT Cover
- The specific implementation of `get_text_segment(header)`.
- Anti-hooking verification specifically paired with `vm_region_recurse_64`.
