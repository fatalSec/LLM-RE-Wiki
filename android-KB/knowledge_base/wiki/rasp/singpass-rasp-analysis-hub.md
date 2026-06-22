---
type: hub
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/22-08-singpass-rasp-analysis/
author: Romain Thomas
published: 2022-08-29
llm_summary: "A semantic router for the SingPass RASP analysis series, covering hook detection, anti-debugging, jailbreak detection, and advanced Frida Stalker fingerprinting."
---

# SingPass RASP Analysis (Part 1) — Hub

This series explores the RASP (Runtime Application Self-Protection) and obfuscation techniques used in the SingPass iOS application (v2022-08-29).

## Analysis Chunks

| Section | Description |
|---|---|
| [[wiki/rasp/singpass/intro-obfuscator-identification\|1. Identification]] | Identifying the commercial obfuscator (NuDetectSDK) via binary grepping. |
| [[wiki/rasp/singpass/rasp-strings-callback\|2. RASP Callback Logic]] | Discovery of RASP event strings and the central `on_rasp_detection` callback. |
| [[wiki/rasp/singpass/hook-detection-prologue\|3. Hook Detection]] | `EVT_CODE_PROLOGUE`: Verifying function prologues against `0xFF` for `sub SP, SP, #CST`. |
| [[wiki/rasp/singpass/detection-callbacks-overriding\|4. Callback Overriding]] | How the app overrides default crash callbacks with user-defined RASP logic. |
| [[wiki/rasp/singpass/anti-debug-checks\|5. Anti-Debug]] | `ppid` check and `sysctl` `P_TRACED` flag verification. |
| [[wiki/rasp/singpass/jailbreak-detection-files\|6. Jailbreak (Files)]] | File existence checks for JB artifacts (Cydia, Sileo, etc.) and `unc0ver` unmount check. |
| [[wiki/rasp/singpass/environment-checks\|7. Environment]] | Validation of `HOME` and dyld image paths to detect code lifting/emulation. |
| [[wiki/rasp/singpass/advanced-detections\|8. Advanced Detections]] | SIP (KEXTS) status and Sandbox API existence checks for OSX/Apple Silicon detection. |
| [[wiki/rasp/singpass/code-symbol-table-integrity\|9. Symbol Table Integrity]] | `EVT_CODE_SYMBOL_TABLE`: Manual import resolution and cross-check against GOT/Stubs. |
| [[wiki/rasp/singpass/code-tracing-frida-stalker\|10. Frida Stalker Detection]] | `EVT_CODE_TRACING`: Fingerprinting `GumExecCtx` via TLS and `TPIDRRO_EL0`. |
| [[wiki/rasp/singpass/thread-state-pc-check\|11. Thread PC Check]] | Detecting Stalker by checking if thread PC is within `libsystem_kernel.dylib`. |
| [[wiki/rasp/singpass/app-loaded-libraries-integrity\|12. Library Integrity]] | `EVT_APP_LOADED_LIBRARIES`: MurmurHash32 verification of Mach-O dependencies. |
| [[wiki/rasp/singpass/code-system-lib-integrity\|13. System Lib Integrity]] | `EVT_CODE_SYSTEM_LIB`: Byte-per-byte comparison of in-memory vs on-disk dyld shared cache. |
| [[wiki/rasp/singpass/rasp-design-weaknesses-bypass\|14. Weaknesses & Bypass]] | Bypassing all checks via a single function replacement (callback reuse weakness). |
| [[wiki/rasp/singpass/annexes-jb-artifacts\|15. Annexes]] | Comprehensive lists of JB detection files and flagged packages. |

## Open Questions
- Does the commercial obfuscator automatically include these checks or are they manually integrated?
- Why was native code obfuscation (MBA, CFF) disabled in this specific build?
