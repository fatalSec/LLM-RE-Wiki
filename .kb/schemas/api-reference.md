# Schema: API / SDK Reference & Usage Patterns

> **Use when:** Source has function signatures, SDK reference docs, API parameters, or library usage guides.
> **Common metadata:** See [_common-metadata.md](_common-metadata.md)
> **Rule:** Reference signatures and their practical usage patterns are consolidated into this single file for direct traversal.

---

## Template

```markdown
---
type: api-doc
topic: wiki/<topic>/_index
source: <URL>
tags: [tag1, tag2]
sdk_library_version: "<x.x.x>"
official_source: <URL>
arch: [arm64, arm32, x86_64, all]
complexity: intermediate | advanced
completeness: stub | partial | complete
last_verified: YYYY-MM-DD
tool_versions: [<tool x.x>]
llm_summary: "<A dense summary of the API class, core purpose, and primary RE use case for direct LLM retrieval>"
---

# <API or SDK Name> — Reference & Usage Patterns

## 1. Class Purpose & Core Use Cases
*   **Purpose:** <What this library/class does in 1 sentence, e.g. 'Used to dynamically construct AArch64 machine instructions at runtime.'> [V]
*   **Primary RE Use Case:** <e.g. 'Dynamically patching native JNI methods to bypass integrity gates.'> [V]
*   **When to Use:** <Exact scenario, e.g. 'When compiling memory instructions dynamically without writing raw shellcode bytes.'> [I]
*   **When NOT to Use:** <Negative condition, e.g. 'Targeting 32-bit ARM architectures; use ArmWriter instead.'> [VS: AArch64]

## 2. Architecture & Selection Guide
| Target Scenario / Architecture | Use This API Class | Instead of | Technical Rationale |
|---|---|---|---|
| AArch64 (64-bit ARM) | `Arm64Writer` | `ArmWriter` | Generates native 64-bit instruction encodings |
| Memory Tracing | `Stalker` | `Interceptor` | Complete basic block tracing with minimal hook overhead |

---

## 3. API Signatures & Behaviors {#signatures}

### `<methodName(param: Type): ReturnType>`

```<language>
// Exact function/method signature verbatim from source
methodName(param: Type): ReturnType
```
*   **Parameters:**
    *   `param`: <Description, expected type, and constraint invariants>
*   **Return Value:** <Detailed return behavior under success, null, and failure conditions>
*   **Under-the-Hood Behavior:** <Non-obvious side-effects, memory locks, thread implications> [V]
*   **Version Discrepancies:** <Behavioral changes across tool/library versions> [VS: x.x]

<!-- Duplicate block per logical API method group -->

---

## 4. Complete Usage Patterns & Code Walkthroughs {#patterns}

### Pattern 1: <Name of Task, e.g. Hooking Native Export & Spoofing Return>
```javascript
// Complete, runnable code snippet demonstrating the API usage verbatim
Interceptor.attach(Module.getExportByName(null, 'open'), {
    onEnter(args) {
        this.path = args[0].readUtf8String();
    },
    onLeave(retval) {
        if (this.path && this.path.includes("su")) {
            retval.replace(ptr(-1));
        }
    }
});
```

#### Context & Step-by-Step Execution:
*   **Goal:** <What task this code snippet accomplishes>
*   **When to Use:** <Exact scenario where this snippet applies>
*   **Tested Environment:** <Tool versions, OS, and Architecture>
*   **Step-by-Step Execution Flow:**
    1.  **Lines 1-3:** <Action taken, e.g. 'Attaches an Interceptor to the native open export.'>
    2.  **Lines 4-8:** <Action taken, e.g. 'Inspects target filename argument from register X0 and spoofs return value to -1.'>
*   **Pattern Gotchas:** <Conditions that trigger silent failures or memory crashes> [VS: x.x]

---

## 5. Scope Boundaries, Gotchas & Open Questions
- **General Gotchas & Silent Failures:** <Known version quirks, race conditions, or memory leaks> [V/VS]
- **What This Article Does NOT Cover:** <Explicit scope boundary, e.g. "Windows/macOS native APIs — see [[wiki/other]]">
- **Open Questions / Unverified Behaviors:** <Undocumented APIs or experimental features>
- **Related Articles:** [[wiki/topic/article#anchor|Related API / Tool]]
```

---

## Key Rules for This Schema

### Schema-Specific Fields
| Field | Required | Notes |
|---|---|---|
| `sdk_library_version` | Yes | Target library version string (e.g. `"16.2.1"`) |
| `official_source` | Yes | Direct link to official API docs or repository header file |
| `arch` | Conditional | Supported architectures (`[arm64, arm32, x86_64, all]`) |

### Content Rules
- **Signatures + Patterns Stay Together:** Never split signatures into a separate file from their practical code patterns.
- **Mandatory Walkthroughs:** For every usage pattern, provide a step-by-step description under "Execution Flow".
- **Verbatim Signatures:** Types, parameter names, and default values must be extracted exactly from official source headers.
