#!/usr/bin/env python3
"""
Register / unregister the LLM-RE-WIKI MCP server with the AI agents installed on this machine.

Usage:
    register.py detect                         list installed agents that support MCP
    register.py check                          start the server and list its tools; exit 1 if it can't start
    register.py status  --agent <name>         exit 0 if registered, 1 if not
    register.py add     --agent <name|all>     register (skips agents where it already is);
                                               refuses if `check` fails, so a broken server is never registered
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


# ---------------------------------------------------------------------------
# Preflight: never register a server that can't start
# ---------------------------------------------------------------------------

class ServerBroken(Exception):
    pass


PREFLIGHT_TIMEOUT = 30  # seconds; first start can be slow while Python compiles the SDK
_preflight_result: str | None = None

_KB_VENV = SERVER.parents[1] / "scripts" / ".venv"  # always the KB's own venv, never the running Python's prefix
_FIX = (f"Fix: rebuild the KB venv on Python 3.10+ and install the MCP dependency, e.g.\n"
        f"    rm -rf {_KB_VENV}\n"
        f"    python3.12 -m venv {_KB_VENV}\n"
        f"    {_KB_VENV / 'bin' / 'pip'} install -r {SERVER.parents[1] / 'scripts' / 'requirements.txt'} "
        f"-r {SERVER.parent / 'requirements-mcp.txt'}\n"
        f"then register again with {_KB_VENV / 'bin' / 'python3'} {Path(__file__).resolve()} add\n"
        f"(update.sh does the rebuild automatically when a Python 3.10+ is installed; macOS: brew install python@3.12)")


def preflight() -> str:
    """Starts the server exactly as agents will (PYTHON + SERVER over stdio), sends initialize,
    notifications/initialized and tools/list, and returns a one-line summary. Raises ServerBroken
    with the cause and the fix. The server keeps running after answering, so stdout is read line
    by line until the tools/list reply arrives (not communicate(), which would wait for exit)."""
    global _preflight_result
    if _preflight_result is not None:
        return _preflight_result
    if sys.version_info < (3, 10):
        raise ServerBroken(f"{PYTHON} is Python {sys.version_info.major}.{sys.version_info.minor}; "
                           f"the MCP server needs 3.10+.\n{_FIX}")
    r = _run([PYTHON, "-c", "import mcp"])
    if r.returncode:
        raise ServerBroken(f"the 'mcp' package is not installed in {PYTHON}.\n{_FIX}")

    import queue
    import tempfile
    import threading
    import time

    with tempfile.TemporaryFile(mode="w+") as err:
        proc = subprocess.Popen([PYTHON, str(SERVER)], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                stderr=err, text=True, bufsize=1)
        lines: queue.Queue = queue.Queue()

        def pump() -> None:
            for out_line in proc.stdout:
                lines.put(out_line)
            lines.put(None)  # EOF: the server exited

        threading.Thread(target=pump, daemon=True).start()

        def fail(reason: str) -> ServerBroken:
            err.seek(0)
            tail = "\n".join(err.read().strip().splitlines()[-5:])
            return ServerBroken(f"{reason}" + (f"\nServer error output:\n{tail}" if tail else "") + f"\n{_FIX}")

        try:
            for msg in (
                {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {
                    "protocolVersion": "2025-06-18", "capabilities": {},
                    "clientInfo": {"name": "llm-re-wiki-preflight", "version": "1"}}},
                {"jsonrpc": "2.0", "method": "notifications/initialized"},
                {"jsonrpc": "2.0", "id": 2, "method": "tools/list"},
            ):
                proc.stdin.write(json.dumps(msg) + "\n")
            proc.stdin.flush()

            deadline = time.monotonic() + PREFLIGHT_TIMEOUT
            while True:
                remaining = deadline - time.monotonic()
                if remaining <= 0:
                    raise fail(f"the server did not answer tools/list within {PREFLIGHT_TIMEOUT}s.")
                try:
                    line = lines.get(timeout=remaining)
                except queue.Empty:
                    continue
                if line is None:
                    raise fail(f"the server exited during start-up (exit code {proc.wait()}).")
                try:
                    reply = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if reply.get("id") != 2:
                    continue
                if "error" in reply:
                    raise fail(f"tools/list returned an error: {reply['error']}")
                tools = [t.get("name") for t in reply.get("result", {}).get("tools", [])]
                if not tools:
                    raise fail("the server started but lists no tools.")
                _preflight_result = f"server starts and lists {len(tools)} tools ({', '.join(tools)})"
                return _preflight_result
        except (BrokenPipeError, OSError) as e:
            raise fail(f"could not talk to the server ({e}).") from None
        finally:
            proc.kill()
            proc.wait()


def add(agent: str) -> str:
    preflight()  # raises ServerBroken: nothing is written for a server that can't start
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
    parser.add_argument("action", choices=["detect", "check", "status", "add", "remove"])
    parser.add_argument("--agent", default="all", help="claude | opencode | cursor | all (default: all)")
    args = parser.parse_args()

    if args.action == "detect":
        print(" ".join(detect()))
        return 0

    if args.action in ("check", "add"):
        try:
            summary = preflight()
        except ServerBroken as e:
            print(f"  [!] MCP server can't start, so it was not registered: {e}" if args.action == "add"
                  else f"  [!] MCP server can't start: {e}")
            return 1
        if args.action == "check":
            print(f"  [✓] MCP server OK: {summary}")
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
