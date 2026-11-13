#!/usr/bin/env bash
# ==============================================================================
# LLM-RE-WIKI — Universal One-Line Installer & Multi-Agent Bootstrapper
# Supports: Claude Code, OpenCode, Pi, and Standalone Operation
# ==============================================================================

set -e

# Terminal colors
if [ -t 1 ]; then
    BOLD="\033[1m"
    GREEN="\033[0;32m"
    BLUE="\033[0;34m"
    YELLOW="\033[0;33m"
    RED="\033[0;31m"
    CYAN="\033[0;36m"
    DIM="\033[2m"
    RESET="\033[0m"
else
    BOLD=""
    GREEN=""
    BLUE=""
    YELLOW=""
    RED=""
    CYAN=""
    DIM=""
    RESET=""
fi

REPO_URL="https://github.com/fatalSec/LLM-RE-WIKI.git"
DEFAULT_INSTALL_DIR="$HOME/.llm-re-wiki"
ARG_DIR=""
ARG_AGENT=""
ARG_YES=0
ARG_NO_VENV=0

# Helper to read from /dev/tty if stdin is piped (e.g. curl | bash)
prompt_user() {
    local prompt_msg="$1"
    local default_ans="$2"
    local user_ans=""

    if [ -t 0 ]; then
        read -r -p "$prompt_msg" user_ans
    elif [ -e /dev/tty ]; then
        read -r -p "$prompt_msg" user_ans < /dev/tty
    else
        user_ans="$default_ans"
    fi
    echo "${user_ans:-$default_ans}"
}

show_banner() {
    printf "%b%b" "$CYAN" "$BOLD"
    cat << "EOF"
  _      _      __  __        _____  ______      __          _______ _  _______ 
 | |    | |    |  \/  |      |  __ \|  ____|     \ \        / /_   _| |/ /_   _|
 | |    | |    | \  / |______| |__) | |__ ______  \ \  /\  / /  | | | ' /  | |  
 | |    | |    | |\/| |______|  _  /|  __|______|  \ \/  \/ /   | | |  <   | |  
 | |____| |____| |  | |      | | \ \| |____         \  /\  /   _| |_| . \ _| |_ 
 |______|______|_|  |_|      |_|  \_\______|         \/  \/   |_____|_|\_\_____|
EOF
    printf "%b" "$RESET"
    echo "  Universal AI Reverse Engineering Knowledge Base Installer"
    echo ""
}

show_help() {
    echo "LLM-RE-WIKI One-Line Installer"
    echo ""
    echo "Usage: ./install.sh [options]"
    echo "   or: curl -fsSL https://raw.githubusercontent.com/fatalSec/LLM-RE-WIKI/main/install.sh | bash -s -- [options]"
    echo ""
    echo "Options:"
    echo "  --dir <path>       Install destination (default: ~/.llm-re-wiki or current repo)"
    echo "  --agent <name>     Target agent: claude | opencode | pi | all | standalone"
    echo "  -y, --yes          Non-interactive mode (accept all defaults)"
    echo "  --no-venv          Skip creating Python virtual environment"
    echo "  -h, --help         Show this help message"
    echo ""
    exit 0
}

# Parse command line options
while [ $# -gt 0 ]; do
    case "$1" in
        --dir)
            ARG_DIR="$2"
            shift 2
            ;;
        --agent)
            ARG_AGENT="$2"
            shift 2
            ;;
        -y|--yes)
            ARG_YES=1
            shift
            ;;
        --no-venv)
            ARG_NO_VENV=1
            shift
            ;;
        -h|--help)
            show_help
            ;;
        *)
            printf "%bUnknown option: %s%b\n" "$RED" "$1" "$RESET" >&2
            show_help
            ;;
    esac
done

show_banner

# Step 1: Check Prerequisites
printf "%b==> Checking Prerequisites...%b\n" "$BOLD" "$RESET"

if ! command -v git >/dev/null 2>&1; then
    printf "%b[X] git is required but not installed.%b\n" "$RED" "$RESET" >&2
    exit 1
fi
printf "  %b[✓]%b Git: %s\n" "$GREEN" "$RESET" "$(git --version | head -n1)"

if ! command -v python3 >/dev/null 2>&1; then
    printf "%b[X] python3 is required but not installed.%b\n" "$RED" "$RESET" >&2
    exit 1
