#!/usr/bin/env bash
# ==============================================================================
# LLM-RE-WIKI — Idempotent Safe Update Script
# Preserves local research notes, targets, and overrides while fast-forwarding
# upstream knowledge (protocols, schemas, and automation scripts).
# ==============================================================================

set -e

# Terminal styling
if [ -t 1 ]; then
    BOLD="\033[1m"
    GREEN="\033[0;32m"
    BLUE="\033[0;34m"
    YELLOW="\033[0;33m"
    RED="\033[0;31m"
    CYAN="\033[0;36m"
    RESET="\033[0m"
else
    BOLD=""
    GREEN=""
    BLUE=""
    YELLOW=""
    RED=""
    CYAN=""
    RESET=""
fi

resolve_vault_dir() {
    # 1. If currently inside a vault repo
    if [ -f "./AGENTS.md" ] && [ -d "./.kb" ]; then
        pwd
        return
    fi

    # 2. From script location (works whether in root or in scripts/)
    SCRIPT_DIR="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
    if [ -f "$SCRIPT_DIR/AGENTS.md" ] && [ -d "$SCRIPT_DIR/.kb" ]; then
        echo "$SCRIPT_DIR"
        return
    fi
    PARENT_DIR="$(cd -P "$SCRIPT_DIR/.." >/dev/null 2>&1 && pwd)"
    if [ -f "$PARENT_DIR/AGENTS.md" ] && [ -d "$PARENT_DIR/.kb" ]; then
        echo "$PARENT_DIR"
        return
    fi

    # 3. Standard default locations
    if [ -d "$HOME/.llm-re-wiki" ]; then
        echo "$HOME/.llm-re-wiki"
        return
    elif [ -d "$HOME/llm-re-wiki" ]; then
        echo "$HOME/llm-re-wiki"
        return
    fi

    echo ""
}

VAULT_DIR="$(resolve_vault_dir)"

if [ -z "$VAULT_DIR" ] || [ ! -d "$VAULT_DIR" ]; then
    printf "%bError: LLM-RE-WIKI vault directory not found.%b\n" "$RED" "$RESET" >&2
    printf "Please run update.sh from within the LLM-RE-WIKI repository directory.\n" >&2
    exit 1
fi

cd "$VAULT_DIR"

printf "%b%b=== LLM-RE-WIKI Idempotent Update ===%b\n" "$BOLD" "$BLUE" "$RESET"
printf "Vault Directory: %b%s%b\n" "$CYAN" "$VAULT_DIR" "$RESET"

# 1. Git Verification & Branch Detection
if [ ! -d ".git" ]; then
    printf "%b[X] %s is not a Git repository. Cannot fast-forward upstream.%b\n" "$RED" "$VAULT_DIR" "$RESET" >&2
    exit 1
fi

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")"
printf "Active Branch:   %b%s%b\n\n" "$CYAN" "$CURRENT_BRANCH" "$RESET"

# 2. Safe Stash for Modified Tracked Files
HAS_LOCAL_MODS=0
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    HAS_LOCAL_MODS=1
    STASH_NAME="llm-re-wiki-update-$(date +%Y%m%d_%H%M%S)"
    printf "%b[*] Local modifications detected in tracked files.%b\n" "$YELLOW" "$RESET"
    printf "    Safely stashing local modifications to '%s'...\n" "$STASH_NAME"
    git stash push -m "$STASH_NAME"
fi

# 3. Fetch and Fast-Forward Upstream
printf "[*] Fetching updates from origin/%s...\n" "$CURRENT_BRANCH"
git fetch origin "$CURRENT_BRANCH"

printf "[*] Fast-forwarding upstream changes (git pull --ff-only)...\n"
if git pull --ff-only origin "$CURRENT_BRANCH"; then
    printf "  %b[✓] Upstream knowledge fast-forwarded successfully.%b\n" "$GREEN" "$RESET"
else
    printf "\n%b[!] Notice: Fast-forward was not possible (local branch has diverged).%b\n" "$YELLOW" "$RESET"
    printf "    Your local research and custom commits are safe.\n"
    printf "    To reconcile manually: cd %s && git rebase origin/%s\n" "$VAULT_DIR" "$CURRENT_BRANCH"
    if [ "$HAS_LOCAL_MODS" -eq 1 ]; then
        git stash pop || true
    fi
    exit 1
fi

# 4. Restore Stashed Modifications
if [ "$HAS_LOCAL_MODS" -eq 1 ]; then
    printf "[*] Restoring stashed local modifications...\n"
    if git stash pop; then
        printf "  %b[✓] Local modifications restored cleanly.%b\n" "$GREEN" "$RESET"
    else
        printf "  %b[!] Note: Conflicts occurred while reapplying local modifications.%b\n" "$YELLOW" "$RESET"
        printf "      Run 'git status' inside %s to review.\n" "$VAULT_DIR"
    fi
fi

# 5. Idempotent Python Virtualenv Dependency Check
VENV_DIR="$VAULT_DIR/.kb/scripts/.venv"
if [ -d "$VENV_DIR" ] && [ -x "$VENV_DIR/bin/pip" ]; then
    printf "[*] Syncing virtual environment dependencies...\n"
    "$VENV_DIR/bin/pip" install -q --upgrade pip 2>/dev/null || true
    if "$VENV_DIR/bin/pip" install -q -r "$VAULT_DIR/.kb/scripts/requirements.txt"; then
        printf "  %b[✓] Dependencies up to date.%b\n" "$GREEN" "$RESET"
    fi
fi

# 6. Idempotent Secondary Index Rebuild & Link Validation
printf "[*] Rebuilding secondary indexes and validating KB health...\n"
PYTHON_BIN="python3"
if [ -x "$VENV_DIR/bin/python3" ]; then
    PYTHON_BIN="$VENV_DIR/bin/python3"
fi

if ! "$PYTHON_BIN" "$VAULT_DIR/.kb/scripts/index_builder.py"; then
    printf "%b[!] KB health check found problems (listed above). Your notes are untouched; fix them when convenient.%b\n" "$YELLOW" "$RESET"
fi

# 7. Summary
printf "\n%b%b[✓] LLM-RE-WIKI update complete!%b\n" "$GREEN" "$BOLD" "$RESET"
printf "Your research notes in %b%s/knowledge_base/%b and custom targets are preserved.\n\n" "$CYAN" "$VAULT_DIR" "$RESET"
