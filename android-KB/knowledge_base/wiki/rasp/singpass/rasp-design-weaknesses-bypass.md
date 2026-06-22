---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/22-08-singpass-rasp-analysis/
tags: [ios, rasp, bypass, frida, design-weakness]
complexity: intermediate
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2022-08-29
reproducibility: unverified
llm_summary: "Bypassing the entire RASP suite in SingPass by exploiting the architectural weakness of reusing a single callback for all detection events."
---

# RASP Design Weaknesses & Bypass

[Hub]([[wiki/rasp/singpass-rasp-analysis-hub]]) | [Prev]([[wiki/rasp/singpass/code-system-lib-integrity]]) | [Next]([[wiki/rasp/singpass/annexes-jb-artifacts]])

## This Article Answers
- What is the primary architectural weakness in SingPass's RASP implementation?
- How can all RASP checks be bypassed with a single Frida script?

## Key Takeaways
- [TECHNIQUE] Exploiting "Single Point of Failure" by identifying callback reuse. [V]
- [TECHNIQUE] Using `Interceptor.replace` to neutralize the central RASP handler. [V]
- [GOTCHA] The obfuscator supports advanced features, but they are only as strong as their integration by the app developer. [V]
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Function | Central Handler | `hook_detect_cbk_user_def` | Single function for ALL RASP events |
| Event Mapping | Enum | `RASP_EVENTS` | See mapping below |
| Tool | Bypass | Frida Gum | `gum_interceptor_replace` |

## In-Depth Walkthrough
- **The Design Weakness**
  - Although the commercial obfuscator provides isolated checks and distinct event codes, the SingPass developers mapped **all** RASP events to a single user-defined callback: `hook_detect_cbk_user_def`. [V]
  - This creates a massive Single Point of Failure (SPOF). Regardless of which check (debugging, jailbreak, hooking) triggers, the execution flow always passes through this one function. [V]
- **The Bypass**
  - By replacing `hook_detect_cbk_user_def` with a "do-nothing" function, all RASP detections are effectively neutralized. [V]
  - The application continues execution normally as if no threats were detected.

## Code Snippets
### RASP Events Enum
```cpp
enum class RASP_EVENTS : uint32_t {
  EVT_ENV_JAILBREAK        = 0x1,
  EVT_ENV_DEBUGGER         = 0x2,
  EVT_APP_SIGNATURE        = 0x20,
  EVT_APP_LOADED_LIBRARIES = 0x40,
  EVT_CODE_PROLOGUE        = 0x400,
  EVT_CODE_SYMBOL_TABLE    = 0x800,
  EVT_CODE_SYSTEM_LIB      = 0x1000,
  EVT_CODE_TRACING         = 0x2000,
};
```
> **Source line:** [V]

### Frida Bypass Script (Conceptual)
```javascript
// Neutralize the RASP handler
const handlerAddr = Module.findExportByName(null, "hook_detect_cbk_user_def");
Interceptor.replace(handlerAddr, new NativeCallback((info) => {
  const evt = info.readU32();
  console.log(`[RASP] Blocked event: 0x${evt.toString(16)}`);
}, 'void', ['pointer']));
```
> **Context:** Exploiting the callback reuse to disable all RASP features.
> **Source line:** [V]

## Known Bypass & Mitigation Vectors
### Vector 1: Callback Replacement
*   **Action:** Target `hook_detect_cbk_user_def` via `Interceptor.replace`.
*   **Result:** Universal bypass of all analyzed RASP checks.

## What This Article Does NOT Cover
- Native code obfuscation (MBA, CFF), which was disabled in this version.
- `EVT_APP_MACHO` and `EVT_APP_SIGNATURE` (not enabled in SingPass).
