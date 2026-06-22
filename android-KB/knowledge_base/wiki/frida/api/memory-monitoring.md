---
type: api-doc
topic: wiki/frida/api/_index
source: "https://frida.re/docs/javascript-api/"
tags: [frida, memory, scanning, monitoring, patching]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
llm_summary: "Detailed reference for Frida's memory manipulation and monitoring APIs, covering scanning, allocation, protection changes, and hardware-backed access monitoring."
---

# Memory & Monitoring Reference

[Hub]([[wiki/frida/api/frida-javascript-api-hub]]) | [Prev]([[wiki/frida/api/process-thread-module]]) | [Next]([[wiki/frida/api/native-modules]])

## 1. Class Purpose & Core Use Cases
*   **Purpose:** Provides fine-grained control over memory operations, including pattern scanning, allocation, protection modification, and real-time access monitoring. [V]
*   **Primary RE Use Case:** Locating signatures in memory, patching code to bypass checks, and detecting when specific regions are read from or written to. [V]

---

## 2. Memory Object
Low-level memory operations.

### Scanning
*   **`Memory.scan(address, size, pattern, callbacks)`**: Asynchronous scan. [V]
    *   `pattern`: e.g., `"13 37 ?? ff"` or masked `"13 37 : 1f ff"`.
    *   `callbacks`: `onMatch(address, size)`, `onError(reason)`, `onComplete()`.
*   **`Memory.scanSync(address, size, pattern)`**: Synchronous scan returning array of matches. [V]

### Manipulation
*   **`Memory.alloc(size[, options])`**: Allocates memory on the heap or page-aligned. [V]
    *   `options`: `{ near: address, maxDistance: bytes }`.
*   **`Memory.copy(dst, src, n)`**: Standard `memcpy`. [V]
*   **`Memory.protect(address, size, protection)`**: Changes memory protection (`rwx`). [V]
*   **`Memory.patchCode(address, size, apply)`**: Safe code modification. Handles systems where code pages are read-only/signed (e.g., iOS). [V]

---

## 3. MemoryAccessMonitor
Tracks memory accesses.

*   **`MemoryAccessMonitor.enable(ranges, callbacks)`**: Monitors ranges. [V]
    *   `callbacks.onAccess(details)`: Triggered on FIRST access of each page.
    *   `details`: `threadId`, `operation` (`read`, `write`, `execute`), `from`, `address`. [V]
*   **`MemoryAccessMonitor.disable()`**: Stops monitoring. [V]

---

## 4. Usage Patterns

### Pattern 1: Safe Code Patching
```javascript
const target = Module.getExportByName('libgame.so', 'is_pro_user');
Memory.patchCode(target, 4, (code) => {
    const cw = new Arm64Writer(code, { pc: target });
    cw.putMovRegU32('w0', 1);
    cw.putRet();
    cw.flush();
});
```
#### How the Code Works:
1.  **Line 1:** Gets the function address.
2.  **Line 2:** Uses `patchCode` to request a writable buffer.
3.  **Line 3-7:** Uses `Arm64Writer` to write `return true` logic. `patchCode` handles the commit to memory.

---

## 5. Gotchas
- `Memory.alloc()`: Memory is released when ALL JS handles are gone. Keep a global reference if used by native code. [V]
- `Memory.patchCode()`: Do not assume the `code` pointer is the same as the `address` pointer (iOS temporary buffers). [V]
- `MemoryAccessMonitor`: Only notifies on the **first** access to a page. Subsequent accesses to the same page are not reported until re-enabled. [V]
- `Memory.scan()`: Use `stop` return value in `onMatch` to exit early. [V]