fi
PY_VER="$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')"
printf "  %b[✓]%b Python: %s (Python %s)\n" "$GREEN" "$RESET" "$(command -v python3)" "$PY_VER"

if ! command -v curl >/dev/null 2>&1; then
    printf "%b[!] curl is not installed. Recommended for article ingestion.%b\n" "$YELLOW" "$RESET"
fi

# Step 2: Agent Discovery
printf "\n%b==> Detecting Installed AI Coding Agents...%b\n" "$BOLD" "$RESET"

CLAUDE_PATH="$(command -v claude 2>/dev/null || true)"
OPENCODE_PATH="$(command -v opencode 2>/dev/null || true)"
PI_PATH="$(command -v pi 2>/dev/null || true)"

DETECTED_COUNT=0
if [ -n "$CLAUDE_PATH" ]; then
    printf "  %b[✓] Claude Code:%b %s\n" "$GREEN" "$RESET" "$CLAUDE_PATH"
    DETECTED_COUNT=$((DETECTED_COUNT + 1))
else
    printf "  %b[-] Claude Code:%b Not found in PATH\n" "$DIM" "$RESET"
fi

if [ -n "$OPENCODE_PATH" ]; then
    printf "  %b[✓] OpenCode:%b    %s\n" "$GREEN" "$RESET" "$OPENCODE_PATH"
    DETECTED_COUNT=$((DETECTED_COUNT + 1))
else
    printf "  %b[-] OpenCode:%b    Not found in PATH\n" "$DIM" "$RESET"
fi

if [ -n "$PI_PATH" ]; then
    printf "  %b[✓] Pi:%b          %s\n" "$GREEN" "$RESET" "$PI_PATH"
    DETECTED_COUNT=$((DETECTED_COUNT + 1))
else
    printf "  %b[-] Pi:%b          Not found in PATH\n" "$DIM" "$RESET"
fi

# Step 3: Determine Target Directory
CURRENT_DIR="$(pwd)"
IS_INSIDE_REPO=0
if [ -f "$CURRENT_DIR/AGENTS.md" ] && [ -d "$CURRENT_DIR/.kb" ]; then
    IS_INSIDE_REPO=1
    DEFAULT_INSTALL_DIR="$CURRENT_DIR"
fi

TARGET_DIR="$ARG_DIR"
if [ -z "$TARGET_DIR" ]; then
    if [ "$ARG_YES" -eq 1 ]; then
        TARGET_DIR="$DEFAULT_INSTALL_DIR"
    else
        printf "\n%b==> Target Installation Directory%b\n" "$BOLD" "$RESET"
        if [ "$IS_INSIDE_REPO" -eq 1 ]; then
            printf "Detected existing LLM-RE-WIKI directory at: %s\n" "$CURRENT_DIR"
            TARGET_DIR="$(prompt_user "Use current directory? [Y/n]: " "Y")"
            case "$TARGET_DIR" in
                y|Y|yes|YES) TARGET_DIR="$CURRENT_DIR" ;;
                *) TARGET_DIR="$(prompt_user "Enter target directory: " "$HOME/.llm-re-wiki")" ;;
            esac
        else
            TARGET_DIR="$(prompt_user "Where would you like to install LLM-RE-WIKI? [$DEFAULT_INSTALL_DIR]: " "$DEFAULT_INSTALL_DIR")"
        fi
    fi
fi

# Expand tilde and normalize path
TARGET_DIR="${TARGET_DIR/#\~/$HOME}"
if [ -d "$TARGET_DIR" ]; then
    TARGET_DIR="$(cd "$TARGET_DIR" && pwd)"
else
    mkdir -p "$(dirname "$TARGET_DIR")" 2>/dev/null || true
    TARGET_DIR="$(cd "$(dirname "$TARGET_DIR")" 2>/dev/null && pwd)/$(basename "$TARGET_DIR")"
fi

