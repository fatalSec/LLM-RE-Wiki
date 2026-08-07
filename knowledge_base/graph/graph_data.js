window.GRAPH_DATA = {
  "nodes": [
    {
      "id": "wiki/_master-index",
      "display_id": "wiki/_master-index",
      "title": "Knowledge Base Master Index",
      "path": "/Users/impossible/Documents/Trainings2026/Agentic-KB/knowledge_base/wiki/_master-index.md",
      "rel_path": "knowledge_base/wiki/_master-index.md",
      "topic": "_root",
      "color": "#a855f7",
      "type": "article",
      "complexity": "intermediate",
      "summary": "No summary provided.",
      "tags": [],
      "content": "# Knowledge Base Master Index\nLast reindexed: 2026-08-06 | Total articles: 11\n\n## Quick Navigation \u2014 \"I want to...\"\n- Understand SingPass RASP detection mechanisms \u2192 [[wiki/rasp/singpass/_hub]]\n- Bypass SingPass RASP with one Frida hook \u2192 [[wiki/rasp/singpass/rasp-bypass]]\n- Detect Frida Stalker via GumExecCtx fingerprinting \u2192 [[wiki/rasp/singpass/frida-stalker-detection]]\n- Find all jailbreak file paths checked by SingPass \u2192 [[wiki/rasp/singpass/jailbreak-detection]]\n- Understand AArch64 hook prologue detection \u2192 [[wiki/rasp/singpass/hook-detection]]\n\n## Topic Index\n\n| Topic | Description | Articles | Last Updated |\n|---|---|---|---|\n| [[wiki/rasp/_index\\|RASP]] | Runtime Application Self-Protection: iOS anti-debug, jailbreak detection, anti-Frida, integrity checks (SingPass / NuDetect SDK) | 11 | 2026-08-06 |\n",
      "val": 5.0
    },
    {
      "id": "wiki/_ttp-index",
      "display_id": "wiki/_ttp-index",
      "title": "TTP Index",
      "path": "/Users/impossible/Documents/Trainings2026/Agentic-KB/knowledge_base/wiki/_ttp-index.md",
      "rel_path": "knowledge_base/wiki/_ttp-index.md",
      "topic": "general",
      "color": "#6b7280",
      "type": "article",
      "complexity": "intermediate",
      "summary": "No summary provided.",
      "tags": [],
      "content": "# TTP Index\n\n| TTP ID | Name | Tactic | Articles | Notes |\n|---|---|---|---|---|\n| T1629.003 | Disable/Modify Tools | Defense Evasion | [[wiki/rasp/singpass/frida-stalker-detection]], [[wiki/rasp/singpass/thread-check]] | Anti-Frida Stalker detection patterns |\n| T1082 | System Information Discovery | Discovery | [[wiki/rasp/singpass/anti-debug]] | sysctl KERN_PROC_PID P_TRACED check |\n| T1057 | Process Discovery | Discovery | [[wiki/rasp/singpass/anti-debug]] | getppid() check against launchd PID=1 |\n| T1083 | File and Directory Discovery | Discovery | [[wiki/rasp/singpass/jailbreak-detection]] | 22+ jailbreak file path checks |\n| T1518 | Software Discovery | Discovery | [[wiki/rasp/singpass/app-loaded-libraries]] | Dependency hash check for injected libraries |\n| T1622 | Debugger Evasion | Defense Evasion | [[wiki/rasp/singpass/anti-debug]] | ppid + P_TRACED debug detection |\n| T1179 | Hooking | Credential Access | [[wiki/rasp/singpass/hook-detection]], [[wiki/rasp/singpass/symbol-table-check]] | Detection of function hooking via prologue byte and GOT comparison |\n",
      "val": 6.6
    },
    {
      "id": "wiki/_patterns-index",
      "display_id": "wiki/_patterns-index",
      "title": "Patterns Index",
      "path": "/Users/impossible/Documents/Trainings2026/Agentic-KB/knowledge_base/wiki/_patterns-index.md",
      "rel_path": "knowledge_base/wiki/_patterns-index.md",
      "topic": "general",
      "color": "#6b7280",
      "type": "article",
      "complexity": "intermediate",
      "summary": "No summary provided.",
      "tags": [],
      "content": "# Patterns Index\n\n| Pattern | Type | Targets Seen | Articles | First Filed |\n|---|---|---|---|---|\n| AArch64 first-byte 0xFF hook detection | Anti-hooking | SingPass (NuDetect SDK) | [[wiki/rasp/singpass/hook-detection]] | 2026-08-06 |\n| Single-callback RASP design (all events \u2192 one function) | Design weakness | SingPass (NuDetect SDK) | [[wiki/rasp/singpass/rasp-bypass]], [[wiki/rasp/singpass/detection-callbacks]] | 2026-08-06 |\n| GumExecCtx TLS fingerprinting (TLS key 0x100-0x200 scan) | Anti-Frida Stalker | SingPass (NuDetect SDK) | [[wiki/rasp/singpass/frida-stalker-detection]] | 2026-08-06 |\n| Thread PC proximity to mach_msg check | Anti-Frida Stalker | SingPass (NuDetect SDK) | [[wiki/rasp/singpass/thread-check]] | 2026-08-06 |\n| Manual import resolution + GOT/__la_symbol_ptr comparison | Anti-hooking | SingPass (NuDetect SDK) | [[wiki/rasp/singpass/symbol-table-check]] | 2026-08-06 |\n| MurmurHash32 of Mach-O dependency names | Library injection detection | SingPass (NuDetect SDK) | [[wiki/rasp/singpass/app-loaded-libraries]] | 2026-08-06 |\n| dyld shared cache byte-per-byte integrity | System library integrity | SingPass (NuDetect SDK) | [[wiki/rasp/singpass/code-system-lib]] | 2026-08-06 |\n| Sandbox private syscall for path existence | Jailbreak/code-lift detection | SingPass (NuDetect SDK) | [[wiki/rasp/singpass/jailbreak-detection]] | 2026-08-06 |\n| JIT string decryption (XOR, temporary variable) | Anti-static-analysis | SingPass (NuDetect SDK) | [[wiki/rasp/singpass...",
      "val": 9.0
    },
    {
      "id": "wiki/log",
      "display_id": "wiki/log",
      "title": "KB Activity Log",
      "path": "/Users/impossible/Documents/Trainings2026/Agentic-KB/knowledge_base/wiki/log.md",
      "rel_path": "knowledge_base/wiki/log.md",
      "topic": "general",
      "color": "#6b7280",
      "type": "article",
      "complexity": "intermediate",
      "summary": "No summary provided.",
      "tags": [],
      "content": "# KB Activity Log\n\n## [2026-08-06] ingest | https://www.romainthomas.fr/post/22-08-singpass-rasp-analysis/\n- Crawl status: success\n- Raw file: part-1-singpass-rasp-analysis.md\n- Images downloaded: 13\n",
      "val": 1
    },
    {
      "id": "wiki/_snippets-index",
      "display_id": "wiki/_snippets-index",
      "title": "Code Snippets Index",
      "path": "/Users/impossible/Documents/Trainings2026/Agentic-KB/knowledge_base/wiki/_snippets-index.md",
      "rel_path": "knowledge_base/wiki/_snippets-index.md",
      "topic": "general",
      "color": "#6b7280",
      "type": "article",
      "complexity": "intermediate",
      "summary": "No summary provided.",
      "tags": [],
      "content": "# Code Snippets Index\n\n| Purpose | Language | Tool | Article | Tags |\n|---|---|---|---|---|\n| Bypass all SingPass RASP events | C (Frida Gum) | Frida (gum_interceptor_replace) | [[wiki/rasp/singpass/rasp-bypass]] | #rasp #ios #bypass #frida |\n| Exclude libsystem_kernel from Stalker | C (Frida Gum) | Frida Stalker | [[wiki/rasp/singpass/thread-check]] | #frida #stalker #bypass |\n| Anti-debug ppid check | C | iOS syscall | [[wiki/rasp/singpass/anti-debug]] | #anti-debug #ios |\n| Anti-debug sysctl P_TRACED | C | iOS sysctl | [[wiki/rasp/singpass/anti-debug]] | #anti-debug #ptrace #ios |\n| Environment jailbreak checks (HOME/dyld) | C | iOS stdlib | [[wiki/rasp/singpass/jailbreak-detection]] | #jailbreak #env #ios |\n| CSR SIP check via __csrctl | C | iOS private API | [[wiki/rasp/singpass/jailbreak-detection]] | #jailbreak #csr #ios |\n| Sandbox file-test-existence check | C | iOS Sandbox API | [[wiki/rasp/singpass/jailbreak-detection]] | #jailbreak #sandbox #ios |\n| SYM_ORIGINS enum + symbol check | C | \u2014 | [[wiki/rasp/singpass/symbol-table-check]] | #import-integrity #got #ios |\n| GumExecCtx structure layout (with offsets) | C | Frida Gum | [[wiki/rasp/singpass/frida-stalker-detection]] | #frida #stalker #gumexecctx |\n| MurmurHash dependency name check | C (pseudo) | IDA Pro | [[wiki/rasp/singpass/app-loaded-libraries]] | #murmurhash #import-integrity #ios |\n| dyld shared cache byte comparison | C (pseudo) | IDA Pro | [[wiki/rasp/singpass/code-system-lib]] | #dyld #integrity #ios...",
      "val": 7.3999999999999995
    },
    {
      "id": "wiki/_tools-index",
      "display_id": "wiki/_tools-index",
      "title": "Tools Index",
      "path": "/Users/impossible/Documents/Trainings2026/Agentic-KB/knowledge_base/wiki/_tools-index.md",
      "rel_path": "knowledge_base/wiki/_tools-index.md",
      "topic": "general",
      "color": "#6b7280",
      "type": "article",
      "complexity": "intermediate",
      "summary": "No summary provided.",
      "tags": [],
      "content": "# Tools Index\n\n| Tool | Tested Version | Key Articles | Notes |\n|---|---|---|---|\n| Frida (gum_interceptor_replace) | unspecified | [[wiki/rasp/singpass/rasp-bypass]] | Master bypass via single-callback replacement |\n| Frida Gum (gum_stalker_exclude) | unspecified | [[wiki/rasp/singpass/thread-check]] | Excludes libsystem_kernel.dylib from Stalker tracing |\n| Frida Stalker (GumExecCtx) | unspecified | [[wiki/rasp/singpass/frida-stalker-detection]] | Target of TLS fingerprinting check |\n| LIEF | unspecified | [[wiki/rasp/singpass/app-loaded-libraries]], [[wiki/rasp/singpass/symbol-table-check]] | Mach-O parsing; dependency enumeration |\n| IDA Pro | unspecified | [[wiki/rasp/singpass/_hub]] | Used for static binary analysis |\n",
      "val": 5.8
    },
    {
      "id": "wiki/rasp/_index",
      "display_id": "wiki/rasp/_index",
      "title": "RASP \u2014 Index",
      "path": "/Users/impossible/Documents/Trainings2026/Agentic-KB/knowledge_base/wiki/rasp/_index.md",
      "rel_path": "knowledge_base/wiki/rasp/_index.md",
      "topic": "rasp",
      "color": "#ef4444",
      "type": "concept",
      "complexity": "intermediate",
      "summary": "No summary provided.",
      "tags": [],
      "content": "# RASP \u2014 Index\n\n## Quick Navigation\nLooking for... \u2192 Go to...\n- \"How does SingPass detect Frida Stalker?\" \u2192 [[wiki/rasp/singpass/frida-stalker-detection]]\n- \"How to bypass all SingPass RASP with one hook?\" \u2192 [[wiki/rasp/singpass/rasp-bypass]]\n- \"What jailbreak files does SingPass check?\" \u2192 [[wiki/rasp/singpass/jailbreak-detection]]\n- \"How does hook detection work on AArch64?\" \u2192 [[wiki/rasp/singpass/hook-detection]]\n- \"Overview of all SingPass RASP mechanisms\" \u2192 [[wiki/rasp/singpass/_hub]]\n\n## Articles\n\n| Article | Covers (Summary) | Type | Completeness | Last Updated |\n|---|---|---|---|---|\n| [[wiki/rasp/singpass/_hub\\|SingPass RASP Hub]] | Full RASP analysis hub: NuDetect SDK, 8 event types, callback architecture, all mechanism links | blog | complete | 2026-08-06 |\n| [[wiki/rasp/singpass/hook-detection\\|Hook Detection]] | EVT_CODE_PROLOGUE: first-byte 0xFF check for AArch64 sub SP prologue | blog | complete | 2026-08-06 |\n| [[wiki/rasp/singpass/detection-callbacks\\|Detection Callbacks]] | Callback architecture: static vars, single shared callback design, X23 init sequence | blog | complete | 2026-08-06 |\n| [[wiki/rasp/singpass/anti-debug\\|Anti-Debug]] | EVT_ENV_DEBUGGER: ppid==1 check and sysctl P_TRACED flag | blog | complete | 2026-08-06 |\n| [[wiki/rasp/singpass/jailbreak-detection\\|Jailbreak Detection]] | EVT_ENV_JAILBREAK: 22+ file checks, env vars, unmount probe, CSR SIP, Sandbox API | blog | complete | 2026-08-06 |\n| [[wiki/rasp/singpass/symbol-table-check\\|Symbol Tab...",
      "val": 5.0
    },
    {
      "id": "wiki/rasp/singpass/_hub",
      "display_id": "wiki/rasp/singpass/_hub",
      "title": "SingPass RASP Analysis \u2014 Hub",
      "path": "/Users/impossible/Documents/Trainings2026/Agentic-KB/knowledge_base/wiki/rasp/singpass/_hub.md",
      "rel_path": "knowledge_base/wiki/rasp/singpass/_hub.md",
      "topic": "rasp",
      "color": "#ef4444",
      "type": "blog",
      "complexity": "advanced",
      "summary": "Full RASP analysis of the SingPass iOS app (AArch64, NuDetect SDK obfuscator): covers hook-prologue detection, anti-debug (ppid+sysctl), jailbreak file/env/CSR/Sandbox checks, import table integrity, Frida Stalker GumExecCtx fingerprinting, thread PC proximity, dyld shared cache byte comparison, and a single-callback design weakness enabling full bypass via gum_interceptor_replace.",
      "tags": [
        "rasp",
        "ios",
        "aarch64",
        "frida",
        "jailbreak-detection",
        "anti-debug",
        "obfuscation",
        "singpass"
      ],
      "content": "\n\n# SingPass RASP Analysis \u2014 Hub\n\n> **LLM Decision Router.** Select the chunk matching your query.\n\n## Context [V]\n\n- **Target:** SingPass iOS app, AArch64 Mach-O binary (`SingPass`). [V]\n- **Obfuscator:** Commercial SDK identified by the `+++++++` string marker \u2014 NuDetect SDK (`NuDetectSDK.framework`). Code is *lightly* obfuscated; static analysis is viable. [V]\n- **Oracle:** The app displays a jailbreak detection error on startup \u2014 a reliable pass/fail indicator for bypasses. [V]\n- **RASP framework:** All events funnel through a single user-defined callback `hook_detect_cbk_user_def` stored in static variables initialized by `init_and_check_rasp`. [V]\n- **Binary available:** Decrypted Mach-O at `https://www.romainthomas.fr/post/22-08-singpass-rasp-analysis/bin/SingPass`. [V]\n\n## RASP Event Codes [V]\n\n| Event | Code | Mechanism | Chunk |\n|---|---|---|---|\n| `EVT_ENV_JAILBREAK` | `0x1` | File/env/CSR/Sandbox checks | [[wiki/rasp/singpass/jailbreak-detection]] |\n| `EVT_ENV_DEBUGGER` | `0x2` | ppid + sysctl P_TRACED | [[wiki/rasp/singpass/anti-debug]] |\n| `EVT_APP_SIGNATURE` | `0x20` | Not enabled in SingPass | \u2014 |\n| `EVT_APP_LOADED_LIBRARIES` | `0x40` | MurmurHash32 of dependency names | [[wiki/rasp/singpass/app-loaded-libraries]] |\n| `EVT_CODE_PROLOGUE` | `0x400` | First-byte 0xFF hook detection | [[wiki/rasp/singpass/hook-detection]] |\n| `EVT_CODE_SYMBOL_TABLE` | `0x800` | Manual GOT/__la_symbol_ptr resolution | [[wiki/rasp/singpass/symbol-table-check]] |\n| `EVT_CODE_SYSTEM_...",
      "val": 25.8
    },
    {
      "id": "wiki/rasp/singpass/code-system-lib",
      "display_id": "wiki/rasp/singpass/code-system-lib",
      "title": "Code System Lib Check \u2014 EVT_CODE_SYSTEM_LIB",
      "path": "/Users/impossible/Documents/Trainings2026/Agentic-KB/knowledge_base/wiki/rasp/singpass/code-system-lib.md",
      "rel_path": "knowledge_base/wiki/rasp/singpass/code-system-lib.md",
      "topic": "rasp",
      "color": "#ef4444",
      "type": "blog",
      "complexity": "advanced",
      "summary": "EVT_CODE_SYSTEM_LIB (code 0x1000): verifies in-memory integrity of system libraries against the on-disk dyld shared cache. Uses SYS_shared_region_check_np to get cache base, iterates vm_region_recurse_64 (infoCnt=19) over the shared cache range, then callback check_region_cbk (0x100ED5E0C) reads the __TEXT segment via vm_read and compares it byte-by-byte (loop 0x100ED6C58-0x100ED6C70) against a mmap'd slice of the on-disk cache. Rarely triggered in practice.",
      "tags": [
        "rasp",
        "ios",
        "aarch64",
        "dyld-shared-cache",
        "vm-region",
        "integrity-check",
        "system-library"
      ],
      "content": "\n\n[Hub]([[wiki/rasp/singpass/_hub]]) | [Prev]([[wiki/rasp/singpass/app-loaded-libraries]]) | [Next]([[wiki/rasp/singpass/rasp-bypass]])\n\n# Code System Lib Check \u2014 EVT_CODE_SYSTEM_LIB\n\n## This Article Answers\n- \"How does SingPass verify the integrity of system libraries against the dyld shared cache?\"\n- \"What is `iterate_system_region` and how does it filter addresses?\"\n- \"What does `check_region_cbk` do byte-per-byte?\"\n- NOT: \"How to bypass by excluding libsystem_kernel\" \u2014 see [[wiki/rasp/singpass/thread-check]]\n\n## Key Takeaways\n- [TECHNIQUE] Compare the in-memory `__TEXT` segment of a system library (read via `vm_read`) against the corresponding slice of the on-disk dyld shared cache (mapped via `mmap`). Any patched byte in a system library is detected.\n- [PREREQ] Dyld shared cache must be accessible at the standard path; check requires disk I/O.\n- [GOTCHA] The callback `check_region_cbk` was **never triggered** during the author's testing even when system functions were hooked. Conditions may require `pages_swapped_out=1` to be forced. This is the most complex check but appears to have lowest real-world trigger reliability.\n- Reproducibility: unverified\n\n## Low-Level Technical Invariants [V]\n\n| Attribute | Value | Notes |\n|---|---|---|\n| Event name | `EVT_CODE_SYSTEM_LIB` | String at `__data:1010B8D30` |\n| Event code | `0x1000` | Passed to callback |\n| Main iterator function | `iterate_system_region` = `sub_100ED5BF8` | Calls `vm_region_recurse_64` and filters |\n| Callback...",
      "val": 12.6
    },
    {
      "id": "wiki/rasp/singpass/detection-callbacks",
      "display_id": "wiki/rasp/singpass/detection-callbacks",
      "title": "Detection Callbacks \u2014 Architecture",
      "path": "/Users/impossible/Documents/Trainings2026/Agentic-KB/knowledge_base/wiki/rasp/singpass/detection-callbacks.md",
      "rel_path": "knowledge_base/wiki/rasp/singpass/detection-callbacks.md",
      "topic": "rasp",
      "color": "#ef4444",
      "type": "blog",
      "complexity": "advanced",
      "summary": "The NuDetect SDK RASP framework stores per-event callback pointers in static variables. At runtime, init_and_check_rasp overwrites all of them (via a single STR X23 sequence) to the same user-defined function hook_detect_cbk_user_def, which routes all events to on_rasp_detection \u2014 creating a single-point-of-failure bypass target.",
      "tags": [
        "rasp",
        "ios",
        "aarch64",
        "callback",
        "architecture",
        "static-analysis"
      ],
      "content": "\n\n[Hub]([[wiki/rasp/singpass/_hub]]) | [Prev]([[wiki/rasp/singpass/hook-detection]]) | [Next]([[wiki/rasp/singpass/anti-debug]])\n\n# Detection Callbacks \u2014 Architecture\n\n## This Article Answers\n- \"How are RASP detection callbacks stored and initialized in SingPass?\"\n- \"What is `hook_detect_cbk_user_def` and why does it matter for bypassing?\"\n- \"What strings appear in the `__data` section after runtime decryption?\"\n- NOT: \"How to bypass each individual check\" \u2014 see [[wiki/rasp/singpass/rasp-bypass]]\n\n## Key Takeaways\n- [TECHNIQUE] All RASP callback pointers are static variables initialized at startup by a single `STR X23` sequence in `init_and_check_rasp`.\n- [PREREQ] Callback pointers must be initialized before any RASP check runs; initialization happens during `init_and_check_rasp`.\n- [GOTCHA] The default callback `hook_detect_cbk` **corrupts a pointer** (would crash the app). The developer-supplied override `hook_detect_cbk_user_def` does NOT \u2014 it calls `on_rasp_detection` instead.\n- Reproducibility: unverified\n\n## Low-Level Technical Invariants [V]\n\n| Attribute | Value | Notes |\n|---|---|---|\n| Default callback | `hook_detect_cbk` | Corrupts the pointer param \u2014 crashes the app if triggered |\n| User-defined callback | `hook_detect_cbk_user_def` | Calls `on_rasp_detection`; no pointer corruption |\n| Master callback pointer address | `0x10109D760` | The static variable holding the active callback |\n| Init function | `init_and_check_rasp` | Overwrites all callback pointers via X2...",
      "val": 17.399999999999995
    },
    {
      "id": "wiki/rasp/singpass/symbol-table-check",
      "display_id": "wiki/rasp/singpass/symbol-table-check",
      "title": "Code Symbol Table Check \u2014 EVT_CODE_SYMBOL_TABLE",
      "path": "/Users/impossible/Documents/Trainings2026/Agentic-KB/knowledge_base/wiki/rasp/singpass/symbol-table-check.md",
      "rel_path": "knowledge_base/wiki/rasp/singpass/symbol-table-check.md",
      "topic": "rasp",
      "color": "#ef4444",
      "type": "blog",
      "complexity": "advanced",
      "summary": "EVT_CODE_SYMBOL_TABLE (code 0x800): manually resolves all imported symbols by parsing dependency export tries at startup, stores them in a metadata structure with symbols_index (uint32_t[0x399]), origins (LA_SYMBOL=1/GOT=2), and resolved address tables. At check time, live section pointers (GOT/__la_symbol_ptr) are compared against the manually-resolved baseline; mismatches verified with dladdr are reported. Disabling by zeroing the origins table sets all entries to NONE and skips all checks.",
      "tags": [
        "rasp",
        "ios",
        "aarch64",
        "import-table",
        "got",
        "symbol-resolution",
        "anti-hooking"
      ],
      "content": "\n\n[Hub]([[wiki/rasp/singpass/_hub]]) | [Prev]([[wiki/rasp/singpass/jailbreak-detection]]) | [Next]([[wiki/rasp/singpass/frida-stalker-detection]])\n\n# Code Symbol Table Check \u2014 EVT_CODE_SYMBOL_TABLE\n\n## This Article Answers\n- \"How does NuDetect SDK detect hooked imported functions via the GOT/__la_symbol_ptr?\"\n- \"What is the metadata structure used for manual symbol resolution?\"\n- \"How can this check be disabled by zeroing the origins table?\"\n- NOT: \"How Frida hooks imports\" \u2014 see Frida documentation\n\n## Key Takeaways\n- [TECHNIQUE] Manual re-resolution of all imports at startup; runtime comparison of live section pointers vs. baseline resolves using `dladdr` for mismatch verification.\n- [PREREQ] Initialization must complete (`sub_100E544E8`) before any checks run.\n- [GOTCHA] The check handles lazy-bound symbols (those still pointing into `__stub_helper`) \u2014 it skips them. Only resolved symbols are compared. Setting `origin[sym_idx] = NONE (0)` disables the check for that symbol.\n- Reproducibility: unverified\n\n## Low-Level Technical Invariants [V]\n\n| Attribute | Value | Notes |\n|---|---|---|\n| Event name | `EVT_CODE_SYMBOL_TABLE` | String at `__data:1010B8D50` |\n| Event code | `0x800` | Passed to callback |\n| Init function | `sub_100E544E8` | Performs manual import resolution |\n| `nb_symbols` | `0x399` | Length of `symbols_index` and `origins` tables |\n| `symbols_index` type | `uint32_t[]` | Translation from obfuscator index to section index |\n| Origin enum `NONE` | `0` | Skip c...",
      "val": 17.800000000000004
    },
    {
      "id": "wiki/rasp/singpass/anti-debug",
      "display_id": "wiki/rasp/singpass/anti-debug",
      "title": "Anti-Debug \u2014 EVT_ENV_DEBUGGER",
      "path": "/Users/impossible/Documents/Trainings2026/Agentic-KB/knowledge_base/wiki/rasp/singpass/anti-debug.md",
      "rel_path": "knowledge_base/wiki/rasp/singpass/anti-debug.md",
      "topic": "rasp",
      "color": "#ef4444",
      "type": "blog",
      "complexity": "advanced",
      "summary": "EVT_ENV_DEBUGGER (code 0x2): two checks \u2014 (1) getppid() != 1 (launchd PID), (2) sysctl KERN_PROC_PID with P_TRACED flag in kp_proc.p_flag. Both trigger the same RASP callback. AArch64 assembly for the callback dispatch is fully captured.",
      "tags": [
        "rasp",
        "ios",
        "aarch64",
        "anti-debug",
        "sysctl",
        "ptrace",
        "launchd"
      ],
      "content": "\n\n[Hub]([[wiki/rasp/singpass/_hub]]) | [Prev]([[wiki/rasp/singpass/detection-callbacks]]) | [Next]([[wiki/rasp/singpass/jailbreak-detection]])\n\n# Anti-Debug \u2014 EVT_ENV_DEBUGGER\n\n## This Article Answers\n- \"How does SingPass/NuDetect SDK detect a debugger on iOS?\"\n- \"What sysctl arguments does the anti-debug check use?\"\n- NOT: \"How to bypass ptrace on Android\" \u2014 different OS/mechanism\n\n## Key Takeaways\n- [TECHNIQUE] Two checks: parent process ID (must equal launchd PID=1) and `sysctl` P_TRACED flag in `extern_proc.p_flag`.\n- [PREREQ] Both checks are performed on the running process itself \u2014 no external process querying needed.\n- [GOTCHA] The ppid check is weak: any process spawned from launchd normally has ppid=1, so only attaching a debugger that re-parents the process will trigger it.\n- Reproducibility: unverified\n\n## Low-Level Technical Invariants [V]\n\n| Attribute | Value | Notes |\n|---|---|---|\n| Event name | `EVT_ENV_DEBUGGER` | String at `__data:1010B8DD0` |\n| Event code | `0x2` | Passed to callback |\n| launchd PID constant | `1` (`LAUNCHD_PID`) | Expected ppid for non-debugged processes |\n| sysctl CTL_KERN names | `{CTL_KERN, KERN_PROC, KERN_PROC_PID, getpid()}` | 4-element int array |\n| sysctl info structure | `kinfo_proc` (sizeof = passed as `sizeof_info`) | Result struct |\n| P_TRACED flag | `P_TRACED` in `kp_proc.p_flag` | BSD flag indicating process is being traced |\n| Callback pointer | `EVT_ENV_DEBUGGER_cbk_ptr` | ADRP+LDR loaded from static var |\n| Corrupted ptr va...",
      "val": 11.4
    },
    {
      "id": "wiki/rasp/singpass/jailbreak-detection",
      "display_id": "wiki/rasp/singpass/jailbreak-detection",
      "title": "Jailbreak Detection \u2014 EVT_ENV_JAILBREAK",
      "path": "/Users/impossible/Documents/Trainings2026/Agentic-KB/knowledge_base/wiki/rasp/singpass/jailbreak-detection.md",
      "rel_path": "knowledge_base/wiki/rasp/singpass/jailbreak-detection.md",
      "topic": "rasp",
      "color": "#ef4444",
      "type": "blog",
      "complexity": "advanced",
      "summary": "EVT_ENV_JAILBREAK (code 0x1): multi-layered jailbreak detection covering 22+ file existence checks (fopen/utimes hooks needed to uncover JIT-decoded strings), environment variable checks (_dyld_get_image_name/HOME/_NSGetExecutablePath), unmount of /.installed_unc0ver, CSR CSR_ALLOW_UNTRUSTED_KEXTS via __csrctl, and Sandbox private syscall API (file-test-existence/file-read-metadata) for macOS-path checks targeting Apple Silicon code-lifting detection.",
      "tags": [
        "rasp",
        "ios",
        "jailbreak-detection",
        "sandbox-api",
        "csr",
        "environment-check",
        "file-check"
      ],
      "content": "\n\n[Hub]([[wiki/rasp/singpass/_hub]]) | [Prev]([[wiki/rasp/singpass/anti-debug]]) | [Next]([[wiki/rasp/singpass/symbol-table-check]])\n\n# Jailbreak Detection \u2014 EVT_ENV_JAILBREAK\n\n## This Article Answers\n- \"What files does SingPass check for jailbreak detection?\"\n- \"How does NuDetect SDK use the Sandbox API for jailbreak detection?\"\n- \"What environment variables trigger EVT_ENV_JAILBREAK?\"\n- \"How does SingPass detect Apple Silicon / code lifting?\"\n- NOT: \"How to bypass jailbreak detection\" \u2014 see [[wiki/rasp/singpass/rasp-bypass]]\n\n## Key Takeaways\n- [TECHNIQUE] Five distinct check categories: file existence, `unmount` probe, environment variables, CSR SIP status, and Sandbox private syscall.\n- [PREREQ] Strings for file paths are JIT-decoded \u2014 static dump of `__data` does not reveal all paths; hooking `fopen`/`utimes` and iterating dumps is required to recover full string set.\n- [GOTCHA] The Sandbox API (`__mac_syscall(\"Sandbox\", 2, ...)`) path checks target macOS-specific directories \u2014 intended to detect Apple Silicon / code-lifting, not standard jailbreaks. Using a private syscall may violate Apple policy.\n- Reproducibility: unverified\n\n## Low-Level Technical Invariants [V]\n\n| Attribute | Value | Notes |\n|---|---|---|\n| Event name | `EVT_ENV_JAILBREAK` | String at `__data:1010B8DF0` |\n| Event code | `0x1` | Passed to callback |\n| Corrupted ptr value | `0x13B76B477E382CB` | Second param in callback dispatch |\n| CSR flag checked | `CSR_ALLOW_UNTRUSTED_KEXTS` | Checked via `__csrc...",
      "val": 15.800000000000002
    },
    {
      "id": "wiki/rasp/singpass/rasp-bypass",
      "display_id": "wiki/rasp/singpass/rasp-bypass",
      "title": "RASP Design Weakness & Master Bypass",
      "path": "/Users/impossible/Documents/Trainings2026/Agentic-KB/knowledge_base/wiki/rasp/singpass/rasp-bypass.md",
      "rel_path": "knowledge_base/wiki/rasp/singpass/rasp-bypass.md",
      "topic": "rasp",
      "color": "#ef4444",
      "type": "blog",
      "complexity": "advanced",
      "summary": "SingPass RASP design weakness: all RASP events (EVT_ENV_JAILBREAK, EVT_ENV_DEBUGGER, EVT_CODE_PROLOGUE, EVT_CODE_SYMBOL_TABLE, EVT_CODE_SYSTEM_LIB, EVT_CODE_TRACING, EVT_APP_LOADED_LIBRARIES) share a single callback hook_detect_cbk_user_def at static address 0x10109D760. Replacing it with a do_nothing function via gum_interceptor_replace disables all RASP checks simultaneously. Demonstrated live on device.",
      "tags": [
        "rasp",
        "ios",
        "aarch64",
        "bypass",
        "frida",
        "gum-interceptor",
        "design-weakness",
        "single-callback"
      ],
      "content": "\n\n[Hub]([[wiki/rasp/singpass/_hub]]) | [Prev]([[wiki/rasp/singpass/code-system-lib]])\n\n# RASP Design Weakness & Master Bypass\n\n## This Article Answers\n- \"How to bypass all SingPass RASP checks with a single Frida hook?\"\n- \"Why does using the same callback for all RASP events weaken protection?\"\n- \"What is the exact gum_interceptor_replace call to disable all RASP in SingPass?\"\n- NOT: \"How individual checks work\" \u2014 see respective chunk articles\n\n## Key Takeaways\n- [TECHNIQUE] Replace the single shared callback `hook_detect_cbk_user_def` with a no-op `do_nothing` function via Frida Gum's `gum_interceptor_replace`. All RASP events silenced.\n- [PREREQ] Frida Gum access to the target process; knowledge of `hook_detect_cbk_user_def` address (obtained via `___atomic_load`/`___atomic_store` cross-references or binary search for the static variable at `0x10109D760`).\n- [GOTCHA] The native code is *lightly* obfuscated \u2014 RASP check code itself is NOT obfuscated (no MBA or CFF applied). This makes both static analysis and targeting trivial.\n- Reproducibility: unverified \u2014 demonstrated live on device by author.\n\n## Low-Level Technical Invariants [V]\n\n| Attribute | Value | Notes |\n|---|---|---|\n| Shared callback address (static var) | `0x10109D760` | The single static variable holding the active callback for ALL events |\n| Callback function | `hook_detect_cbk_user_def` | Developer-supplied; calls `on_rasp_detection` |\n| All events unified | `EVT_ENV_JAILBREAK=0x1, EVT_ENV_DEBUGGER=0x2, EVT...",
      "val": 27.0
    },
    {
      "id": "wiki/rasp/singpass/app-loaded-libraries",
      "display_id": "wiki/rasp/singpass/app-loaded-libraries",
      "title": "App Loaded Libraries Check \u2014 EVT_APP_LOADED_LIBRARIES",
      "path": "/Users/impossible/Documents/Trainings2026/Agentic-KB/knowledge_base/wiki/rasp/singpass/app-loaded-libraries.md",
      "rel_path": "knowledge_base/wiki/rasp/singpass/app-loaded-libraries.md",
      "topic": "rasp",
      "color": "#ef4444",
      "type": "blog",
      "complexity": "advanced",
      "summary": "EVT_APP_LOADED_LIBRARIES (code 0x40): hashes all 0x6D Mach-O LC_LOAD_DYLIB dependency names using a MurmurHash derivative into uint32_t values; compares dynamically-computed table against a hard-coded reference table at two binary locations (0x100E4CF38, 0x100E55678). Detection fires if any injected library (e.g. FridaGadget.dylib) alters the hash.",
      "tags": [
        "rasp",
        "ios",
        "aarch64",
        "import-integrity",
        "murmurhash",
        "dependency-check",
        "anti-frida"
      ],
      "content": "\n\n[Hub]([[wiki/rasp/singpass/_hub]]) | [Prev]([[wiki/rasp/singpass/thread-check]]) | [Next]([[wiki/rasp/singpass/code-system-lib]])\n\n# App Loaded Libraries Check \u2014 EVT_APP_LOADED_LIBRARIES\n\n## This Article Answers\n- \"How does SingPass detect injected libraries like FridaGadget.dylib?\"\n- \"What hash function is used for the dependency name check?\"\n- \"Why are the hard-coded hashes duplicated at two binary locations?\"\n- NOT: \"How to bypass by excluding the library from Stalker\" \u2014 see [[wiki/rasp/singpass/thread-check]]\n\n## Key Takeaways\n- [TECHNIQUE] Hash all `LC_LOAD_DYLIB`/`LC_ID_DYLIB` dependency names at runtime into a `uint32_t` table; compare against a hard-coded reference. Any change (injection of a new dylib) alters the hash and triggers detection.\n- [PREREQ] Library list must be stable at check time; `dladdr` used to get the Mach-O header for traversal.\n- [GOTCHA] Hashes are 32-bit but stored using X11/X12 (64-bit registers) in the comparison \u2014 compiler optimization to batch two hash values per register load/store. The reference table is duplicated at two binary locations.\n- Reproducibility: unverified\n\n## Low-Level Technical Invariants [V]\n\n| Attribute | Value | Notes |\n|---|---|---|\n| Event name | `EVT_APP_LOADED_LIBRARIES` | String at `__data:1010B8D90` |\n| Event code | `0x40` | Passed to callback |\n| Library count | `0x6D` (109) | Number of dependencies hashed |\n| Hash type | `uint32_t` | 32-bit hash per dependency name |\n| Hash algorithm | MurmurHash derivative | 32...",
      "val": 15.400000000000004
    },
    {
      "id": "wiki/rasp/singpass/thread-check",
      "display_id": "wiki/rasp/singpass/thread-check",
      "title": "Thread PC Proximity Check \u2014 EVT_CODE_TRACING (Method 2)",
      "path": "/Users/impossible/Documents/Trainings2026/Agentic-KB/knowledge_base/wiki/rasp/singpass/thread-check.md",
      "rel_path": "knowledge_base/wiki/rasp/singpass/thread-check.md",
      "topic": "rasp",
      "color": "#ef4444",
      "type": "blog",
      "complexity": "advanced",
      "summary": "EVT_CODE_TRACING (code 0x2000) \u2014 thread PC proximity check: calls thread_get_state(ARM_UNIFIED_THREAD_STATE) on the current thread; if |state->ts_64.__pc - &mach_msg| > 0x4000 the thread is not executing inside libsystem_kernel.dylib and Stalker is assumed active. Bypass: gum_stalker_exclude('libsystem_kernel.dylib') ensures PC returns to that library.",
      "tags": [
        "rasp",
        "ios",
        "aarch64",
        "frida",
        "stalker",
        "thread-state",
        "mach-thread",
        "anti-frida"
      ],
      "content": "\n\n[Hub]([[wiki/rasp/singpass/_hub]]) | [Prev]([[wiki/rasp/singpass/frida-stalker-detection]]) | [Next]([[wiki/rasp/singpass/app-loaded-libraries]])\n\n# Thread PC Proximity Check \u2014 EVT_CODE_TRACING (Method 2)\n\n## This Article Answers\n- \"What is the second Frida Stalker detection mechanism in SingPass?\"\n- \"How does thread_get_state detect the Stalker?\"\n- \"How to bypass the thread PC proximity check with gum_stalker_exclude?\"\n- NOT: \"GumExecCtx TLS fingerprinting\" \u2014 see [[wiki/rasp/singpass/frida-stalker-detection]]\n\n## Key Takeaways\n- [TECHNIQUE] Reads the current thread's PC via `thread_get_state(ARM_UNIFIED_THREAD_STATE)`. If `abs(pc - &mach_msg) > 0x4000`, the thread is not suspended inside `libsystem_kernel.dylib` \u2192 Stalker detected.\n- [PREREQ] The check fires while a thread is in a suspended state or the check samples the thread state on the calling thread.\n- [GOTCHA] The `0x4000` threshold is the effective size window around `&mach_msg` that counts as \"inside libsystem_kernel\". When Stalker is running, the PC lands in Stalker's code cache, which is far outside `libsystem_kernel`.\n- Reproducibility: unverified \u2014 author confirmed with standalone test case.\n\n## Low-Level Technical Invariants [V]\n\n| Attribute | Value | Notes |\n|---|---|---|\n| Event name | `EVT_CODE_TRACING` | Same event as GumExecCtx check |\n| Event code | `0x2000` | Passed to callback |\n| Corrupted ptr | `0x13b71a24724edfe` | Second param in callback dispatch |\n| Thread state type | `ARM_UNIFIED_THREAD_STATE`...",
      "val": 15.800000000000002
    },
    {
      "id": "wiki/rasp/singpass/frida-stalker-detection",
      "display_id": "wiki/rasp/singpass/frida-stalker-detection",
      "title": "Frida Stalker Detection \u2014 GumExecCtx Fingerprinting",
      "path": "/Users/impossible/Documents/Trainings2026/Agentic-KB/knowledge_base/wiki/rasp/singpass/frida-stalker-detection.md",
      "rel_path": "knowledge_base/wiki/rasp/singpass/frida-stalker-detection.md",
      "topic": "rasp",
      "color": "#ef4444",
      "type": "blog",
      "complexity": "advanced",
      "summary": "EVT_CODE_TRACING (code 0x2000) \u2014 GumExecCtx fingerprinting: scans TLS slots 0x100-0x200 via TPIDRRO_EL0 for regions >0x30 bytes; fingerprints GumExecCtx at the found address by checking *(tlv+0x18)==thread_id (GumThreadId), *(tlv+0x24)<=5 (GumOS enum max), and *(tlv+0x28)<3 (GumPtrauthSupport enum max). Bypass: recompile Frida with swapped _GumExecCtx fields.",
      "tags": [
        "rasp",
        "ios",
        "aarch64",
        "frida",
        "stalker",
        "gumexecctx",
        "tls",
        "anti-frida"
      ],
      "content": "\n\n[Hub]([[wiki/rasp/singpass/_hub]]) | [Prev]([[wiki/rasp/singpass/symbol-table-check]]) | [Next]([[wiki/rasp/singpass/thread-check]])\n\n# Frida Stalker Detection \u2014 GumExecCtx Fingerprinting\n\n## This Article Answers\n- \"How does SingPass detect Frida's Stalker at runtime?\"\n- \"What fields of GumExecCtx does the NuDetect SDK fingerprint?\"\n- \"What TLS key range does the Stalker detection scan?\"\n- NOT: \"How Frida Stalker works internally\" \u2014 see Frida source `gumstalker-arm64.c`\n\n## Key Takeaways\n- [TECHNIQUE] Scans TLS slots 0x100\u20130x200 using the raw `TPIDRRO_EL0` register. For each slot with a valid backing region (size > 0x30), fingerprints the pointed-to structure as `GumExecCtx` by checking three field offsets against expected enum ranges.\n- [PREREQ] Frida Stalker must be active and following the current thread for `gum_tls_key_set_value` to have stored `GumExecCtx*` in a TLS slot.\n- [GOTCHA] The fingerprint is purely structural (field offset + value range) \u2014 it does NOT check magic numbers or strings. Reordering fields in `_GumExecCtx` breaks the detection.\n- Reproducibility: unverified\n\n## Low-Level Technical Invariants [V]\n\n| Attribute | Value | Notes |\n|---|---|---|\n| Event name | `EVT_CODE_TRACING` | String at `__data:1010B8D10` |\n| Event code | `0x2000` | Passed to callback |\n| Corrupted ptr | `0x13b71ae1e16d02e` | Second param in callback dispatch |\n| TLS scan range | `0x100` to `0x200` (exclusive) | `tlv_idx` loop variable |\n| TLS access instruction | `MRS(TPIDRRO_EL0) ...",
      "val": 17.0
    },
    {
      "id": "wiki/rasp/singpass/hook-detection",
      "display_id": "wiki/rasp/singpass/hook-detection",
      "title": "Hook Detection \u2014 EVT_CODE_PROLOGUE",
      "path": "/Users/impossible/Documents/Trainings2026/Agentic-KB/knowledge_base/wiki/rasp/singpass/hook-detection.md",
      "rel_path": "knowledge_base/wiki/rasp/singpass/hook-detection.md",
      "topic": "rasp",
      "color": "#ef4444",
      "type": "blog",
      "complexity": "advanced",
      "summary": "EVT_CODE_PROLOGUE (code 0x400): checks the first byte of a target function against 0xFF \u2014 the first byte of the AArch64 'sub SP, SP, #CST' stack-allocation prologue encoding. A non-0xFF byte indicates a hooking trampoline has overwritten the prologue.",
      "tags": [
        "rasp",
        "ios",
        "aarch64",
        "hook-detection",
        "prologue",
        "anti-frida"
      ],
      "content": "\n\n[Hub]([[wiki/rasp/singpass/_hub]]) | [Next]([[wiki/rasp/singpass/detection-callbacks]])\n\n# Hook Detection \u2014 EVT_CODE_PROLOGUE\n\n## This Article Answers\n- \"How does the NuDetect SDK detect hooked functions on AArch64 iOS?\"\n- \"Why does the obfuscator check the first byte of a function against 0xFF?\"\n- NOT: \"How does Frida intercept functions?\" \u2014 see Frida documentation\n\n## Key Takeaways\n- [TECHNIQUE] Load the first byte of a target function and compare it to `0xFF`; a mismatch means the prologue has been overwritten (hooked).\n- [PREREQ] Compiler must be the obfuscator's own compiler so it knows at compile time what the correct first-byte encoding is for each function.\n- [GOTCHA] This check only works for functions compiled to use `sub SP, SP, #CST` as their stack-allocation instruction. Functions using `stp REG, REG, [SP, #N]!` have a different first byte and require a different prologue check.\n- Reproducibility: unverified\n\n## Low-Level Technical Invariants [V]\n\n| Attribute | Value | Notes |\n|---|---|---|\n| Event name | `EVT_CODE_PROLOGUE` | String in `__data` at `0x1010B8D70` |\n| Event code | `0x400` | Passed as first param to detection callback |\n| Checked byte value | `0xFF` | First byte of `sub SP, SP, #CST` encoding on AArch64 |\n| Instruction encoding | `0xFF ?? 0x00 0xD1` | Full encoding of `sub SP, SP, #<imm>` |\n| Corrupted pointer | `0x13b71a24724edfe` | Second param to `EVT_CODE_TRACING_cbk_ptr` in hook-trigger path |\n| Callback pointer location | `#hook_detect_cbk_p...",
      "val": 14.200000000000001
    }
  ],
  "links": [
    {
      "source": "wiki/_master-index",
      "target": "wiki/rasp/singpass/_hub"
    },
    {
      "source": "wiki/_master-index",
      "target": "wiki/rasp/singpass/rasp-bypass"
    },
    {
      "source": "wiki/_master-index",
      "target": "wiki/rasp/singpass/frida-stalker-detection"
    },
    {
      "source": "wiki/_master-index",
      "target": "wiki/rasp/singpass/jailbreak-detection"
    },
    {
      "source": "wiki/_master-index",
      "target": "wiki/rasp/singpass/hook-detection"
    },
    {
      "source": "wiki/_ttp-index",
      "target": "wiki/rasp/singpass/frida-stalker-detection"
    },
    {
      "source": "wiki/_ttp-index",
      "target": "wiki/rasp/singpass/thread-check"
    },
    {
      "source": "wiki/_ttp-index",
      "target": "wiki/rasp/singpass/anti-debug"
    },
    {
      "source": "wiki/_ttp-index",
      "target": "wiki/rasp/singpass/jailbreak-detection"
    },
    {
      "source": "wiki/_ttp-index",
      "target": "wiki/rasp/singpass/app-loaded-libraries"
    },
    {
      "source": "wiki/_ttp-index",
      "target": "wiki/rasp/singpass/hook-detection"
    },
    {
      "source": "wiki/_ttp-index",
      "target": "wiki/rasp/singpass/symbol-table-check"
    },
    {
      "source": "wiki/_patterns-index",
      "target": "wiki/rasp/singpass/hook-detection"
    },
    {
      "source": "wiki/_patterns-index",
      "target": "wiki/rasp/singpass/rasp-bypass"
    },
    {
      "source": "wiki/_patterns-index",
      "target": "wiki/rasp/singpass/detection-callbacks"
    },
    {
      "source": "wiki/_patterns-index",
      "target": "wiki/rasp/singpass/frida-stalker-detection"
    },
    {
      "source": "wiki/_patterns-index",
      "target": "wiki/rasp/singpass/thread-check"
    },
    {
      "source": "wiki/_patterns-index",
      "target": "wiki/rasp/singpass/symbol-table-check"
    },
    {
      "source": "wiki/_patterns-index",
      "target": "wiki/rasp/singpass/app-loaded-libraries"
    },
    {
      "source": "wiki/_patterns-index",
      "target": "wiki/rasp/singpass/code-system-lib"
    },
    {
      "source": "wiki/_patterns-index",
      "target": "wiki/rasp/singpass/jailbreak-detection"
    },
    {
      "source": "wiki/_patterns-index",
      "target": "wiki/rasp/singpass/_hub"
    },
    {
      "source": "wiki/_snippets-index",
      "target": "wiki/rasp/singpass/rasp-bypass"
    },
    {
      "source": "wiki/_snippets-index",
      "target": "wiki/rasp/singpass/thread-check"
    },
    {
      "source": "wiki/_snippets-index",
      "target": "wiki/rasp/singpass/anti-debug"
    },
    {
      "source": "wiki/_snippets-index",
      "target": "wiki/rasp/singpass/jailbreak-detection"
    },
    {
      "source": "wiki/_snippets-index",
      "target": "wiki/rasp/singpass/symbol-table-check"
    },
    {
      "source": "wiki/_snippets-index",
      "target": "wiki/rasp/singpass/frida-stalker-detection"
    },
    {
      "source": "wiki/_snippets-index",
      "target": "wiki/rasp/singpass/app-loaded-libraries"
    },
    {
      "source": "wiki/_snippets-index",
      "target": "wiki/rasp/singpass/code-system-lib"
    },
    {
      "source": "wiki/_tools-index",
      "target": "wiki/rasp/singpass/rasp-bypass"
    },
    {
      "source": "wiki/_tools-index",
      "target": "wiki/rasp/singpass/thread-check"
    },
    {
      "source": "wiki/_tools-index",
      "target": "wiki/rasp/singpass/frida-stalker-detection"
    },
    {
      "source": "wiki/_tools-index",
      "target": "wiki/rasp/singpass/app-loaded-libraries"
    },
    {
      "source": "wiki/_tools-index",
      "target": "wiki/rasp/singpass/symbol-table-check"
    },
    {
      "source": "wiki/_tools-index",
      "target": "wiki/rasp/singpass/_hub"
    },
    {
      "source": "wiki/rasp/_index",
      "target": "wiki/rasp/singpass/frida-stalker-detection"
    },
    {
      "source": "wiki/rasp/_index",
      "target": "wiki/rasp/singpass/rasp-bypass"
    },
    {
      "source": "wiki/rasp/_index",
      "target": "wiki/rasp/singpass/jailbreak-detection"
    },
    {
      "source": "wiki/rasp/_index",
      "target": "wiki/rasp/singpass/hook-detection"
    },
    {
      "source": "wiki/rasp/_index",
      "target": "wiki/rasp/singpass/_hub"
    },
    {
      "source": "wiki/rasp/singpass/_hub",
      "target": "wiki/rasp/singpass/jailbreak-detection"
    },
    {
      "source": "wiki/rasp/singpass/_hub",
      "target": "wiki/rasp/singpass/anti-debug"
    },
    {
      "source": "wiki/rasp/singpass/_hub",
      "target": "wiki/rasp/singpass/app-loaded-libraries"
    },
    {
      "source": "wiki/rasp/singpass/_hub",
      "target": "wiki/rasp/singpass/hook-detection"
    },
    {
      "source": "wiki/rasp/singpass/_hub",
      "target": "wiki/rasp/singpass/symbol-table-check"
    },
    {
      "source": "wiki/rasp/singpass/_hub",
      "target": "wiki/rasp/singpass/code-system-lib"
    },
    {
      "source": "wiki/rasp/singpass/_hub",
      "target": "wiki/rasp/singpass/frida-stalker-detection"
    },
    {
      "source": "wiki/rasp/singpass/_hub",
      "target": "wiki/rasp/singpass/thread-check"
    },
    {
      "source": "wiki/rasp/singpass/_hub",
      "target": "wiki/rasp/singpass/detection-callbacks"
    },
    {
      "source": "wiki/rasp/singpass/_hub",
      "target": "wiki/rasp/singpass/rasp-bypass"
    },
    {
      "source": "wiki/rasp/singpass/code-system-lib",
      "target": "wiki/rasp/singpass/_hub"
    },
    {
      "source": "wiki/rasp/singpass/code-system-lib",
      "target": "wiki/rasp/singpass/app-loaded-libraries"
    },
    {
      "source": "wiki/rasp/singpass/code-system-lib",
      "target": "wiki/rasp/singpass/rasp-bypass"
    },
    {
      "source": "wiki/rasp/singpass/code-system-lib",
      "target": "wiki/rasp/singpass/thread-check"
    },
    {
      "source": "wiki/rasp/singpass/code-system-lib",
      "target": "wiki/rasp/singpass/detection-callbacks"
    },
    {
      "source": "wiki/rasp/singpass/code-system-lib",
      "target": "wiki/rasp/singpass/hook-detection"
    },
    {
      "source": "wiki/rasp/singpass/code-system-lib",
      "target": "wiki/rasp/singpass/symbol-table-check"
    },
    {
      "source": "wiki/rasp/singpass/detection-callbacks",
      "target": "wiki/rasp/singpass/_hub"
    },
    {
      "source": "wiki/rasp/singpass/detection-callbacks",
      "target": "wiki/rasp/singpass/hook-detection"
    },
    {
      "source": "wiki/rasp/singpass/detection-callbacks",
      "target": "wiki/rasp/singpass/anti-debug"
    },
    {
      "source": "wiki/rasp/singpass/detection-callbacks",
      "target": "wiki/rasp/singpass/rasp-bypass"
    },
    {
      "source": "wiki/rasp/singpass/symbol-table-check",
      "target": "wiki/rasp/singpass/_hub"
    },
    {
      "source": "wiki/rasp/singpass/symbol-table-check",
      "target": "wiki/rasp/singpass/jailbreak-detection"
    },
    {
      "source": "wiki/rasp/singpass/symbol-table-check",
      "target": "wiki/rasp/singpass/frida-stalker-detection"
    },
    {
      "source": "wiki/rasp/singpass/symbol-table-check",
      "target": "wiki/rasp/singpass/rasp-bypass"
    },
    {
      "source": "wiki/rasp/singpass/symbol-table-check",
      "target": "wiki/rasp/singpass/detection-callbacks"
    },
    {
      "source": "wiki/rasp/singpass/symbol-table-check",
      "target": "wiki/rasp/singpass/hook-detection"
    },
    {
      "source": "wiki/rasp/singpass/anti-debug",
      "target": "wiki/rasp/singpass/_hub"
    },
    {
      "source": "wiki/rasp/singpass/anti-debug",
      "target": "wiki/rasp/singpass/detection-callbacks"
    },
    {
      "source": "wiki/rasp/singpass/anti-debug",
      "target": "wiki/rasp/singpass/jailbreak-detection"
    },
    {
      "source": "wiki/rasp/singpass/anti-debug",
      "target": "wiki/rasp/singpass/rasp-bypass"
    },
    {
      "source": "wiki/rasp/singpass/jailbreak-detection",
      "target": "wiki/rasp/singpass/_hub"
    },
    {
      "source": "wiki/rasp/singpass/jailbreak-detection",
      "target": "wiki/rasp/singpass/anti-debug"
    },
    {
      "source": "wiki/rasp/singpass/jailbreak-detection",
      "target": "wiki/rasp/singpass/symbol-table-check"
    },
    {
      "source": "wiki/rasp/singpass/jailbreak-detection",
      "target": "wiki/rasp/singpass/rasp-bypass"
    },
    {
      "source": "wiki/rasp/singpass/jailbreak-detection",
      "target": "wiki/rasp/singpass/detection-callbacks"
    },
    {
      "source": "wiki/rasp/singpass/rasp-bypass",
      "target": "wiki/rasp/singpass/_hub"
    },
    {
      "source": "wiki/rasp/singpass/rasp-bypass",
      "target": "wiki/rasp/singpass/code-system-lib"
    },
    {
      "source": "wiki/rasp/singpass/rasp-bypass",
      "target": "wiki/rasp/singpass/detection-callbacks"
    },
    {
      "source": "wiki/rasp/singpass/rasp-bypass",
      "target": "wiki/rasp/singpass/hook-detection"
    },
    {
      "source": "wiki/rasp/singpass/rasp-bypass",
      "target": "wiki/rasp/singpass/anti-debug"
    },
    {
      "source": "wiki/rasp/singpass/rasp-bypass",
      "target": "wiki/rasp/singpass/jailbreak-detection"
    },
    {
      "source": "wiki/rasp/singpass/rasp-bypass",
      "target": "wiki/rasp/singpass/frida-stalker-detection"
    },
    {
      "source": "wiki/rasp/singpass/rasp-bypass",
      "target": "wiki/rasp/singpass/thread-check"
    },
    {
      "source": "wiki/rasp/singpass/rasp-bypass",
      "target": "wiki/rasp/singpass/symbol-table-check"
    },
    {
      "source": "wiki/rasp/singpass/rasp-bypass",
      "target": "wiki/rasp/singpass/app-loaded-libraries"
    },
    {
      "source": "wiki/rasp/singpass/app-loaded-libraries",
      "target": "wiki/rasp/singpass/_hub"
    },
    {
      "source": "wiki/rasp/singpass/app-loaded-libraries",
      "target": "wiki/rasp/singpass/thread-check"
    },
    {
      "source": "wiki/rasp/singpass/app-loaded-libraries",
      "target": "wiki/rasp/singpass/code-system-lib"
    },
    {
      "source": "wiki/rasp/singpass/app-loaded-libraries",
      "target": "wiki/rasp/singpass/rasp-bypass"
    },
    {
      "source": "wiki/rasp/singpass/app-loaded-libraries",
      "target": "wiki/rasp/singpass/detection-callbacks"
    },
    {
      "source": "wiki/rasp/singpass/app-loaded-libraries",
      "target": "wiki/rasp/singpass/symbol-table-check"
    },
    {
      "source": "wiki/rasp/singpass/thread-check",
      "target": "wiki/rasp/singpass/_hub"
    },
    {
      "source": "wiki/rasp/singpass/thread-check",
      "target": "wiki/rasp/singpass/frida-stalker-detection"
    },
    {
      "source": "wiki/rasp/singpass/thread-check",
      "target": "wiki/rasp/singpass/app-loaded-libraries"
    },
    {
      "source": "wiki/rasp/singpass/thread-check",
      "target": "wiki/rasp/singpass/rasp-bypass"
    },
    {
      "source": "wiki/rasp/singpass/thread-check",
      "target": "wiki/rasp/singpass/detection-callbacks"
    },
    {
      "source": "wiki/rasp/singpass/frida-stalker-detection",
      "target": "wiki/rasp/singpass/_hub"
    },
    {
      "source": "wiki/rasp/singpass/frida-stalker-detection",
      "target": "wiki/rasp/singpass/symbol-table-check"
    },
    {
      "source": "wiki/rasp/singpass/frida-stalker-detection",
      "target": "wiki/rasp/singpass/thread-check"
    },
    {
      "source": "wiki/rasp/singpass/frida-stalker-detection",
      "target": "wiki/rasp/singpass/rasp-bypass"
    },
    {
      "source": "wiki/rasp/singpass/frida-stalker-detection",
      "target": "wiki/rasp/singpass/detection-callbacks"
    },
    {
      "source": "wiki/rasp/singpass/hook-detection",
      "target": "wiki/rasp/singpass/_hub"
    },
    {
      "source": "wiki/rasp/singpass/hook-detection",
      "target": "wiki/rasp/singpass/detection-callbacks"
    },
    {
      "source": "wiki/rasp/singpass/hook-detection",
      "target": "wiki/rasp/singpass/rasp-bypass"
    }
  ]
};