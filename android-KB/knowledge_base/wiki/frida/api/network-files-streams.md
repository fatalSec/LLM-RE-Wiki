---
type: api-doc
topic: wiki/frida/api/_index
source: "https://frida.re/docs/javascript-api/"
tags: [frida, network, socket, file, stream]
complexity: intermediate
completeness: complete
last_verified: 2026-06-07
llm_summary: "Reference for Frida's filesystem and networking APIs, enabling scripts to interact with files, sockets, and data streams within the target process."
---

# Network, Files & Streams Reference

[Hub]([[wiki/frida/api/frida-javascript-api-hub]]) | [Prev]([[wiki/frida/api/native-invocation]]) | [Next]([[wiki/frida/api/databases]])

## 1. Class Purpose & Core Use Cases
*   **Purpose:** Provides a high-level asynchronous API for networking (TCP/UNIX sockets) and synchronous/asynchronous file I/O. [V]
*   **Primary RE Use Case:** Exfiltrating decrypted memory to a remote server, logging data to local files, or intercepting data flowing through process streams. [V]

---

## 2. Socket Object
Networking primitives.

*   **`Socket.listen([options])`**: Returns `Promise<SocketListener>`. [V]
    *   `family`: `ipv4`, `ipv6`, `unix`.
*   **`Socket.connect(options)`**: Returns `Promise<SocketConnection>`. [V]
*   **`Socket.localAddress(handle)`** / `peerAddress(handle)`: Inspects handle. [V]

---

## 3. File Object
Synchronous file interaction.

*   **`File.readAllBytes(path)`** / `readAllText(path)`. [V]
*   **`File.writeAllBytes(path, data)`** / `writeAllText(path, text)`. [V]
*   **`new File(path, mode)`**: Mode: `"rb"`, `"wb"`, etc.
    *   `seek(offset[, whence])`, `tell()`, `flush()`, `close()`. [V]
    *   `readBytes([size])`, `readText([size])`, `readLine()`. [V]

---

## 4. IOStream Objects
Asynchronous stream handling.

*   **`IOStream`**: Base containing `input` and `output`. [V]
*   **`InputStream`**: `read(size)`, `readAll(size)`. [V]
*   **`OutputStream`**: `write(data)`, `writeAll(data)`, `writeMemoryRegion(addr, size)`. [V]
*   **System-specific**: `UnixInputStream`, `Win32InputStream`. [V]

---

## 5. Usage Patterns

### Pattern 1: Dumping Memory to File
```javascript
const mem = ptr('0x1234').readByteArray(1024);
const f = new File('/sdcard/dump.bin', 'wb');
f.write(mem);
f.flush();
f.close();
```
#### How the Code Works:
1.  **Line 1:** Reads a block of memory into a buffer.
2.  **Line 2:** Opens a local file for binary writing.
3.  **Line 3-5:** Writes the buffer, flushes the OS cache, and closes the handle.

---

## 6. Gotchas
- `File` methods are mostly **synchronous**, which can block the target process. Use `OutputStream` for non-blocking operations. [V]
- Networking APIs are **asynchronous** and return Promises. [V]
- `Socket.listen()`: Defaults to a random TCP port if not specified. [V]
