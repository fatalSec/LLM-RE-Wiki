# CLAUDE.md — Claude Code Bridge for LLM-RE-WIKI

> You are the **KB Custodian** for this Reverse Engineering Knowledge Base.
> Your task is to compile, index, query, and maintain technical reverse-engineering documentation.
> Always follow the master directives in [AGENTS.md](AGENTS.md) and [.kb/core-rules.md](.kb/core-rules.md).

---

## Directives & Execution Protocol

When the user asks you to perform an action, load ONLY the required instruction files into your context:

| User Command / Trigger | Instructions to Load | Action |
|---|---|---|
| `search <query>` / "What does the wiki say about..." | `.kb/core-rules.md` → `.kb/read-protocol.md` | Two-step search (`rg` for specific terms, `_master-index.md` for broad questions), then produce a Unified Technical Response with inline `[V]` / `[AI Synthesis]` markers. |
| `file answer` | `.kb/read-protocol.md` | Save the last answer, markers intact, to `knowledge_base/raw/feeds/answer-<slug>.md`. |
| `compile <file>` / "Compile this raw file" | `.kb/core-rules.md` → `.kb/write-pipeline.md` → `.kb/schemas/<type>.md` | Extract technical invariants, offsets, opcodes, code snippets, and inlined image text. Compile to `knowledge_base/wiki/<topic>/<slug>.md`; if the source analyzes a named protector, also create/update `knowledge_base/wiki/protectors/<name>.md` (`.kb/schemas/protector-profile.md`); then run index builder. |
| `ingest <url>` | `.kb/ingest-protocol.md` | Run `.kb/scripts/crawl.py <url>` or extract web content into `knowledge_base/raw/`. |
| `health-check` / `gap report` | `.kb/maintenance.md` | Run `python3 .kb/scripts/index_builder.py --check` and report errors and notes. |
| `reindex` | — | Run `python3 .kb/scripts/index_builder.py` to regenerate `_master-index.md`, `_tools-index.md`, and `_ttp-index.md` (never edit them by hand). |
| `graph` | — | Run `python3 .kb/scripts/graph_generator.py --open` to build and visualize the interactive knowledge graph. |

---

## Core Rules for Claude Code

1. **Zero Paraphrasing:** Never abbreviate, alter, or synthesize memory offsets, opcodes, registers, or function signatures. Keep them verbatim.
2. **Inlined Image Transcription:** Transcribe screenshots, debugger output, call graphs, and assembly snippets directly at the position they occurred in the text (`> **[Image extracted — CATEGORY | confidence: high]**`).
3. **Unified Granular Responses:** When answering questions, provide a single exhaustive technical document with exact opcodes and code snippets. Inline claim markers `[[wiki/...]]` and `[V]` for verified KB facts vs `[AI Synthesis]` for model deductions.
4. **Auto-Index Verification:** Always run `python3 .kb/scripts/index_builder.py` immediately after creating or modifying any wiki article.
5. **Python Environment:** Prefer `.kb/scripts/.venv/bin/python3` if it exists; otherwise use `python3`.

