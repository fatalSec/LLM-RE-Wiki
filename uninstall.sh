#!/usr/bin/env bash
# ==============================================================================
# LLM-RE-WIKI — Safe Uninstaller Script
# Provides safe options to archive research notes and remove the repository.
# ==============================================================================

set -e

# Terminal styling
if [ -t 1 ]; then
    BOLD="\033[1m"
    GREEN="\033[0;32m"
    YELLOW="\033[0;33m"
    RED="\033[0;31m"
    CYAN="\033[0;36m"
    RESET="\033[0m"
else
    BOLD=""
    GREEN=""
    YELLOW=""
    RED=""
    CYAN=""
    RESET=""
fi

resolve_vault_dir() {
    if [ -f "./AGENTS.md" ] && [ -d "./.kb" ]; then
        pwd
        return
    fi

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

prompt_input() {
    local prompt_msg="$1"
    local default_ans="$2"
    local ans=""

    if [ -t 0 ]; then
        read -r -p "$prompt_msg" ans
    elif [ -e /dev/tty ]; then
        read -r -p "$prompt_msg" ans < /dev/tty
    else
        ans="$default_ans"
    fi
    echo "${ans:-$default_ans}"
}

printf "%b%b=== LLM-RE-WIKI Safe Uninstaller ===%b\n\n" "$BOLD" "$RED" "$RESET"

if [ -n "$VAULT_DIR" ]; then
    printf "Detected Vault Directory: %b%s%b\n\n" "$CYAN" "$VAULT_DIR" "$RESET"
else
    printf "%bError: LLM-RE-WIKI vault directory could not be located.%b\n" "$RED" "$RESET" >&2
    exit 1
fi

echo "Please choose an uninstallation option:"
echo "  1) Create Backup Archive & Remove Vault (Recommended)"
echo "     Exports ~/llm-re-wiki-backup-<timestamp>.tar.gz before removing the vault."
echo ""
echo "  2) Complete Wipe"
echo "     Permanently removes the vault directory and all notes (requires confirmation)."
echo ""
echo "  3) Cancel"
echo ""

CHOICE="$(prompt_input "Enter choice [1-3, default: 3]: " "3")"

# Clean legacy symlinks/configs if present
rm -f "$HOME/.local/bin/llm-re-wiki" 2>/dev/null || true
rm -rf "$HOME/.config/llm-re-wiki" 2>/dev/null || true

case "$CHOICE" in
    1)
        TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
        BACKUP_FILE="$HOME/llm-re-wiki-backup-${TIMESTAMP}.tar.gz"
        printf "\n[*] Archiving vault to %s...\n" "$BACKUP_FILE"
        tar -czf "$BACKUP_FILE" -C "$(dirname "$VAULT_DIR")" "$(basename "$VAULT_DIR")"
        printf "%b[✓] Backup archive created successfully: %s%b\n" "$GREEN" "$BACKUP_FILE" "$RESET"

        printf "[*] Removing vault directory: %s...\n" "$VAULT_DIR"
        rm -rf "$VAULT_DIR"
        printf "%b[✓] LLM-RE-WIKI uninstalled. Your research is safely preserved in %s%b\n" "$GREEN" "$BACKUP_FILE" "$RESET"
        ;;
    2)
        printf "\n%b%bWARNING: This will permanently delete %s and all research notes!%b\n" "$RED" "$BOLD" "$VAULT_DIR" "$RESET"
        CONFIRM="$(prompt_input "Type DELETE to confirm: " "")"
        if [ "$CONFIRM" = "DELETE" ]; then
            printf "[*] Removing %s...\n" "$VAULT_DIR"
            rm -rf "$VAULT_DIR"
            printf "%b[✓] LLM-RE-WIKI completely removed.%b\n" "$GREEN" "$RESET"
        else
            printf "%bConfirmation aborted. Nothing was deleted.%b\n" "$YELLOW" "$RESET"
            exit 0
        fi
        ;;
    *)
        echo "Uninstallation cancelled."
        exit 0
        ;;
esac
