---
type: hub
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/26-01-dexprotector/
author: Romain Thomas
published: 2026-01-04
llm_summary: "A semantic router for DexProtector analysis, covering its multi-stage bootstrap, custom ELF loading, key derivation, DEX/string encryption, and asset protection mechanisms."
---

# DexProtector Analysis Hub

DexProtector is a post-build security solution for Android and iOS that provides obfuscation, RASP, and integrity controls.

## Analysis Chunks

| Section | Description |
|---|---|
| [[wiki/protectors/dexprotector/bootstrap-loading-chain\|1. Bootstrap & Loading Chain]] | Analysis of the `Protected<suffix>` class, `libdpboot.so`, and the custom ELF loader `libdexprotector.so`. |
| [[wiki/protectors/dexprotector/custom-elf-loader-mechanisms\|2. Custom ELF Loader]] | Identification of the `DPLF` magic, packed payload locations, and `liblinker.so` internals. |
| [[wiki/protectors/dexprotector/key-derivation-binding\|3. Key Derivation & Binding]] | How DexProtector binds keys to APK signatures, DEX files, and linker states (`rtld_db_dlactivity`). |
| [[wiki/protectors/dexprotector/class-encryption-anti-dump\|4. Class Encryption & Anti-Dump]] | Processing of `classes.dex.dat` and the `munmap`-based anti-dumping mechanism. |
| [[wiki/protectors/dexprotector/string-encryption-integrity\|5. String Encryption]] | Native-backed string decryption (`ProtectedLiveNetTV.s`) with function address integrity binding. |
| [[wiki/protectors/dexprotector/method-field-hiding\|6. Method & Field Hiding]] | Indirect access via `LibLiveNetTV.i` and the `dp.mp3` mapping file. |
| [[wiki/protectors/dexprotector/deobfuscation-redex-passes\|7. Deobfuscation (Redex)]] | Orchestrating Redex passes to strip string encryption and hidden access layers. |
| [[wiki/protectors/dexprotector/asset-protection-vtable-hooking\|8. Asset Protection]] | Intercepting `android::_FileAsset` via vtable manipulation in `libandroidfw.so`. |
| [[wiki/protectors/dexprotector/rasp-root-detection-binder\|9. RASP & Root Detection]] | Standard RASP features and raw Binder-based package enumeration to bypass `PackageManager` hooks. |
| [[wiki/protectors/dexprotector/annexes-unprotected-apps\|10. Annexes]] | List of apps successfully unprotected and identified file markers. |

## Related Topics
- [[wiki/rasp/_index|Runtime Application Self-Protection (RASP)]]
- [[wiki/protectors/singpass-rasp-analysis-hub|SingPass RASP Analysis]]
