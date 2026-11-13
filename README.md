# LLM-RE-WIKI — AI Knowledge Base Agent for Reverse Engineering

**Turn reverse engineering blogs, malware reports, and research notes into a searchable Markdown wiki — compiled and queried by your AI coding agent (Claude Code, OpenCode, Pi, Cursor).**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.9%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![Storage](https://img.shields.io/badge/Storage-Plain%20Markdown-black?logo=markdown&logoColor=white)](#how-it-works)
[![YouTube](https://img.shields.io/badge/YouTube-Watch%20Tutorial-red?logo=youtube&logoColor=white)](https://youtu.be/8JgcliENtPQ)

> 📺 **Coming from the YouTube video?** The exact code shown in the [tutorial](https://youtu.be/8JgcliENtPQ) is on the [`v1-video`](https://github.com/fatalSec/LLM-RE-WIKI/tree/v1-video) branch. This `main` branch is the actively updated version.

<p align="center">
  <img src="docs/architecture.png" alt="LLM-RE-WIKI 3-tier architecture: you type ingest, compile, and search commands; the AI agent routes them through AGENTS.md or CLAUDE.md to instruction files and Python scripts; everything is stored as Markdown in knowledge_base raw, wiki, and graph folders" width="900">
</p>

---

## What It Does

- **Ingest** — Crawl a reverse engineering writeup (blog, report, docs) into Markdown, with all images saved locally.
- **Compile** — Your AI agent turns it into a structured wiki article, keeping **offsets, opcodes, hex, and scripts exactly as written** — never summarized.
- **Search** — Ask questions and get detailed technical answers, with every claim marked as *verified from your notes* (`[V]`) or *AI reasoning* (`[AI Synthesis]`).
- **Visualize** — Browse your whole knowledge base as an interactive graph.

Everything is plain Markdown on your disk: readable in Obsidian or VS Code, and versionable with Git. No vector database, no server.

---

## Quickstart

**1. Install** (needs `git` and `python3`):

```bash
curl -fsSL https://raw.githubusercontent.com/fatalSec/LLM-RE-WIKI/main/install.sh | bash
```

This clones the project to `~/.llm-re-wiki`, sets up a Python virtual environment, and asks which AI agent you use.

**2. Open your agent inside the folder:**

```bash
cd ~/.llm-re-wiki && claude      # or: opencode, pi
```

**3. Talk to the agent:**

```text
ingest https://example.com/some-reverse-engineering-writeup
compile some-reverse-engineering-writeup.md
search "How does this app detect Frida?"
graph
```

That's it. Compiled articles land in `knowledge_base/wiki/`.

<details>
<summary><b>Manual install (without the one-line script)</b></summary>

```bash
git clone https://github.com/fatalSec/LLM-RE-WIKI.git
cd LLM-RE-WIKI
python3 -m venv .kb/scripts/.venv
.kb/scripts/.venv/bin/pip install -r .kb/scripts/requirements.txt
```

</details>

---

## Commands

Type these in your agent's chat (plain-English requests work too):

| Command | What it does |
|---|---|
| `ingest <url>` | Download a web page into `knowledge_base/raw/feeds/` with its images (skips URLs you already ingested) |
| `compile <file>` | Turn a raw file into a structured wiki article and update the indexes |
| `search <question>` | Answer from the wiki, with sources and provenance markers |
| `file answer` | Save the last answer to the inbox so you can compile it later |
| `reindex` | Rebuild the indexes and the graph |
| `health-check` | Find broken links, missing metadata, unlinked articles, and raw files not compiled yet |
| `graph` | Open the interactive knowledge graph in your browser |
| `gap report` | List thin topics and missing coverage |
| `contradictions` | List articles with conflicting claims (`[X]`) |

You can also run the scripts directly:

```bash
.kb/scripts/.venv/bin/python .kb/scripts/crawl.py "<url>"          # ingest (add --force to re-crawl)
python3 .kb/scripts/index_builder.py                               # reindex
python3 .kb/scripts/index_builder.py --check                       # health check (exits 1 on errors)
python3 .kb/scripts/graph_generator.py --open                      # graph
```

---

## Provenance Markers

Every answer and article shows where each claim came from, so you always know what was in your sources and what the AI added:

| Marker | Meaning |
|---|---|
| `[V]` | **Verified** — stated in the article's source (the default for source content) |
| `[I]` | **Inferred** — a logical conclusion from verified facts |
| `[U]` | **Unverified** — from a forum or unconfirmed source |
| `[VS: Frida 16.x]` | **Version-specific** — only true for that version |
| `[X: see <article>]` | **Contradicted** — another source disagrees |
| `[AI Synthesis]` | **AI reasoning** — from the model's general knowledge, not your notes |

**Example answer:**

```markdown
DexProtector derives its stage-2 key from the bytes of `rtld_db_dlactivity()`. [[wiki/protectors/dexprotector-bootstrap]] [V]
When Frida attaches, it patches that function with a trampoline, corrupting the key. [AI Synthesis]
```

---

## How It Works

The "agent" is a set of Markdown instruction files that any capable AI coding agent can follow:

```text
ingest <url>  ──▶  knowledge_base/raw/      (raw Markdown + images)
compile       ──▶  knowledge_base/wiki/     (structured articles + auto-built indexes)
search        ──▶  answer with exact code and [V] / [AI Synthesis] markers
```

- `AGENTS.md` / `CLAUDE.md` tell the agent which instructions to load for each command.
- `.kb/` holds the rules, the compile and search steps, and one template per content type (blog, malware analysis, pentest finding, research paper, API reference, analysis notes).
- Python scripts handle the deterministic parts: crawling (and skipping URLs you already ingested), building indexes, checking links and metadata, and generating the graph.
- Search always takes two steps: `rg` for exact terms (function names, opcodes, hex), or the auto-generated `_master-index.md` (one line per article) for broad questions. The AI never edits index files, so they never go stale.

<details>
<summary><b>Project layout</b></summary>

```text
LLM-RE-WIKI/
├── AGENTS.md              # Main instructions (OpenCode, Pi, Cursor, …)
├── CLAUDE.md              # Instructions for Claude Code
├── .kb/
│   ├── core-rules.md      # Rules that apply to every task
│   ├── read-protocol.md   # How to search and answer
│   ├── write-pipeline.md  # How to compile raw files
│   ├── ingest-protocol.md # How to crawl URLs
│   ├── index-formats.md   # Index file formats
│   ├── maintenance.md     # Health check and reports
│   ├── schemas/           # Article templates per content type
│   └── scripts/
│       ├── crawl.py           # Web page → Markdown + images
│       ├── index_builder.py   # Indexes + health check
│       ├── graph_generator.py # Knowledge graph data
│       └── requirements.txt
├── knowledge_base/
│   ├── raw/               # Inbox: crawled pages, images, and filed answers
│   ├── wiki/              # Your compiled knowledge base
│   │   ├── _master-index.md   # One line per article (auto-generated)
│   │   ├── _tools-index.md    # Tool + version → articles (auto-generated)
│   │   └── _ttp-index.md      # ATT&CK technique → articles (auto-generated)
│   └── graph/             # Graph viewer (index.html)
├── install.sh / update.sh / uninstall.sh
└── LICENSE
```

</details>

---

## Supported AI Agents

| Agent | How it connects |
|---|---|
| [Claude Code](https://www.anthropic.com/claude-code) | Reads `CLAUDE.md` automatically |
| [OpenCode](https://opencode.ai/) | Reads `AGENTS.md` automatically |
| [Pi](https://github.com/badlogic/pi-mono) | Reads `AGENTS.md` automatically |
| [Cursor](https://cursor.com/), [Antigravity](https://antigravity.google/), others | Open the folder and point the agent at `AGENTS.md` |

Image transcription (screenshots, disassembly, diagrams) needs a model that can read images.

---

## FAQ

**How is this different from RAG or a vector database?**
RAG splits documents into chunks and retrieves them at question time, which can break up assembly listings and lose exact bytes. LLM-RE-WIKI compiles each source once into a clean article that keeps code and offsets intact, then searches those articles directly.

**Does my data leave my machine?**
The knowledge base is local files. Your notes are sent only to whichever AI model your agent uses, as with any coding agent.

**Can I use it with Obsidian?**
Yes. Open `knowledge_base/wiki/` as an Obsidian vault — articles use `[[wiki/...]]` links.

**What if a page can't be crawled?**
Some sites block bots or need JavaScript. Save the page as Markdown (e.g. with the MarkDownload browser extension), put it in `knowledge_base/raw/feeds/`, and run `compile` on it.

**Can I add my own notes?**
Yes. Drop any `.md` file into `knowledge_base/raw/feeds/` and run `compile <file>`.

**What if two writeups cover the same target?**
The agent merges the new details into the existing article instead of creating a duplicate. Both sources are listed in the article's `sources:` field, and conflicting claims are marked `[X]`.

**What if I ingest the same URL twice?**
It's skipped, and you're told which file already has it. Add `--force` to crawl it again (for example, if the page was updated).

**Should I edit the index files?**
No. `_master-index.md`, `_tools-index.md`, and `_ttp-index.md` are rebuilt from your articles on every `compile` or `reindex`, so manual edits would be overwritten.

---

## Update & Uninstall

```bash
~/.llm-re-wiki/update.sh      # pulls the latest version, keeps your notes
~/.llm-re-wiki/uninstall.sh   # offers to back up your notes first
```

---

## Contributing

Issues and pull requests are welcome — especially new schemas, crawler improvements, and bug fixes. Fork the repo, create a branch, and open a PR.

## License

[Apache 2.0](LICENSE)
