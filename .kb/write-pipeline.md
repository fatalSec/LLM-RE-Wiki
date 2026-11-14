# WRITE MODE — Compile Pipeline

> **Load when:** `compile` command. **Prerequisite:** `core-rules.md`
> **See also:** [schemas/](schemas/) | [index-formats.md](index-formats.md)

---

## 0. Batch Compile — One Subagent per Raw File

**Use when** `compile` names two or more files, names no file ("compile", "compile all"), or more than one file is pending. For a single named file, skip to §1.

**Why:** each source must be compiled in its own context. Reading several RE writeups into one context overflows it, and the model starts mixing offsets, opcodes, and scripts between sources.

### Orchestrator (the session that received `compile`)

1. **List, don't read.** Pending files = `knowledge_base/raw/feeds/*.md` whose name doesn't end in `_processed`. Use `ls` / `wc -l` only. **Never open the contents of a raw file in the orchestrator.**
2. **Spawn one subagent per file** with the worker prompt below (Claude Code: `Agent` tool; OpenCode: `task` tool; any agent with subagents). Run them in parallel if your platform allows it; with a local model, run them one after another — each still in a fresh subagent.
3. **Keep only the reports.** Don't read the new articles in full; the reports are enough for step 4.
4. **After every worker has finished**, do the shared steps yourself, one at a time:
   1. **Protector profiles (§2 step 9):** for each report with a protector delta, load `.kb/schemas/protector-profile.md`, re-read the profile from disk (or create it), and apply the delta. Apply deltas for the same protector one after another, merging rows per the schema's rules.
   2. **Batch cross-links (§2 step 8):** where reports show overlap (same protector, technique, or tool), link the new articles to each other. Read only the frontmatter and the heading you link to.
   3. **Index (§2 step 12):** run `index_builder.py` once and fix any errors it reports.
   4. **Log (§2 step 13):** one log entry per source, filled from its report.
5. **Failures:** if a worker fails or times out, its raw file stays without `_processed`. Don't compile it in the orchestrator — list it in your reply so the user can rerun `compile <file>`.

**No subagents available?** Compile the files one at a time with the full §2 pipeline: never read file N+1 before file N is renamed `_processed`. Tell the user that one file per session is safer for large batches.

### Worker prompt

Pass this verbatim, replacing `<file>`:

```text
You are a KB Custodian batch worker. Read AGENTS.md and follow its compile
pipeline (.kb/write-pipeline.md §1–§5) for exactly one raw file:
<file>

Batch-worker rules:
- Read no other file in knowledge_base/raw/feeds/.
- Run §2 steps 1–8, 10 and 11. Skip step 9 (protector profile), step 12
  (index_builder.py) and step 13 (log) — the orchestrator does those.
- Do not edit anything under knowledge_base/wiki/protectors/ or log.md.
- Other workers run at the same time. Before editing an existing article,
  re-read it and make a targeted edit; never rewrite a file you didn't create.
- Reply with this report only — no article text:

source: <file>
type: <type>
articles created: <paths>
articles updated: <paths>
llm_summary: <path>: <llm_summary>   (one line per created article)
protector delta: none | <Product name>
  fingerprints: <indicator> | `<exact value>` | <version> | [[link#anchor]]
  mechanisms: <name> | <category> | <version> | <bypass status> | `<key invariant>` | [[link#anchor]]
  versions: <version> | <first seen> | <what changed> | [[link]]
  bypasses: <approach> | <what it neutralizes> | <version> | [[link#anchor]]
markers: [I]×N [U]×N [AI]×N | open questions: N
coverage: complete | missing: <checklist items>
```

The worker loads `core-rules.md`, this file, and its schema itself (via `AGENTS.md`), so it follows the same rules as a single-file compile.

---

## 1. Content Type Router

Classify the raw file, then load the matching schema from `.kb/schemas/`.

| Priority | Content | Signals | Schema file | `type:` value |
|---|---|---|---|---|
| 1 | Pentest finding | CVSS, finding title, recommendation | `pentest-finding.md` | `pentest-finding` |
| 2 | Malware analysis | IOC tables, family name, C2 | `malware-analysis.md` | `malware-analysis` |
| 3 | Research paper | Abstract, citations, DOI | `research-paper.md` | `research-paper` |
| 4 | API / SDK doc | Function signatures, param tables | `api-reference.md` | `api-doc` |
| 5 | Analysis notes | First-person, hypothesis language, filed answers (`answer-*.md`) | `analysis-notes.md` | `analysis-notes` |
| 6 | Blog / writeup | Narrative walkthrough, dated | `blog-writeup.md` | `blog` |

**Placeholders:** every `<…>` in a template is a placeholder. Fill it from the source or delete the line — never copy placeholder text or invent values.

