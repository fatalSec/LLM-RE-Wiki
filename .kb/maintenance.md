# KB Maintenance — Health Check, Commands, Logging

> **Scope:** Health checks, hygiene commands, and operational logging.
> **Load when:** User triggers `health-check`, `gap report`, or `contradictions`.
> **See also:** [index-formats.md](index-formats.md)

---

## 1. Health Check

Run on command `health-check`:

```bash
python3 .kb/scripts/index_builder.py --check
```

Report its output to the user. It exits with code 1 if there are errors.

### What It Checks
| Check | Level | Meaning |
|---|---|---|
| Dead `[[wiki links]]` | **Error** | A link points to a file that doesn't exist |
| Invalid frontmatter | **Error** | Missing any of: `type`, `topic`, `sources`, `tags`, `complexity`, `completeness`, `last_verified`, `llm_summary` — or a `type` that isn't one of the schema types |
| Broken image links | **Error** | A local `![…](path)` image doesn't exist. Images live in `knowledge_base/raw/assets/`; from `wiki/<topic>/` the link is `../../raw/assets/<slug>/<image>` |
| Orphan articles | Note | No other article links to it (the generated master index doesn't count) |
| No outgoing links | Note | The article doesn't link to any other article |
| Uncompiled raw files | Note | Files in `knowledge_base/raw/feeds/` without the `_processed` suffix |

For each error, fix the article (or ask the user), then re-run the check.

---

## 2. Specialized Commands

| Command | Action |
|---|---|
| `health-check` | Run the full check list (§1 above). |
| `gap report` | Run the health check, then report underdeveloped topics (<2 articles in `_master-index.md`) and `completeness: stub` articles. |
| `contradictions` | List all articles carrying `[X]` conflict markers. |

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
