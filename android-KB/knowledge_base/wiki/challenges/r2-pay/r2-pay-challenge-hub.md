---
type: hub
topic: wiki/rasp/_index
source: "https://www.romainthomas.fr/post/20-09-r2con-obfuscated-whitebox-part1/"
author: Romain Thomas
published: 2020-09-20
llm_summary: "A semantic hub for the r2-pay challenge analysis, focusing on its multi-layered RASP protections: anti-root, anti-debug, anti-frida, and code integrity."
---

# r2-pay Challenge (Part 1) — Hub

The `r2-pay` challenge (r2con 2020) is an Android application featuring an obfuscated native library with multi-layered RASP and a whitebox implementation.

## Analysis Chunks

| Section | Description |
|---|---|
| [[wiki/challenges/r2-pay/anti-root-checks\|1. Anti-Root]] | Analysis of RootBeer (Java) and manual `su` file checks in ELF constructors. |
| [[wiki/challenges/r2-pay/anti-debug-checks\|2. Anti-Debug]] | Standard `TracerPid` inspection in `/proc/self/status` via byte-per-byte read. |
| [[wiki/challenges/r2-pay/anti-frida-checks\|3. Anti-Frida]] | Detection via `gmain` thread names in `/proc/self/task` and named pipes in `/proc/self/fd`. |
| [[wiki/challenges/r2-pay/integrity-checks\|4. Integrity Checks]] | Verification of the `.plt` section of `libc.so` and the `.text` section of the native library. |
| [[wiki/challenges/r2-pay/bypass-strategies\|5. Bypass Strategies]] | Static patching with LIEF and dynamic instrumentation using QBDI to neutralize RASP. |

## Target Environment
*   **Platform:** Android 9 (AArch64).
*   **Protection:** Fork of O-LLVM (Control-Flow Flattening, String Obfuscation).
*   **Main Binary:** `libnative-lib.so`.

## Related
- [[wiki/rasp/_index|RASP Overview]]
- [[wiki/arch/arm64-syscall-reference|ARM64 Syscall Reference]]
