---
type: api-doc
topic: wiki/frida/api/_index
source: "https://frida.re/docs/javascript-api/"
tags: [frida, nativepointer, int64, uint64, memory-access]
complexity: intermediate
completeness: complete
last_verified: 2026-06-07
llm_summary: "Essential reference for Frida's primitive data types, focusing on NativePointer operations and 64-bit integer handling for memory manipulation."
---

# Data Types & Pointers Reference

[Hub]([[wiki/frida/api/frida-javascript-api-hub]]) | [Prev]([[wiki/frida/api/native-modules]]) | [Next]([[wiki/frida/api/native-invocation]])

## 1. Class Purpose & Core Use Cases
*   **Purpose:** Provides robust handling for memory addresses (`NativePointer`) and large integers (`Int64`, `UInt64`) that exceed standard JavaScript Number precision. [V]
*   **Primary RE Use Case:** Arithmetic on memory offsets, reading/writing raw bytes, and handling Pointer Authentication (PAC) on modern ARM64 devices. [V]

---

## 2. NativePointer Object
The core abstraction for memory addresses.

### Arithmetic & Comparison
*   `add(rhs)`, `sub(rhs)`, `and(rhs)`, `or(rhs)`, `xor(rhs)`, `not()`.
*   `isNull()`, `equals(rhs)`, `compare(rhs)`. [V]

### Pointer Authentication (PAC)
*   `sign([key, data])`: Adds PAC bits. Keys: `ia` (default), `ib`, `da`, `db`. [V]
*   `strip([key])`: Removes PAC bits. [V]
*   `blend(smallInteger)`: Blends bits for use as `data` in `sign()`. [V]

### Memory Access
*   **Read**: `readPointer()`, `readS8()`, `readU32()`, `readFloat()`, `readByteArray(len)`. [V]
*   **Write**: `writePointer(ptr)`, `writeU32(val)`, `writeByteArray(bytes)`. [V]
*   **String**: `readUtf8String([len])`, `readCString()`, `writeUtf8String(str)`. [V]
*   **Volatile**: `readVolatile(len)`, `writeVolatile(bytes)`: Slower but avoids crashing if memory is unmapped during access. [V]

---

## 3. Int64 & UInt64
*   `new Int64(v)` / `new UInt64(v)`.
*   Supports arithmetic (`add`, `sub`, `and`, etc.) and bitwise shifts (`shl`, `shr`).
*   `toNumber()` / `toString([radix])`. [V]

---

## 4. Usage Patterns

### Pattern 1: Pointer Arithmetic and Dereferencing
```javascript
const base = Module.findBaseAddress('libnative.so');
const structPtr = base.add(0x1234);
const fieldVal = structPtr.add(8).readU32();
```
#### How the Code Works:
1.  **Line 1:** Finds the module base.
2.  **Line 2:** Calculates the absolute address of a struct using a hex offset.
3.  **Line 3:** Offsets from the struct base to a field at +8 bytes and reads its 32-bit unsigned integer value.

---

## 5. Gotchas
- `NativePointer` read/write functions throw exceptions if memory is unmapped. Use `readVolatile` for safer, slower access. [V]
- `sign()` and `strip()` are no-ops on hardware that doesn't support PAC. [V]
- `toInt32()`: Casts the pointer to a signed 32-bit integer; may lose precision on 64-bit systems. [V]
