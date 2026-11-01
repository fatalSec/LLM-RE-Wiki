# WRITE MODE — Compile Pipeline

> **Load when:** `compile` command. **Prerequisite:** `core-rules.md`
> **See also:** [schemas/](schemas/) | [index-formats.md](index-formats.md)

---

## 1. Content Type Router

Classify the raw file, then load the matching schema from `.kb/schemas/`.

| Priority | Type | Signals | Schema |
|---|---|---|---|
| 1 | Pentest finding | CVSS, finding title, recommendation | `pentest-finding.md` |
| 2 | Malware analysis | IOC tables, family name, C2 | `malware-analysis.md` |
| 3 | Research paper | Abstract, citations, DOI | `research-paper.md` |
| 4 | API / SDK doc | Function signatures, param tables | `api-reference.md` |
| 5 | Analysis notes | First-person, hypothesis language | `analysis-notes.md` |
| 6 | Blog / writeup | Narrative walkthrough, dated | `blog-writeup.md` |

**Tiebreaker:** Highest priority wins. If the file covers two distinct domains, split per §3 and assign each chunk its own schema. Multi-topic files (3+ distinct `##` domains) → split per §3 first.

---

## 2. Compile Steps

**ZERO-LOSS DIRECTIVE:** Never summarize. Preserve ALL offsets, hex, registers, paths, syscalls, bypass scripts, and code verbatim.

1. **Read** entire raw file. **Extract a pre-flight checklist** of all `##` headings, technical mechanisms, and code blocks.
2. **Images:** Process per §4. Extract text before writing.
3. **Classify** → select schema (§1).
4. **Pre-flight plan:** Determine layout: **Cohesive Subject Module** (preferred for <1,200 words per §3) or **Hub + Semantic Chunks** (for massive multi-stage deep dives).
5. **Load schema** from `.kb/schemas/<type>.md`.
6. **YAML metadata:** Write required fields and a dense 1-2 sentence `llm_summary`.
7. **Write article(s)** per schema. Check off headings and code from the step 1 checklist as you write.
8. **Update topic `_index.md`:** Add a 1-line link and summary under the parent topic index.
9. **Cross-link:** Link every new article from ≥1 existing article or index.
10. **Coverage check:** Confirm every heading, mechanism, and code block from the step 1 checklist is present in the output. Re-read raw text only if a missing item requires verification.
11. **Rename** raw file: append `_processed`.
12. **Automated Indexing & Graph Sync:** Run deterministic indexer:
    ```bash
    python3 .kb/scripts/index_builder.py
    ```
    *(Automatically compiles `_tools-index`, `_snippets-index`, `_patterns-index`, `_ttp-index`, validates links, and syncs `graph_data.js`).*
13. **Log** to `knowledge_base/wiki/log.md`:
```markdown
## [YYYY-MM-DD] compile | <source>
- Type: <type> | Articles created: <list> | Updated: <list>
- Indexes updated: auto (index_builder.py) | Graph: yes
- Markers: [V] default | [I]×N [U]×N [AI]×N | Open questions: N
```

---

## 3. Architecture: Cohesive Modules vs. Hub + Chunks

To maximize token efficiency and prevent "chunk bloat," choose the layout based on target scope:

| Layout | When to Use | Structure |
|---|---|---|
| **Cohesive Subject Module** *(Recommended)* | Single target, challenge, or writeup under ~1,200 words | 1 rich article with semantic anchor headings (`### Mechanism {#anchor}`). Keeps detection + bypass together. |
| **Hub + Semantic Chunks** | Massive multi-stage systems (>1,200 words) or multi-domain tooling (e.g. DexProtector 5-stage chain) | `_hub.md` decision router + 1 chunk per decoupled phase/mechanism. |

### Cohesive Subject Module Pattern
Keep tightly coupled mechanisms (e.g. root check + debug check + bypass) in one document using explicit anchor headings:
```markdown
## 1. TracerPid Anti-Debug via /proc/self/status {#anti-debug}
... [Exact opcodes, syscalls, disassembly] ...

## 2. Frida Named-Pipe Detection {#anti-frida}
... [Exact thread checks, file descriptor scanning] ...

## Bypass & Neutralization Strategies {#bypass}
... [Frida scripts, LIEF patches] ...
```
Links can target specific mechanisms directly: `[[wiki/topic/subject#anti-debug|TracerPid Detection]]`.

### Hub + Chunk Layout (For Multi-Stage Systems)
```
wiki/<topic>/<subject>/
├── _hub.md              ← LLM decision router with 2-3 sentence summaries
├── bootstrap.md         ← Chunk: Stage 1 unpacking
├── anti-debug.md        ← Chunk: Stage 2 integrity checks
└── ...
```
Chunk filenames = mechanism only. Navigation at top of each chunk:
```markdown
[Hub]([[wiki/<topic>/<subject>/_hub]]) | [Prev](...) | [Next](...)
```

---

## 4. Image Handling

**Transcribe verbatim. Never summarize.** Images in `knowledge_base/raw/assets/<article>/<image>.<ext>`.

| Category | Action |
|---|---|
| `DISASSEMBLY` | Transcribe ALL instructions verbatim. Function name, addresses, symbols. |
| `DECOMPILED_CODE` | Transcribe CODE verbatim. Class + method. Flag: crypto, JNI, integrity. |
| `TOOL_OUTPUT` | Transcribe EVERY line verbatim. |
| `DIAGRAM` | Components, flow (`A → B → C`), security boundaries, all labels. |
| `HEX_DUMP` | Transcribe HEX verbatim with offsets and ASCII. |
| `SCREENSHOT` | Transcribe ALL text, versions, errors verbatim. |
| `DECORATIVE` | Skip. Write `> **[Image: decorative — skipped]**` |

Insert as: `> **[Image extracted — CATEGORY | confidence: high/low]**` + extracted content.
Low confidence: append `— verify against original source: <url>`.

---

## 5. Update Protocol

When new source overlaps an existing article:

1. **Diff** → identify genuinely new details.
2. **Merge inline** into existing sections. Tag: `[V: <new-source>]`.
3. **Contradictions** → `[X: see <article>]` on both claims. Add to Open Questions. Prefer higher-quality source per `core-rules.md` §2.3.
4. **Update YAML:** `last_verified`, `completeness`, add new `source`.
5. **Never create "Part 2"** — merge over proliferation.
