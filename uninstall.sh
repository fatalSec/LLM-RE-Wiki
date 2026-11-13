#!/usr/bin/env bash
# ==============================================================================
# LLM-RE-WIKI — Safe Uninstaller Script
# Idempotently removes global CLI symlinks, configs, and provides options
# to archive or preserve research notes in knowledge_base/
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

CONFIG_FILE="$HOME/.config/llm-re-wiki/config"

resolve_vault_dir() {
    if [ -f "./AGENTS.md" ] && [ -d "./.kb" ] && [ -d "./knowledge_base" ]; then
        pwd
        return
    fi

    if [ -f "$CONFIG_FILE" ]; then
        # shellcheck disable=SC1090
        . "$CONFIG_FILE"
        if [ -n "$VAULT_DIR" ] && [ -d "$VAULT_DIR" ]; then
            echo "$VAULT_DIR"
            return
        fi
    fi

    SCRIPT_DIR="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
    if [ -f "$SCRIPT_DIR/AGENTS.md" ] && [ -d "$SCRIPT_DIR/.kb" ]; then
        echo "$SCRIPT_DIR"
        return
    fi

    if [ -d "$HOME/llm-re-wiki" ]; then
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
    printf "Vault Directory: %bNot registered in config%b\n\n" "$YELLOW" "$RESET"
fi

echo "Please choose an uninstallation option:"
echo "  1) Keep Knowledge Base Notes (Recommended)"
echo "     Removes ~/.local/bin/llm-re-wiki and ~/.config/llm-re-wiki."
echo "     Leaves all notes and vault files completely untouched."
echo ""
echo "  2) Create Backup Archive & Remove Vault"
echo "     Exports ~/llm-re-wiki-backup-<timestamp>.tar.gz before removing the vault."
echo ""
echo "  3) Complete Wipe"
echo "     Permanently removes the vault directory and CLI wrapper (requires confirmation)."
echo ""
echo "  4) Cancel"
echo ""

CHOICE="$(prompt_input "Enter choice [1-4, default: 4]: " "4")"

case "$CHOICE" in
    1)
        printf "\n[*] Removing global CLI symlink and config...\n"
        rm -f "$HOME/.local/bin/llm-re-wiki"
        rm -rf "$HOME/.config/llm-re-wiki"
        printf "%b[✓] CLI wrapper removed. Your knowledge base and research notes remain intact at:%b\n" "$GREEN" "$RESET"
        [ -n "$VAULT_DIR" ] && printf "    %s\n" "$VAULT_DIR"
        ;;
    2)
        if [ -z "$VAULT_DIR" ] || [ ! -d "$VAULT_DIR" ]; then
            printf "%b[X] Vault directory could not be found to archive.%b\n" "$RED" "$RESET" >&2
            exit 1
        fi
        TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
        BACKUP_FILE="$HOME/llm-re-wiki-backup-${TIMESTAMP}.tar.gz"
        printf "\n[*] Archiving vault to %s...\n" "$BACKUP_FILE"
        tar -czf "$BACKUP_FILE" -C "$(dirname "$VAULT_DIR")" "$(basename "$VAULT_DIR")"
        printf "%b[✓] Backup archive created successfully: %s%b\n" "$GREEN" "$BACKUP_FILE" "$RESET"

        printf "[*] Removing vault directory: %s...\n" "$VAULT_DIR"
        rm -rf "$VAULT_DIR"
        rm -f "$HOME/.local/bin/llm-re-wiki"
        rm -rf "$HOME/.config/llm-re-wiki"
        printf "%b[✓] LLM-RE-WIKI uninstalled. Your research is safely preserved in %s%b\n" "$GREEN" "$BACKUP_FILE" "$RESET"
        ;;
    3)
        if [ -z "$VAULT_DIR" ] || [ ! -d "$VAULT_DIR" ]; then
            printf "%b[!] No vault directory found to remove. Cleaning CLI symlinks...%b\n" "$YELLOW" "$RESET"
            rm -f "$HOME/.local/bin/llm-re-wiki"
            rm -rf "$HOME/.config/llm-re-wiki"
            exit 0
        fi
        printf "\n%b%bWARNING: This will permanently delete %s and all research notes!%b\n" "$RED" "$BOLD" "$VAULT_DIR" "$RESET"
        CONFIRM="$(prompt_input "Type DELETE to confirm: " "")"
        if [ "$CONFIRM" = "DELETE" ]; then
            printf "[*] Removing %s...\n" "$VAULT_DIR"
            rm -rf "$VAULT_DIR"
            rm -f "$HOME/.local/bin/llm-re-wiki"
            rm -rf "$HOME/.config/llm-re-wiki"
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
