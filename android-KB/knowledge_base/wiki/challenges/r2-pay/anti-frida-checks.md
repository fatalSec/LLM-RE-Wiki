---
type: blog
topic: wiki/rasp/_index
source: "https://www.romainthomas.fr/post/20-09-r2con-obfuscated-whitebox-part1/"
tags: [android, rasp, anti-frida, gmain, named-pipes, proc-fs]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2020-09-20
reproducibility: unverified
llm_summary: "Analysis of r2-pay's sophisticated anti-Frida checks, targeting gmain thread names and named pipes in /proc/self/fd."
---

# r2-pay Anti-Frida Checks

[Hub]([[wiki/challenges/r2-pay/r2-pay-challenge-hub]]) | [Prev]([[wiki/challenges/r2-pay/anti-debug-checks]]) | [Next]([[wiki/challenges/r2-pay/integrity-checks]])

## This Article Answers
- How does r2-pay detect the presence of Frida beyond simple map scanning?
- What are the unique indicators used to identify the Frida agent and server?

## Key Takeaways
- [TECHNIQUE] Searching for the `gmain` thread name in `/proc/self/task/<tid>/status`. [V]
- [TECHNIQUE] Inspecting named pipes and file descriptors in `/proc/self/fd/`. [V]
- [PREREQ] Understanding that Frida's communication relies on named pipes (e.g., `linjector`). [V]
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Thread Name | Indicator | `gmain` | Created by Frida's GLib runtime |
| Pipe Pattern | Indicator | `re.frida.server` | Found in symlinks of `/proc/self/fd/` |
| Pipe Pattern | Indicator | `linjector` | Part of Frida's injection path |
| Syscall | Link Read | `readlinkat` | Used to resolve `/proc/self/fd/` symlinks |
| Memory Offset | FD Check | `0x043448` | `readlinkat` call location |

## In-Depth Walkthrough
- **Thread Name Detection**
  - The thread `sub_1a690` iterates over all task statuses: `/proc/self/task/%s/status`. [V]
  - It searches for the name `gmain`. If found, the application crashes immediately. [V]
- **File Descriptor (Pipe) Detection**
  - The check iterates over `/proc/self/fd/%s` and uses `readlinkat` to inspect the target. [V]
  - It specifically flags paths containing `re.frida.server` or `linjector`. [V]
  - Example detected path: `/data/local/tmp/re.frida.server/linjector-500`.

## Code Snippets
### Frida Bypass via syscall instrumentation (QBDI)
```cpp
vm.addMnemonicCB("SVC", POST_INST, [] (VMInstanceRef vm, GPRState* gprState, ...) {
  if (gprState->x8 == __NR_readlinkat) {
    std::string buf = reinterpret_cast<char*>(gprState->x2);
    if (buf.find("re.frida.server") != std::string::npos) {
      static const std::string FAKE = "anon_inode:[eventfd]";
      memcpy((void*)gprState->x2, (void*)FAKE.c_str(), FAKE.size() + 1);
      gprState->x0 = FAKE.size() + 1;
    }
  }
});
```
> **Context:** Spoofing `readlinkat` results to hide Frida pipes.
> **Source line:** [V]

## Known Bypass & Mitigation Vectors
### Vector 1: Dynamic Thread Renaming
*   **Action:** Hook `pthread_setname_np` to prevent Frida threads from being named `gmain`.

### Vector 2: String/Syscall Patching
*   **Action:** Hook `snprintf` or `readlinkat` to redirect queries or spoof results. [V]

## What This Article Does NOT Cover
- Detections based on D-Bus signatures.
- Frida portal detection.
