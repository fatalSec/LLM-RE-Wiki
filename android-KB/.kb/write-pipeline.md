# WRITE MODE — Compile Pipeline

> **Scope:** Processing raw files into structured wiki articles.
> **Load when:** User says `compile`, `compile <filename>`, or drops files in `knowledge_base/raw/`.
> **Prerequisite:** Read `core-rules.md` first.
> **See also:** [core-rules.md](core-rules.md) | [schemas/](schemas/) | [index-formats.md](index-formats.md)

---

## 1. Content Type Router

Read the raw file completely, then classify using this decision tree:

### Quick Classification

```
File has DOI / abstract / methodology?    → research-paper
File has CVSS / finding title?            → pentest-finding
File has IOC table / C2 / family name?    → malware-analysis
File has API signatures / param tables?   → api-reference
File is first-person / hypothesis?        → analysis-notes
File is narrative walkthrough + dated?    → blog-writeup
None of the above?                        → blog-writeup (most general)
```

### Full Classification Table

| Type | Primary signals | Schema file |
|---|---|---|
| Research paper | Abstract, citations, methodology section, DOI | `schemas/research-paper.md` |
| Blog / writeup | Narrative walkthrough, dated, author byline | `schemas/blog-writeup.md` |
| API / SDK doc | Function signatures, parameter tables, version header | `schemas/api-reference.md` |
| Pentest finding | CVSS score, finding title, recommendation section | `schemas/pentest-finding.md` |
| Personal RE notes | First-person, observations, hypothesis language | `schemas/analysis-notes.md` |
| Malware analysis | IOC tables, family name, C2 infrastructure | `schemas/malware-analysis.md` |
| Code only | Standalone script, no prose context | Index in `_snippets-index.md`, create minimal wrapper article |
| Large mixed file | >200 lines OR 3+ distinct `##` topic sections | Split first (§3), then apply per-chunk schema |

**After classifying:** Load the corresponding schema file from `.kb/schemas/` and use it as the template.

---

## 2. Standard Compile Steps

**CRITICAL RULE:** DO NOT SUMMARIZE OR CONDENSE. You must preserve all technical depth, code snippets, offsets, opcodes, and command outputs exactly as they appear in the raw file.

**THE ZERO-LOSS COMPILE DIRECTIVE:**
If the raw source contains any of the following details, they **MUST** be explicitly listed in the *Low-Level Technical Invariants* table and *Known Bypass & Mitigation Vectors* section of the schema. Summarizing them in generic text is considered a compilation failure:
1. Memory offsets (e.g. `0x100E4CF38`).
2. Hex values or cryptographic hashes (e.g., `0x3a5b6c7d`).
3. Register names and register operations (e.g., `FCMP D1, D0`, `X11`/`X12`).
4. Paths of files or directories queried (e.g., `/proc/self/status`).
5. System call numbers or library signatures.
6. Bypass commands, static patches, or hooking scripts.

For every raw file, execute in order:

1. **Read** entire file before writing anything.
2. **Process Images (MANDATORY)**: Scan the raw file for image links (e.g., `![...]`). If any images exist, you MUST immediately process them using your multimodal capabilities according to the rules in §4 (Image Handling). Extract the text/context first.
3. **Classify** type → select schema from §1.
4. **Pre-flight Plan** → BEFORE writing any files, output an execution plan: list the specific chunks to create, the hub file, and index files that need updating.
5. **Load Template**: Load the matching `.kb/schemas/<type>.md` file.
6. **Generate YAML Metadata**: Construct the metadata block as standard YAML Frontmatter at the very top of each article. Populate `llm_summary` with a dense, 1-2 sentence description.
7. **Write or update** wiki article(s) using the correct schema. *Preserve technical depth and inject the extracted image text exactly where the image appeared.*
8. **Update** that topic's `_index.md` (articles table + Quick Navigation).
9. **Consolidate API references & patterns** into a single high-density file, ensuring both signatures and code patterns are stored together (see `schemas/api-reference.md`).
10. **Update** all relevant cross-topic indexes (→ `index-formats.md`).
11. **Cross-link** every new article from at least one existing article.
12. **Automated Link Verification (MANDATORY)**: Parse the newly created/updated file(s) for any `[[wiki links]]` and verify that all targets exist. If any target is missing, compile it or create a placeholder stub immediately.
13. **Rename** raw file: append `_processed` (do not delete the source).
14. **Verification Loop:** Re-read the original raw file and compare it against your generated output. Verify that:
    - NO `##` headings or distinct topics were skipped.
    - NO code blocks, shell commands, or technical snippets were omitted.
    - If anything was missed, generate the missing articles/chunks and update the indexes before proceeding.
