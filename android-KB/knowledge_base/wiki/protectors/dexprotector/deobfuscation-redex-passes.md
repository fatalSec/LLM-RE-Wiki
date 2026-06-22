---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/26-01-dexprotector/
tags: [android, dexprotector, deobfuscation, redex]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2026-01-04
reproducibility: unverified
llm_summary: "Orchestrating Redex passes to automatically strip DexProtector's string encryption and hidden access layers from DEX files."
---

# Deobfuscation (Redex)

[Hub]([[wiki/protectors/dexprotector-hub]]) | [Prev]([[wiki/protectors/dexprotector/method-field-hiding]]) | [Next]([[wiki/protectors/dexprotector/asset-protection-vtable-hooking]])

## This Article Answers
- How can Redex be used to reverse DexProtector's obfuscation?
- What custom Redex passes are needed for string and method restoration?

## Key Takeaways
- [TECHNIQUE] Using Redex's abstract interpretation and type inference to identify obfuscated calls. [V]
- [TECHNIQUE] Automated string restoration using `se.dat`. [V]
- [TECHNIQUE] Automated method/field restoration using `dp.mp3`. [V]
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Tool | Framework | Redex | Facebook's DEX optimizer |
| Pass Name | Custom | `StringEncryption` | Restores `ProtectedLiveNetTV.s` calls |
| Pass Name | Custom | `RecoverHiddenAccess` | Restores `LibLiveNetTV.i` calls |
| File Dependency | String Recovery| `se.dat.clear` | Decrypted version of the string asset |
| File Dependency | Access Recovery| `dp.mp3` | Mapping file for hidden members |

## In-Depth Walkthrough
- **Redex Pass Orchestration**
  - To strip the protection, custom passes are integrated into a standard Redex pipeline. [V]
  - Example config [V]:
    ```json
    "passes": [
      "StringEncryption",
      "RecoverHiddenAccess",
      "PeepholePass",
      "ConstantPropagationPass",
      "LocalDcePass"
    ]
    ```
- **The Restoration Logic**
  - **`StringEncryption` Pass**: Identifies calls to the decryption wrapper, lookups the index in the (pre-decrypted) `se.dat.clear`, and replaces the call with the original `const-string`. [V]
  - **`RecoverHiddenAccess` Pass**: Identifies calls to the native bridge, resolves the method/field via `dp.mp3`, and replaces the bridge call with the appropriate `invoke-virtual`, `invoke-static`, `get-field`, etc. [V]
- **Verification**
  - Comparing `classes2.decrypted.dex` (before Redex) with `classes2.unprotected.dex` (after Redex) shows a complete return to standard Java bytecode. [V]

## Code Snippets
### Redex Configuration
```json
{
  "RecoverHiddenAccess": {
    "info": "/path/to/dp.mp3"
  },
  "StringEncryption": {
    "se_dat_file": "/path/to/se.dat.clear"
  }
}
```
> **Context:** Configuration for custom Redex passes to ingest DexProtector metadata.
> **Source line:** [V]

## What This Article Does NOT Cover
- Compiling Redex with custom passes.
- Handling of control-flow flattening (if present).
