# Schema: API / SDK Reference & Usage Patterns

> **Use when:** Source has function signatures, SDK reference docs, API parameters, or library usage guides.
> **Common metadata:** See [_common-metadata.md](_common-metadata.md)
> **Placeholders:** Everything in `<angle brackets>` is a placeholder. Replace it with values from the source, or delete the line. Never invent values.
> **Rule:** Signatures and their usage patterns stay together in one file.

---

## Template

```markdown
---
type: api-doc
topic: wiki/<topic>/_index
sources: [<official docs or header URL first>, <other URL>]
tags: [<tag>, <tag>]
arch: [<arm64 | arm32 | x86_64 | all>]
complexity: <intermediate | advanced>
completeness: <stub | partial | complete>
last_verified: <YYYY-MM-DD>
tool_versions: [<Library x.y.z>]
llm_summary: "<API/class + purpose + main RE use case, key terms first, 1-2 sentences>"
---
<!-- Omit arch if the source doesn't mention it. The library version goes in tool_versions so it appears in _tools-index.md. -->

# <API or SDK Name> — Reference & Usage Patterns

## 1. Purpose & Use Cases
- **Purpose:** <what this library or class does, one sentence>
- **Primary RE Use Case:** <how reverse engineers use it>
- **When to Use:** <exact scenario> [I]
- **When NOT to Use:** <negative condition and the alternative> [VS: <arch or version>]

## 2. Selection Guide
| Scenario / Arch | Recommended API | Rationale & Trade-offs |
|---|---|---|
| <scenario> | `<class or function>` | <why, and what it costs> |

## 3. Signatures & Behavior {#signatures}
<!-- Repeat this block per method or method group. -->
### `<methodName>`
```<language>
<exact signature verbatim from the source>
```
- **Parameters:** `<param>`: <type, meaning, constraints>
- **Returns:** <behavior on success, null, and failure>
- **Under the Hood:** <side effects, locks, threading>
- **Version Differences:** <behavior changes between versions> [VS: <version>]

## 4. Usage Patterns {#patterns}
### Pattern 1: <Task name> {#<pattern-anchor>}
```<language>
<complete, runnable code verbatim from the source>
```
- **Goal:** <what this code does>
- **When to Use:** <scenario>
- **Tested Environment:** <tool versions, OS, architecture>
- **Walkthrough:**
  1. **Lines <n-m>:** <what they do>
  2. **Lines <n-m>:** <what they do>
- **Gotchas:** <silent failures or crash conditions> [VS: <version>]

## 5. Scope Boundaries & Open Questions
- **Gotchas:** <version quirks, race conditions, leaks>
- **Not Covered:** <explicit scope boundary> — see [[wiki/<topic>/<article>]]
- **Open Questions:** <undocumented or experimental behavior> [U]
- **Related:** [[wiki/<topic>/<article>#<anchor>|<label>]]
```

---

## Key Rules for This Schema

### Schema-Specific Fields
| Field | Required | Notes |
|---|---|---|
| `tool_versions` | Yes | Library/SDK version this reference applies to (e.g. `[Frida 16.2.1]`) |
| `sources` | Yes | List the official docs or header file first |
| `arch` | Conditional | Supported architectures. Omit if not applicable. |

### Content Rules
- **Signatures and patterns stay together:** never split them into separate files.
- **Walkthrough required:** every usage pattern gets a line-by-line walkthrough.
- **Verbatim signatures:** types, parameter names, and defaults are copied exactly from the official source.
