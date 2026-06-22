---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/26-01-dexprotector/
tags: [android, dexprotector, string-encryption, integrity]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2026-01-04
reproducibility: unverified
llm_summary: "Technical breakdown of DexProtector's string encryption, including its reliance on assets/se.dat and its unique function-address-based integrity binding."
---

# String Encryption & Integrity

[Hub]([[wiki/protectors/dexprotector-hub]]) | [Prev]([[wiki/protectors/dexprotector/class-encryption-anti-dump]]) | [Next]([[wiki/protectors/dexprotector/method-field-hiding]])

## This Article Answers
- How does DexProtector decrypt strings at runtime?
- How is the string decryption process bound to the native function's integrity?

## Key Takeaways
- [TECHNIQUE] Replacing strings with calls to a native function (e.g., `ProtectedLiveNetTV.s`) using an encoded index. [V]
- [TECHNIQUE] Using `assets/se.dat` as a lookup table for string offsets. [V]
- [TECHNIQUE] Masking the crypto context with the memory address of the decryption function to prevent hooking. [V]
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| File Path | String Data | `assets/se.dat` | Encrypted string repository |
| Function Name | Decryptor | `ProtectedLiveNetTV.s(String)` | Example native decryption wrapper |
| Key Component | Decryption | Calling class `hashCode()` | Used as part of the nonce/key derivation |
| Key Component | Decryption | Decryption function address | Used to unmask the crypto context |
| Offset Source | `se.dat` | Encoded index | e.g. `0x5a7d` maps to a file offset |

## In-Depth Walkthrough
- **Decryption Process**
  - A call like `ProtectedLiveNetTV.s("\u5a7d")` passes an index (`0x5a7d`) to the native library. [V]
  - **Lookup**: The index is used to find a file offset in `assets/se.dat`. [V]
  - **Key Derivation**: The decryption key/nonce is derived from [V]:
    1. The string index itself.
    2. The `hashCode()` of the Java class making the call (e.g., `com.playnet.androidtv.BootReceiver`).
- **Function Address Integrity Binding**
  - The internal cryptographic context is masked using the **memory address** of the decryption function (`ProtectedLiveNetTV.s`). [V]
  - If an attacker replaces the function (e.g., via `env->RegisterNative` or symbol hooking), the new function address will differ.
  - The resulting unmasking will produce a corrupted crypto context, and the string will fail to decrypt. [V]

## Low-Level Technical Details [V]

### String Decryption Flow
> **[Image extracted — DIAGRAM | confidence: high]**
> ```text
> Input: index (0x5a7d) + Calling Class Hash
> -> Offset Lookup in se.dat
> -> Decrypt data with key(index, ClassHash)
> -> Output: "android.intent.action.BOOT_COMPLETED"
> ```

## Known Bypass & Mitigation Vectors
### Vector 1: Emulated Decryption
*   **Action:** Implement a decryption tool that mimics the `libdp.so` logic, providing the correct `hashCode` and handling the `se.dat` offsets.

## What This Article Does NOT Cover
- The specific encryption algorithm (standard vs. custom) used inside `se.dat`.
- Batch decryption strategies for entire DEX files.
