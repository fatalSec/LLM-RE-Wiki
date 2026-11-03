# Common Article Metadata (YAML Frontmatter)

> **Scope:** Shared metadata fields used by ALL article schemas.
> **Usage:** Include this block at the very top of every wiki article (delimited by `---`).

---

## Metadata Block Template

```yaml
---
type: <schema type>
topic: wiki/<topic>/_index
source: <URL, DOI, or filename>
tags: [tag1, tag2]
arch: [arm64, arm32, x86_64]
complexity: beginner | intermediate | advanced
completeness: stub | partial | complete
last_verified: YYYY-MM-DD
tool_versions: [Frida x.x, Android x, IDA x.x]
attack_ttps: [T1xxx, T1xxx.xxx]
llm_summary: "<A dense, 1-2 sentence summary of the article's core knowledge for direct LLM indexing/retrieval>"
---
```

## Field Rules

| Field | Required | Notes |
|---|---|---|
| `type` | Yes | Must match one of: `research-paper`, `blog`, `api-doc`, `pentest-finding`, `analysis-notes`, `malware-analysis` |
| `topic` | Yes | Relative path to parent topic `_index.md` (e.g. `wiki/rasp/_index`) |
| `source` | Yes | Original URL, DOI, or raw filename. Never omit. |
| `tags` | Yes | YAML array of lowercase, hyphenated tags. Min 2, max 8. |
| `arch` | Conditional | Target architecture: `arm64`, `arm32`, `x86_64`, `all`. Required for native binaries. |
| `complexity` | Yes | `beginner` \| `intermediate` \| `advanced` |
| `completeness` | Yes | `stub` = placeholder, `partial` = key sections done, `complete` = fully populated |
| `last_verified` | Yes | Date this article was last checked against its source (YYYY-MM-DD) |
| `tool_versions` | Conditional | YAML array of version strings. Required if article mentions versioned tools. |
| `attack_ttps` | Conditional | YAML array of MITRE ATT&CK Mobile/Enterprise TTP IDs (e.g. `[T1629.003]`). Auto-indexed into `_ttp-index.md`. |
| `llm_summary` | Yes | Dense 1-2 sentence summary of core technique, target, and bypass for direct LLM search and navigation. |
