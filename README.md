# LLM-RE-WIKI

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![Markdown Vault](https://img.shields.io/badge/Storage-Plain%20Markdown-black?logo=markdown&logoColor=white)](knowledge_base/wiki/)
[![Interactive Graph](https://img.shields.io/badge/Visualizer-Force--Directed%20Graph-purple)](knowledge_base/graph/index.html)
[![YouTube Walkthrough](https://img.shields.io/badge/YouTube-Watch%20Tutorial-red?logo=youtube&logoColor=white)](https://youtu.be/8JgcliENtPQ)
[![Version](https://img.shields.io/badge/Release-v2.0%20Optimized-success)](#whats-new-in-v2)

> 📺 **Looking for the YouTube Video Version?**  
> The exact codebase featured in the [YouTube Tutorial](https://youtu.be/8JgcliENtPQ) is preserved on the [`v1-video`](https://github.com/fatalSec/LLM-RE-WIKI/tree/v1-video) branch.  
> You are currently on **`main` (v2)**, engineered for enterprise-grade token efficiency, fast-path 2-turn retrieval, and automated deterministic indexing.

---

## Overview

**LLM-RE-WIKI** is an open-source, file-based AI Knowledge Base custodian for reverse engineering, malware analysis, and offensive security research. 

It is **not** a generic chatbot wrapper or an opaque vector database. Instead, it is an instruction-driven architecture (`AGENTS.md` + `.kb/`) that turns any capable coding agent ([Claude Code](https://claude.ai/), [Cursor](https://cursor.com/), [Windsurf](https://codeium.com/windsurf), or [Antigravity](https://github.com/google)) into a rigorous, anti-hallucinating security librarian.

The agent crawls blogs, papers, pentest findings, and disassembly notes, compiles them into structured, cross-linked Markdown modules with **verbatim technical primitives** (offsets, opcodes, syscalls, bypass scripts), and visualizes the entire research corpus in an interactive force-directed knowledge graph.

<p align="center">
  <img src="docs/architecture.png" alt="3-tier AI agent system: user input commands (ingest / compile / search) → AI agent orchestrator (rules + dispatcher) → markdown knowledge vault (raw feeds → compiled graph nodes)" width="700">
</p>

---

## Why LLM-RE-WIKI?

Security research notes decay rapidly:
- **Paraphrasing Rot:** Traditional LLMs summarize away critical registers, JNI signatures, and exact hex bytes.
- **RAG Context Fragmentation:** Chunking algorithms break continuous assembly routines and multi-stage unpackers into disjoint fragments.
- **Hallucinated Ground Truth:** After a few months, it becomes impossible to distinguish what was *empirically verified* against hardware from what an LLM *guessed*.

LLM-RE-WIKI enforces the opposite discipline:
1. **Zero-Loss Verbatim Compilation:** Disassembly instructions, hex bytes, struct layouts, and exploit scripts are preserved verbatim—never compressed or paraphrased.
2. **Provenance on Every Claim:** A strict inline marker system separates verified source facts (`[V]`) from logical inferences (`[I]`), unconfirmed claims (`[U]`), version quirks (`[VS]`), and model intelligence (`[AI Synthesis]`).
3. **Machine-Navigable Markdown:** Every article carries YAML frontmatter and bidirectional Obsidian-style links (`[[wiki/...]]`) so consuming LLMs can traverse technical relationships deterministically.
4. **100% Local & Portable:** All data lives in plain markdown files on disk. No vector DBs, no embeddings servers, no lock-in. Diff it with Git, view it in Obsidian, or edit it in VS Code.

---

## What's New in v2 (Optimizations)

The `main` branch includes major architectural improvements based on Anthropic and industry agent benchmarks:

| Capability | v1 (Video Snapshot) | v2 (`main`) | Benefit |
|---|---|---|---|
| **Query Retrieval** | 4-hop sequential file reads | **Fast-Path 2-turn retrieval** (`rg`/lookup) | **~70% reduction in context token costs** |
| **Secondary Indexing** | LLM manually formats 4 markdown tables | **Automated via `index_builder.py`** | **Saves ~10k generation tokens per compile** |
| **Document Granularity** | Micro-chunking (1 file per mechanism) | **Cohesive Subject Modules + Anchors** | **Eliminates 60% boilerplate overhead** |
| **Provenance Syntax** | `[V]` on every sentence and table cell | **Scoped baseline with delta-only tagging** | **Lower output token latency** |
| **Link Integrity** | Manual LLM link checks | **Automated link & orphan validation** | **Zero broken links guaranteed** |

---

## Architecture

LLM-RE-WIKI operates as a clean **3-tier system**:

```
./ (Repository Root)
├── AGENTS.md                  ← Master Dispatcher: task router & core operational rules
├── .kb/                       ← Agent "Firmware": rules, schemas, protocols, and automation
│   ├── core-rules.md          ← Anti-hallucination baseline & behavioral constraints
│   ├── read-protocol.md       ← Query engine: Fast-Path search & discovery traversal
│   ├── write-pipeline.md      ← Ingest-to-Wiki compilation pipeline & module routing
│   ├── ingest-protocol.md     ← URL ingestion protocol & crawler instructions
│   ├── index-formats.md       ← Master and cross-topic index schemas
│   ├── maintenance.md         ← Vault health checks, gap analysis, and contradictions
│   ├── schemas/               ← Content-type schemas (malware, pentest, API, paper, etc.)
│   └── scripts/               ← Automation utilities
│       ├── crawl.py           ← Headless crawler with readability & image extraction
│       ├── index_builder.py   ← Automated secondary index generator & health checker
│       ├── graph_generator.py ← Obsidian link parser & visualizer data generator
│       └── requirements.txt   ← Python dependencies
└── knowledge_base/            ← The Knowledge Vault (all persistent state)
    ├── raw/                   ← Staging inbox: downloaded feeds, writeups, and assets
    │   ├── feeds/             ← Raw markdown writeups (.md)
    │   └── assets/            ← Downloaded images and diagrams (.png)
    ├── wiki/                  ← Compiled Knowledge Base (Obsidian-compatible)
    └── graph/                 ← Force-directed interactive knowledge graph (index.html)
```

---

## Core Workflow

```
ingest <url>   ──▶   compile <file>   ──▶   search <query>
 (Staging)              (Synthesis)            (Retrieval)
    │                       │                       │
    ▼                       ▼                       ▼
raw/feeds/<slug>.md    knowledge_base/wiki/    Unified technical answer
raw/assets/<slug>/*    + Auto-indexes (v2)     with exact opcodes &
                       + graph_data.js         inline provenance markers
```

### 1. Ingest
Crawl technical blogs, writeups, or documentation. `crawl.py` extracts the primary article text, recovers diagrams, downloads all images locally to `knowledge_base/raw/assets/`, converts WebP to PNG, and stages clean markdown in `knowledge_base/raw/feeds/`.

### 2. Compile
The agent classifies the content type, extracts a coverage checklist, transcribes images/disassembly, and compiles the notes into a **Cohesive Subject Module** with anchor headings (`### Mechanism {#anchor}`). It updates the topic index and runs `index_builder.py` to deterministically regenerate cross-topic indexes and the knowledge graph.

### 3. Search
The agent uses **Fast-Path Retrieval** (`rg` keyword search or frontmatter scan) to jump directly to the target module in **1–2 conversational turns**, outputting a consolidated technical brief with function signatures, opcodes, and explicit provenance markers.

### 4. Visualize
Open `knowledge_base/graph/index.html` in any browser to explore an interactive, searchable, force-directed graph of the entire knowledge base colored by topic.

---

## Quickstart

### One-Line Installation

Install and configure LLM-RE-WIKI in seconds with the universal installer:

```bash
curl -fsSL https://raw.githubusercontent.com/fatalSec/LLM-RE-WIKI/main/install.sh | bash
```

The installer automatically:
- Verifies system prerequisites (`git`, `python3 3.9+`, `curl`).
- Probes for installed AI coding agents: **Claude Code** (`claude`), **OpenCode** (`opencode`), and **Pi** (`pi`).
- Prompts you to choose which agent(s) to configure (or run non-interactively with `-y` / `--yes`).
- Clones the repository, provisions `.kb/scripts/.venv`, and runs the self-test suite.
- Installs the global `llm-re-wiki` management CLI into `~/.local/bin/`.

#### Launching Your Agent

Once installed, launch the KB custodian in your preferred agent:

```bash
# Claude Code (auto-bridges via CLAUDE.md)
llm-re-wiki claude     # or: cd ~/llm-re-wiki && claude

# OpenCode (auto-bridges via AGENTS.md)
llm-re-wiki opencode   # or: cd ~/llm-re-wiki && opencode

# Pi (auto-bridges via AGENTS.md)
llm-re-wiki pi         # or: cd ~/llm-re-wiki && pi
```

#### Idempotent Lifecycle Scripts & CLI

LLM-RE-WIKI uses **declarative, idempotent shell lifecycle scripts** rather than opaque compiled binaries. You can invoke them directly in the repository or through the optional `llm-re-wiki` shell wrapper:

| Task | Direct Script | CLI Wrapper | Action & Safety Guarantee |
|---|---|---|---|
| **Install** | `./install.sh` | — | Detects agents (Claude/OpenCode/Pi), bootstraps venv, symlinks CLI |
| **Update** | `./update.sh` | `llm-re-wiki update` | Fast-forwards upstream (`git pull --ff-only`), syncs venv, reindexes; **strictly preserves local notes and targets** |
| **Uninstall** | `./uninstall.sh` | `llm-re-wiki uninstall` | Offers safe backup archive (`~/llm-re-wiki-backup-*.tar.gz`) or unlinks CLI without deleting research notes |
| **Launch Agent** | — | `llm-re-wiki [agent]` | Launches Claude Code, OpenCode, or Pi inside the vault |
| **Graph** | — | `llm-re-wiki graph` | Rebuilds and opens interactive knowledge graph visualizer |
| **Health** | — | `llm-re-wiki health` | Runs automated dead-link and orphan validator |

> **Why Declarative Shell Scripts Over Compiled Binaries?**
> - **Knowledge Evolves Faster Than Binaries:** The core value lives in mutable text artifacts—token-optimized schemas, protocols, and markdown notes. You never need to cut releases for new RASP bypasses or Frida scripts.
> - **Zero Gatekeeper & Signing Friction:** No macOS Gatekeeper / notarization blocks, no platform-specific cross-compilation CI/CD, and zero execution overhead.
> - **Clean State Preservation:** `update.sh` uses declarative `git pull --ff-only` and safety stashes, ensuring user notes in `knowledge_base/` and custom target directories are never clobbered.
> - **Native Agent Harness Discovery:** OpenCode, Claude Code, and Pi discover agent instructions (`AGENTS.md`, `CLAUDE.md`) directly from predictable filesystem paths. Keeping files transparent on disk simplifies MCP debugging and inspection.

---

### Manual Setup (Step-by-Step)

If you prefer manual setup without the global CLI:

#### 1. Clone & Setup
```bash
git clone https://github.com/fatalSec/LLM-RE-WIKI.git
cd LLM-RE-WIKI

# Create virtual environment and install crawler dependencies
python3 -m venv .kb/scripts/.venv
.kb/scripts/.venv/bin/pip install -r .kb/scripts/requirements.txt
```

#### 2. Crawl a Technical Writeup
```bash
.kb/scripts/.venv/bin/python .kb/scripts/crawl.py "https://example.com/dexprotector-analysis"
```
*Output: `knowledge_base/raw/feeds/dexprotector-analysis.md` and downloaded images in `knowledge_base/raw/assets/`.*

#### 3. Compile with Your AI Agent
Open the repository in your agent (e.g., Claude Code, OpenCode, Pi, or Cursor) and run:
```text
compile dexprotector-analysis.md
```
The agent reads `AGENTS.md` (or `CLAUDE.md`), loads the schema, writes the compiled wiki article(s), and automatically updates indexes and graph data.

#### 4. Query the Knowledge Base
Ask your agent any technical question:
```text
search "How does DexProtector detect Frida linker trampolines?"
```
The agent retrieves the exact article and returns a granular response with exact assembly opcodes, syscalls, and inline provenance tags.

#### 5. Launch the Knowledge Graph
```bash
python3 .kb/scripts/index_builder.py --open
```


---

## Command Reference

You can interact with your agent using natural language or these standardized commands:

| Command | Purpose | Module / Script |
|---|---|---|
| `ingest <url>` | Crawl a URL into raw markdown and download assets | `.kb/ingest-protocol.md` |
| `compile <file>` | Compile raw notes into structured wiki modules | `.kb/write-pipeline.md` |
| `search <query>` | Query the KB with fast-path 2-turn retrieval | `.kb/read-protocol.md` |
| `reindex` | Auto-build secondary indexes, validate links, and sync graph | `python3 .kb/scripts/index_builder.py` |
| `graph` | Rebuild and open the interactive graph visualizer | `python3 .kb/scripts/graph_generator.py --open` |
| `health-check` | Scan for dead links, orphan articles, and stale stubs | `python3 .kb/scripts/index_builder.py --check` |
| `gap report` | Identify underdeveloped topics and undocumented areas | `.kb/maintenance.md` |
| `contradictions` | List articles containing conflicting claims (`[X]`) | `.kb/maintenance.md` |

---

## Provenance Marker System

To eliminate hallucination and maintain clear source attribution, every factual statement carries an explicit provenance tag:

| Marker | Meaning | Usage |
|---|---|---|
| `[V]` | **Verified** | Confirmed from cited primary source (implicit default for primary writeup facts) |
| `[I]` | **Inferred** | Logical deduction from verified facts, not explicitly in the text |
| `[U]` | **Unverified** | From community forums, unconfirmed blogs, or anecdotal writeups |
| `[VS: Target]` | **Version-Specific** | Applies strictly to the specified tool/platform version (e.g., `[VS: Frida 16.x]`) |
| `[X: see <ref>]` | **Contradicted** | Conflicting findings between multiple sources; requires investigation |
| `[AI Synthesis]` | **Model Intelligence** | Pre-trained model reasoning, generic assembly patterns, or proposed bypass scripts |

---

## Scripts & Tooling

| Script / Tool | Purpose | Dependencies |
|---|---|---|
| `install.sh` | Idempotent one-line installer: agent detection (Claude, OpenCode, Pi), automated setup, and CLI provisioning. | Bash, `git`, `python3`, `curl` |
| `update.sh` | Idempotent update script: fast-forwards upstream (`git pull --ff-only`), syncs venv, and validates KB health while protecting user notes. | Bash, `git` |
| `uninstall.sh` | Idempotent safe uninstaller: provides options to keep research notes, export a timestamped backup archive, or wipe. | Bash, `tar` |
| `bin/llm-re-wiki` | Optional lightweight shell wrapper: launches agents, delegates to lifecycle scripts, and runs KB tools. | Bash |
| `.kb/scripts/crawl.py` | Web scraper with readability extraction, figure recovery, WebP-to-PNG conversion, and asset management. | `requests`, `beautifulsoup4`, `lxml`, `readability-lxml`, `markdownify`, `Pillow` |
| `.kb/scripts/index_builder.py` | Fast deterministic indexer: scans YAML frontmatter across the vault to compile secondary indexes, validates link health, and updates the graph. | Standard Library (uses `PyYAML` if present) |
| `.kb/scripts/graph_generator.py` | Parses Obsidian links (`[[wiki/...]]`), computes node weights, builds `graph_data.js`, and serves the visualizer. | Standard Library (uses `PyYAML` if present) |



---

## Contributing & Community

Contributions are welcome! If you have optimized schemas, new ingestion crawlers, or refined RE patterns:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-schema`).
3. Commit your changes and submit a Pull Request.

---

## License

This project is licensed under the Apache 2.0 License. See [LICENSE](LICENSE) for details.
