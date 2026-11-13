# Schema: Research Paper

> **Use when:** Source has an abstract, academic citations, a methodology section, empirical evaluation, or a DOI.
> **Common metadata:** See [_common-metadata.md](_common-metadata.md)
> **Placeholders:** Everything in `<angle brackets>` is a placeholder. Replace it with values from the source, or delete the line. Never invent values.

---

## Template

```markdown
---
type: research-paper
topic: wiki/<topic>/_index
sources: [<DOI or URL>]
tags: [<tag>, <tag>]
authors: ["<First Last>", "<First Last>"]
venue: "<Conference or journal YYYY>"
doi_url: <DOI or arXiv link>
arch: [<arm64 | arm32 | x86_64 | all>]
attack_ttps: [<T####.###>]
complexity: <intermediate | advanced>
completeness: <stub | partial | complete>
last_verified: <YYYY-MM-DD>
tool_versions: [<Tool x.y>]
llm_summary: "<Core finding + practical RE applicability, key terms first, 1-2 sentences>"
---
<!-- Omit tool_versions, arch, or attack_ttps if the paper doesn't mention them. -->

# <Paper Title>

## 1. Overview & Key Takeaways
<!-- Self-contained: should answer most questions without reading further. -->
- **[FINDING]** <core result, 1-2 lines>
- **[LIMITATION]** <most significant limitation stated by the authors>
- **[RE-APPLICABILITY]** <practical relevance to reverse engineering or bypass work> [I]

## 2. Problem & Motivation
- **Gap Addressed:** <problem or evasion pattern investigated>
- **Why Existing Approaches Fail:** <limits of current tools>

## 3. Methodology & System
- **Approach:** <algorithm, instrumentation technique, or model>
- **Dataset & Environment:** <sample counts, OS versions, devices>
- **Tools Built:** <names, open-source status, architecture>

## 4. Empirical Findings {#empirical-findings}
<!-- Exact numbers, formulas, and invariants, verbatim. -->
| Metric / Invariant | Exact Value | Significance & Baseline |
|---|---|---|
| <metric, syscall, or invariant> | `<verbatim value>` | <what it shows, compared with what> |

## 5. Practical RE Applicability {#poc}
<!-- The most important section for this KB: turn theory into usable techniques. -->
- **Actionable Techniques:** <tools, scripts, or heuristics usable now> <[I] if inferred>
- **Related Wiki Topics:** [[wiki/<topic>/<article>]]
- **Proof of Concept:**
```<language>
<code from the paper or its repository, verbatim>
```

## 6. Scope Boundaries & Open Questions
- **Author-Stated Limitations:** <e.g. evaluated only on one architecture>
- **Not Covered:** <explicit scope boundary>
- **Open Questions:** <claims needing independent verification> [U]
- **Related:** [[wiki/<topic>/<article>]] — <reason>
```

---

## Key Rules for This Schema

### Schema-Specific Fields
| Field | Required | Notes |
|---|---|---|
| `authors` | Yes | YAML list, one full name per entry: `["John Smith", "Jane Doe"]` |
| `venue` | Yes | Conference or journal and year (e.g. `"USENIX Security 2024"`) |
| `doi_url` | Conditional | DOI or arXiv link if the paper has one |
| `attack_ttps` | Conditional | MITRE ATT&CK IDs evaluated in the paper. Omit if unmapped. |

### Content Rules
- **Focus on RE applicability:** extract concrete algorithms, offsets, and tooling, not proofs.
- **Numbers are verbatim:** keep exact sample counts, detection rates, and timings.
- **State limitations explicitly** in §6.
