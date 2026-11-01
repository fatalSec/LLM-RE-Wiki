# Index File Formats

> **Scope:** Templates for all index files in the wiki.
> **Load when:** Creating or updating indexes during compile or reindex.
> **See also:** [write-pipeline.md](write-pipeline.md)

---

## 1. `_master-index.md` — Wiki Root

```markdown
# Knowledge Base Master Index
Last reindexed: YYYY-MM-DD | Total articles: N

## Quick Navigation — "I want to..."
- Hook a native function → [[wiki/frida/_index]]
- Understand DexGuard obfuscation → [[wiki/obfuscation/_index]]
- Find a working cert pinning bypass → [[wiki/rasp/_index]] or check [[wiki/_snippets-index]]

## Topic Index
| Topic | Description | Articles | Last updated |
|---|---|---|---|
| [[wiki/frida/_index|Frida]] | Scripting, Stalker, Interceptor, CodeWriters | N | YYYY-MM-DD |
| [[wiki/obfuscation/_index|Obfuscation]] | O-LLVM, control-flow flattening, string encryption | N | YYYY-MM-DD |
| [[wiki/rasp/_index|RASP]] | Anti-root, integrity checks, anti-debug | N | YYYY-MM-DD |
```

---

## 2. Topic `_index.md` — Per-Folder Navigation

```markdown
# <Topic Name> — Index

## Quick Navigation
<!-- Routing decision tree based on LLM query -->
Looking for... → Go to...
- "How do I hook a Java method?" → [[frida-interceptor]]
- "How do I trace all calls in a module?" → [[frida-stalker]]

## Articles
| Article | Covers (Summary) | Type | Completeness | Last updated |
|---|---|---|---|---|
| [[frida-interceptor]] | <llm_summary from YAML> | api-doc | complete | YYYY-MM-DD |
```

---

## 3. Cross-Topic Indexes

> **Deterministic Generation:** These secondary tables are compiled automatically from article YAML frontmatter via:
> ```bash
> python3 .kb/scripts/index_builder.py
> ```
> Do not spend LLM generation tokens editing these tables manually during compile.

### `_tools-index.md`
```markdown
| Tool | Tested version | Key articles | Notes |
|---|---|---|---|
| Frida | 16.2 | [[wiki/frida/...]] | 16.x behavior differs from 15.x |
```

### `_snippets-index.md`
```markdown
| Purpose | Language | Tool | Article | Tags |
|---|---|---|---|---|
| Bypass OkHttp3 pinning | JS | Frida 16.x | [[wiki/rasp/...]] | #ssl #okhttp |
```

### `_patterns-index.md`
```markdown
| Pattern | Type | Targets seen | Articles | First filed |
|---|---|---|---|---|
| DexGuard v4.x XOR string decrypt | Obfuscation | 4 | [[wiki/obfuscation/...]] | YYYY-MM-DD |
```

### `_ttp-index.md`
```markdown
| TTP ID | Name | Tactic | Articles | Notes |
|---|---|---|---|---|
| T1629.003 | Disable/Modify Tools | Defense Evasion | [[wiki/rasp/...]] | anti-Frida patterns |
```

---

## Index Maintenance Rules

- **Topic `_index.md`:** The LLM manually registers new articles with a 1-line link and summary.
- **Cross-Topic Indexes:** Automatically regenerated via `python3 .kb/scripts/index_builder.py`.
- **Link format:** Use standard Obsidian links:
  - Canonical format: `[[wiki/topic/subject]]` or with anchors: `[[wiki/topic/subject#anchor|Label]]`.
  - Same-directory shorthand: `[[article-name]]` (resolved automatically relative to parent directory).
- **Graph Visualizer:** Automatically updated whenever `index_builder.py` is invoked.

