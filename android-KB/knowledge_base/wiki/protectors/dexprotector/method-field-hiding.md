---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/26-01-dexprotector/
tags: [android, dexprotector, hide-access, jni, dp-mp3]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2026-01-04
reproducibility: unverified
llm_summary: "Analysis of DexProtector's method and field access hiding, utilizing a native bridge and the assets/dp.mp3 mapping file."
---

# Method & Field Access Hiding

[Hub]([[wiki/protectors/dexprotector-hub]]) | [Prev]([[wiki/protectors/dexprotector/string-encryption-integrity]]) | [Next]([[wiki/protectors/dexprotector/deobfuscation-redex-passes]])

## This Article Answers
- How does DexProtector hide calls to sensitive Android APIs (e.g., `getPackageName`)?
- What is the structure of the `assets/dp.mp3` file?

## Key Takeaways
- [TECHNIQUE] Replacing direct method/field access with a native bridge function (e.g., `LibLiveNetTV.i`). [V]
- [TECHNIQUE] Resolving target APIs via a mapping file `assets/dp.mp3`. [V]
- [PREREQ] Understanding JNI's `FindClass`, `GetMethodID`, and `CallObjectMethod` flow. [V]
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| File Path | Access Map | `assets/dp.mp3` | Encrypted/Compressed mapping data |
| Function Name | Bridge | `LibLiveNetTV.i(int, ...)` | Native invocation bridge |
| Struct Section | `dp.mp3` | Elements Array | Maps index to name/signature/class |
| Struct Section | `dp.mp3` | Classes Array | References to owning classes |
| Struct Section | `dp.mp3` | Strings Pool | Literals for all names and signatures |

## In-Depth Walkthrough
- **Invocation Redirection**
  - Direct calls like `context.getPackageName()` are transformed into `LibLiveNetTV.i(1465, context)`. [V]
  - The first parameter is a unique index (`1465`).
- **`dp.mp3` Mapping Resolution**
  - During initialization, `libdp.so` decrypts and decompresses `dp.mp3`. [V]
  - The index `1465` is used as an index into the **Elements Array** within `dp.mp3`. [V]
  - This resolves to the triple: `android/content/Context`, `getPackageName`, `()Ljava/lang/String;`. [V]
- **Native Execution**
  - The bridge function then uses the JNI to find the class, get the method ID, and perform the invocation:
    - `env->FindClass(...)`
    - `env->GetMethodID(...)`
    - `env->CallObjectMethod(...)` [V]

## Low-Level Technical Details [V]

### `dp.mp3` Layout
> **[Image extracted — DIAGRAM | confidence: high]**
> ```text
> 1. Header: Hashes + counts
> 2. Elements Array: {name_idx, sig_idx, class_idx}
> 3. Classes Array: {string_pool_idx}
> 4. Strings Pool: "getPackageName", "()Ljava/lang/String;", etc.
> ```

## Known Bypass & Mitigation Vectors
### Vector 1: Bridge Reversal
*   **Action:** Parse `dp.mp3` and automatically replace all calls to the bridge function with the original Java instructions. (See [[wiki/protectors/dexprotector/deobfuscation-redex-passes]]).

## What This Article Does NOT Cover
- Performance overhead of JNI-based indirect access.
- Static fields vs. Instance methods resolution logic.
