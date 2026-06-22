---
type: api-doc
topic: wiki/frida/api/_index
source: "https://frida.re/docs/javascript-api/"
tags: [frida, rpc, cloak, profiling, messaging, debugging]
complexity: intermediate
completeness: complete
last_verified: 2026-06-07
llm_summary: "Reference for Frida's auxiliary APIs, including RPC for host communication, Cloak for stealth, and the Profiler for performance analysis."
---

# Communication & Miscellaneous Reference

[Hub]([[wiki/frida/api/frida-javascript-api-hub]]) | [Prev]([[wiki/frida/api/arch-writers]])

## 1. Class Purpose & Core Use Cases
*   **Purpose:** Auxiliary tools for script debugging, host-to-agent communication, stealth (Cloaking), and performance measurement. [V]

---

## 2. Communication
*   **`send(message[, data])`**: Sends JSON `message` (and optional binary `data`) to the host. [V]
*   **`recv([type, ]callback)`**: Registers a callback for the next message from the host. One-shot. [V]
*   **`rpc.exports`**: Object to expose functions for direct invocation by the host. [V]

---

## 3. Cloak Object
Hides Frida's presence from process introspection.

*   `Cloak.addThread(id)` / `removeThread(id)`. [V]
*   `Cloak.addRange(range)` / `removeRange(range)`. [V]
*   `Cloak.addFileDescriptor(fd)`. [V]
*   *Note: Frida's own resources are cloaked automatically.* [V]

---

## 4. Profiler & Sampler
Worst-case performance analysis.

*   **`new Profiler()`**: Built on top of `Interceptor`. [V]
*   `instrument(addr, sampler)`: Measures cycles/time between entry and exit. [V]
*   `generateReport()`: Returns XML string. [V]
*   **Samplers**: `CycleSampler`, `WallClockSampler`, `MallocCountSampler`. [V]

---

## 5. Other Utilities
*   **`console.log()` / `warn()` / `error()`**: Global logging. [V]
*   **`hexdump(target[, options])`**: Formatted memory visualization. [V]
*   **`new Worker(url)`**: Background thread for heavy JS processing. [V]
*   **`gc()`**: Forces garbage collection. [V]
*   **`setTimeout()` / `setInterval()` / `setImmediate()`**: Timing events. [V]

---

## 6. Usage Patterns

### Pattern 1: Simple RPC Export
```javascript
rpc.exports = {
  getProcessInfo() {
    return { pid: Process.id, arch: Process.arch };
  }
};
```

---

## 7. Gotchas
- **`recv()`**: Only triggers once. You must call it again inside the callback to receive continuous messages. [V]
- **`send()` performance**: Not optimized for high frequencies. Batch data before sending if possible. [V]
- **`Worker`**: Workers have their own heap and lock; communication is via `post()` and `onMessage`. [V]
