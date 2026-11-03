# Schema: Research Paper

> **Use when:** Source has abstract, academic citations, methodology section, empirical evaluations, or DOI.
> **Common metadata:** See [_common-metadata.md](_common-metadata.md)

---

## Template

```markdown
---
type: research-paper
topic: wiki/<topic>/_index
source: <URL or DOI>
tags: [tag1, tag2]
authors: [<Last, First et al.>]
published: "<Venue, Year>"
doi_url: <link>
arch: [arm64, arm32, x86_64, all]
attack_ttps: [T1xxx]
complexity: intermediate | advanced
completeness: stub | partial | complete
last_verified: YYYY-MM-DD
tool_versions: [<if applicable>]
llm_summary: "<A dense, 1-2 sentence summary of the paper's core findings and practical applicability to Reverse Engineering for direct LLM retrieval>"
---

# <Paper Title>

## 1. Paper Overview & Key Takeaways
<!-- Self-contained. Must answer 80% of technical queries without reading further. -->
*   **[FINDING]** <Core empirical or theoretical result in 1-2 lines> [V]
*   **[LIMITATION]** <Most significant technical limitation identified by the authors> [V]
*   **[RE-APPLICABILITY]** <Exact practical relevance to modern Reverse Engineering / bypass work> [I]

## 2. Problem Statement & Motivation
- **Gap Addressed:** <What technical problem or evasion pattern does this paper investigate?> [V]
- **Failure of Existing Approaches:** <Why current static/dynamic analysis tools fail on this problem> [V]

## 3. Methodology & System Architecture
- **Proposed Approach:** <Core algorithm, instrumentation technique, or formal model> [V]
- **Target Dataset & Environment:** <Number of APKs/binaries analyzed, Android versions, test devices> [V]
- **Frameworks & Tools Built:** <Names, open-source status, and architecture of tools introduced> [V]

## 4. Low-Level Invariants & Empirical Findings [V]
<!-- Capture concrete formulas, detection rates, performance overheads, or memory invariants -->
| Metric / Invariant | Evaluated Value | Baseline / Ground Truth | Significance / Notes |
|---|---|---|---|
| Detection Accuracy | `98.4%` | `72.1%` (Commercial RASP) | True positive rate on obfuscated samples |
| Runtime Overhead | `< 4.2ms` | Standard execution | Tracing overhead per basic block |
| Core Syscall / API | `sys_ptrace` | `PTRACE_TRACEME` | Specific hook point analyzed |

## 5. Practical Reverse Engineering Applicability
<!-- Most important section for this KB: translating academic theory into actionable RE techniques -->
- **Actionable Techniques:** <Concrete tools, scripts, or heuristic rules that can be used immediately> [V/I]
- **Informed Wiki Topics:** Which security mechanisms or attack patterns this enhances: [[wiki/topic/article]]
- **Proof-of-Concept / Usage Patterns:**
```<language>
// Runnable snippet, hook, or deobfuscation script introduced in the paper
```

## 6. Scope Boundaries & Open Questions
- **Limitations Stated by Authors:** <Author-acknowledged constraints, e.g. "Only evaluated on AArch64"> [V]
- **What This Paper Does NOT Cover:** <Explicit scope boundary, e.g. "Commercial packers using virtualization">
- **Open Questions / Unverified Claims:** <Claims requiring independent laboratory verification>
- **Related Articles:** [[wiki/topic/article]] — reason for relationship
```

---

## Key Rules for This Schema

### Schema-Specific Fields
| Field | Required | Notes |
|---|---|---|
| `authors` | Yes | YAML array of author names (e.g. `[Smith, John, Doe, Jane et al.]`) |
| `published` | Yes | Publication venue and year (e.g. `"USENIX Security 2024"`, `"IEEE S&P 2023"`) |
| `doi_url` | Conditional | DOI link or ArXiv URL. Required if paper is indexed. |
| `attack_ttps` | Conditional | Mapped MITRE ATT&CK TTPs evaluated in the paper |

### Content Rules
- **Focus on RE Applicability:** Academic papers often emphasize formal proofs; extract the concrete offsets, algorithms, and practical tooling.
- **Preserve Empirical Data Verbatim:** Retain exact sample counts, detection rates, and benchmark timings.
- **Maintain Clear Boundaries:** Declare limitations explicitly in Section 6.
