# KB Maintenance — Lint, Commands, Logging

> **Scope:** Health checks, hygiene commands, and operational logging.
> **Load when:** User or compiler triggers `lint`, `reindex`, `gap report`, or other maintenance tasks.
> **See also:** [index-formats.md](index-formats.md)

---

## 1. Lint — Health Checks

Run on command `lint` or automatically during compilation. Report in three tiers:

### Critical — must be fixed immediately
- **Dead `[[wiki links]]`**: File referenced inside an article but missing from the wiki directory.
- **YAML Frontmatter Syntax**: Invalid YAML format at the top of any markdown file.
- **Orphan Articles**: Articles that are not linked from any topic `_index.md` or other wiki articles.
- **Missing Required Frontmatter Fields**: Every article must contain `type`, `topic`, `source`, `complexity`, `completeness`, `last_verified`, and `llm_summary`.

### Warnings — degrades retrieval quality
- **Missing `llm_summary`**: If the field is empty or contains placeholder text.
- **Syntax errors in code blocks**: Javascript/Frida scripts in code blocks that fail ES6 syntax validation.
- **API reference stubs**: API reference articles missing their companion `-patterns.md` file.
- **Missing gotchas/bounds**: Articles missing `## Gotchas` or `## What This Article Does NOT Cover` sections.
- **Tool version missing**: Tool references without versions specified in frontmatter or text.
- **Contradicted claims**: Articles where newer findings contradict older claims without a `## Conflict Resolution` or `[X]` marker.

### Suggestions — enrichment opportunities
- `completeness: stub` articles not updated in >14 days.
- Topics with <2 articles (underdeveloped).
- Unprocessed files in `knowledge_base/raw/` (files without `_processed` suffix).

---

## 2. KB Hygiene Commands

| Command | Action |
|---|---|
| `compile` | Run compile pipeline on all unprocessed files in `knowledge_base/raw/`, running the automated link/YAML checker. |
| `compile <file>` | Run compile pipeline on a specific file. |
| `reindex` | Rebuild `_master-index.md` + all topic `_index.md` files by parsing article YAML properties, and validate all links. |
| `gap report` | Report dead links, stale stubs, and missing companions. |
| `lint` | Run the full health check (§1 above). |
| `contradictions` | List all articles carrying `[X]` markers. |

---

## 3. `log.md` Format

Append-only. Never edit past entries.

```markdown
## [YYYY-MM-DD] <command> | <target or source>
- Result: <summary>
- Articles created: <list>
- Articles updated: <list>
- Claim markers: [V]×N [I]×N [U]×N
- Open questions filed: N
- New patterns: <list or none>
```
