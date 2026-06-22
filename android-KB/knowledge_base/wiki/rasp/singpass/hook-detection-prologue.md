---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/22-08-singpass-rasp-analysis/
tags: [ios, rasp, hook-detection, arm64, assembly]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2022-08-29
reproducibility: unverified
llm_summary: "Detection of function hooking (EVT_CODE_PROLOGUE) by verifying the first byte of function prologues against the expected 0xFF (sub SP, SP, #CST) encoding."
---

# Hook Detection (EVT_CODE_PROLOGUE)

[Hub]([[wiki/rasp/singpass-rasp-analysis-hub]]) | [Prev]([[wiki/rasp/singpass/rasp-strings-callback]]) | [Next]([[wiki/rasp/singpass/detection-callbacks-overriding]])

## This Article Answers
- How does SingPass detect if a native function is hooked?
- What specific assembly instruction does the prologue check look for?

## Key Takeaways
- [TECHNIQUE] Verifying the first byte of a function for the `0xFF` constant.
- [TECHNIQUE] Using a custom compiler to insert matching checks for different prologue styles.
- [PREREQ] Understanding AArch64 function prologues and instruction encoding.
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Byte Constant | Prologue Check | `0xFF` | First byte of `sub SP, SP, #CST` |
| Instruction | Prologue | `sub SP, SP, #CST` | Encoding: `0xff ** 0x00 0xd1` |
| Event Code | RASP | `0x400` | `EVT_CODE_PROLOGUE` |
| Register | Allocation | `SP` | Stack Pointer manipulation |

## In-Depth Walkthrough
- **Prologue Verification Logic**
  - Regular functions start with a prologue allocating stack space.
  - Common AArch64 prologues:
    1. `stp REG, REG, [SP, 0xAA]!`
    2. `sub SP, SP, 0xBB` followed by `stp REG, REG, [SP, 0xCC]`
  - The instruction `sub SP, SP, #CST` is encoded such that its first byte is `0xFF`. [V]
- **The Check**
  - The obfuscator loads the **first byte** of the target function.
  - If the byte is NOT `0xFF`, it assumes a different prologue or a hooking trampoline (which usually starts with `B` or `LDR`).
  - Upon failure, it jumps to a RASP block that triggers the user callback with code `0x400`. [V]
- **Compiler Integration**
  - Since the app is compiled through the obfuscator's compiler, it knows which functions should have which prologue and inserts the appropriate check. [V]

## Low-Level Technical Details [V]

### Assembly Pattern
> **[Image extracted — DISASSEMBLY | confidence: high]**
> ```asm
> __text:000000010000B030  LDRB  W8, [X19]        ; Load first byte of target function
> __text:000000010000B034  CMP   W8, #0xFF        ; Compare with 0xFF
> __text:000000010000B038  B.NE  loc_rasp_trigger ; If not matching, trigger RASP
> ...
> loc_rasp_trigger:
> __text:000000010000B05C  ADRP  X8, #hook_detect_cbk_ptr
> __text:000000010000B060  LDR   X8, [X8, #hook_detect_cbk_ptr]
> __text:000000010000B064  MOV   W0, #0x400       ; EVT_CODE_PROLOGUE
> __text:000000010000B068  MOV   X1, X20          ; Corrupted pointer
> __text:000000010000B06C  BLR   X8               ; Call RASP callback
> ```

## Known Bypass & Mitigation Vectors
### Vector 1: Instruction Patching
*   **Target point:** Comparison at `000000010000B034`.
*   **Patched Instruction:** `NOP` or forcing `B.EQ`.

## Code Snippets
```asm
; Instruction encoding example
; sub SP, SP, #0x10
0xff 0x43 0x00 0xd1
```
> **Context:** AArch64 instruction encoding for stack subtraction.
> **Source line:** [V]

## What This Article Does NOT Cover
- Functions using `stp` with pre-index as the first instruction (byte != `0xFF`).
- Indirect branches used in hooking.
