# Schema: Blog Post / Writeup / Tutorial

> **Use when:** Source is a narrative walkthrough, dated technical blog, or CTF writeup.
> **Common metadata:** See [_common-metadata.md](_common-metadata.md)

---

## Template

```markdown
---
type: blog
topic: wiki/<topic>/_index
source: <URL>
tags: [tag1, tag2]
arch: [arm64, arm32, x86_64]
complexity: beginner | intermediate | advanced
completeness: stub | partial | complete
last_verified: YYYY-MM-DD
tool_versions: [Frida 16.x, Android 13]
attack_ttps: [T1629.003]
author: <name or handle>
published: YYYY-MM-DD
reproducibility: verified-by-me | unverified | likely-outdated
llm_summary: "<A dense, 1-2 sentence summary of the article's technique, targets, and core bypass for direct LLM retrieval>"
---
<!-- Note: Omit arch, tool_versions, or attack_ttps if not referenced in source. Do not leave placeholder text. -->

# <Title / Target System>

<!-- Optional: [Hub]([[wiki/<topic>/<hub-name>]]) | [Prev](...) | [Next](...) only for multi-part Hub+Chunk series; omit for Cohesive Modules -->

## 1. Target Context & Key Takeaways
*   **Core Question:** <What exact question or challenge does this analysis solve?> [V]
*   **Core Technique:** <Primary protection or evasion mechanism in 1 line> [V]
*   **Prerequisites:** <Required environment, tools, and prior knowledge> [V]
*   **Key Gotcha / Failure:** <Most critical point where tools or bypasses fail> [VS: x.x]
*   **Reproducibility:** verified-by-me | unverified | likely-outdated

## 2. Low-Level Technical Invariants [V]
<!-- MANDATORY: Capture exact binary, memory, network, and filesystem indicators verbatim. DO NOT summarize hex/offsets. -->
| Invariant / Indicator | Value / Primitive | Technical Context & Purpose |
|---|---|---|
| Memory Offset | `0x100E4CF38` | Base check comparison branch (`B.NE loc_crash`) |
| Hex / Constant | `0x3a5b6c7d` | Expected MurmurHash32 runtime integrity seed |
| Registers | `X11`, `X12` | Double register check verifying memory address bounds |
| System Call | `openat`, `read` | Byte-per-byte scan of `/proc/self/status` for TracerPid |
| File / Directory | `/sys/class/` | Path check scanning for root and su binaries |

## 3. Mechanism Deep Dive {#mechanism-name}
<!-- For Cohesive Modules covering 2+ mechanisms in one file, duplicate this section with anchors:
     ## 3.1 TracerPid Anti-Debug {#anti-debug}
     ## 3.2 Frida Thread & Pipe Detection {#anti-frida} -->
- **Execution Flow:**
  - Step 1: <Action with verbatim function names and symbols> [V]
  - Step 2: <Action with register operations, stack state, or memory locks> [V]

### Disassembly & Inlined Image Transcriptions
<!-- MANDATORY: Transcribe ALL images/screenshots (IDA/Ghidra graphs, hex dumps, tool outputs) verbatim where they appear -->
> **[Image extracted — DISASSEMBLY | confidence: high]**
> Function: `sub_1a690` (TracerPid status check):
```text
0x020ee0: MOV  X0, #-100        ; AT_FDCWD
0x020ee4: ADRP X1, #status_str   ; "/proc/self/status"
0x020ee8: SVC  #0               ; sys_openat
0x0231e8: SVC  #0               ; sys_read byte-by-byte
```

## 4. Known Bypass & Mitigation Vectors {#bypass}
<!-- Document how the mechanism was defeated or mitigated -->
### Vector 1: Dynamic Instrumentation (Frida Runtime Hook) {#frida-hook}
```javascript
// Complete, runnable code snippet verbatim from source
Memory.protect(Module.getExportByName(null, 'rtld_db_dlactivity'), 4, 'rwx');
Module.getExportByName(null, 'rtld_db_dlactivity').writeByteArray([0xc0, 0x03, 0x5f, 0xd6]);
```
*   **Target Point:** <Hooked method signature, symbol, or memory offset>
*   **Result / Manipulation:** <Expected behavior, register changes, or spoofed return values>
*   **Tested Environment:** <Tool versions, OS, Architecture>

### Vector 2: Static Binary / Assembly Patching {#static-patch}
*   **Target Offset:** `0x100E4CF38`
*   **Original Instruction:** `B.NE loc_crash`
*   **Patched Instruction:** `NOP` or `B loc_safe`
*   **Notes:** <Instruction length, thumb mode, CRC checksum, or signing concerns>

## 5. Scope Boundaries, Gotchas & Open Questions
- **Gotchas / Silent Failures:** <Silent failure modes or version discrepancies> [VS: x.x]
- **What This Article Does NOT Cover:** <Explicit scope boundary, e.g. "iOS-specific behavior — see [[wiki/other]]">
- **Open Questions / Unverified Claims:** <Claims from source that could not be independently confirmed>
- **Related Articles:** [[wiki/topic/article#anchor|Related Mechanism]]
```

---

## Key Rules for This Schema

### Schema-Specific Fields
| Field | Required | Notes |
|---|---|---|
| `author` | Yes | Author name or handle from the blog post |
| `published` | Yes | Original publication date (YYYY-MM-DD) |
| `reproducibility` | Yes | `verified-by-me` \| `unverified` \| `likely-outdated` — assesses real-world reliability |
| `arch` | Conditional | Architecture (`arm64`, `arm32`, `x86_64`) if native binaries are analyzed. Omit if not applicable. |
| `attack_ttps` | Conditional | MITRE ATT&CK Mobile/Enterprise IDs (e.g. `[T1629.003]`). Omit if not applicable. |

### Content Rules
- **Low-Level Invariants Table is Mandatory:** Any binary offset, checksum, register configuration, system call number, or file path must be logged exactly.
- **Bypass & Mitigation Section is Mandatory:** Document how the check was defeated (hooking, patching, or filesystem spoofing).
- **Verbatim Code & Opcodes:** Offsets, opcodes, registers, and bypass code must never be paraphrased or condensed.
- **Date is Critical:** Blogs age rapidly. A 2019 Frida technique may fail on Frida 16.x or Android 14. Always pin versions.
