---
type: api-doc
topic: wiki/frida/api/_index
source: "https://frida.re/docs/javascript-api/"
tags: [frida, cmodule, rustmodule, apiresolver, kernel, symbols]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
llm_summary: "Reference for Frida's high-performance native integration modules (C/Rust) and advanced system introspection tools (Kernel, ApiResolver)."
---

# Native & Integrated Modules Reference

[Hub]([[wiki/frida/api/frida-javascript-api-hub]]) | [Prev]([[wiki/frida/api/memory-monitoring]]) | [Next]([[wiki/frida/api/data-types]])

## 1. Class Purpose & Core Use Cases
*   **Purpose:** Allows embedding high-performance native code (C/Rust) directly into scripts and provides advanced tools for resolving APIs across different runtimes (ObjC/Swift) and the kernel. [V]
*   **Primary RE Use Case:** Implementing hot callbacks for Stalker/Interceptor that would be too slow in JS, and performing system-wide symbol resolution. [V]

---

## 2. CModule & RustModule
Embedding machine code.

*   **`new CModule(code[, symbols, options])`**: Compiles C source (via TinyCC) into memory. [V]
    *   Exports functions as `NativePointer` properties.
    *   Use for performance-critical logic in `Interceptor` or `Stalker`.
*   **`new RustModule(code[, symbols, options])`**: Compiles Rust into memory. [V]
    *   Functions should be `#[no_mangle] extern "C"`.

---

## 3. ApiResolver
Cross-runtime symbol resolution.

*   **`new ApiResolver(type)`**: Types: `module`, `objc`, `swift`. [V]
*   **`enumerateMatches(query)`**: Supports globs. [V]
    *   `module`: `exports:*!open*`
    *   `objc`: `-[NSURL* *HTTP*]`
    *   `swift`: `functions:*CoreDevice!*RemoteDevice*`

---

## 4. Kernel Object
Kernel-space introspection (requires kernel-level access).

*   `Kernel.base`, `Kernel.pageSize`.
*   `Kernel.enumerateModules()`.
*   `Kernel.enumerateRanges(protection)`.
*   `Kernel.readByteArray(addr, len)` / `writeByteArray(addr, bytes)`. [V]

---

## 5. Usage Patterns

### Pattern 1: High-Performance C Hook
```javascript
const cm = new CModule(`
#include <gum/guminterceptor.h>
void onEnter (GumInvocationContext * ic) {
  // fast logic here
}
`);
Interceptor.attach(target, cm.onEnter);
```
#### How the Code Works:
1.  **Line 1-6:** Compiles a C function that follows the `GumJS` hook signature.
2.  **Line 7:** Attaches the C function directly to the interceptor, bypassing the JS-to-Native context switch overhead.

---

## 6. Gotchas
- `CModule`: All data is read-only. Declare writable globals as `extern` and pass them via the `symbols` argument. [V]
- `ApiResolver`: Recommended to use the same instance for batches of queries, but recreate for future batches to avoid stale data. [V]
- `Kernel`: Only available if the backend supports kernel-level instrumentation. [V]
