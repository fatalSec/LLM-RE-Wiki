---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/22-08-singpass-rasp-analysis/
tags: [ios, rasp, jailbreak-detection, syscalls]
complexity: intermediate
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2022-08-29
reproducibility: unverified
llm_summary: "Jailbreak detection in SingPass using multiple system calls (stat, open, fopen) to verify the existence of common jailbreak artifacts and specific unc0ver indicators."
---

# Jailbreak Detection (Files)

[Hub]([[wiki/rasp/singpass-rasp-analysis-hub]]) | [Prev]([[wiki/rasp/singpass/anti-debug-checks]]) | [Next]([[wiki/rasp/singpass/environment-checks]])

## This Article Answers
- What files does SingPass check for jailbreak detection?
- Which system calls are used to perform these checks?

## Key Takeaways
- [TECHNIQUE] Using a variety of filesystem syscalls (and wrappers) to check for artifacts.
- [TECHNIQUE] Attempting to unmount `/.installed_unc0ver` to detect the unc0ver jailbreak.
- [GOTCHA] Not all strings are decrypted at the same time; some are decrypted just-in-time in temporary variables.
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Helper Offset | `pathconf` | `0x100008EB0 -- 0x100008F28` | Helper function range |
| Helper Offset | `utimes` | `0x10000D8D4 -- 0x10000D948` | Helper function range |
| Helper Offset | `stat` | `0x100012188 -- 0x10001221C` | Helper function range |
| Helper Offset | `open` | `0x10002D478 -- 0x10002D4D8` | Helper function range |
| Helper Offset | `fopen` | `0x1000474E4 -- 0x100047554` | Helper function range |
| Helper Offset | `stat64` | `0x10006AA30 -- 0x10006AAD8` | Helper function range |
| Helper Offset | `getfsstat64` | `0x1047E82C -- 0x10047E914` | Helper function range |
| File Path | unc0ver Check | `/.installed_unc0ver` | Targeted for unmount check |
| Event Code | RASP | `EVT_ENV_JAILBREAK` | Triggered on detection |

## In-Depth Walkthrough
- **Filesystem Artifact Checks**
  - The obfuscator checks for the existence of files and directories associated with jailbreaks (Cydia, Sileo, etc.).
  - It uses both direct syscalls and "helper" functions at specific offsets. [V]
- **JIT String Decryption**
  - Some strings (like jailbreak paths) are only decrypted right before use.
  - To recover these, one must hook functions like `fopen` or `utimes` and dump the `__data` section immediately after the call. [V]
- **unc0ver Specific Check**
  - A unique check for `unc0ver` involves trying to unmount a specific file.
  - Command: `_unmount("/.installed_unc0ver")` at offset `0x100E4D814`. [V]

## Code Snippets
```cpp
// unc0ver check at 0x100E4D814
_unmount("/.installed_unc0ver")
```
> **Context:** Specific logic to detect the unc0ver jailbreak environment.
> **Source line:** [V]

## Known Bypass & Mitigation Vectors
### Vector 1: Hooking Syscalls/Helpers
*   **Action:** Intercept all file-related calls (`stat`, `open`, etc.) and return "not found" (e.g., `ENOENT`) for known jailbreak paths.

## What This Article Does NOT Cover
- The full list of checked paths (see [[wiki/rasp/singpass/annexes-jb-artifacts]]).
- Bypassing the `unmount` check specifically.
