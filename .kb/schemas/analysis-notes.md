# Schema: Personal RE Notes / Analysis Notes

> **Use when:** Source is first-person notes, live reverse engineering observations, or experimental lab logs.
> **Common metadata:** See [_common-metadata.md](_common-metadata.md)

---

## Template

```markdown
---
type: analysis-notes
topic: wiki/<topic>/_index
source: <filename or "personal lab notes">
tags: [tag1, tag2]
target: <package name, binary name, or target subsystem>
analysis_date: YYYY-MM-DD
status: in-progress | complete | abandoned
bypass_status: complete | partial | failed | not-attempted
arch: [arm64, arm32, x86_64]
complexity: intermediate | advanced
completeness: stub | partial | complete
last_verified: YYYY-MM-DD
tool_versions: [<tool x.x, if applicable>]
attack_ttps: [<T-IDs, if mapped>]
llm_summary: "<A dense, 1-2 sentence summary of analysis findings, dead-ends, and working bypasses for direct LLM retrieval>"
---

# <Target Description or Subsystem> — Analysis Notes

## 1. Analysis Status & Key Takeaways
*   **[VERIFIED]** <Confirmed finding from dynamic or static testing> [V]
*   **[DEAD-END]** <Approach that definitively failed + reason why> [V]
*   **[HYPOTHESIS]** <Unconfirmed theory or pattern worth investigating> [I/U]
*   **Analysis Status:** in-progress | complete | abandoned
*   **Bypass Status:** complete | partial | failed | not-attempted

## 2. Low-Level Invariants & Verified Observations [V]
<!-- Verbatim offsets, opcodes, memory layouts, and symbols directly confirmed during analysis -->
| Metric / Target | Attribute | Observed Value | Significance / Notes |
|---|---|---|---|
| Memory Offset | `0x0001a690` | Background monitoring thread | Spawns status checker |
| Syscall / Symbol | `openat` / `read` | `/proc/self/status` | Byte-per-byte TracerPid read |
| Register State | `W0` == `0x1` | Anti-Frida trigger gate | Return check for thread name |

- **Step-by-Step Observations:**
  - Observed action 1 [V]
  - Observed action 2 [V]

## 3. Dead Ends & Failed Approaches
<!-- CRITICAL: Prevents repeating failed work in subsequent analysis sessions -->
| Attempted Approach | Specific Failure Symptom | Why It Failed | Confidence |
|---|---|---|---|
| Hooking `libc.so!read` | App instantly crashes (SIGSEGV) | Syscall called inline via SVC instruction, not libc export | High |
| Patching `.rodata` string | Checksum verification aborts | Second thread verifies SHA256 of text segment | High |

## 4. Working Techniques & Proof-of-Concepts {#working-techniques}
```<language>
// Runnable code snippet, Frida script, or patch that succeeded in lab testing
```
*   **Context:** <Exact conditions and timing required for this snippet to work>
*   **Caveats:** <Version dependencies, OS limitations, or stability concerns>
*   **Tested On:** <Target device, OS version, architecture, and tool versions>

## 5. Hypotheses & Follow-up Items [I/U]
- **Hypothesis 1:** <Educated guess regarding protection mechanism and justification> [I]
- **Testing Plan:** <Next step to validate or refute hypothesis>

## 6. Scope Boundaries & Open Questions
- **What This Article Does NOT Cover:** <Untested subsystems, architectures, or app versions>
- **Open Questions:** <Unresolved behaviors or unexplored constructor functions>
- **Related Articles:** [[wiki/patterns/<pattern>]] | [[wiki/techniques/<technique>]]
```

---

## Key Rules for This Schema

### Schema-Specific Fields
| Field | Required | Notes |
|---|---|---|
| `target` | Yes | Target package name, binary name, or target subsystem |
| `analysis_date` | Yes | Date analysis was conducted (YYYY-MM-DD) |
| `status` | Yes | `in-progress` \| `complete` \| `abandoned` |
| `bypass_status` | Yes | `complete` \| `partial` \| `failed` \| `not-attempted` — crucial for retrieval routing |
| `arch` | Conditional | Architecture tested (`[arm64, arm32, x86_64]`) |

### Content Rules
- **Dead Ends is the Most Valuable Section:** Explicitly record what did *not* work and *why* to prevent wasting tokens or hours re-testing dead avenues.
- **Strict Provenance Separation:** Separate `[V]` verified observations from `[I/U]` hypotheses.
- **Redaction:** Redact proprietary or sensitive client names if necessary, but keep package identifiers and technical symbols intact.
