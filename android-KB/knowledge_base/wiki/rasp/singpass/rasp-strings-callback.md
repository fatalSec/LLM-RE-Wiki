---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/22-08-singpass-rasp-analysis/
tags: [ios, rasp, memory-dumping, lief]
complexity: intermediate
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2022-08-29
reproducibility: unverified
llm_summary: "Dumping the __data section of SingPass at runtime to recover decoded RASP event strings and identify the central on_rasp_detection callback."
---

# RASP Strings & Callback Logic

[Hub]([[wiki/rasp/singpass-rasp-analysis-hub]]) | [Prev]([[wiki/rasp/singpass/intro-obfuscator-identification]]) | [Next]([[wiki/rasp/singpass/hook-detection-prologue]])

## This Article Answers
- How to recover obfuscated RASP strings?
- What is the central callback for RASP events in SingPass?

## Key Takeaways
- [TECHNIQUE] Runtime memory dumping of the `__data` section after string decryption.
- [PREREQ] Frida for injection and LIEF for in-memory parsing.
- [GOTCHA] Strings are likely decoded only when the app reaches its initial state (e.g., error message displayed).
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Binary Section | Dumping | `__data` | Contains decoded RASP strings at runtime |
| Function Name | RASP Central | `on_rasp_detection` | Referenced by all `EVT_*` strings |
| Tool | Parsing | LIEF | Used to parse the Mach-O in-memory |

## In-Depth Walkthrough
- **Runtime String Recovery**
  - The obfuscator decrypts strings at runtime.
  - Strategy:
    1. Run the app until the "Jailbreak" error message is shown.
    2. Attach with Frida.
    3. Inject a library that uses LIEF to parse the in-memory `SingPass` binary.
    4. Dump the `__data` section to `/tmp`. [V]
- **Recovered RASP Strings**
  - Dumping reveals `EVT_*` strings used for threat signaling.
  - All these strings share a single cross-reference (XREF) to a specific function: `on_rasp_detection`. [V]

## Recovered Data Sections [V]

> **[Image extracted — HEX_DUMP | confidence: high]**
> ```text
> __data:00000001010B97FA  qword_1010B97FA  DCQ   0x942752767D91608E
> __data:00000001010B9802  byte_1010B9802   DCB   0x98
> __data:00000001010B9803  dword_1010B9803  DCD   0x2318E9A2
> __data:00000001010B9807                   DCQ   0x222AD8A21325DEE5
> __data:00000001010B980F  byte_1010B980F   DCB   0xE0
> __data:00000001010B9810  byte_1010B9810   DCB   0xE5
> ```
> *Context: Slices of the `__data` section before the dump (encrypted).*

> **[Image extracted — DECOMPILED_CODE | confidence: high]**
> ```text
> __data:00000001010B97FA  aTaurine         DCB   "/taurine",0
> __data:00000001010B9803  aTaurineCstmp    DCB   "/taurine/cstmp",0
> __data:00000001010B9812  aTaurineJailbre  DCB   "/taurine/jailbreakd",0
> __data:00000001010B9826                   DCD   0
> __data:00000001010B982A  aTaurineLaunchj  DCB   "/taurine/launchjailbreak",0
> ```
> *Context: Slices of the `__data` section after the dump (decrypted).*

> **[Image extracted — TOOL_OUTPUT | confidence: high]**
> ```text
> __data:1010B8D10  aEvtCodeTracing   DCB   "EVT_CODE_TRACING",0     ; XREF: on_rasp_detection
> __data:1010B8D30  aEvtCodeSystemL   DCB   "EVT_CODE_SYSTEM_LIB",0  ; XREF: on_rasp_detection
> __data:1010B8D50  aEvtCodeSymbolT   DCB   "EVT_CODE_SYMBOL_TABLE",0; XREF: on_rasp_detection
> __data:1010B8D70  aEvtCodePrologu   DCB   "EVT_CODE_PROLOGUE",0    ; XREF: on_rasp_detection
> __data:1010B8D90  aEvtEnvDebugger   DCB   "EVT_ENV_DEBUGGER",0     ; XREF: on_rasp_detection
> __data:1010B8DB0  aEvtEnvJailbrea   DCB   "EVT_ENV_JAILBREAK",0    ; XREF: on_rasp_detection
> ```
> *Context: Recovered RASP event strings and their common XREF to `on_rasp_detection`.*

## Known Bypass & Mitigation Vectors
### Vector 1: Runtime Memory Dump
*   **Target point:** `__data` section at the end of initialization.
*   **Result:** Plaintext recovery of all hardcoded strings (paths, event names).

## What This Article Does NOT Cover
- String encoding routines (analyzed in Part 2).
- Specific logic of `on_rasp_detection`.
