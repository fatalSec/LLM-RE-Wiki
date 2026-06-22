---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/22-08-singpass-rasp-analysis/
tags: [ios, rasp, callbacks, initialization]
complexity: intermediate
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2022-08-29
reproducibility: unverified
llm_summary: "Analysis of SingPass's RASP callback mechanism, showing how the default crash-inducing callback is overridden with a user-defined function."
---

# Detection Callbacks & Overriding

[Hub]([[wiki/rasp/singpass-rasp-analysis-hub]]) | [Prev]([[wiki/rasp/singpass/hook-detection-prologue]]) | [Next]([[wiki/rasp/singpass/anti-debug-checks]])

## This Article Answers
- Why doesn't SingPass crash immediately when a RASP event is detected?
- Where are the RASP callback pointers stored?

## Key Takeaways
- [TECHNIQUE] Overriding default RASP callbacks during application initialization.
- [GOTCHA] If the app doesn't override the callback, the default behavior is a crash via pointer corruption.
- [V] Address of the static callback pointer: `0x10109D760`.
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Memory Offset | Callback Ptr | `0x10109D760` | Address of `hook_detect_cbk_ptr` |
| Memory Offset | Init Function | `init_and_check_rasp` | Responsible for overwriting callbacks |
| Function Name | Default CBK | `hook_detect_cbk` | Corrupts pointers to cause crash |
| Function Name | User CBK | `hook_detect_cbk_user_def` | Displays UI message instead of crashing |

## In-Depth Walkthrough
- **Default Callback Behavior**
  - The obfuscator includes a default callback `hook_detect_cbk`.
  - Statically analyzing it shows it corrupts the provided pointer parameters, leading to a crash. [V]
- **Initialization & Overriding**
  - During `init_and_check_rasp`, the application overwrites the default pointer at `0x10109D760`.
  - Only ONE instruction in the binary (`init_and_check_rasp+01BC`) performs this write. [V]
  - The new pointer `hook_detect_cbk_user_def` calls `on_rasp_detection`, which uses the recovered event strings to display an error message to the user. [V]
- **Propagation to Other Checks**
  - The `X23` register (holding the user-defined callback address) is used to initialize several other RASP check pointers (tracing, jailbreak, etc.). [V]

## Low-Level Technical Details [V]

### Callback Pointer Definition
> **[Image extracted — TOOL_OUTPUT | confidence: high]**
> ```text
> __data:000000010109D760  hook_detect_cbk_ptr  DCQ  hook_detect_cbk
> ```

### Callback Overwriting Logic
> **[Image extracted — DISASSEMBLY | confidence: high]**
> ```asm
> __text:0000000100ED7E54  ADRL  X8, hook_detect_cbk_user_def
> __text:0000000100ED7E5C  STR   X8, [X23, #hook_detect_cbk_ptr]
> ```
> *Context: `init_and_check_rasp` overwriting the static variable with the user-defined handler.*

### Propagation (Fig 3: X23 Writes)
> **[Image extracted — TOOL_OUTPUT | confidence: high]**
> ```text
> W 0x00100ED7E5C STR X23, ...
> W 0x00100ED81F0 STR X23, ...
> W 0x00100ED86A0 STR X23, ...
> W 0x00100ED8B48 STR X23, ...
> ```
> *Context: Distribution of the user callback to multiple RASP subsystems.*

## Known Bypass & Mitigation Vectors
### Vector 1: Static Patching
*   **Target point:** `0x00100ED7E5C` (STR instruction).
*   **Action:** Prevent the overwrite or replace `X23` with a `NOP` function address.

## What This Article Does NOT Cover
- The specific implementation of `hook_detect_cbk_user_def`'s UI logic.
