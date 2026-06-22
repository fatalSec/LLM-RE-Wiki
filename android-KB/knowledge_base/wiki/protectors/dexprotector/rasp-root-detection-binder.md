---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/26-01-dexprotector/
tags: [android, dexprotector, rasp, binder, root-detection]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2026-01-04
reproducibility: unverified
llm_summary: "Analysis of DexProtector's RASP features, focusing on its raw Binder-based package enumeration to bypass standard Android API hooks."
---

# RASP & Root Detection

[Hub]([[wiki/protectors/dexprotector-hub]]) | [Prev]([[wiki/protectors/dexprotector/asset-protection-vtable-hooking]]) | [Next]([[wiki/protectors/dexprotector/annexes-unprotected-apps]])

## This Article Answers
- How does DexProtector bypass `PackageManager` hooks during root detection?
- What are the primary RASP features supported by DexProtector?

## Key Takeaways
- [TECHNIQUE] Using raw Binder communication to query installed packages. [V]
- [TECHNIQUE] Deferred reaction to detected threats to hinder analysis. [V]
- [TECHNIQUE] Immediate countermeasures (crash/key corruption) if threats are detected during early startup. [V]
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| IPC Mechanism | API Bypass | Raw Binder | Bypasses `PackageManager` |
| Package Name | Flagged | `com.zachspong.temprootremovejb` | Example root-related package |
| Reaction | Stealth | Deferred Response | Detection != Immediate Crash |
| Config Tag | XML | `<antiDebug>`, `<antiEmulator>`, `<antiMalware>` | Configuration options |

## In-Depth Walkthrough
- **Raw Binder Communication**
  - Most RASP solutions hook or use the `PackageManager` Java API to find root apps.
  - DexProtector communicates directly with the system via low-level Binder calls. [V]
  - This bypasses common Frida hooks on `PackageManagerService` or `IPackageManager`.
- **Supported RASP Features**
  - **Anti-Debug**: Standard debugger detection.
  - **Anti-Emulator**: Checks for specific hardware properties/emulation markers.
  - **Anti-Malware**: Detection of known malicious or unwanted packages.
  - **Runtime Checks**: Continuous monitoring for hooks (Frida, Xposed). [V]
- **Reaction Strategies**
  - **Deferred**: If a hook is detected mid-execution, the app might wait several minutes or until a specific UI action before crashing. [V]
  - **Immediate**: If a debugger or Frida is detected during the very first stages of `libdp.so` initialization, it will corrupt the master key or terminate the process. [V]

## Known Bypass & Mitigation Vectors
### Vector 1: Binder Hooking
*   **Action:** Hook the low-level `ioctl` (for Binder) or the `BpBinder` class to intercept and filter out the results of package enumeration.

## What This Article Does NOT Cover
- Detailed mapping of Binder transaction codes for `IPackageManager`.
- Specific emulator detection heuristics.
