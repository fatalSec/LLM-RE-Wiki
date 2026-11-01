# READ MODE — Query Protocol

> **Scope:** How to navigate the KB efficiently and answer technical queries.
> **Load when:** User or consuming agent queries the KB.
> **Prerequisite:** Read `core-rules.md` first.
> **See also:** [core-rules.md](core-rules.md) | [index-formats.md](index-formats.md)

---

## Retrieval Protocols: Fast-Path vs. Discovery Path

Choose the retrieval route based on query specificity to minimize context token consumption:

```
┌────────────────────────────────────────────────────────┐
│                      Query Type                        │
├──────────────────────────┬─────────────────────────────┤
│  Specific Technique,     │  Fast-Path (1-2 Turns)      │
│  Tool, Function, or CVE  │  Direct search -> Read File │
├──────────────────────────┼─────────────────────────────┤
│  Broad, Exploratory,     │  Discovery Path             │
│  or Unknown Category     │  _master-index -> Topic     │
└──────────────────────────┴─────────────────────────────┘
```

### Route A: Fast-Path Retrieval (Preferred — 1-2 Turns)
1. **Targeted Search:** Search directly across `knowledge_base/wiki/` using keywords or tags:
   - Shell search: `rg -l -i "<keyword>" knowledge_base/wiki/` or check `llm_summary` in frontmatter.
2. **Direct Read:** Read the matched article or Cohesive Subject Module directly.
3. **Synthesis:** Jump straight to Step 4 (Response Composition).

### Route B: Discovery Path Traversal (Broad Queries)
1. **Route via Master Index:** Read `knowledge_base/wiki/_master-index.md` to identify the candidate topic directory (`wiki/<topic>/`).
2. **Navigate Topic Index:** Read `wiki/<topic>/_index.md` to select the specific module or hub.
3. **Read YAML & Module Content:** Read the targeted module, checking `tool_versions` and `llm_summary`.

---

## Response Composition (Single Consolidated Technical Document)

Compose **ONE seamless, highly granular technical document**. High-level abstract summaries are strictly forbidden. Every mechanism must be explained down to its exact function names, assembly opcodes, register operations, C/C++ structures, or JNI signatures.

### Formatting Rules:
1. **NO Separate Section Headers:** DO NOT output separate section headers like `## 📚 Knowledge Base Findings` or `## 🧠 AI Intelligence & Analysis`.
2. **Deep Technical Granularity:** Include exact function names (`rtld_db_dlactivity`), opcodes (`sub sp, sp, #0x30`), structs (`DT_ANDROID_RELA`), and code snippets. Show **HOW** it works, not just high-level descriptions.
3. **Provenance Markers:**
   - Facts confirmed by local wiki files are cited with the article link and `[V]` (e.g. `[[wiki/rasp/r2-pay#anti-debug]] [V]`).
   - Use delta markers inline for non-verified content: `[I]` (Inferred), `[U]` (Unverified), `[VS: Target]` (Version-Specific), `[X]` (Contradicted).
   - Pre-trained model intelligence, general assembly patterns, or bypass suggestions not in the local wiki MUST be marked `[AI Synthesis]`.

### Example Response:
```markdown
# DexProtector (Licel 5.x) Detection & Anti-Analysis Architecture

### 1. Implicit Linker-State Anti-Frida (`rtld_db_dlactivity`)
DexProtector binds stage 2 (`libdp.so`) decryption directly to the execution bytes of the dynamic linker function `rtld_db_dlactivity()`. [[wiki/protectors/dexprotector-bootstrap]] [V] 

When `frida-server` attaches, it writes an ARM64 trampoline at `rtld_db_dlactivity()`: [AI Synthesis]

```assembly
; [AI Synthesis] Standard Frida Linker Trampoline
ldr x16, #0x8
br  x16
.quad <frida_handler_address>
```

Because stage 2 key derivation reads bytes from `rtld_db_dlactivity()`, running Frida corrupts the key state, causing `libdp.so` payload decryption to fail with a memory fault. [[wiki/protectors/dexprotector-bootstrap]] [V]

To bypass this check, restore the original `ret` opcode (`0xd65f03c0`) before key derivation executes: [AI Synthesis]

```javascript
// [AI Synthesis] Linker Byte Restoration Pattern
Memory.protect(Module.getExportByName(null, 'rtld_db_dlactivity'), 4, 'rwx');
Module.getExportByName(null, 'rtld_db_dlactivity').writeByteArray([0xc0, 0x03, 0x5f, 0xd6]);
```
```

---

## When the KB Has Partial or No Information

If a query is not fully covered by any wiki article:

1. State clearly what is missing from the local KB (e.g., *"Not currently documented in local wiki"*).
2. Provide the full technical solution inline, marking all model-generated claims and code blocks as `[AI Synthesis]`.
3. Offer to compile a new raw KB article from the AI response so it can be saved into the KB inbox!
