# LLM-RE-WIKI

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![Markdown Vault](https://img.shields.io/badge/Storage-Plain%20Markdown-black?logo=markdown&logoColor=white)](knowledge_base/wiki/)
[![Interactive Graph](https://img.shields.io/badge/Visualizer-Force--Directed%20Graph-purple)](knowledge_base/graph/index.html)
[![Harness Support](https://img.shields.io/badge/Agents-OpenCode%20%7C%20Claude%20Code%20%7C%20Pi-blue)](AGENTS.md)
[![YouTube Walkthrough](https://img.shields.io/badge/YouTube-Watch%20Tutorial-red?logo=youtube&logoColor=white)](https://youtu.be/8JgcliENtPQ)
[![Version](https://img.shields.io/badge/Release-v2.0%20Optimized-success)](#whats-new-in-v2)

> 📺 **Looking for the YouTube Video Version?**  
> The exact codebase featured in the [YouTube Tutorial](https://youtu.be/8JgcliENtPQ) is preserved on the [`v1-video`](https://github.com/fatalSec/LLM-RE-WIKI/tree/v1-video) branch.  
> You are currently on **`main` (v2)**, engineered for enterprise-grade token efficiency, fast-path 2-turn retrieval, automated deterministic indexing, and multi-harness compatibility.

---

## Overview

**LLM-RE-WIKI** is an open-source, file-based AI Knowledge Base custodian for reverse engineering, malware analysis, and offensive security research.

It is **not** a generic chatbot wrapper or an opaque vector database. Instead, it is an instruction-driven architecture (`AGENTS.md` + `CLAUDE.md` + `.kb/`) that turns any capable coding agent ([Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview), [OpenCode](https://opencode.ai/), [Pi](https://github.com), [Cursor](https://cursor.com/), or [Antigravity](https://github.com/google)) into a rigorous, anti-hallucinating security librarian.

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
| **Harness Support** | Cursor-centric | **Native bridges for Claude Code, OpenCode & Pi** | **Cross-agent interoperability** |

---

## Vault Architecture

LLM-RE-WIKI operates as a clean, transparent file-based system:

```text
LLM-RE-WIKI/
├── AGENTS.md                  # Master Orchestrator: task router & core operational rules
├── CLAUDE.md                  # Native bridge instructions for Claude Code
├── .kb/                       # Agent "Firmware": rules, schemas, protocols, and automation
│   ├── core-rules.md          # Anti-hallucination baseline & behavioral constraints
│   ├── read-protocol.md       # Query engine: Fast-Path search & discovery traversal
│   ├── write-pipeline.md      # Ingest-to-Wiki compilation pipeline & module routing
│   ├── ingest-protocol.md     # URL ingestion protocol & crawler instructions
│   ├── index-formats.md       # Master and cross-topic index schemas
│   ├── maintenance.md         # Vault health checks, gap analysis, and contradictions
│   ├── schemas/               # Content-type schemas (malware, pentest, API, paper, etc.)
│   └── scripts/               # Automation utilities
│       ├── crawl.py           # Headless crawler with readability & image extraction
│       ├── index_builder.py   # Automated secondary index generator & health checker
│       ├── graph_generator.py # Obsidian link parser & visualizer data generator
│       └── requirements.txt   # Python dependencies
├── knowledge_base/            # The Knowledge Vault (all persistent research data)
│   ├── raw/                   # Staging inbox: downloaded feeds, writeups, and assets
│   │   ├── feeds/             # Raw markdown writeups (.md)
│   │   └── assets/            # Downloaded images and diagrams (.png)
│   ├── wiki/                  # Compiled Knowledge Base (Obsidian-compatible Markdown)
│   └── graph/                 # Force-directed interactive knowledge graph (index.html)
├── install.sh                 # Idempotent installer: agent detection & venv bootstrap
├── update.sh                  # Safe fast-forward update (git pull --ff-only)
└── uninstall.sh               # Safe backup archive & uninstaller
```

---

## Core Knowledge Pipeline

```text
ingest <url>   ──▶   compile <file>   ──▶   search <query>
 (Staging)              (Synthesis)            (Retrieval)
    │                       │                       │
    ▼                       ▼                       ▼
knowledge_base/raw/    knowledge_base/wiki/    Unified technical answer
feeds/<slug>.md        + Auto-indexes (v2)     with exact opcodes &
assets/<slug>/*        + graph_data.js         inline provenance markers
```

### 1. Ingest
Crawl technical blogs, writeups, or documentation. `crawl.py` extracts the primary article text, recovers diagrams, downloads all images locally to `knowledge_base/raw/assets/`, converts WebP to PNG, and stages clean markdown in `knowledge_base/raw/feeds/`.

### 2. Compile
The agent classifies the content type, extracts a coverage checklist, transcribes images/disassembly verbatim, and compiles the notes into a **Cohesive Subject Module** with anchor headings (`### Mechanism {#anchor}`). It updates the topic index and runs `index_builder.py` to deterministically regenerate cross-topic indexes and the knowledge graph.

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

#### Launching Your Agent

Launch your preferred agent directly inside the vault:

```bash
# Claude Code (auto-bridges via CLAUDE.md)
cd ~/.llm-re-wiki && claude

# OpenCode (auto-bridges via AGENTS.md)
cd ~/.llm-re-wiki && opencode

# Pi (auto-bridges via AGENTS.md)
cd ~/.llm-re-wiki && pi
```

#### Idempotent Lifecycle Scripts

LLM-RE-WIKI uses **declarative, idempotent shell lifecycle scripts** rather than opaque compiled binaries:

| Task | Command | Action & Safety Guarantee |
|---|---|---|
| **Install** | `./install.sh` | Detects agents (Claude/OpenCode/Pi), bootstraps venv, runs self-check |
| **Update** | `./update.sh` | Fast-forwards upstream (`git pull --ff-only`), syncs venv, reindexes; **strictly preserves local notes and targets** |
| **Uninstall** | `./uninstall.sh` | Safe uninstaller: offers backup archive (`~/llm-re-wiki-backup-*.tar.gz`) or safe cleanup |

> **Why Declarative Shell Scripts Over Compiled Binaries?**
> - **Knowledge Evolves Faster Than Binaries:** The core value lives in mutable text artifacts—token-optimized schemas, protocols, and markdown notes. You never need to cut releases for new RASP bypasses or Frida scripts.
> - **Zero Gatekeeper & Signing Friction:** No macOS Gatekeeper / notarization blocks, no platform-specific cross-compilation CI/CD, and zero execution overhead.
> - **Clean State Preservation:** `update.sh` uses declarative `git pull --ff-only` and safety stashes, ensuring user notes in `knowledge_base/` are never clobbered.
> - **Native Agent Harness Discovery:** OpenCode, Claude Code, and Pi discover agent instructions (`AGENTS.md`, `CLAUDE.md`) directly from predictable filesystem paths.

---

### In-Vault Reversing Workflow

Once your agent is open inside the vault:

#### 1. Ingest a Writeup or Documentation
```bash
python3 .kb/scripts/crawl.py "https://example.com/dexprotector-analysis"
```
*Output: `knowledge_base/raw/feeds/dexprotector-analysis.md` and downloaded images in `knowledge_base/raw/assets/`.*

#### 2. Compile with Your AI Agent
Tell your agent in chat:
```text
compile dexprotector-analysis.md
```
The agent reads `AGENTS.md` (or `CLAUDE.md`), loads the schema, writes the compiled wiki article(s), and automatically runs `index_builder.py` to update indexes and graph data.

#### 3. Query the Knowledge Base
Ask your agent any technical question:
```text
search "How does DexProtector detect Frida linker trampolines?"
```
The agent retrieves the exact article and returns a granular response with exact assembly opcodes, syscalls, and inline provenance tags.

#### 4. Launch the Knowledge Graph
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
| `install.sh` | Idempotent one-line installer: agent detection (Claude, OpenCode, Pi), automated setup. | Bash, `git`, `python3`, `curl` |
| `update.sh` | Idempotent update script: fast-forwards upstream (`git pull --ff-only`), syncs venv, and validates KB health. | Bash, `git` |
| `uninstall.sh` | Idempotent safe uninstaller: provides options to keep research notes, export a backup archive, or wipe. | Bash, `tar` |
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

This project is licensed under the Apache 2.0 License.
