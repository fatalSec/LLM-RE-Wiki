---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/22-08-singpass-rasp-analysis/
tags: [ios, rasp, obfuscation-identification]
complexity: beginner
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2022-08-29
reproducibility: unverified
llm_summary: "Identification of the commercial obfuscator NuDetectSDK in the SingPass binary using grep for internal logging patterns."
---

# SingPass RASP Identification

[Hub]([[wiki/rasp/singpass-rasp-analysis-hub]]) | Next]([[wiki/rasp/singpass/rasp-strings-callback]])

## This Article Answers
- How to identify the obfuscator used in SingPass?
- What are the primary binaries involved in RASP?

## Key Takeaways
- [TECHNIQUE] Grepping for unique logging/internal strings in the application bundle.
- [PREREQ] Decrypted Mach-O binary (SingPass).
- [GOTCHA] Obfuscator names may be redacted in public writeups but patterns remain visible.
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| File Path | Bundle | `Frameworks/NuDetectSDK.framework/NuDetectSDK` | Framework using the same obfuscator |
| Binary | Main | `SingPass` | Main application binary containing RASP checks |
| String Pattern | Internal API | `+++++++ThreatLogAPI(headers:)` | Logging prefix used by the obfuscator |
| String Pattern | Internal API | `+++++++CallbackHandler(context:)` | Callback handler prefix |

## In-Depth Walkthrough
- **Identification of Obfuscator**
  - Use `grep` to search for unique markers in the install directory.
  - Command: `iPhone:/private/[...]/SingPass.app root# grep -Ri +++++++ *` [V]
  - Results show matches in both `NuDetectSDK.framework` and the main `SingPass` binary.
- **Threat Detection Strings**
  - Grepping the binary for the same marker reveals RASP-related APIs.
  - Command: `$ SingPass.app strings ./SingPass|grep -i +++++++` [V]
  - Discovered strings:
    - `+++++++ThreatLogAPI(headers:)`
    - `+++++++CallbackHandler(context:)`

## Code Snippets
```text
iPhone:/private/[...]/SingPass.app root# grep -Ri +++++++ *
Binary file Frameworks/NuDetectSDK.framework/NuDetectSDK matches
Binary file SingPass matches

$ SingPass.app strings ./SingPass|grep -i +++++++
+++++++ThreatLogAPI(headers:)
+++++++CallbackHandler(context:)
```
> **Context:** Initial reconnaissance to identify the protection vendor and entry points.
> **Source line:** [V]

## What This Article Does NOT Cover
- The specific name of the commercial obfuscator (redacted in source).
- Deep analysis of `NuDetectSDK` internals.
