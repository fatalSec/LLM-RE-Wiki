---
type: api-doc
topic: wiki/frida/api/_index
source: "https://frida.re/docs/javascript-api/"
tags: [frida, sqlite, database, storage]
complexity: intermediate
completeness: complete
last_verified: 2026-06-07
llm_summary: "Reference for Frida's SQLite API, supporting both persistent file-based databases and high-performance in-memory databases for script metadata storage."
---

# Databases (SQLite) Reference

[Hub]([[wiki/frida/api/frida-javascript-api-hub]]) | [Prev]([[wiki/frida/api/network-files-streams]]) | [Next]([[wiki/frida/api/instrumentation]])

## 1. Class Purpose & Core Use Cases
*   **Purpose:** Allows scripts to manage data using the robust SQLite v3 engine, either on disk or entirely in memory. [V]
*   **Primary RE Use Case:** Storing large amounts of precomputed static analysis data (e.g., control flow graphs or symbol maps) to guide dynamic analysis. [V]

---

## 2. SqliteDatabase
*   **`SqliteDatabase.open(path[, options])`**: Opens a file-based database. [V]
    *   `flags`: `['readonly', 'readwrite', 'create']`.
*   **`SqliteDatabase.openInline(encodedContents)`**: Opens an in-memory database from Base64/gzipped data. [V]
*   **`exec(sql)`**: Executes non-query SQL (e.g., `CREATE TABLE`). [V]
*   **`prepare(sql)`**: Compiles query into a `SqliteStatement`. [V]
*   **`dump()`**: Dumps database as gzipped Base64 string. [V]

---

## 3. SqliteStatement
*   **Binding**: `bindInteger(idx, val)`, `bindText(idx, val)`, `bindBlob(idx, bytes)`, `bindNull(idx)`. [V]
*   **`step()`**: Iterates results. Returns array of values or `null`. [V]
*   **`reset()`**: Resets state for reuse. [V]

---

## 4. Usage Patterns

### Pattern 1: Bundling In-Memory Data
```javascript
const db = SqliteDatabase.openInline('H4sIAAAAAAAA/...'); // Gzipped Base64
const smt = db.prepare('SELECT addr FROM symbols WHERE name = ?');
smt.bindText(1, 'target_func');
const row = smt.step();
if (row) console.log('Found at: ' + row[0]);
smt.reset();
```
#### How the Code Works:
1.  **Line 1:** Initializes an in-memory DB from a bundled asset (no disk I/O).
2.  **Line 2-6:** Performs a fast lookup using SQL indexing.

---

## 5. Gotchas
- `openInline()` is 100% in-memory and never touches the filesystem. [V]
- `SqliteStatement`: Ensure `reset()` is called between re-bindings or if `step()` is not exhausted. [V]
- Gzip detection in `openInline()` is automatic via magic marker. [V]
