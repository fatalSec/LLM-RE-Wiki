---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/22-08-singpass-rasp-analysis/
tags: [ios, rasp, sip, sandbox-api, apple-silicon]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2022-08-29
reproducibility: unverified
llm_summary: "Advanced detection in SingPass using CSR status (SIP) and private Sandbox API calls to identify Apple Silicon (M1) environments and macOS-specific paths."
---

# Advanced Detections (SIP & Sandbox)

[Hub]([[wiki/rasp/singpass-rasp-analysis-hub]]) | [Prev]([[wiki/rasp/singpass/environment-checks]]) | [Next]([[wiki/rasp/singpass/code-symbol-table-integrity]])

## This Article Answers
- How does SingPass detect if it's running on an Apple M1/Silicon Mac?
- What private iOS APIs are used for environment fingerprinting?

## Key Takeaways
- [TECHNIQUE] Using `__csrctl` to check for `CSR_ALLOW_UNTRUSTED_KEXTS` (SIP status).
- [TECHNIQUE] Using the private `__mac_syscall` with the "Sandbox" policy.
- [TECHNIQUE] Verifying existence of macOS-specific paths like `/opt/homebrew/bin/brew`.
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Syscall | `__csrctl` | `CSR_ALLOW_UNTRUSTED_KEXTS` | Detects disabled SIP (M1/macOS) |
| Syscall | `__mac_syscall` | `"Sandbox"` | Private API for path existence |
| File Path | M1/macOS | `/opt/homebrew/bin/brew` | Homebrew path on Apple Silicon |
| File Path | M1/macOS | `/usr/local/bin/brew` | Homebrew path on Intel |
| File Path | M1/macOS | `/Applications/Xcode.app/...` | Xcode path |
| Address Range | CSR Check | `0x100004640 – 0x1000046B8` | SingPass binary |
| Address Range | Sandbox Check | `0x100ED7684` | Helper function |
| Event Code | RASP | `EVT_ENV_JAILBREAK` | Triggered on detection |

## In-Depth Walkthrough
- **SIP Status (KEXTS)**
  - The obfuscator checks System Integrity Protection (SIP) via `__csrctl`.
  - Specifically, it looks for the `CSR_ALLOW_UNTRUSTED_KEXTS` flag. [V]
  - This is likely used to detect if the app is running on an Apple M1/Silicon Mac where this flag might be deactivated for certain tasks. [V]
- **Sandbox API & Path Probing**
  - The app uses `__mac_syscall` with the "Sandbox" argument to probe for paths.
  - Operation: `file-test-existence` with `SANDBOX_FILTER_PATH`. [V]
  - Checked paths include OSX-related directories (Xcode, Homebrew).
  - It also uses the Sandbox attribute `file-read-metadata` as an alternative to `stat()`. [V]
  - These checks aim to ensure the code hasn't been "lifted" to a macOS environment.

## Code Snippets
### CSR Status Check
```cpp
csr_config_t buffer = 0;
if (__csrctl(CSR_ALLOW_UNTRUSTED_KEXTS, buffer, sizeof(csr_config_t)) {
  /* SIP is disabled with CSR_ALLOW_UNTRUSTED_KEXTS */
  // -> Trigger EVT_ENV_JAILBREAK
}
```
> **Source line:** [V]

### Sandbox API Check
```cpp
int ret = __mac_syscall("Sandbox", /* Sandbox Check */ 2,
                        getpid(), "file-test-existence", SANDBOX_FILTER_PATH,
                        "/opt/homebrew/bin/brew");
```
> **Source line:** [V]

## Known Bypass & Mitigation Vectors
### Vector 1: Syscall Hooking
*   **Action:** Intercept `__csrctl` and return 0 (success/protected).
*   **Action:** Intercept `__mac_syscall` for the "Sandbox" policy and return "not found" for macOS-specific paths.

## What This Article Does NOT Cover
- Detailed breakdown of all `__csrctl` flags.
- Apple's policy compliance regarding private `Sandbox` syscall usage.
