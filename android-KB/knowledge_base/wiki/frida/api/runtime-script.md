---
type: api-doc
topic: wiki/frida/api/_index
source: "https://frida.re/docs/javascript-api/"
tags: [frida, script, runtime, lifecycle]
complexity: beginner
completeness: complete
last_verified: 2026-06-07
llm_summary: "Reference for Frida's core runtime and script management APIs, including versioning, script evaluation, and resource cleanup via weak bindings."
---

# Frida Runtime & Script Reference

[Hub]([[wiki/frida/api/frida-javascript-api-hub]]) | [Next]([[wiki/frida/api/process-thread-module]])

## 1. Class Purpose & Core Use Cases
*   **Purpose:** Manages the Frida environment and the lifecycle of JavaScript scripts injected into target processes. [V]
*   **Primary RE Use Case:** Retrieving Frida versions for compatibility checks and dynamically loading sub-scripts or assets. [V]

## 2. Frida Object
Contains global runtime information.

| Property | Type | Description |
|---|---|---|
| `Frida.version` | `string` | Current Frida version. |
| `Frida.heapSize` | `number` | Size of Frida's private heap shared by all scripts. |

---

## 3. Script Object
Handles script execution, evaluation, and memory management.

### Evaluation & Loading
*   **`Script.runtime`**: Returns `"QJS"` or `"V8"`. [V]
*   **`Script.evaluate(name, source)`**: Evaluates JavaScript string in global scope. Supports source maps. [V]
*   **`Script.load(name, source)`**: Compiles and evaluates as an ES module. Returns a *Promise*. [V]
*   **`Script.nextTick(func[, ...params])`**: Runs `func` on the next tick after exiting the JS runtime. [V]

### Lifecycle & GC
*   **`Script.pin()` / `Script.unpin()`**: Reference-counted mechanism to prevent script unloading. [V]
*   **`Script.bindWeak(value, fn)`**: Calls `fn` when `value` is garbage-collected or script unloads. Returns an ID. [V]
*   **`Script.unbindWeak(id)`**: Stops monitoring and calls the callback immediately. [V]

### Global Access
*   **`Script.setGlobalAccessHandler(handler | null)`**: Resolves attempts to access non-existent globals. Useful for REPLs.
    *   `enumerate()`: Returns array of existing globals.
    *   `get(property)`: Returns value for a property.

---

## 4. Usage Patterns

### Pattern 1: Safe Resource Cleanup
```javascript
const handle = openNativeResource();
Script.bindWeak(handle, () => {
    closeNativeResource(handle);
});
```
#### How the Code Works:
1.  **Line 1:** Allocates or opens a native resource.
2.  **Line 2-4:** Binds a weak listener to the JavaScript handle. When the JS handle is GC'd, the native resource is automatically closed.

## 5. Gotchas
- `Script.pin()` must be balanced with `Script.unpin()`.
- `Script.evaluate()` vs `eval()`: Use `evaluate` for better stack traces and source map support. [V]
- `Script.nextTick()` is essential for scheduling tasks that shouldn't block the current native execution. [I]
