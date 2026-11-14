#!/usr/bin/env python3
"""
Register / unregister the LLM-RE-WIKI MCP server with the AI agents installed on this machine.

Usage:
    register.py detect                         list installed agents that support MCP
    register.py status  --agent <name>         exit 0 if registered, 1 if not
    register.py add     --agent <name|all>     register (skips agents where it already is)
    register.py remove  --agent <name|all>     unregister

Agents:
    claude    Claude Code   via `claude mcp add|get|remove --scope user`
    opencode  OpenCode      via `opencode mcp add --global`; checked/removed in ~/.config/opencode/opencode.json
    cursor    Cursor        ~/.cursor/mcp.json ("mcpServers")

The server is launched with this Python (the KB's venv) and .kb/mcp/server.py next to this file.
JSON config files are backed up (*.bak) before every change and never rewritten if they can't be parsed.
Stdlib only.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

NAME = "llm-re-wiki"
SERVER = Path(__file__).resolve().parent / "server.py"
PYTHON = sys.executable
AGENTS = ("claude", "opencode", "cursor")
LABELS = {"claude": "Claude Code", "opencode": "OpenCode", "cursor": "Cursor"}


# ---------------------------------------------------------------------------
# Detection & paths
# ---------------------------------------------------------------------------

def _opencode_bin() -> str | None:
    found = shutil.which("opencode")
    if found:
        return found
    fallback = Path.home() / ".opencode" / "bin" / "opencode"
    return str(fallback) if fallback.is_file() else None


def _opencode_config() -> Path:
    base = Path(os.environ.get("XDG_CONFIG_HOME") or Path.home() / ".config") / "opencode"
    for name in ("opencode.json", "opencode.jsonc"):
        if (base / name).is_file():
            return base / name
    return base / "opencode.json"


def _cursor_config() -> Path:
    return Path.home() / ".cursor" / "mcp.json"


def detect() -> list[str]:
    found = []
    if shutil.which("claude"):
        found.append("claude")
    if _opencode_bin():
        found.append("opencode")
    if shutil.which("cursor") or (Path.home() / ".cursor").is_dir():
        found.append("cursor")
    return found


# ---------------------------------------------------------------------------
# JSON config helpers
# ---------------------------------------------------------------------------

class UnreadableConfig(Exception):
    pass


def _strip_jsonc(text: str) -> str:
    """Removes // and /* */ comments (outside strings) and trailing commas, so JSONC parses as JSON."""
    out, i, n, in_str = [], 0, len(text), False
    while i < n:
        ch = text[i]
        if in_str:
            out.append(ch)
            if ch == "\\" and i + 1 < n:
                out.append(text[i + 1])
                i += 2
                continue
            if ch == '"':
                in_str = False
        elif ch == '"':
            in_str = True
            out.append(ch)
        elif text.startswith("//", i):
            while i < n and text[i] != "\n":
                i += 1
            continue
        elif text.startswith("/*", i):
            end = text.find("*/", i + 2)
            i = n if end == -1 else end + 2
            continue
        else:
            out.append(ch)
        i += 1
    return re.sub(r",(\s*[}\]])", r"\1", "".join(out))


def _load(path: Path, jsonc: bool = False) -> dict:
    """Strict JSON by default (safe to rewrite). jsonc=True also accepts comments and
    trailing commas — for read-only checks only, since rewriting would drop comments."""
    if not path.is_file():
        return {}
    text = path.read_text(encoding="utf-8") or "{}"
    try:
        data = json.loads(_strip_jsonc(text) if jsonc else text)
    except json.JSONDecodeError as e:
        kind = "has a syntax error" if jsonc else "is not plain JSON"
        raise UnreadableConfig(f"{path} {kind} (line {e.lineno}: {e.msg}); fix or edit it by hand") from e
    if not isinstance(data, dict):
        raise UnreadableConfig(f"{path} does not contain a JSON object; edit it by hand")
    return data


