---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/22-08-singpass-rasp-analysis/
tags: [ios, rasp, anti-debug, sysctl, ppid]
complexity: intermediate
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2022-08-29
reproducibility: unverified
llm_summary: "Implementation of standard iOS anti-debug checks in SingPass using getppid() verification and sysctl P_TRACED flag detection."
---

# Anti-Debug Checks

[Hub]([[wiki/rasp/singpass-rasp-analysis-hub]]) | [Prev]([[wiki/rasp/singpass/detection-callbacks-overriding]]) | [Next]([[wiki/rasp/singpass/jailbreak-detection-files]])

## This Article Answers
- How does SingPass detect if it is being debugged?
- What system calls are used for anti-debugging?

## Key Takeaways
- [TECHNIQUE] Verifying that the parent process is `launchd` (PID 1).
- [TECHNIQUE] Checking the `P_TRACED` flag via `sysctl`.
- [PREREQ] Access to `getppid()` and `sysctl()` system APIs.
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| PID | Expected PPID | `1` | `/sbin/launchd` |
| Flag | P_TRACED | `0x00000800` | (Inferred from standard headers) |
| Event Code | RASP | `EVT_ENV_DEBUGGER` | Triggered on detection |
| Address Range | PPID Check | `0x10071F420 – 0x10071F474` | SingPass binary |
| Address Range | sysctl Check | `0x100151668 – 0x100151730` | SingPass binary |

## In-Depth Walkthrough
- **PPID Verification**
  - The app checks its parent process ID using `getppid()`.
  - On a standard iOS device, the parent should be `launchd` (PID 1).
  - If `ppid != 1`, the `EVT_ENV_DEBUGGER` event is triggered. [V]
- **sysctl P_TRACED Check**
  - The app uses `sysctl` to retrieve process information (`KERN_PROC_PID`).
  - It inspects `info.kp_proc.p_flag` for the `P_TRACED` bit.
  - If set, it indicates a debugger is attached, triggering `EVT_ENV_DEBUGGER`. [V]

## Code Snippets
### PPID Check (Conceptual)
```cpp
static constexpr pid_t LAUNCHD_PID = 1;
pid_t ppid = getppid();
if (ppid != LAUNCHD_PID) {
  // Trigger EVT_ENV_DEBUGGER
}
```
> **Context:** `getppid` may be called via libc or direct syscall. [V]

### sysctl Check (Conceptual)
```cpp
int names[] = {
  CTL_KERN,
  KERN_PROC,
  KERN_PROC_PID,
  getpid(),
};
kinfo_proc info;
int sizeof_info = sizeof(kinfo_proc);
int ret = sysctl(names, 4, &info, &sizeof_info, nullptr, nullptr);
if (info.kp_proc.p_flag & P_TRACED) {
  // Trigger EVT_ENV_DEBUGGER
}
```
> **Source line:** [V]

## Known Bypass & Mitigation Vectors
### Vector 1: Hooking getppid
*   **Action:** Force return value `1`.

### Vector 2: Hooking sysctl
*   **Action:** Intercept `KERN_PROC_PID` queries and clear the `P_TRACED` bit in the returned `kinfo_proc` structure.

## What This Article Does NOT Cover
- Advanced anti-debug like `ptrace` with `PT_DENY_ATTACH`.
- Thread-specific debug register checks.
