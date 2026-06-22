---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/22-08-singpass-rasp-analysis/
tags: [ios, rasp, frida-stalker, thread-state, pc-check]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2022-08-29
reproducibility: unverified
llm_summary: "Detecting Frida Stalker by inspecting the current thread's PC via thread_get_state() and verifying its location relative to libsystem_kernel.dylib."
---

# Thread State PC Check (EVT_CODE_TRACING)

[Hub]([[wiki/rasp/singpass-rasp-analysis-hub]]) | [Prev]([[wiki/rasp/singpass/code-tracing-frida-stalker]]) | [Next]([[wiki/rasp/singpass/app-loaded-libraries-integrity]])

## This Article Answers
- How does SingPass use `thread_get_state` to detect code tracing?
- Why does the Stalker cause the thread PC to appear outside of standard libraries?

## Key Takeaways
- [TECHNIQUE] Using `thread_get_state` to retrieve the `ARM_UNIFIED_THREAD_STATE`. [V]
- [TECHNIQUE] Calculating the distance between the thread's PC (`__pc`) and a known system function (`mach_msg`). [V]
- [GOTCHA] The Stalker executes code from its own code cache, causing the PC to point outside of the expected library range. [V]
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| System Call | `thread_get_state`| `ARM_UNIFIED_THREAD_STATE` | Retrieves register state |
| Reference Func | `mach_msg` | Base for distance check | `&mach_msg` |
| Threshold | Max Delta | `0x4000` | Max distance from `mach_msg` allowed |
| Event Code | RASP | `0x2000` | `EVT_CODE_TRACING` |

## In-Depth Walkthrough
- **Thread State Retrieval**
  - The app calls `thread_get_state` for the current thread. [V]
  - It populates an `arm_unified_thread_state` structure.
- **PC Location Verification**
  - It extracts the Program Counter: `state->ts_64.__pc`.
  - It calculates the absolute delta between the current PC and the address of `mach_msg`:
    - `delta = abs(state->ts_64.__pc - &mach_msg)` [V]
- **The Stalker Detection**
  - If `delta > 0x4000`, the PC is considered to be outside of `libsystem_kernel.dylib`. [V]
  - When the Frida Stalker is active, it executes code from a dedicated code cache. If the Stalker is currently following system calls, the PC will reflect the cache location rather than the original library, triggering the check. [V]

## Code Snippets
### PC Integrity Check (Conceptual)
```cpp
thread_read_t target = pthread_mach_thread_np(pthread_self());
uint32_t count = ARM_UNIFIED_THREAD_STATE_COUNT;
arm_unified_thread_state state;
thread_get_state(target, ARM_UNIFIED_THREAD_STATE, &state, &count);

const auto mach_msg_addr = reinterpret_cast<uintptr_t>(&mach_msg);
const uintptr_t delta = abs(state->ts_64.__pc - mach_msg_addr);

if (delta > 0x4000) {
  // Trigger EVT_CODE_TRACING
}
```
> **Source line:** [V]

## Known Bypass & Mitigation Vectors
### Vector 1: Stalker Exclusion
*   **Action:** Use `gum_stalker_exclude(stalker, "libsystem_kernel.dylib")`. [V]
*   **Result:** The Stalker will stop following the thread when it enters `libsystem_kernel.dylib`, ensuring the PC remains within the library (and thus within the `0x4000` threshold) during the check. [V]

## What This Article Does NOT Cover
- Bypassing by hooking `thread_get_state` directly.
- Other libraries checked via similar PC distance logic.
