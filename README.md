# LLM-RE-KnowledgeBase-Agent (v1 Video Edition)

[![YouTube Walkthrough](https://img.shields.io/badge/YouTube-Watch%20Tutorial-red?logo=youtube&logoColor=white)](https://youtu.be/8JgcliENtPQ)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![Markdown Vault](https://img.shields.io/badge/Storage-Plain%20Markdown-black?logo=markdown&logoColor=white)](knowledge_base/wiki/)
[![Interactive Graph](https://img.shields.io/badge/Visualizer-Force--Directed%20Graph-purple)](knowledge_base/graph/index.html)
[![Branch](https://img.shields.io/badge/Branch-v1--video-orange)](https://github.com/fatalSec/LLM-RE-WIKI/tree/v1-video)

> 📺 **YouTube Tutorial Snapshot**  
> This branch preserves the exact codebase featured in the [YouTube Walkthrough (youtu.be/8JgcliENtPQ)].  
> You can follow along with the video step-by-step using the instructions below.  
> 
> 🚀 *Looking for the latest optimized version?* Check the [**`main`**](https://github.com/fatalSec/LLM-RE-WIKI) branch, featuring fast-path 2-turn retrieval, automated indexing, and token-efficiency enhancements.

---

## Overview

**LLM-RE-KnowledgeBase-Agent** is a file-based, LLM-driven Reverse Engineering Knowledge Base custodian. It ingests security blogs, academic papers, pentest findings, and malware writeups, compiles them into a structured, cross-linked Markdown wiki with anti-hallucination provenance markers, and visualizes the corpus as an interactive knowledge graph.

The system is not a chatbot wrapper—it is a set of modular agent instruction files (`AGENTS.md` + `.kb/`) that turn any capable coding agent ([Claude Code](https://claude.ai/), [Cursor](https://cursor.com/), [Windsurf](https://codeium.com/windsurf), or [Antigravity](https://github.com/google)) into a disciplined security research librarian.

<p align="center">
  <img src="docs/architecture.png" alt="3-tier AI agent system: user commands -> AI agent orchestrator -> markdown knowledge vault" width="700">
</p>

---

## Why This Exists

Reverse engineering and offensive security notes rot quickly:
- **Paraphrasing loss:** LLMs summarize away exact opcodes, registers, and memory offsets.
- **Unverified claims:** Blog assertions often get promoted to "fact," with no record of what was verified vs. inferred.
- **Context fragmentation:** Standard vector search chunks break continuous assembly routines and unpacker stages.

This agent enforces:
1. **Zero-Loss Compilation:** Offsets, hex dumps, registers, JNI signatures, and bypass scripts are preserved verbatim.
2. **Provenance on Every Claim:** Inline markers separate verified source facts (`[V]`) from inferences (`[I]`), unverified community notes (`[U]`), version quirks (`[VS]`), and model reasoning (`[AI Synthesis]`).
3. **Machine-Navigable Structure:** Every article carries YAML frontmatter and hub-and-spoke links (`[[wiki/...]]`) so downstream agents can traverse technical dependencies deterministically.

---

## Video Tutorial Walkthrough (Follow Along)

To replicate the exact workflow shown in the [YouTube video](https://youtu.be/8JgcliENtPQ):

### 1. Clone this Branch
```bash
git clone -b v1-video https://github.com/fatalSec/LLM-RE-WIKI.git
cd LLM-RE-WIKI
```

### 2. Set Up the Python Environment
```bash
python3 -m venv .kb/scripts/.venv
.kb/scripts/.venv/bin/pip install -r .kb/scripts/requirements.txt
```

### 3. Ingest a Writeup into the Inbox
```bash
.kb/scripts/.venv/bin/python .kb/scripts/crawl.py "https://example.com/some-re-writeup"
```
The crawler downloads the article text to `knowledge_base/raw/feeds/<slug>.md` and saves all diagrams/images locally in `knowledge_base/raw/assets/<slug>/`.

### 4. Compile with Your AI Agent
Open this repository in your AI coding assistant (Cursor, Claude Code, or Antigravity) and instruct it:
```text
compile <slug>.md
```
The agent reads `AGENTS.md`, matches the schema, extracts technical invariants, generates hub-and-chunk wiki articles, and refreshes the indexes.

### 5. Query the Knowledge Base
```text
search "How does r2-pay detect TracerPid?"
```
The agent retrieves the specific chunk and outputs a unified technical brief with exact opcodes and inline provenance markers.

### 6. Explore the Knowledge Graph
```bash
.kb/scripts/.venv/bin/python .kb/scripts/graph_generator.py --open
```
Opens `knowledge_base/graph/index.html` in your browser showing an interactive, force-directed graph of your compiled research notes.

---

## System Architecture

The codebase is organized into three distinct tiers:

```
./ (project root)
├── AGENTS.md                  ← Master Dispatcher (read by the AI agent on every session)
├── .kb/                       ← Agent instructions, schemas, and scripts
│   ├── core-rules.md          ← Anti-hallucination baseline & behavioral rules
│   ├── read-protocol.md       ← Query mode: index-to-article traversal
│   ├── write-pipeline.md      ← Compile mode: raw file -> structured wiki chunks
│   ├── ingest-protocol.md     ← URL ingestion protocol (crawl.py instructions)
│   ├── index-formats.md       ← Master, topic, and cross-topic index schemas
│   ├── maintenance.md         ← Health check, gap analysis, and contradictions
│   ├── schemas/               ← Content-type templates (malware, pentest, API, blog, etc.)
│   └── scripts/               ← Python tooling
│       ├── crawl.py           ← Web crawler (readability + image downloader)
│       ├── graph_generator.py ← Builds graph_data.js for the visualizer
│       └── requirements.txt
└── knowledge_base/            ← Persistent Knowledge Vault
    ├── raw/                   ← Staging inbox (unprocessed feeds & downloaded images)
    ├── wiki/                  ← Compiled markdown articles (Obsidian-style [[links]])
    └── graph/                 ← Force-directed visualizer (index.html)
```

---

## Command Reference

| Command | Action | Protocol |
|---|---|---|
| `ingest <url>` | Crawl URL -> raw markdown + local images inbox | `.kb/ingest-protocol.md` |
| `compile <file>` | Compile raw notes into structured wiki articles | `.kb/write-pipeline.md` |
| `search <query>` | Query the KB -> unified answer with inline provenance | `.kb/read-protocol.md` |
| `graph` | Build and open the interactive knowledge-graph visualizer | `.kb/scripts/graph_generator.py --open` |
| `health-check` | Scan for dead links, orphan articles, and stale stubs | `.kb/maintenance.md` |
| `gap report` | Report missing links and underdeveloped topics | `.kb/maintenance.md` |
| `contradictions` | List all articles carrying `[X]` conflict markers | `.kb/maintenance.md` |

---

## Provenance Marker System

Every factual claim in a wiki article carries an inline tag to prevent model confabulation:

| Marker | Meaning |
|---|---|
| `[V]` | **Verified** — directly confirmed from the cited primary source |
| `[I]` | **Inferred** — logical conclusion from verified facts |
| `[U]` | **Unverified** — from a blog, forum, or secondary source |
| `[VS: Frida 16.x]` | **Version-Specific** — applies strictly to the stated version |
| `[X: see <article>]` | **Contradicted** — conflicts with another documented source |
| `[AI Synthesis]` | **Model Intelligence** — general pre-trained reasoning or proposed code |

---

## License

This project is licensed under the Apache 2.0 License.
