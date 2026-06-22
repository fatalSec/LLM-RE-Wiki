---
type: blog
topic: wiki/rasp/_index
source: "https://www.romainthomas.fr/post/20-09-r2con-obfuscated-whitebox-part1/"
tags: [android, rasp, anti-root, rootbeer, su-files]
complexity: intermediate
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2020-09-20
reproducibility: unverified
llm_summary: "Analysis of r2-pay's anti-root mechanisms, combining the RootBeer library with native manual file existence checks for 'su' artifacts."
---

# r2-pay Anti-Root Checks

[Hub]([[wiki/challenges/r2-pay/r2-pay-challenge-hub]]) | [Next]([[wiki/challenges/r2-pay/anti-debug-checks]])

## This Article Answers
- How does r2-pay detect root access?
- What files are targeted by its native root detection?

## Key Takeaways
- [TECHNIQUE] Using the open-source **RootBeer** library for Java-level checks. [V]
- [TECHNIQUE] Manual existence checks for `su` binaries in ELF constructors via `open`, `openat`, and `faccessat`. [V]
- [GOTCHA] If root is detected at the Java level, the app triggers a divide-by-zero exception. [V]
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Library | Root Detection | `libtool-checker.so` | RootBeer native component |
| Function | Check 1 | `open('/system/xbin/su')` | Direct file probe |
| Function | Check 2 | `openat(..., '/data/su')` | Syscall-based probe |
| Function | Check 3 | `faccessat('/sbin/su')` | Syscall-based probe |
| Memory Offset | open call | `0x099180` | Native library address |

## In-Depth Walkthrough
- **Java Layer (RootBeer)**
  - The app embeds `libtool-checker.so`.
  - Checks are performed in `MainActivity`. [V]
  - Bypassed by hooking the obfuscated methods in `RootCheck` (e.g., `₤` and `θ`).
- **Native Layer (Manual Checks)**
  - Located in the **second ELF constructor** (`sub_77D14`). [V]
  - Spawns a thread (`sub_98c00`) that checks for common root artifacts. [V]
- **Targeted Paths [V]:**
  - `/data/local/su`, `/data/local/bin/su`, `/data/local/xbin/su`, `/sbin/su`, `/su/bin/su`, `/system/bin/su`, `/system/bin/.ext/su`, `/system/bin/failsafe/su`, `/system/sd/xbin/su`, `/system/usr/we-need-root/su`, `/system/xbin/su`, `/cache/su`, `/data/su`, `/dev/su`.

## Code Snippets
### Frida Bypass (Java)
```javascript
Java.perform(function () {
  var RootCheck = Java.use('\u266b.\u1d64'); // Obfuscated class
  RootCheck['₤'].implementation = function () { return false; }
  RootCheck['θ'].overload().implementation = function () { return false; }
});
```
> **Context:** Bypassing the RootBeer library's detection logic.
> **Source line:** [V]

## Known Bypass & Mitigation Vectors
### Vector 1: native function hooking
*   **Action:** Hook `open`, `openat`, and `faccessat`. [V]
*   **Result:** Force return value `-1` or `-2` (ENOENT) when paths containing `/su` are queried.

## What This Article Does NOT Cover
- RootBeer internal JNI logic.
- Bypass for Magisk Hide.
