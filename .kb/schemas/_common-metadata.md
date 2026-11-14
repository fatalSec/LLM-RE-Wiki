# Common Article Metadata (YAML Frontmatter)

> **Scope:** Shared metadata fields used by ALL article schemas.
> **Usage:** Include this block at the very top of every wiki article (delimited by `---`).

---

## Metadata Block Template

```yaml
---
type: <schema type>
topic: wiki/<topic>/_index
sources: [<URL, DOI, or filename>]
tags: [tag1, tag2]
arch: [arm64, arm32, x86_64]
complexity: beginner | intermediate | advanced
completeness: stub | partial | complete
last_verified: YYYY-MM-DD
tool_versions: [Frida 16.x, Android 13]
attack_ttps: [T1629.003]
llm_summary: "<A dense, 1-2 sentence summary of the article's core knowledge for direct LLM indexing/retrieval>"
---
```

> **Rule for Optional Fields:** If an article does not reference specific tools, architectures, or ATT&CK TTPs, **omit those lines entirely**. Do NOT leave placeholder text like `<if applicable>`.

## Field Rules

| Field | Required | Notes |
|---|---|---|
| `type` | Yes | Must match one of: `research-paper`, `blog`, `api-doc`, `pentest-finding`, `analysis-notes`, `malware-analysis`, `protector-profile` |
| `topic` | Yes | Relative path to parent topic `_index.md` (e.g. `wiki/rasp/_index`) |
| `sources` | Yes | YAML array of original URLs, DOIs, or raw filenames. Primary source first; append (never replace) when a later source is merged in. Never omit. Legacy single `source:` is still accepted. |
| `tags` | Yes | YAML array of lowercase, hyphenated tags. Min 2, max 8. |
| `arch` | Conditional | Target architecture: `arm64`, `arm32`, `x86_64`, `all`. Required for native binaries. Omit if not applicable. |
| `complexity` | Yes | `beginner` \| `intermediate` \| `advanced` |
| `completeness` | Yes | `stub` = placeholder, `partial` = key sections done, `complete` = fully populated |
| `last_verified` | Yes | Date this article was last checked against its source (YYYY-MM-DD) |
| `tool_versions` | Conditional | YAML array of version strings (e.g. `[Frida 16.2, Android 13]`). Omit if no versioned tools referenced. |
| `attack_ttps` | Conditional | YAML array of MITRE ATT&CK Mobile/Enterprise TTP IDs (e.g. `[T1629.003]`). Auto-indexed into `_ttp-index.md`. Omit if not mapped. |
| `llm_summary` | Yes | Dense 1-2 sentence summary of core technique, target, and bypass. The first ~120 characters appear in `_master-index.md`, so put the most searchable terms (target, technique, tool) first. |
