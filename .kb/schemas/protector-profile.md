# Schema: Protector Profile

> **Use when:** A compiled source *analyzes* the mechanisms of a named commercial protector, packer, obfuscator, or RASP product (e.g. DexProtector, DexGuard, iXGuard, Promon SHIELD, VMProtect, Themida). A source that only *mentions* one does not count.
> **Not a raw-source type:** profiles are derived pages. Compile the source into its own article first (with its normal schema), then create or update the profile — see `write-pipeline.md` §2 step 9.
> **Location:** `knowledge_base/wiki/protectors/<protector-slug>.md` — one page per product, never one per version.
> **Common metadata:** See [_common-metadata.md](_common-metadata.md)
> **Placeholders:** Everything in `<angle brackets>` is a placeholder. Replace it with values from the linked articles, or delete the line. Never invent values.

---

## Template

```markdown
---
type: protector-profile
topic: wiki/protectors/_index
sources: [<URL of every contributing source>]
tags: [<protector-slug>, <category>, <platform>]
protector: <Product name>
vendor: <Vendor name or unknown>
aliases: [<other names used in sources>]
category: <rasp | packer | obfuscator | virtualizer | anti-tamper>
platforms: [<Android | iOS | Windows | Linux | macOS>]
versions_seen: [<x.y>]
complexity: <intermediate | advanced>
completeness: <stub | partial | complete>
last_verified: <YYYY-MM-DD>
llm_summary: "<Protector + platform + main mechanisms + bypass state, key terms first, 1-2 sentences>"
---

# <Product Name> — Protector Profile

> Cross-source summary. Exact offsets, code, and transcriptions live in the linked articles; this page links to them.

## 1. Overview
- **What it is:** <one line: category and what it protects>
- **Platforms / Versions seen:** <platforms> / <versions, oldest → newest>
- **Coverage:** <N> articles — <how complete the KB's picture is>

## 2. Identification & Fingerprints {#fingerprints}
<!-- How to recognize this protector in a sample. Exact values only. -->
| Indicator | Exact Value | Versions | Details |
|---|---|---|---|
| <library / class / string / section / file> | `<verbatim value>` | <x.y> | [[wiki/<topic>/<article>#<anchor>]] |

## 3. Protection Mechanisms {#mechanisms}
<!-- One row per mechanism. Every row links to the article it came from; a row without a link is marked [U]. -->
| Mechanism | Category | Versions Seen | Bypass Status | Key Invariant | Details |
|---|---|---|---|---|---|
| <name> | <anti-frida / anti-debug / root / integrity / encryption / obfuscation> | <x.y> | <bypassed / partial / not bypassed / unknown> | `<one exact value>` | [[wiki/<topic>/<article>#<anchor>]] |

## 4. Version Timeline {#versions}
| Version | First Seen | What Changed | Source |
|---|---|---|---|
| <x.y> | <YYYY-MM or unknown> | <new / removed / changed mechanisms> | [[wiki/<topic>/<article>]] |

## 5. Known Bypass Approaches {#bypass}
- **<Approach>** — <one line: what it neutralizes> · tested on <version> · [[wiki/<topic>/<article>#<anchor>]]

## 6. Contradictions & Open Questions
- <claim> [X: see [[wiki/<topic>/<article>]]]
- <unresolved question> [U]

## 7. Related
- [[wiki/<topic>/<article>|<label>]] — <relationship>
```

---

## Key Rules for This Schema

### Schema-Specific Fields
| Field | Required | Notes |
|---|---|---|
| `protector` | Yes | Product name as the vendor writes it |
| `vendor` | Yes | Vendor name, or `unknown` |
| `aliases` | Conditional | Other names seen in sources, so `rg` finds this page. Omit if none |
| `category` | Yes | `rasp` \| `packer` \| `obfuscator` \| `virtualizer` \| `anti-tamper` |
| `platforms` | Yes | Platforms the KB has evidence for |
| `versions_seen` | Yes | Every version mentioned by a linked article; `[unknown]` if none |
| `sources` | Yes | Union of the `sources` of every linked article |

### Content Rules
- **Summarize and link; never duplicate.** Each row holds one key exact value and a link. Full disassembly, scripts, and image transcriptions stay in the source article.
- **Every row is traceable:** it links to the article it came from, or is marked `[U]`.
- **Merge, don't append:** if a new source confirms an existing mechanism, update that row (add the version and link) instead of adding a duplicate row.
- **Disagreements:** when sources conflict on a mechanism or bypass status, keep both and mark `[X]`, and list it in §6.
- **Bypass status reflects the linked articles only** — never upgrade `unknown` to `bypassed` from general knowledge.
