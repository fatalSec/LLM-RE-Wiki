# Schema: Blog Post / Writeup / Tutorial

> **Use when:** Source is a narrative walkthrough, dated technical blog, or CTF writeup.
> **Common metadata:** See [_common-metadata.md](_common-metadata.md)
> **Placeholders:** Everything in `<angle brackets>` is a placeholder. Replace it with values from the source, or delete the line. Never invent values.

---

## Template

```markdown
---
type: blog
topic: wiki/<topic>/_index
sources: [<URL>]
tags: [<tag>, <tag>]
arch: [<arm64 | arm32 | x86_64>]
complexity: <beginner | intermediate | advanced>
completeness: <stub | partial | complete>
last_verified: <YYYY-MM-DD>
tool_versions: [<Tool x.y>]
attack_ttps: [<T####.###>]
author: <name or handle>
published: <YYYY-MM-DD>
reproducibility: <verified-by-me | unverified | likely-outdated>
llm_summary: "<Target + technique + bypass, key terms first, 1-2 sentences>"
---
<!-- Omit arch, tool_versions, or attack_ttps if the source doesn't mention them. -->

# <Title / Target System>

<!-- Only for multi-part Hub + Chunk series: [[wiki/<topic>/<subject>/_hub|Hub]] | [[<prev-chunk>|Prev]] | [[<next-chunk>|Next]] -->

## 1. Target Context & Key Takeaways
- **Core Question:** <what problem or challenge this writeup solves>
- **Core Technique:** <primary protection or evasion mechanism, one line>
- **Prerequisites:** <environment, tools, prior knowledge>
- **Key Gotcha:** <where tools or bypasses fail> [VS: <version>]

## 2. Low-Level Technical Invariants
<!-- MANDATORY: every offset, constant, register, syscall, and path from the source, verbatim. -->
| Invariant | Exact Value | Context & Purpose |
|---|---|---|
| <offset / constant / register / syscall / path> | `<verbatim value>` | <what it does or gates> |

## 3. Mechanism Deep Dive {#<mechanism-anchor>}
<!-- Cohesive Module with 2+ mechanisms: repeat this section as 3.1, 3.2… each with its own {#anchor}. -->
- **Execution Flow:**
  1. <step, with verbatim function names and symbols>
  2. <step, with register operations, stack state, or memory checks>

### Disassembly & Image Transcriptions
<!-- MANDATORY: transcribe every image (IDA/Ghidra views, hex dumps, tool output) where it appears in the source. -->
> **[Image extracted — <CATEGORY> | confidence: <high | low>]**
> <function name / context>
```text
<verbatim instructions, addresses, and comments>
```

## 4. Bypass & Mitigation Vectors {#bypass}
### Vector 1: <Approach, e.g. Frida hook> {#<vector-anchor>}
```<language>
<complete, runnable code verbatim from the source>
```
- **Target Point:** <hooked symbol, method signature, or offset>
- **Result:** <changed behavior, spoofed return value, register change>
- **Tested Environment:** <tool versions, OS, architecture>

### Vector 2: <Approach, e.g. static patch> {#<vector-anchor>}
- **Target Offset:** `<offset>`
- **Original Instruction:** `<instruction>`
- **Patched Instruction:** `<instruction>`
- **Notes:** <instruction length, Thumb mode, checksums, re-signing>

## 5. Scope Boundaries & Open Questions
- **Gotchas / Silent Failures:** <failure modes, version differences> [VS: <version>]
- **Not Covered:** <explicit scope boundary> — see [[wiki/<topic>/<article>]]
- **Open Questions:** <claims from the source that couldn't be confirmed> [U]
- **Related:** [[wiki/<topic>/<article>#<anchor>|<label>]]
```

---

## Key Rules for This Schema

### Schema-Specific Fields
| Field | Required | Notes |
|---|---|---|
| `author` | Yes | Author name or handle |
| `published` | Yes | Original publication date (YYYY-MM-DD) |
| `reproducibility` | Yes | `verified-by-me` \| `unverified` \| `likely-outdated` |
| `arch` | Conditional | Only if native binaries are analyzed |
| `attack_ttps` | Conditional | Only if the source maps to MITRE ATT&CK |

### Content Rules
- **Invariants table is mandatory:** log every offset, checksum, register, syscall number, and path exactly.
- **Bypass section is mandatory:** document how the check was defeated (hook, patch, or spoofing).
- **Verbatim only:** offsets, opcodes, registers, and code are never paraphrased or shortened.
- **Pin versions:** blogs age fast; a technique for one Frida or Android version may fail on the next.