# Step 4: Agent Selection
SELECTED_AGENT="$ARG_AGENT"
if [ -z "$SELECTED_AGENT" ]; then
    if [ "$ARG_YES" -eq 1 ]; then
        if [ "$DETECTED_COUNT" -gt 0 ]; then
            SELECTED_AGENT="all"
        else
            SELECTED_AGENT="standalone"
        fi
    else
        printf "\n%b==> Select Target Agent Configuration%b\n" "$BOLD" "$RESET"
        echo "Which AI coding agent would you like to configure?"
        echo "  1) Claude Code  (bridges via CLAUDE.md)"
        echo "  2) OpenCode     (bridges via AGENTS.md)"
        echo "  3) Pi           (bridges via AGENTS.md)"
        echo "  4) All Agents   (configures bridges for Claude Code, OpenCode, and Pi)"
        echo "  5) Standalone   (generic markdown instructions for any AI agent)"
        echo ""

        DEFAULT_CHOICE="4"
        if [ "$DETECTED_COUNT" -eq 1 ]; then
            [ -n "$CLAUDE_PATH" ] && DEFAULT_CHOICE="1"
            [ -n "$OPENCODE_PATH" ] && DEFAULT_CHOICE="2"
            [ -n "$PI_PATH" ] && DEFAULT_CHOICE="3"
        fi

        CHOICE="$(prompt_user "Select option [1-5, default: $DEFAULT_CHOICE]: " "$DEFAULT_CHOICE")"
        case "$CHOICE" in
            1|claude) SELECTED_AGENT="claude" ;;
            2|opencode) SELECTED_AGENT="opencode" ;;
            3|pi) SELECTED_AGENT="pi" ;;
            4|all) SELECTED_AGENT="all" ;;
            5|standalone) SELECTED_AGENT="standalone" ;;
            *) SELECTED_AGENT="all" ;;
        esac
    fi
fi

printf "\n%bSummary:%b\n" "$BOLD" "$RESET"
printf "  • Install directory: %b%s%b\n" "$CYAN" "$TARGET_DIR" "$RESET"
printf "  • Configured agent:  %b%s%b\n" "$CYAN" "$SELECTED_AGENT" "$RESET"
echo ""

# Step 5: Clone or Update Repository
if [ -d "$TARGET_DIR/.git" ]; then
    printf "%b==> Repository already exists at %s. Ensuring main branch...%b\n" "$BOLD" "$TARGET_DIR" "$RESET"
    cd "$TARGET_DIR"
    git checkout -q main 2>/dev/null || true
else
    printf "%b==> Cloning LLM-RE-WIKI (branch: main)...%b\n" "$BOLD" "$RESET"
    mkdir -p "$(dirname "$TARGET_DIR")"
    git clone -b main "$REPO_URL" "$TARGET_DIR"
    cd "$TARGET_DIR"
fi

# Step 6: Verify Agent Instruction Bridges
printf "\n%b==> Verifying Agent Instruction Bridges...%b\n" "$BOLD" "$RESET"
if [ ! -f "$TARGET_DIR/AGENTS.md" ]; then
    printf "%b[X] Missing AGENTS.md in repository!%b\n" "$RED" "$RESET" >&2
    exit 1
fi
printf "  %b[✓] AGENTS.md:%b Present (for OpenCode, Pi, and Antigravity)\n" "$GREEN" "$RESET"

if [ ! -f "$TARGET_DIR/CLAUDE.md" ]; then
    printf "  %b[*] Creating CLAUDE.md bridge...%b\n" "$YELLOW" "$RESET"
    cat > "$TARGET_DIR/CLAUDE.md" << 'CLAUDE_EOF'
# CLAUDE.md — Claude Code Bridge for LLM-RE-WIKI

> You are the **KB Custodian** for this Reverse Engineering Knowledge Base.
> Your task is to compile, index, query, and maintain technical reverse-engineering documentation.
> Always follow the master directives in [AGENTS.md](AGENTS.md) and [.kb/core-rules.md](.kb/core-rules.md).

---

## Directives & Execution Protocol

When the user asks you to perform an action, load ONLY the required instruction files into your context:

| User Command / Trigger | Instructions to Load | Action |
|---|---|---|
| `search <query>` / "What does the wiki say about..." | `.kb/core-rules.md` → `.kb/read-protocol.md` | Search `knowledge_base/wiki/` and produce a Unified Technical Response with inline `[V]` / `[AI Synthesis]` markers. |
| `compile <file>` / "Compile this raw file" | `.kb/core-rules.md` → `.kb/write-pipeline.md` → `.kb/schemas/<type>.md` | Extract technical invariants, offsets, opcodes, code snippets, and inlined image text. Compile to `knowledge_base/wiki/<topic>/<slug>.md`, then run index builder. |
| `ingest <url>` | `.kb/ingest-protocol.md` | Run `.kb/scripts/crawl.py <url>` or extract web content into `knowledge_base/raw/`. |
| `health-check` / `gap report` | `.kb/maintenance.md` | Run `python3 .kb/scripts/index_builder.py --check` and report dead links or orphans. |
| `reindex` | — | Run `python3 .kb/scripts/index_builder.py` to regenerate all secondary indexes. |
| `graph` | — | Run `python3 .kb/scripts/graph_generator.py --open` to build and visualize the interactive knowledge graph. |

