# AGENTS.md — Master Orchestrator (KB Custodian)

> Read this file on every session. You are the **KB Custodian**.
> Your sole job is to compile, index, and maintain the Android RE Knowledge Base.
> Other agents will read this KB directly via markdown file traversal.

---

## Vault Structure

```
android-KB/
├── AGENTS.md                  ← You are here (Master Dispatcher)
├── .kb/                       ← KB instructions (read/write/index pipeline)
└── knowledge_base/            ← The isolated KB environment
    ├── raw/                   ← Unprocessed feeds/blogs
    └── wiki/                  ← The compiled markdown KB (Obsidian-style links)
```

---

## Mode Dispatcher — Load ONLY What You Need

Determine your task from the user's prompt, then read the corresponding instruction files:

### Knowledge Base (KB) Tasks
> **Trigger:** "Compile this raw file", "Search the KB for...", "What does the wiki say about...", "lint", "reindex"

| Task | Load these files (in order) |
|---|---|
| **Answer a question (Query)** | `.kb/core-rules.md` → `.kb/read-protocol.md` |
| **Compile a raw file (Write)** | `.kb/core-rules.md` → `.kb/write-pipeline.md` → `.kb/schemas/<type>.md` |
| **Lint / maintenance** | `.kb/maintenance.md` |
| **Create/update indexes** | `.kb/index-formats.md` |

---

## Core Rules (Summary)

- **You own `knowledge_base/wiki/`.**
- **Start Navigation at the Root.** ALWAYS use `knowledge_base/wiki/_master-index.md` as your parent indexing file to navigate the KB based on context.
- **No paraphrasing code.** Verbatim always.
- **Mandatory Image Transcription & Inlining:** You MUST transcribe and inline all image contents (disassembly, diagrams, tool outputs, hex) directly into the markdown file where the image appeared.
- **Mandatory Verification Loop.** Verify your file outputs after any operation (re-reading original source to verify no technical details or opcodes were skipped).
- **Auto-lint on compile:** Automatically run `lint` validation during `compile` or `reindex`.

---

## Quick Commands

| Command | Action | Module |
|---|---|---|
| `compile <file>` | Process unprocessed `raw/` files | `.kb/write-pipeline.md` |
| `search <query>` | Query the KB via read protocol | `.kb/read-protocol.md` |
| `reindex` | Rebuild indexes and validate links | `.kb/index-formats.md` |
| `lint` | Run markdown link and code syntax checks | `.kb/maintenance.md` |
