# Schema: Personal RE Notes / Analysis Notes

> **Use when:** Source is first-person notes, live reverse engineering observations, experimental lab logs, or a filed KB answer (`answer-*.md`).
> **Common metadata:** See [_common-metadata.md](_common-metadata.md)
> **Placeholders:** Everything in `<angle brackets>` is a placeholder. Replace it with values from the source, or delete the line. Never invent values.

---

## Template

```markdown
---
type: analysis-notes
topic: wiki/<topic>/_index
sources: [<raw filename or "personal lab notes">]
tags: [<tag>, <tag>]
target: <package name, binary name, or subsystem>
analysis_date: <YYYY-MM-DD>
status: <in-progress | complete | abandoned>
bypass_status: <complete | partial | failed | not-attempted>
arch: [<arm64 | arm32 | x86_64>]
complexity: <intermediate | advanced>
completeness: <stub | partial | complete>
last_verified: <YYYY-MM-DD>
tool_versions: [<Tool x.y>]
attack_ttps: [<T####.###>]
llm_summary: "<Target + findings + what worked, key terms first, 1-2 sentences>"
---
<!-- Omit arch, tool_versions, or attack_ttps if the notes don't mention them. -->

# <Target or Subsystem> — Analysis Notes

## 1. Key Takeaways
- **[VERIFIED]** <finding confirmed by static or dynamic testing>
- **[DEAD-END]** <approach that failed, and why>
- **[HYPOTHESIS]** <unconfirmed theory worth testing> [I]

## 2. Verified Observations {#observations}
<!-- Verbatim offsets, opcodes, memory layouts, and symbols confirmed during analysis. -->
| Invariant | Exact Value | Significance |
|---|---|---|
| <offset / syscall / symbol / register state> | `<verbatim value>` | <what it means for the analysis> |

- **Step-by-step:**
  1. <observed action>
  2. <observed action>

<!-- MANDATORY: transcribe screenshots, debugger output, or IDA views where they appear. -->
> **[Image extracted — <CATEGORY> | confidence: <high | low>]**
> <verbatim transcription>

## 3. Dead Ends & Failed Approaches {#dead-ends}
<!-- The most valuable section: stops anyone from repeating failed work. -->
| Attempted Approach | Failure Symptom | Why It Failed (confidence) |
|---|---|---|
| <what was tried> | <crash, abort, no effect…> | <root cause> (<high / medium / low>) |

## 4. Working Techniques & PoCs {#working-techniques}
```<language>
<runnable script or patch that worked, verbatim>
```
- **Context:** <exact conditions and timing required>
- **Caveats:** <version dependencies, OS limits, stability>
- **Tested On:** <device, OS version, architecture, tool versions>

## 5. Hypotheses & Next Steps
- **Hypothesis:** <educated guess and why> [I]
- **Test Plan:** <how to confirm or refute it>

## 6. Scope Boundaries & Open Questions
- **Not Covered:** <untested subsystems, architectures, or app versions>
- **Open Questions:** <unresolved behaviors> [U]
- **Related:** [[wiki/<topic>/<article>#<anchor>|<label>]]
```

---

## Key Rules for This Schema

### Schema-Specific Fields
| Field | Required | Notes |
|---|---|---|
| `target` | Yes | Package name, binary name, or subsystem |
| `analysis_date` | Yes | When the analysis was done (YYYY-MM-DD) |
| `status` | Yes | `in-progress` \| `complete` \| `abandoned` |
| `bypass_status` | Yes | `complete` \| `partial` \| `failed` \| `not-attempted` |
| `arch` | Conditional | Only if native code was analyzed |

### Content Rules
- **Dead Ends matter most:** record what did *not* work and *why*.
- **Keep observations and guesses apart:** verified observations go in §2; anything unconfirmed is marked `[I]` or `[U]`.
- **Filed answers (`answer-*.md`):** keep every `[AI Synthesis]` marker exactly as filed; never upgrade it to verified.
- **Redaction:** remove client names if needed, but keep package identifiers and technical symbols intact.
