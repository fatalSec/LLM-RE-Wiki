---
type: hub
topic: wiki/frida/_index
source: "https://frida.re/docs/javascript-api/"
tags: [frida, javascript-api, reference]
complexity: intermediate
completeness: complete
last_verified: 2026-06-07
llm_summary: "A semantic hub for Frida's JavaScript API documentation, providing organized links to runtime, process, memory, and instrumentation modules."
---

# Frida JavaScript API — Hub

Frida's JavaScript API allows for dynamic instrumentation, memory manipulation, and process introspection across multiple platforms.

## API Modules

| Module | Description |
|---|---|
| [[wiki/frida/api/runtime-script\|1. Runtime & Script]] | Core Frida versioning and script lifecycle management (`Frida`, `Script`). |
| [[wiki/frida/api/process-thread-module\|2. Process, Thread & Module]] | Introspection of processes, threads, and loaded libraries (`Process`, `Thread`, `Module`). |
| [[wiki/frida/api/memory-monitoring\|3. Memory & Monitoring]] | Scanning, allocation, and access monitoring (`Memory`, `MemoryAccessMonitor`). |
| [[wiki/frida/api/native-modules\|4. Native & Integrated Modules]] | Integration with C/Rust and low-level kernel/symbol resolution (`CModule`, `RustModule`, `ApiResolver`, `Kernel`). |
| [[wiki/frida/api/data-types\|5. Data Types & Pointers]] | Handling of pointers and 64-bit integers (`NativePointer`, `Int64`, `UInt64`, `ArrayBuffer`). |
| [[wiki/frida/api/native-invocation\|6. Native Invocation]] | Defining and calling native functions and callbacks (`NativeFunction`, `NativeCallback`, `SystemFunction`). |
| [[wiki/frida/api/network-files-streams\|7. Network, Files & Streams]] | Socket communication and filesystem access (`Socket`, `File`, `IOStream`). |
| [[wiki/frida/api/databases\|8. Databases (SQLite)]] | In-memory and file-based SQLite database interaction (`SqliteDatabase`). |
| [[wiki/frida/api/instrumentation\|9. Instrumentation]] | Function hooking and execution tracing (`Interceptor`, `Stalker`). |
| [[wiki/frida/api/runtime-bridges\|10. Runtime Bridges]] | High-level interaction with Java (Android) and Objective-C (iOS/macOS). |
| [[wiki/frida/api/arch-writers\|11. Architecture Writers]] | Runtime machine code generation for x86, ARM, ARM64, and MIPS. |
| [[wiki/frida/api/misc-apis\|12. Communication & Misc]] | RPC, messaging, cloaking, and performance profiling. |

## Quick Start
- Use **TypeScript** for the best development experience (code completion, type checking).
- Scripts are executed within the target process and share the private Frida heap.
- Always use `Java.perform()` or `ObjC.schedule()` when interacting with their respective runtimes.

## Related
- [[wiki/arch/arm64-syscall-reference|ARM64 Syscall Reference]]
- [[wiki/rasp/_index|RASP Analysis]]