**Protector profiles** (`protector-profile.md`, `type: protector-profile`) are not in this router: they are derived pages, updated in step 9 *after* the source is compiled with its own schema.

**Tiebreaker:** Highest priority wins. If the file covers two distinct domains, split per §3 and assign each chunk its own schema. Multi-topic files (3+ distinct `##` domains) → split per §3 first.

---

## 2. Compile Steps

**ZERO-LOSS DIRECTIVE:** Never summarize. Preserve ALL offsets, hex, registers, paths, syscalls, bypass scripts, and code verbatim.

**Faithfulness rules** (apply to every article):
- **Markers:** don't write `[V]` on content from the primary source — it is the default. Never combine markers (`[V][U]`, `[V][I]`). Anything the source does not state is `[I]` (your deduction) or `[AI Synthesis]` (general knowledge), never `[V]`. Full rules: `core-rules.md` §2.1.
- **Code:** only put code in an article if it appears in the source (or is transcribed from a source image). If the source has none — e.g. it links to a repo — write `No code in source; implementation: <repo link>`. Any code you reconstruct goes in a block whose first line is a `[AI Synthesis]` comment, and never cites the source or repo as its origin.
- **Verbatim text:** copy unusual source text exactly (odd headings, sign-offs, typos). Don't "fix" it or guess why it looks that way; at most add a neutral note such as *"heading appears as `</last word>` in the source"*.

1. **Read** entire raw file. **Extract a pre-flight checklist** of all `##` headings, technical mechanisms, and code blocks.
2. **Images:** Process per §4. Extract text before writing.
3. **Classify** → select schema (§1).
4. **Pre-flight plan:** Determine layout: **Cohesive Subject Module** (preferred for <1,200 words per §3) or **Hub + Semantic Chunks** (for massive multi-stage deep dives).
5. **Load schema** from `.kb/schemas/<type>.md`.
6. **YAML metadata:** Write required fields, `sources: [<url or file>]`, and a dense 1-2 sentence `llm_summary` with the most searchable terms first (its first ~120 characters go into the master index).
7. **Write article(s)** per schema. Check off headings and code from the step 1 checklist as you write.
8. **Cross-link:** Link every new article from ≥1 related existing article, and link out to related articles. (Do **not** edit any index file — they are generated in step 12.)
9. **Protector profile:** If the source *analyzes* the mechanisms of a named commercial protector, packer, obfuscator, or RASP product (not just mentions one), load `.kb/schemas/protector-profile.md` and create or update `wiki/protectors/<protector-slug>.md`: add or update one mechanism row per mechanism (with the version and a `[[link#anchor]]` to the new article), extend the version timeline, fingerprints, and bypass list, and append the source to `sources:`. Link the new article back to the profile. Skip this step otherwise.
10. **Coverage check:** Confirm every heading, mechanism, and code block from the step 1 checklist is present in the output. Re-read raw text only if a missing item requires verification.
11. **Rename** raw file: append `_processed`.
12. **Automated Indexing & Graph Sync:** Run the deterministic indexer and fix any errors it reports:
    ```bash
    python3 .kb/scripts/index_builder.py
    ```
    *(Regenerates `_master-index`, `_tools-index`, `_ttp-index`, validates links and frontmatter, and syncs `graph_data.js`.)*
13. **Log** to `knowledge_base/wiki/log.md`:
```markdown
## [YYYY-MM-DD] compile | <source>
- Type: <type> | Articles created: <list> | Updated: <list>
- Indexes updated: auto (index_builder.py) | Graph: yes | Protector profile: <created / updated / none>
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
[[wiki/<topic>/<subject>/_hub|Hub]] | [[<prev-chunk>|Prev]] | [[<next-chunk>|Next]]
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
Only write a `DECORATIVE` line for an image that actually exists in the source.

**Image links must be rewritten.** Raw files link images as `../assets/<slug>/<image>` (relative to `raw/feeds/`). That path is wrong from inside `wiki/`. Rewrite it relative to the article's own folder so it points into `knowledge_base/raw/assets/`:

| Article location | Image link |
|---|---|
| `wiki/<topic>/<article>.md` | `../../raw/assets/<slug>/<image>` |
| `wiki/<topic>/<subject>/<chunk>.md` (hub chunk) | `../../../raw/assets/<slug>/<image>` |

`index_builder.py` reports any local image link whose file doesn't exist as an error.

---

## 5. Update Protocol

When new source overlaps an existing article:

1. **Diff** → identify genuinely new details.
2. **Merge inline** into existing sections. Tag: `[V: <new-source>]`.
3. **Contradictions** → `[X: see <article>]` on both claims. Add to Open Questions. Prefer higher-quality source per `core-rules.md` §2.3.
4. **Update YAML:** `last_verified`, `completeness`, and append the new source to `sources:` (never replace existing entries).
5. **Never create "Part 2"** — merge over proliferation.