---

## Core Rules for Claude Code

1. **Zero Paraphrasing:** Never abbreviate, alter, or synthesize memory offsets, opcodes, registers, or function signatures. Keep them verbatim.
2. **Inlined Image Transcription:** Transcribe screenshots, debugger output, call graphs, and assembly snippets directly at the position they occurred in the text (`> **[Image extracted — CATEGORY | confidence: high]**`).
3. **Unified Granular Responses:** When answering questions, provide a single exhaustive technical document with exact opcodes and code snippets. Inline claim markers `[[wiki/...]]` and `[V]` for verified KB facts vs `[AI Synthesis]` for model deductions.
4. **Auto-Index Verification:** Always run `python3 .kb/scripts/index_builder.py` immediately after creating or modifying any wiki article.
5. **Python Environment:** Prefer `.kb/scripts/.venv/bin/python3` if it exists; otherwise use `python3`.
CLAUDE_EOF
fi
printf "  %b[✓] CLAUDE.md:%b Present (for Claude Code)\n" "$GREEN" "$RESET"

# Step 7: Setup Python Environment
if [ "$ARG_NO_VENV" -eq 0 ]; then
    printf "\n%b==> Setting up Python virtual environment...%b\n" "$BOLD" "$RESET"
    VENV_DIR="$TARGET_DIR/.kb/scripts/.venv"
    if [ ! -d "$VENV_DIR" ]; then
        python3 -m venv "$VENV_DIR"
    fi

    if [ -x "$VENV_DIR/bin/pip" ]; then
        printf "  [*] Installing dependencies from .kb/scripts/requirements.txt...\n"
        "$VENV_DIR/bin/pip" install -q --upgrade pip 2>/dev/null || true
        if "$VENV_DIR/bin/pip" install -q -r "$TARGET_DIR/.kb/scripts/requirements.txt"; then
            printf "  %b[✓] Virtual environment ready.%b\n" "$GREEN" "$RESET"
        else
            printf "  %b[!] Notice: Optional pip dependencies had warnings (scripts will still run).%b\n" "$YELLOW" "$RESET"
        fi
    fi
fi

# Step 8: Ensure scripts are executable
chmod +x "$TARGET_DIR/"*.sh 2>/dev/null || true

# Step 9: Verify Knowledge Base Integrity
printf "\n%b==> Running KB Self-Check...%b\n" "$BOLD" "$RESET"
cd "$TARGET_DIR"
if [ -x "$TARGET_DIR/.kb/scripts/.venv/bin/python3" ]; then
    "$TARGET_DIR/.kb/scripts/.venv/bin/python3" .kb/scripts/index_builder.py --check
else
    python3 .kb/scripts/index_builder.py --check
fi

# Step 10: Complete!
printf "\n%b%b========================================================================%b\n" "$GREEN" "$BOLD" "$RESET"
printf "%b%b  LLM-RE-WIKI Successfully Installed!%b\n" "$GREEN" "$BOLD" "$RESET"
printf "%b%b========================================================================%b\n\n" "$GREEN" "$BOLD" "$RESET"

echo "Location: $TARGET_DIR"
echo ""
echo "How to launch your AI Agent:"
case "$SELECTED_AGENT" in
    claude)
        echo "  cd $TARGET_DIR && claude"
        ;;
    opencode)
        echo "  cd $TARGET_DIR && opencode"
        ;;
    pi)
        echo "  cd $TARGET_DIR && pi"
        ;;
    *)
        echo "  • Claude Code: cd $TARGET_DIR && claude"
        echo "  • OpenCode:    cd $TARGET_DIR && opencode"
        echo "  • Pi:          cd $TARGET_DIR && pi"
        ;;
esac

echo ""
echo "Idempotent Lifecycle Scripts:"
echo "  • Update:    $TARGET_DIR/update.sh"
echo "  • Uninstall: $TARGET_DIR/uninstall.sh"
echo ""
