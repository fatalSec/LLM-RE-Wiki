---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/22-08-singpass-rasp-analysis/
tags: [ios, rasp, import-integrity, mach-o, symbol-table]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2022-08-29
reproducibility: unverified
llm_summary: "Verification of import table integrity (EVT_CODE_SYMBOL_TABLE) in SingPass by manually resolving symbols and cross-checking against GOT and Lazy Symbol pointers."
---

# Symbol Table Integrity (EVT_CODE_SYMBOL_TABLE)

[Hub]([[wiki/rasp/singpass-rasp-analysis-hub]]) | [Prev]([[wiki/rasp/singpass/advanced-detections]]) | [Next]([[wiki/rasp/singpass/code-tracing-frida-stalker]])

## This Article Answers
- How does SingPass verify that imported functions (like `fopen`) are not hooked?
- What is the internal metadata structure used for symbol integrity checks?

## Key Takeaways
- [TECHNIQUE] Manual resolution of imports by parsing `__LINKEDIT` and export tries in-memory. [V]
- [TECHNIQUE] Cross-checking manually resolved addresses against the `__got` and `__la_symbol_ptr` sections. [V]
- [TECHNIQUE] Using `dladdr` to verify that both the resolved and the actual pointer belong to the same library base. [V]
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Initialization | Function | `sub_100E544E8` | Sets up the metadata structure |
| Struct | `symbols_metadata_t` | See layout below | Contains pointers to tables |
| Event Code | RASP | `EVT_CODE_SYMBOL_TABLE` | Triggered on mismatch |
| Address Range | Check | `0x100016FC4 – 0x100017024` | Integrity verification loop |
| Constant | `nb_symbols` | `0x399` | Number of symbols tracked |

## In-Depth Walkthrough
- **Manual Symbol Resolution**
  - During initialization (`sub_100E544E8`), the obfuscator manually resolves all imported functions.
  - It iterates over symbols, parses `__LINKEDIT`, and follows the exports trie to find absolute addresses. [V]
- **Metadata Structure**
  - The obfuscator maintains a `symbols_metadata_t` structure [V]:
    - `symbols_index`: Translation table to indices in `__got` or `__la_symbol_ptr`.
    - `origins`: Enum indicating if a symbol is in `LA_SYMBOL` (1) or `GOT` (2).
    - `resolved_la_syms` / `resolved_got_syms`: Pointers to the manually resolved address tables.
    - `macho_la_syms` / `macho_got_syms`: Pointers to the actual Mach-O sections.
- **Verification Loop**
  - The check accesses `symbols_index` and `origins` (e.g., at index `0x32a`). [V]
  - It compares the value in the Mach-O section with the manually resolved value.
  - **Exception**: If the Mach-O entry points to the `__stub_helper` section, it is considered "not yet resolved" and skipped. [V]
  - **Validation**: If they don't match, `dladdr` is used to see if they at least share the same `dli_fbase`. If the bases differ, it's a confirmed hook (e.g., Frida), and the event is triggered. [V]

## Low-Level Technical Details [V]

### Metadata Layout
> **[Image extracted — DISASSEMBLY | confidence: high]**
> ```text
> __data:000000010109F0C8  nb_symbols       DCD  0x399
> __data:000000010109F0D8                   ALIGN 0x20
> __data:000000010109F0E0  ; symbols_metadata_t metadata
> __data:000000010109F0E0  metadata         DCQ  symbols_index
> __data:000000010109F0E8                   DCQ  origins
> __data:000000010109F0F0                   DCQ  0 ; resolved_la_syms
> __data:000000010109F0F8                   DCQ  0 ; resolved_got_syms
> __data:000000010109F100                   DCQ  0 ; macho_la_syms
> __data:000000010109F108                   DCQ  0 ; macho_got_syms
> __data:000000010109F110                   DCQ  0 ; stub_helper_start
> __data:000000010109F118                   DCQ  0 ; stub_helper_end
> ```

### Verification Logic (Pseudo-code)
```cpp
const uintptr_t addr_from_section    = section_ptr[sym_idx];
const uintptr_t addr_from_resolution = manually_resolved[sym_idx];

if (addr_from_section != addr_from_resolution) {
  Dl_info info_section;
  Dl_info info_resolution;

  dladdr(addr_from_section,    &info_section);
  dladdr(addr_from_resolution, &info_resolution);
  if (info_section.dli_fbase != info_resolution.dli_fbase) {
    // --> Trigger EVT_CODE_SYMBOL_TABLE;
  }
}
```
> **Source line:** [V]

## Known Bypass & Mitigation Vectors
### Vector 1: Metadata Tampering
*   **Action:** Set `origin[sym_idx]` to `SYM_ORIGINS::NONE` (0) for the target symbol. This causes the loop to skip the check for that symbol. [V]
*   **Action:** Alternatively, overwrite the `macho_*_syms` pointers in the metadata to point to the `resolved_*_syms` tables.

## What This Article Does NOT Cover
- Detailed parsing of the Export Trie in Mach-O.
- The `___atomic_load` / `___atomic_store` leak of the metadata address.
