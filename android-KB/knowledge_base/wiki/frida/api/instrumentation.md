---
type: api-doc
topic: wiki/frida/api/_index
source: "https://frida.re/docs/javascript-api/"
tags: [frida, interceptor, stalker, hooking, tracing]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
llm_summary: "Detailed reference for Frida's core instrumentation APIs: Interceptor for function hooking and replacement, and Stalker for high-performance code tracing."
---

# Instrumentation Reference (Interceptor & Stalker)

[Hub]([[wiki/frida/api/frida-javascript-api-hub]]) | [Prev]([[wiki/frida/api/databases]]) | [Next]([[wiki/frida/api/runtime-bridges]])

## 1. Class Purpose & Core Use Cases
*   **Purpose:** The core of Frida's power: `Interceptor` for hooking functions at their entry/exit, and `Stalker` for instruction-level execution tracing and transformation. [V]
*   **Primary RE Use Case:** Intercepting API calls to log arguments, replacing crypto logic, or generating coverage maps for obfuscated code. [V]

---

## 2. Interceptor Object
Function-level hooking.

### Methods
*   **`attach(target, callbacks)`**: Hooks at `target`. [V]
    *   `onEnter(args)`: Read/write arguments via `args[n]`.
    *   `onLeave(retval)`: Read/write return value via `retval.replace()`.
*   **`replace(target, replacement)`**: Completely swaps implementation. [V]
    *   Use `NativeCallback` for the `replacement`.
*   **`detachAll()`** / `revert(target)`. [V]
*   **`flush()`**: Commits pending changes to memory. [V]

### Properties (in `this` context)
*   `returnAddress`, `context` (registers), `threadId`, `depth`. [V]
*   `errno` (UNIX), `lastError` (Windows). [V]

---

## 3. Stalker Object
Instruction-level tracing.

### Methods
*   **`follow([threadId, options])`**: Starts tracing. [V]
    *   `events`: `call`, `ret`, `exec`, `block`, `compile`.
    *   `onReceive(events)`: Binary blob of `GumEvent` structs.
    *   `onCallSummary(summary)`: Key-value map of targets/counts.
    *   `transform(iterator)`: Runtime code transformation (powerful!). [V]
*   **`exclude(range)`**: Skips specific memory regions. [V]
*   **`unfollow()`** / `garbageCollect()`. [V]
*   **`addCallProbe(addr, callback)`**: Fast probe without full stalker overhead. [V]

### Config
*   `trustThreshold`: How many executions before code is assumed non-mutating (default: 1). [V]
*   `queueCapacity`, `queueDrainInterval`. [V]

---

## 4. Usage Patterns

### Pattern 1: Hooking and Log Argument
```javascript
Interceptor.attach(Module.getExportByName('libc.so', 'open'), {
  onEnter(args) {
    console.log('Opening: ' + args[0].readUtf8String());
    this.fd = args[0].toInt32(); // Store for onLeave
  },
  onLeave(retval) {
    console.log('Return FD: ' + retval);
  }
});
```
#### How the Code Works:
1.  **onEnter:** Accesses the filename pointer from X0 (ARM64) or stack (x86) and reads the string.
2.  **this context:** Stores data in a thread-local object to pass state from entry to exit.
3.  **onLeave:** Accesses the result returned by the OS.

---

## 5. Gotchas & Performance
- **Performance**: `onEnter/onLeave` in JS adds overhead (~6-11 microseconds). For high-frequency functions, use `CModule` implementations. [V]
- **Flush**: `Interceptor.attach()` changes may not be visible immediately to `NativeFunction` calls in the same script without a `flush()`. [V]
- **Stalker**: `exec` event is extremely noisy and resource-heavy. Use `block` or `call` whenever possible. [V]
- **ARM 32-bit**: Addresses must have LSB set for Thumb (1) or ARM (0) mode. Frida APIs handle this automatically. [V]
- **Recursion**: Frida automatically handles hook recursion to prevent infinite loops. [V]
