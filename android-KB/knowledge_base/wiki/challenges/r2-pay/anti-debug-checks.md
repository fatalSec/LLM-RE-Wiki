---
type: blog
topic: wiki/rasp/_index
source: "https://www.romainthomas.fr/post/20-09-r2con-obfuscated-whitebox-part1/"
tags: [android, rasp, anti-debug, tracerpid, proc-fs]
complexity: intermediate
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2020-09-20
reproducibility: unverified
llm_summary: "Analysis of r2-pay's anti-debug mechanism, specifically its byte-per-byte inspection of /proc/self/status to detect TracerPid."
---

# r2-pay Anti-Debug Checks

[Hub]([[wiki/challenges/r2-pay/r2-pay-challenge-hub]]) | [Prev]([[wiki/challenges/r2-pay/anti-root-checks]]) | [Next]([[wiki/challenges/r2-pay/anti-frida-checks]])

## This Article Answers
- How does r2-pay detect if a debugger is attached?
- What file is monitored for the `TracerPid` value?

## Key Takeaways
- [TECHNIQUE] Inspecting `/proc/self/status` for the `TracerPid` field. [V]
- [TECHNIQUE] Using `openat` and `read` syscalls to parse the file **byte-per-byte**. [V]
- [PREREQ] Understanding that `TracerPid` is non-zero when debugged via `ptrace`. [V]
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| File Path | Status | `/proc/self/status` | Process metadata source |
| Syscall | Open | `openat` | At offset `0x020ee0` |
| Syscall | Read | `read` | At offset `0x0231e8` |
| Register | Buffer | `X0` | Holds syscall return (fd) |

## In-Depth Walkthrough
- **TracerPid Detection**
  - The native library spawns a monitoring thread (`sub_1a690`). [V]
  - It opens `/proc/self/status` using the `openat` syscall. [V]
  - It reads the file contents one byte at a time using `read`. [V]
  - It searches for the string `TracerPid:`. If the following value is not `0`, it assumes a debugger (GDB/LLDB) is present and crashes. [V]

## Code Snippets
### Syscall Trace (Conceptual)
```text
0x020ee0: syscall: openat(AT_FDCWD, '/proc/self/status'): 51
0x0231e8: syscall: read(51, buf, 1): 'T'
0x0231e8: syscall: read(51, buf, 1): 'r'
...
0x0231e8: syscall: read(51, buf, 1): '0' // Success if 0
```
> **Context:** Observed runtime behavior using QBDI.
> **Source line:** [V]

## Known Bypass & Mitigation Vectors
### Vector 1: Syscall Hooking
*   **Action:** Hook `read` or `openat`.
*   **Result:** When `/proc/self/status` is read, ensure the line `TracerPid:	0` is returned regardless of the actual state.

## What This Article Does NOT Cover
- Bypassing kernel-level `ptrace` checks.
- Environment checks for JDWP.
