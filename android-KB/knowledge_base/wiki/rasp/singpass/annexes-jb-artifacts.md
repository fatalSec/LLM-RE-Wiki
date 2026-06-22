---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/22-08-singpass-rasp-analysis/
tags: [ios, jailbreak, artifacts, reference]
complexity: beginner
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2022-08-29
reproducibility: unverified
llm_summary: "Comprehensive reference list of jailbreak files, directories, and third-party packages checked by SingPass's RASP engine."
---

# SingPass RASP Annexes

[Hub]([[wiki/rasp/singpass-rasp-analysis-hub]]) | [Prev]([[wiki/rasp/singpass/rasp-design-weaknesses-bypass]])

## JB Detection Files [V]
| Path | Notes |
| --- | --- |
| `/.bootstrapped` | |
| `/.installed_taurine` | |
| `/.mount_rw` | |
| `/Library/dpkg/lock` | |
| `/binpack` | |
| `/odyssey/cstmp` | |
| `/odyssey/jailbreakd` | |
| `/payload` | |
| `/payload.dylib` | |
| `/private/var/mobile/Library/Caches/kjc.loader` | |
| `/private/var/mobile/Library/Sileo` | |
| `/taurine` | |
| `/taurine/amfidebilitate` | |
| `/taurine/cstmp` | |
| `/taurine/jailbreakd` | |
| `/taurine/jbexec` | |
| `/taurine/launchjailbreak` | |
| `/taurine/pspawn_payload.dylib` | |
| `/var/dropbear` | |
| `/var/jb` | |
| `/var/lib/undecimus/apt` | |
| `/var/motd` | |
| `/var/tmp/cydia.log` | |

## Flagged Packages / Apps [V]
| Path | Description |
| --- | --- |
| `/Applications/AutoTouch.app/AutoTouch` | Macro/Automation |
| `/Applications/iGameGod.app/iGameGod` | Memory Editor |
| `/Applications/zxtouch.app/zxtouch` | Touch Automation |
| `/Library/Activator/Listeners/me.autotouch.AutoTouch.ios8` | |
| `/Library/LaunchDaemons/com.rpetrich.rocketbootstrapd.plist` | RocketBootstrap |
| `/Library/LaunchDaemons/com.tigisoftware.filza.helper.plist` | Filza File Manager |
| `/Library/MobileSubstrate/DynamicLibraries/ATTweak.dylib` | |
| `/Library/MobileSubstrate/DynamicLibraries/GameGod.dylib` | |
| `/Library/MobileSubstrate/DynamicLibraries/LocalIAPStore.dylib` | IAP Cracking |
| `/Library/MobileSubstrate/DynamicLibraries/Satella.dylib` | IAP Cracking |
| `/Library/MobileSubstrate/DynamicLibraries/iOSGodsiAPCracker.dylib` | IAP Cracking |
| `/Library/MobileSubstrate/DynamicLibraries/pccontrol.dylib` | |
| `/Library/PreferenceBundles/SatellaPrefs.bundle/SatellaPrefs` | |
| `/Library/PreferenceBundles/iOSGodsiAPCracker.bundle/iOSGodsiAPCracker` | |

> **Context:** These lists were compiled by iterating over runtime dumps of the `__data` section after specific hooks (e.g., `fopen`, `stat`) triggered JIT decryption. [V]
