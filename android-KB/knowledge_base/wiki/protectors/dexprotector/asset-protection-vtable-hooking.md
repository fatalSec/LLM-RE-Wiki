---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/26-01-dexprotector/
tags: [android, dexprotector, asset-protection, vtable-hooking]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2026-01-04
reproducibility: unverified
llm_summary: "Analysis of DexProtector's asset protection via vtable manipulation of android::_FileAsset in libandroidfw.so to intercept file access calls."
---

# Asset Protection & vtable Hooking

[Hub]([[wiki/protectors/dexprotector-hub]]) | [Prev]([[wiki/protectors/dexprotector/deobfuscation-redex-passes]]) | [Next]([[wiki/protectors/dexprotector/rasp-root-detection-binder]])

## This Article Answers
- How does DexProtector protect non-DEX assets (e.g., SQLite databases, certificates)?
- Which native Android library is targeted for asset interception?

## Key Takeaways
- [TECHNIQUE] Manipulating the vtable of `android::_FileAsset` in `libandroidfw.so`. [V]
- [TECHNIQUE] Intercepting all virtual calls from `AssetManager.open()` (Java) and `AAssetManager_open()` (Native). [V]
- [TECHNIQUE] On-the-fly decryption and decompression of asset data. [V]
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Library | Interception | `libandroidfw.so` | Android Framework library |
| Class | Interception | `android::_FileAsset` | Internal C++ class for assets |
| API | Java | `AssetManager.open()` | Monitored entry point |
| API | Native | `AAssetManager_open()` | Monitored entry point |
| Config Tag | XML | `<resourceEncryption>` | Defines filters for assets/raw/strings |
| Offset Source | Header | File Header | Decryption keys/nonces often embedded in the file |

## In-Depth Walkthrough
- **vtable Manipulation**
  - During the initialization of `libdp.so`, it locates `libandroidfw.so` in memory.
  - It modifies the vtable for the `_FileAsset` class. [V]
  - This effectively hooks virtual functions like `read`, `seek`, and `getLength`.
- **Interception Mechanism**
  - When the app calls `AssetManager.open("chinook.db")`, the Framework's native logic eventually invokes the (now-hooked) `_FileAsset` methods. [V]
  - DexProtector intercepts these, reads the encrypted data from the APK, decrypts/decompresses it in memory, and returns the clear content to the caller. [V]
- **Key Distribution**
  - The decryption key and nonce are typically distributed across:
    1. The asset file's custom header. [V]
    2. A subkey derived from the master key. [V]

## Low-Level Technical Details [V]

### Encrypted vs Decrypted Asset (Hex)
> **[Image extracted — HEX_DUMP | confidence: high]**
> ```text
> Encrypted (chinook.db):
> 00000000  7c 96 af 76 c2 8b 88 b5  18 e6 d7 12 d1 8d f1 a5
> 
> Decrypted (chinook.decrypted.db):
> 00000000  53 51 4c 69 74 65 20 66  6f 72 6d 61 74 20 33 00
> ```
> *Context: Comparing high-entropy encrypted data with the "SQLite format 3" header after decryption.*

## Known Bypass & Mitigation Vectors
### Vector 1: Manual Decryption
*   **Action:** Extract the master key (see [[wiki/protectors/dexprotector/key-derivation-binding]]), derive the asset subkey, and parse the asset's header to perform offline decryption. [V]

## What This Article Does NOT Cover
- Hooking `nativeGetString` for `<strings>` tag protection.
- The specific vtable offsets for different Android versions.
