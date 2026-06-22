---
type: blog
topic: wiki/rasp/_index
source: https://www.romainthomas.fr/post/26-01-dexprotector/
tags: [android, dexprotector, reference]
complexity: beginner
completeness: complete
last_verified: 2026-06-07
author: Romain Thomas
published: 2026-01-04
reproducibility: unverified
llm_summary: "List of applications and file markers identified during the DexProtector deep dive."
---

# DexProtector Annexes

[Hub]([[wiki/protectors/dexprotector-hub]]) | [Prev]([[wiki/protectors/dexprotector/rasp-root-detection-binder]])

## Target File Markers [V]
| Filename | Purpose |
| --- | --- |
| `se.dat` | Encrypted string repository |
| `resources.dat` | Protected resources |
| `mm.dat` | Metadata |
| `dp.mp3` | Method/Field hidden access map |
| `classes.dex.dat` | Encrypted/Compressed DEX container |
| `ic.dat` | Integrity check data |
| `ct.dat` | Context data |
| `rcdb.dat` | Resource database |

## Applications Successfully Unprotected [V]
| App | Version |
| --- | --- |
| `com.revolut.revolut` | `10.109.1` |
| `istark.vpn.starkreloaded` | `7.1-rc` |
| `com.dexprotector.detector.envchecks` | `2.1` |
| `ar.tvplayer.tv` | `5.2.0` |
| `org.unhcr.zakat` | `2.1.54` |
| `com.Hyatt.hyt` | `6.16.0` |
| `com.kms.free` | `11.129.4.14969` |
| `com.flashget.parentalcontrol` | `1.3.6.0` |
| `com.belongtail.ai` | `2.8.4` |
| `com.kidoprotect.app` | `11.1` |

> **Context:** All unprotection efforts were performed using the custom Redex passes and key recovery techniques described in this series. [V]
