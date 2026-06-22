---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/22-08-singpass-rasp-analysis/
tags: [ios, rasp, environment-checks, code-lifting]
complexity: intermediate
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2022-08-29
reproducibility: unverified
llm_summary: "SingPass environment validation via HOME directory, dyld image names, and executable paths to detect code lifting or execution in non-standard iOS environments."
---

# Environment Checks

[Hub]([[wiki/rasp/singpass-rasp-analysis-hub]]) | [Prev]([[wiki/rasp/singpass/jailbreak-detection-files]]) | [Next]([[wiki/rasp/singpass/advanced-detections]])

## This Article Answers
- How does SingPass detect if it is running in a non-standard environment (e.g., emulator or lifted code)?
- What environment variables are inspected?

## Key Takeaways
- [TECHNIQUE] Verifying the `HOME` environment variable.
- [TECHNIQUE] Checking the image name of the main executable via `_dyld_get_image_name(0)`.
- [TECHNIQUE] Using `_NSGetExecutablePath` to verify the execution path.
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Env Var | `HOME` | `/Users` | Trigger if starts with (indicates macOS/lifting) |
| Env Var | `HOME` | `mobile` | Trigger if NOT equal (indicates non-mobile user) |
| Image Path | Prefix | `/private/var/folders` | Trigger if matches (indicates temporary/lifted env) |
| Event Code | RASP | `EVT_ENV_JAILBREAK` | Triggered on detection |
| Offset | `startswith` logic| `0x100015684` | Implementation via XOR/OR sequence |

## In-Depth Walkthrough
- **Code Lifting Detection**
  - The obfuscator checks if the app is running in standard iOS locations.
  - If `_dyld_get_image_name(0)` starts with `/private/var/folders`, it triggers `EVT_ENV_JAILBREAK`. [V]
  - If `_NSGetExecutablePath` returns a path starting with `/private/var/folders`, it also triggers. [V]
- **User/Home Validation**
  - If `getenv("HOME")` starts with `/Users`, it suggests the app is running on macOS (code lifting), triggering detection. [V]
  - If `getenv("HOME")` is NOT `mobile`, it indicates a non-standard iOS user environment. [V]
- **Implementation Detail: `startswith()`**
  - Implemented as a succession of XOR operations that are "OR-ed" to produce a boolean, likely a compiler optimization. [V]
  - Location: `0x100015684`. [V]

## Code Snippets
```cpp
if (strncmp(_dyld_get_image_name(0), "/private/var/folders", 0x14)) {
  -> Trigger EVT_ENV_JAILBREAK
}

if (strncmp(getenv("HOME"), "/Users", 6) == 0) {
  -> Trigger EVT_ENV_JAILBREAK
}

if (strncmp(getenv("HOME"), "mobile", 6) != 0) {
  -> Trigger EVT_ENV_JAILBREAK
}
```
> **Context:** Hardcoded environment expectations for standard iOS production devices.
> **Source line:** [V]

## Known Bypass & Mitigation Vectors
### Vector 1: Hooking getenv
*   **Action:** Force `HOME` to return `/var/mobile` (or just `mobile` depending on the check).

### Vector 2: Hooking dyld functions
*   **Action:** Intercept `_dyld_get_image_name` and `_NSGetExecutablePath` to return standard App Store paths.
