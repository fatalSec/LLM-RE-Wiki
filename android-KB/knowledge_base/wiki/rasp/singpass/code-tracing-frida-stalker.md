---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/22-08-singpass-rasp-analysis/
tags: [ios, rasp, frida-stalker, anti-frida, fingerprinting]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2022-08-29
reproducibility: unverified
llm_summary: "Detection of Frida Stalker in SingPass by fingerprinting the GumExecCtx structure stored in Thread Local Storage (TLS) via the TPIDRRO_EL0 register."
---

# Frida Stalker Detection (EVT_CODE_TRACING)

[Hub]([[wiki/rasp/singpass-rasp-analysis-hub]]) | [Prev]([[wiki/rasp/singpass/code-symbol-table-integrity]]) | [Next]([[wiki/rasp/singpass/thread-state-pc-check]])

## This Article Answers
- How does SingPass detect if Frida's Stalker is tracing the current thread?
- What internal Frida structure is fingerprinted for detection?

## Key Takeaways
- [TECHNIQUE] Accessing Thread Local Storage (TLS) base via `MRS(TPIDRRO_EL0)`. [V]
- [TECHNIQUE] Fingerprinting the `_GumExecCtx` structure by checking specific offsets and enum values. [V]
- [PREREQ] Knowledge of Frida-Gum internals and ARM64 system registers.
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Register | TLS Base | `TPIDRRO_EL0` | Access via `MRS` |
| TLS Key Range | Stalker | `0x100` to `0x200` | Range searched for the Stalker key |
| Struct Offset | `thread_id` | `0x18` | `_GumExecCtx->thread_id` |
| Struct Offset | `target_os` | `0x24` | `_GumExecCtx->code_writer.target_os` |
| Struct Offset | `ptrauth` | `0x28` | `_GumExecCtx->code_writer.ptrauth_support` |
| Enum Limit | `GumOS` | `<= 5` | Max value for `_GumOS` enum |
| Enum Limit | `GumPtrauth`| `<= 2` | Max value for `_GumPtrauthSupport` enum |
| Event Code | RASP | `EVT_CODE_TRACING` | Triggered on detection |

## In-Depth Walkthrough
- **TLS Access**
  - The check begins by getting the thread ID via `_pthread_mach_thread_np(_pthread_self())`. [V]
  - It manually accesses the TLS area using `MRS(TPIDRRO_EL0) & #-8`. [V]
  - On ARM64 iOS, the MSB of `TPIDRRO_EL0` contains the TLS base address.
- **Searching for Stalker Key**
  - The code loops through TLS keys from `0x100` to `0x200`. [V]
  - For each potential pointer, it calls `_vm_region_64` to verify it's a valid address with size `> 0x30`.
- **Fingerprinting `GumExecCtx`**
  - If a valid pointer is found, it's treated as a `_GumExecCtx` structure.
  - It performs the following checks [V]:
    1. `*(ptr + 0x18) == tid`: Does the stored Thread ID match the current thread?
    2. `*(ptr + 0x24) <= 5`: Is the `GumOS` field a valid enum value?
    3. `*(ptr + 0x28) <= 2`: Is the `GumPtrauthSupport` field a valid enum value?
  - If all conditions match, Frida Stalker is detected.

## Low-Level Technical Details [V]

### _GumExecCtx Fingerprint (Pseudo-code)
```cpp
bool is_stalker = (
    _GumExecCtx->thread_id == tid &&
    _GumExecCtx->code_writer.target_os <= 5 &&
    _GumExecCtx->code_writer.ptrauth_support <= 2
);
```

### Fingerprinting Logic Visualization
> **[Image extracted — DIAGRAM | confidence: high]**
> ```text
> bool in_range = address <= tlv_addr && tlv_addr < address + size;
> bool cond = _GumExecCtx->thread_id == tid &&
>             _GumExecCtx->code_writer.target_os <= 5 &&
>             _GumExecCtx->code_writer.ptrauth_support <= 2;
> ```
> *Context: Conditions extracted from the binary to identify the Stalker context.*

## Known Bypass & Mitigation Vectors
### Vector 1: Structural Randomization
*   **Action:** Recompile Frida-Gum with randomized field order in the `_GumExecCtx` structure to break the hardcoded offset checks (`0x18`, `0x24`, `0x28`). [V]

## What This Article Does NOT Cover
- The specific `tlv_idx` allocation logic in Frida.
- Anti-Stalker checks that don't rely on TLS.