def _save(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.is_file():
        shutil.copy2(path, path.with_name(path.name + ".bak"))
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    os.replace(tmp, path)


def _opencode_servers(data: dict) -> list[dict]:
    """OpenCode v2 keeps servers under mcp.servers; older versions directly under mcp."""
    mcp = data.get("mcp")
    if not isinstance(mcp, dict):
        return []
    tables = [mcp]
    if isinstance(mcp.get("servers"), dict):
        tables.insert(0, mcp["servers"])
    return tables


# ---------------------------------------------------------------------------
# Per-agent operations
# ---------------------------------------------------------------------------

def _run(cmd: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, capture_output=True, text=True, timeout=120)


def is_registered(agent: str) -> bool:
    if agent == "claude":
        return shutil.which("claude") is not None and _run(["claude", "mcp", "get", NAME]).returncode == 0
    if agent == "opencode":
        try:
            return any(NAME in table for table in _opencode_servers(_load(_opencode_config(), jsonc=True)))
        except UnreadableConfig:
            return False
    if agent == "cursor":
        try:
            return NAME in (_load(_cursor_config()).get("mcpServers") or {})
        except UnreadableConfig:
            return False
    raise ValueError(agent)


def add(agent: str) -> str:
    if is_registered(agent):
        return "already registered"
    if agent == "claude":
        r = _run(["claude", "mcp", "add", "--scope", "user", NAME, "--", PYTHON, str(SERVER)])
        if r.returncode:
            raise RuntimeError((r.stderr or r.stdout).strip())
        return "registered (user scope, all projects)"
    if agent == "opencode":
        path = _opencode_config()
        # Never let `opencode mcp add` edit a config that is already broken: it appends to it
        # anyway and the result can't be loaded. Raises UnreadableConfig with the line number.
        _load(path, jsonc=True)
        r = _run([_opencode_bin() or "opencode", "mcp", "add", "--global", NAME, "--", PYTHON, str(SERVER)])
        if r.returncode:
            raise RuntimeError((r.stderr or r.stdout).strip())
        if not is_registered("opencode"):
            raise RuntimeError(f"OpenCode reported success, but {path} doesn't contain a loadable entry; check that file")
        return (f"registered (global: {path}). Restart OpenCode's background service to load it: "
                "opencode service restart")
    if agent == "cursor":
        path = _cursor_config()
        data = _load(path)
        data.setdefault("mcpServers", {})[NAME] = {"type": "stdio", "command": PYTHON, "args": [str(SERVER)]}
        _save(path, data)
        return f"registered ({path})"
    raise ValueError(agent)


def remove(agent: str) -> str:
    if not is_registered(agent):
        return "not registered"
    if agent == "claude":
        r = _run(["claude", "mcp", "remove", NAME, "--scope", "user"])
        if r.returncode:
            raise RuntimeError((r.stderr or r.stdout).strip())
        return "removed"
    if agent == "opencode":
        path = _opencode_config()
        try:
            data = _load(path)  # strict: never rewrite a JSONC file (its comments would be lost)
        except UnreadableConfig:
            _load(path, jsonc=True)  # re-raises if the file is actually broken
            raise UnreadableConfig(f'{path} contains comments, so it is not rewritten automatically; '
                                   f'delete the "{NAME}" entry under "mcp" by hand') from None
        for table in _opencode_servers(data):
            table.pop(NAME, None)
        _save(path, data)
        return f"removed from {path}"
    if agent == "cursor":
        path = _cursor_config()
        data = _load(path)
        data.get("mcpServers", {}).pop(NAME, None)
        _save(path, data)
        return f"removed from {path}"
    raise ValueError(agent)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(description="Register the LLM-RE-WIKI MCP server with installed agents.")
    parser.add_argument("action", choices=["detect", "status", "add", "remove"])
    parser.add_argument("--agent", default="all", help="claude | opencode | cursor | all (default: all)")
    args = parser.parse_args()

    if args.action == "detect":
        print(" ".join(detect()))
        return 0

    if args.agent == "all":
        agents = detect()
    elif args.agent in AGENTS:
        agents = [args.agent]
    else:
        parser.error(f"unknown agent '{args.agent}' (choose: {', '.join(AGENTS)}, all)")

    if args.action == "status":
        return 0 if agents and all(is_registered(a) for a in agents) else 1

    failed = False
    for agent in agents:
        try:
            result = add(agent) if args.action == "add" else remove(agent)
            print(f"  [✓] {LABELS[agent]}: {result}")
        except (RuntimeError, UnreadableConfig, OSError, subprocess.TimeoutExpired) as e:
            failed = True
            print(f"  [!] {LABELS[agent]}: {e}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
