---
type: api-doc
topic: wiki/frida/api/_index
source: "https://frida.re/docs/javascript-api/"
tags: [frida, process, thread, module, introspection]
complexity: intermediate
completeness: complete
last_verified: 2026-06-07
llm_summary: "Reference for Frida's process, thread, and module introspection APIs, enabling enumeration of loaded libraries, memory ranges, and thread states."
---

# Process, Thread & Module Reference

[Hub]([[wiki/frida/api/frida-javascript-api-hub]]) | [Prev]([[wiki/frida/api/runtime-script]]) | [Next]([[wiki/frida/api/memory-monitoring]])

## 1. Class Purpose & Core Use Cases
*   **Purpose:** Provides tools to inspect and interact with the target process's architecture, memory layout, threads, and loaded modules. [V]
*   **Primary RE Use Case:** Finding function addresses in modules, checking for debuggers, and enumerating memory ranges for scanning. [V]

---

## 2. Process Object
Global process state and enumeration.

| Member | Description |
|---|---|
| `Process.id` | PID of the process. |
| `Process.arch` | Architecture (`ia32`, `x64`, `arm`, `arm64`). |
| `Process.platform` | OS platform (`windows`, `darwin`, `linux`, etc.). |
| `Process.pageSize` | Virtual memory page size. |
| `Process.pointerSize` | Pointer size in bytes. |
| `Process.codeSigningPolicy` | `optional` or `required`. |
| `Process.isDebuggerAttached()` | Returns boolean. |
| `Process.enumerateThreads()` | Returns array of `Thread` objects. |
| `Process.enumerateModules()` | Returns array of `Module` objects. |

### Module Lookup
*   `findModuleByAddress(addr)` / `getModuleByAddress(addr)`
*   `findModuleByName(name)` / `getModuleByName(name)`
*   *Note: `find` returns `null` on failure, `get` throws an exception.* [V]

### Memory Ranges
*   `enumerateRanges(protection)`: Returns memory regions matching `rwx` specifier. [V]
*   `enumerateMallocRanges()`: Enumerates heap allocations. [V]

---

## 3. Thread Object
Thread state and control.

*   `id`: OS-specific thread ID.
*   `name`: Thread name.
*   `state`: `running`, `stopped`, `waiting`, `uninterruptible`, or `halted`.
*   `context`: Snapshot of registers (`pc`, `sp`, `x0`, etc.).
*   `Thread.backtrace([context, backtracer])`: Generates a backtrace (limit 16 frames). [V]
*   `Thread.sleep(delay)`: Suspends execution. [V]

### Hardware Breakpoints/Watchpoints
*   `setHardwareBreakpoint(id, address)`
*   `setHardwareWatchpoint(id, address, size, conditions)` (`r`, `w`, `rw`) [V]

---

## 4. Module Object
Details of a loaded library.

*   `name`, `base`, `size`, `path`.
*   `ensureInitialized()`: Forces module initializers to run. [V]
*   `enumerateImports()` / `enumerateExports()` / `enumerateSymbols()`.
*   `findExportByName(name)` / `getExportByName(name)`.

---

## 5. Usage Patterns

### Pattern 1: Module-Relative Export Lookup
```javascript
const libc = Process.getModuleByName('libc.so');
const openAddr = libc.getExportByName('open');
console.log('open() is at: ' + openAddr);
```
#### How the Code Works:
1.  **Line 1:** Locates the `libc.so` module metadata.
2.  **Line 2:** Efficiently finds the `open` symbol offset within that specific module.

---

## 6. Gotchas
- `enumerateSymbols()` is only available on iOS, macOS, and Linux-based OSes. [VS]
- Thread `state` and `context` are highly volatile snapshots. [V]
- `Process.runOnThread()` must be used with extreme caution (non-reentrant code). [V]
