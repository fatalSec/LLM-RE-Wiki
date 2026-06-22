# READ MODE — Query Protocol

> **Scope:** How to navigate the KB and answer questions.
> **Load when:** User or consuming agent queries the KB.
> **Prerequisite:** Read `core-rules.md` first.
> **See also:** [core-rules.md](core-rules.md) | [index-formats.md](index-formats.md)

---

## Direct Markdown Traversal Steps

Follow this protocol when retrieving information from the KB:

### Step 1 — Route via Master Index
```
Read knowledge_base/wiki/_master-index.md
→ Scan the Quick Navigation list or Topic Index table
→ Identify the relevant topic folder (e.g. wiki/rasp/ or wiki/obfuscation/)
→ If the query lies outside documented topics, state "not in KB" immediately
```

### Step 2 — Navigate Topic Index
```
Read wiki/<topic>/_index.md
→ Read the "Quick Navigation" decision tree to find specific articles
→ If the target is not listed in this topic, stop and check other indices
```

### Step 3 — Read YAML Metadata & Content
```
Read the specific article markdown file
→ Verify tool_versions and llm_summary in the YAML frontmatter first
→ Read Key Takeaways and Walkthrough sections
→ Check companion -patterns.md files if task-oriented code snippets are required
```

### Step 4 — Compose Response
```
→ Cite articles with [[wiki/topic/article]] links.
→ Surface [U], [VS], and [X] markers if present — flag uncertainty and version dependencies explicitly.
→ If no article covers the query: state "not in KB" and offer to create a new raw article draft.
→ NEVER synthesize an answer by mixing KB facts with training data priors without explicitly labeling which is which.
```

---

## When the KB Has No Answer

If the query is not covered by any wiki article:

> *"This isn't in the KB yet. I can answer from general knowledge but cannot verify against local sources. Want me to create an article from what I know (all claims marked `[U]`), or would you prefer to provide a source?"*

Never silently blend KB and priors.
