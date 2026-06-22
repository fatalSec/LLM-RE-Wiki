---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/26-01-dexprotector/
tags: [android, dexprotector, bootstrap, elf-loader]
complexity: intermediate
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2026-01-04
reproducibility: unverified
llm_summary: "Detailed analysis of DexProtector's bootstrap sequence, from the injected Application class to the custom native ELF loader."
---

# DexProtector Bootstrap & Loading Chain

[Hub]([[wiki/protectors/dexprotector-hub]]) | [Next]([[wiki/protectors/dexprotector/custom-elf-loader-mechanisms]])

## This Article Answers
- How does DexProtector initialize itself in an Android app?
- What are the roles of `libdpboot.so` and `libdexprotector.so`?

## Key Takeaways
- [TECHNIQUE] Injecting a custom `Application` class (`Protected<suffix>`) to hijack `attachBaseContext`. [V]
- [TECHNIQUE] Multi-stage native loading: `libdpboot.so` -> `libdexprotector.so` -> `libdp.so`. [V]
- [PREREQ] Manifest manipulation to point `android:name` to the protected wrapper. [V]
- Reproducibility: unverified

## Low-Level Technical Invariants [V]
| Target / Metric | Attribute | Value / Details | Notes |
|---|---|---|---|
| Manifest Attribute | `android:name` | `com.playnet.androidtv.ProtectedLiveNetTV` | Entry point |
| Native Library | Stage 1 | `libdpboot.so` | Initial bootstrap and integrity |
| Native Library | Stage 2 | `libdexprotector.so` | Custom ELF loader |
| Function Name | Boot Check | `DeFcpynjg()` | Basic integrity check |
| Function Name | Loader Call | `oagfhBoAe()` | Native call to load `dexprotector` |

## In-Depth Walkthrough
- **Application Class Injection**
  - DexProtector replaces or wraps the main `Application` class in `AndroidManifest.xml`. [V]
  - Example: `android:name="com.playnet.androidtv.ProtectedLiveNetTV"`.
- **Initialization in `attachBaseContext`**
  - The `Protected` class overrides `attachBaseContext`. [V]
  - Execution order [V]:
    1. `DeFcpynjg()`: Performs a basic integrity check.
    2. `System.loadLibrary("dpboot")`: Loads the first stage native helper.
    3. `oagfhBoAe()`: A JNI wrapper that eventually calls `System.loadLibrary("dexprotector")`.
- **The Role of `libdexprotector.so`**
  - This library is a custom ELF loader (originally named `liblinker.so`). [V]
  - Its purpose is to decrypt and map the final protected payload (`libdp.so`) into memory.

## Code Snippets
### Manifest Entry
```xml
<application
  android:name="com.playnet.androidtv.ProtectedLiveNetTV">
</application>
```
> **Source line:** [V]

### Java Bootstrap
```java
public class ProtectedLiveNetTV extends Application {
  @Override
  protected void attachBaseContext(Context context) {
      super.attachBaseContext(context);
      try {
          DeFcpynjg(); // Basic integrity check
          System.loadLibrary("dpboot");
          oagfhBoAe(); // Load libdexprotector.so
      } catch (Throwable th) {
          ProtectedLiveNetTV$R$id.EfxsfkH(this, th);
      }
  }
}
```
> **Context:** Early initialization hijacking to prepare the native environment.
> **Source line:** [V]

## What This Article Does NOT Cover
- Internal decryption logic of `libdexprotector.so`.
- The specific implementation of the `DeFcpynjg` integrity check.