15. **Log** to `knowledge_base/wiki/log.md`:

```markdown
## [YYYY-MM-DD] compile | <filename or URL>
- Type classified as: <type>
- Articles created: <list>
- Articles updated: <list>
- Indexes updated: <list>
- Claim markers used: [V]×N [U]×N [I]×N
- Open questions filed: <count>
```

---

## 3. LLM-Optimized Knowledge Splitting & Navigation

**MANDATORY CONSTRAINT:** Do NOT write monolithic articles for multi-topic files. To ensure LLMs can easily navigate and ingest the knowledge without missing details or hitting context limits, you must split the content using the **Semantic Chunking & Linking** strategy.

1. **Semantic Chunk Boundaries:** Split the raw file by isolated technical domains (e.g., "Anti-Frida Checks", "Anti-Root Checks"). Do not split arbitrarily by line count.
2. **Bi-directional Navigation Chain:** Every chunk MUST include a simplified markdown navigation block at the very top of the article body (under the YAML block) to allow direct LLM traversal:
   ```markdown
   [Hub]([[wiki/android-re/<source-hub>]]) | [Prev]([[wiki/<topic>/<prev-chunk>]]) | [Next]([[wiki/<topic>/<next-chunk>]])
   ```
3. **High-Density LLM Structure:**
   - Preserve 100% of the technical details (opcodes, offsets, tool outputs, shell scripts) verbatim inside markdown fenced code blocks.
   - Convert long narrative paragraphs into concise bullet points.
   - Use deep markdown headers (`###`, `####`) to create logical syntax trees.
4. **Semantic Hub Article:** The Hub (`<source-name>-hub.md`) must act as an LLM decision router. For each chunk, write a technical summary describing exactly what data it holds.
5. **Cross-Pollinate Indexes:**
   - Add the Hub to `knowledge_base/wiki/_master-index.md` and its primary topic `_index.md`.
   - Add the individual chunks to their specific topic `_index.md` files.

---

## 4. Image Handling

**CRITICAL CONSTRAINT:** DO NOT SUMMARIZE IMAGES. You MUST physically transcribe the text, code, hex, or disassembly shown in the image VERBATIM.

Images referenced in raw articles are stored in `knowledge_base/raw/assets/`.
When compiling, images are processed and the extracted text is inlined into wiki articles.
Original images are NOT copied to `knowledge_base/wiki/` — only the extracted content is stored.

**Path convention:** `knowledge_base/raw/assets/<article-name>/<image-name>.<ext>`

### Step 1 — Classify (multimodal model required)

```
Classify this image from a mobile security / RE article as:
DISASSEMBLY | DECOMPILED_CODE | TOOL_OUTPUT | DIAGRAM | HEX_DUMP | SCREENSHOT | DECORATIVE
Reply with ONLY the category name.
```

### Step 2 — Extract by category

| Category | Extract |
|---|---|
| `DISASSEMBLY` | MANDATORY: Transcribe ALL instructions verbatim in fenced block tagged with arch. Function name, address range, all symbol refs. |
| `DECOMPILED_CODE` | MANDATORY: Transcribe CODE verbatim. Class + method name. Flag: crypto ops, network calls, reflection, JNI, integrity checks. |
| `TOOL_OUTPUT` | MANDATORY: Transcribe EVERY single line of text/output visible verbatim into a fenced block. |
| `DIAGRAM` | All components and what each represents. Flow as `A → B → C`. Security boundaries and trust zones. All labels preserved exactly. |
| `HEX_DUMP` | MANDATORY: Transcribe HEX verbatim. Include offsets and ASCII representations. |
| `SCREENSHOT` | MANDATORY: Transcribe ALL visible text, version strings, error messages verbatim. |
| `DECORATIVE` | Skip. Write `> **[Image: decorative — skipped]**` |

### Step 3 — Insert into article

```markdown
> **[Image extracted — CATEGORY | confidence: high/low]**
> <extracted content>
```

Low confidence: append `— verify against original source: <url/filename>`
