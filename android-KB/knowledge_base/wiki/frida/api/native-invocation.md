---
type: api-doc
topic: wiki/frida/api/_index
source: "https://frida.re/docs/javascript-api/"
tags: [frida, nativefunction, nativecallback, systemfunction, jni, abi]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
llm_summary: "Reference for calling and implementing native functions within Frida, covering ABIs, type signatures, and exception handling during native invocations."
---

# Native Invocation Reference

[Hub]([[wiki/frida/api/frida-javascript-api-hub]]) | [Prev]([[wiki/frida/api/data-types]]) | [Next]([[wiki/frida/api/network-files-streams]])

## 1. Class Purpose & Core Use Cases
*   **Purpose:** Bridges the JavaScript-to-Native gap, allowing scripts to call arbitrary memory addresses as functions (`NativeFunction`) or implement native-compatible callbacks (`NativeCallback`). [V]
*   **Primary RE Use Case:** Manually calling decrypted functions, invoking JNI methods, or replacing native logic with JavaScript. [V]

---

## 2. NativeFunction
Calling native code from JavaScript.

*   **`new NativeFunction(address, returnType, argTypes[, options])`**
    *   `returnType` / `argTypes`: `void`, `pointer`, `int`, `uint`, `size_t`, `bool`, etc.
    *   **Structs**: Pass an array of field types: `['int', 'int', 'int']`. [V]
    *   **ABI**: `default`, `sysv`, `stdcall`, `thiscall`, `fastcall`, `win64`, `unix64`, `vfp`. [V]
    *   **Options**:
        *   `scheduling`: `cooperative` (default) vs `exclusive`.
        *   `exceptions`: `steal` (default) vs `propagate`.
        *   `traps`: `default`, `none`, `all`. [V]

---

## 3. NativeCallback
Implementing native interfaces in JavaScript.

*   **`new NativeCallback(func, returnType, argTypes[, abi])`**
    *   Resulting object is a `NativePointer`.
    *   Can be passed to `Interceptor.replace()`. [V]

---

## 4. SystemFunction
*   **`new SystemFunction(address, returnType, argTypes[, options])`**
    *   Wraps `NativeFunction` and captures the thread's last error status.
    *   Returns object: `{ value: result, errno: 0 }` (UNIX) or `{ value: result, lastError: 0 }` (Windows). [V]

---

## 5. Usage Patterns

### Pattern 1: Calling a C Function with a Struct
```javascript
const malloc = new NativeFunction(Module.getExportByName(null, 'malloc'), 'pointer', ['size_t']);
const myMem = malloc(1024);
```
#### How the Code Works:
1.  **Line 1:** Locates the `malloc` symbol and defines its signature: returns a pointer, takes one `size_t` argument.
2.  **Line 2:** Calls the native function like a standard JS function.

---

## 6. Gotchas
- **Variadic Functions**: Use `'...'` in `argTypes` to separate fixed and variadic arguments. [V]
- **Large Returns**: For C++ objects larger than `pointerSize`, the ABI may require passing a destination pointer as the first argument. [V]
- **Deadlocks**: `scheduling: 'exclusive'` is faster but riskier. [V]
- **Exception Theft**: `exceptions: 'steal'` avoids process crashes by converting native faults into JS exceptions. [V]
