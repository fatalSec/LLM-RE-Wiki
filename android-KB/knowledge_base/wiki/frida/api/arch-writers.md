---
type: api-doc
topic: wiki/frida/api/_index
source: "https://frida.re/docs/javascript-api/"
tags: [frida, assembly, code-generation, arm64, x86, mips]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
llm_summary: "Comprehensive reference for Frida's architecture-specific code writers and relocators, enabling runtime machine code generation and repositioning."
---

# Architecture Writers & Relocators Reference

[Hub]([[wiki/frida/api/frida-javascript-api-hub]]) | [Prev]([[wiki/frida/api/runtime-bridges]]) | [Next]([[wiki/frida/api/misc-apis]])

## 1. Class Purpose & Core Use Cases
*   **Purpose:** Provides a high-level API to generate and relocate machine code for specific CPU architectures (x86, ARM, ARM64, MIPS). [V]
*   **Primary RE Use Case:** Dynamically creating trampolines, patching instructions with complex logic, or repositioning code blocks during unpacking/deobfuscation. [V]

---

## 2. Code Writers
Writers allow writing assembly instructions directly to a memory address.

### Common Methods (Across All Writers)
*   `new <Arch>Writer(addr[, options])`: Target address and optional PC. [V]
*   `flush()`: Resolves labels and commits to memory. **Mandatory**. [V]
*   `putLabel(id)` / `putJmpNearLabel(id)`: Handle control flow within the generated block. [V]
*   `putNop()`, `putRet()`, `putBreakpoint()`. [V]

### Architecture Specifics
*   **X86Writer**: `putPushax()`, `putPopax()`, `putMovRegFsU32Ptr()`. [V]
*   **ArmWriter**: `putBlxImm()`, `putVpushRange()`. [V]
*   **ThumbWriter**: `putInstructionWide()`, `putCbzRegLabel()`. [V]
*   **Arm64Writer**: `putAdrpRegAddress()`, `putPushAllXRegisters()`, `sign(ptr)`. [V]
*   **MipsWriter**: `putPrologueTrampoline()`, `putMfhiReg()`. [V]

---

## 3. Code Relocators
Relocators copy instructions while adjusting position-dependent branches and data accesses.

*   `new <Arch>Relocator(src, outputWriter)`
*   `readOne()`: Buffers one instruction. [V]
*   `writeOne()` / `writeAll()`: Writes buffered instructions to the output. [V]
*   `skipOne()`: Drops an instruction (useful for patching). [V]
*   `eob`: True if end-of-block (branch) reached. [V]

---

## 4. Usage Patterns

### Pattern 1: Generating a Trampoline (ARM64)
```javascript
const target = ptr('0x1000');
const writer = new Arm64Writer(target);
writer.putPushRegReg('x0', 'x1');
writer.putMovRegU64('x0', 1337);
writer.putPopRegReg('x0', 'x1');
writer.putRet();
writer.flush();
```

---

## 5. Gotchas
- **Labels**: You can reference labels before defining them, but `flush()` must be called to resolve the offsets. [V]
- **Instruction Alignment**: Ensure the target buffer has correct alignment for the architecture (e.g., 4-byte for ARM64). [V]
- **Memory Protection**: The target memory must be writable before using a Writer. [V]
- **Scratch PC**: When using `Memory.patchCode()` on iOS, provide the original PC to the Writer so PC-relative instructions are calculated correctly for the final destination. [V]
