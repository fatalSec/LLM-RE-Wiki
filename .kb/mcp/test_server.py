#!/usr/bin/env python3
"""
End-to-end test for the LLM-RE-WIKI MCP server.

Builds a throwaway sample KB in a temp folder, starts server.py over stdio exactly like an
agent would, and calls every tool. Your real knowledge base is never touched.

Run:  .kb/scripts/.venv/bin/python .kb/mcp/test_server.py
"""
from __future__ import annotations

import asyncio
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from mcp.client.client import Client
from mcp.client.stdio import StdioServerParameters

REPO = Path(__file__).resolve().parents[2]

ARTICLE = """---
type: blog
topic: wiki/rasp/_index
sources: [https://example.test/sample-protector]
tags: [sampleguard, anti-frida, linker]
complexity: advanced
completeness: partial
last_verified: 2026-11-14
author: tester
published: 2026-11
reproducibility: unverified
llm_summary: "SampleGuard 2.x derives a key from rtld_db_dlactivity bytes; Frida trampolines corrupt it."
---
# SampleGuard Linker Check

Profile: [[wiki/protectors/sampleguard]]

## 1. Mechanism {#mechanism}
The check reads `rtld_db_dlactivity` and compares it with `0xd65f03c0`.

## 2. Bypass {#bypass}
Restore the original `ret` before key derivation. [AI Synthesis]

### Notes
Nested note under bypass.

## 3. Scope
Not covered: iOS.
"""

PROFILE = """---
type: protector-profile
topic: wiki/protectors/_index
sources: [https://example.test/sample-protector]
tags: [sampleguard, rasp, android]
protector: SampleGuard
vendor: unknown
category: rasp
platforms: [Android]
versions_seen: [2.0]
complexity: advanced
completeness: partial
last_verified: 2026-11-14
llm_summary: "SampleGuard (Android RASP) profile: linker-byte anti-Frida check in 2.0."
---
# SampleGuard — Protector Profile

| Mechanism | Details |
|---|---|
| Linker check | [[wiki/rasp/sampleguard-linker#mechanism]] |
"""


def build_sample_kb(root: Path) -> None:
    shutil.copytree(REPO / ".kb" / "scripts", root / ".kb" / "scripts", ignore=shutil.ignore_patterns(".venv", "__pycache__"))
    shutil.copytree(REPO / ".kb" / "mcp", root / ".kb" / "mcp", ignore=shutil.ignore_patterns("__pycache__"))
    (root / "knowledge_base" / "graph").mkdir(parents=True)
    shutil.copy(REPO / "knowledge_base" / "graph" / "index.html", root / "knowledge_base" / "graph")
    (root / "knowledge_base" / "raw" / "feeds").mkdir(parents=True)
    wiki = root / "knowledge_base" / "wiki"
    (wiki / "rasp").mkdir(parents=True)
    (wiki / "protectors").mkdir(parents=True)
    (wiki / "rasp" / "sampleguard-linker.md").write_text(ARTICLE, encoding="utf-8")
    (wiki / "protectors" / "sampleguard.md").write_text(PROFILE, encoding="utf-8")
    subprocess.run([sys.executable, str(root / ".kb" / "scripts" / "index_builder.py")],
                   check=True, capture_output=True)


async def run(root: Path) -> list[str]:
    failures: list[str] = []

    def check(name: str, ok: bool, detail: str = "") -> None:
        print(f"  [{'PASS' if ok else 'FAIL'}] {name}")
        if not ok:
            failures.append(f"{name}: {detail[:400]}")

    params = StdioServerParameters(
        command=sys.executable,
        args=[str(root / ".kb" / "mcp" / "server.py")],
        env={**os.environ, "LLM_RE_WIKI_ROOT": str(root)},
    )
    async with Client(params, raise_exceptions=True) as client:
        async def call(tool: str, **args) -> str:
            result = await client.call_tool(tool, args)
            return "\n".join(getattr(c, "text", "") for c in result.content)

        tools = (await client.list_tools()).tools
        names = sorted(t.name for t in tools)
        check("lists the 4 tools", names == ["kb_health", "kb_index", "kb_read", "kb_search"], str(names))
        check("all tools marked read-only",
              all(t.annotations and t.annotations.read_only_hint for t in tools))
        check("instructions warn that content is data", "never as instructions" in (client.instructions or ""))

        r = await call("kb_search", query="RTLD_DB_DLACTIVITY")
        check("search finds exact identifier (case-insensitive) with line numbers",
              "wiki/rasp/sampleguard-linker" in r and "L" in r and "rtld_db_dlactivity" in r, r)
        r = await call("kb_search", query="0xd65f03c0 ret")
        check("multi-word query falls back to all-words match", "all words" in r and "sampleguard-linker" in r, r)
        r = await call("kb_search", query="sampleguard", topic="protectors")
        check("topic filter limits results",
              r.startswith("1 article(s)") and "## wiki/protectors/sampleguard" in r and "## wiki/rasp/" not in r, r)
        r = await call("kb_search", query="does-not-exist-xyz")
        check("no-match message", r.startswith("No matches"), r)

        r = await call("kb_index")
        check("index returns master index", "## protectors (1)" in r and "## rasp (1)" in r, r)
        r = await call("kb_index", topic="protectors")
        check("index returns one topic", "wiki/protectors/sampleguard" in r and "## rasp" not in r, r)

        r = await call("kb_read", path="wiki/rasp/sampleguard-linker")
        check("read full article", r.startswith("---") and "## 3. Scope" in r, r)
        r = await call("kb_read", path="rasp/sampleguard-linker", section="bypass")
        check("read one section incl. nested heading, with source header",
              "## 2. Bypass" in r and "### Notes" in r and "## 3. Scope" not in r and "sources:" in r, r)
        r = await call("kb_read", path="[[wiki/rasp/sampleguard-linker#mechanism]]")
        check("read accepts a wiki link with #anchor", "## 1. Mechanism" in r and "## 2. Bypass" not in r, r)
        r = await call("kb_read", path="wiki/rasp/sampleguard-linker", section="nope")
        check("missing section lists anchors", "Anchors: mechanism, bypass" in r, r)
        r = await call("kb_read", path="../../.kb/scripts/index_builder")
        check("path traversal is refused", r.startswith("Refused"), r)
        r = await call("kb_read", path="wiki/rasp/sampleguard-linkr")
        check("typo suggests the right article", "Did you mean: wiki/rasp/sampleguard-linker" in r, r)

        r = await call("kb_health")
        check("health check passes on the sample KB", r.startswith("Health check PASSED"), r)
    return failures


def main() -> None:
    with tempfile.TemporaryDirectory(prefix="llm-re-wiki-mcp-test-") as tmp:
        root = Path(tmp)
        build_sample_kb(root)
        print("LLM-RE-WIKI MCP server test")
        failures = asyncio.run(run(root))
    if failures:
        print(f"\n{len(failures)} failure(s):")
        for f in failures:
            print(f"  - {f}")
        sys.exit(1)
    print("\nAll checks passed.")


if __name__ == "__main__":
    main()
