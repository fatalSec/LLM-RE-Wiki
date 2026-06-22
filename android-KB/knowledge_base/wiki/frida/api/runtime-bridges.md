---
type: api-doc
topic: wiki/frida/api/_index
source: "https://frida.re/docs/javascript-api/"
tags: [frida, java, android, objc, ios, runtime-bridge]
complexity: advanced
completeness: complete
last_verified: 2026-06-07
llm_summary: "Comprehensive reference for Frida's Java (Android) and Objective-C (iOS/macOS) runtime bridges, enabling high-level interaction with classes, methods, and heap instances."
---

# Runtime Bridges Reference (Java & ObjC)

[Hub]([[wiki/frida/api/frida-javascript-api-hub]]) | [Prev]([[wiki/frida/api/instrumentation]]) | [Next]([[wiki/frida/api/arch-writers]])

## 1. Class Purpose & Core Use Cases
*   **Purpose:** Provides high-level abstractions for interacting with managed runtimes. `Java` for Android's Dalvik/ART and `ObjC` for Apple's runtime. [V]
*   **Primary RE Use Case:** Hooking Java methods to bypass obfuscated RASP logic, instantiating hidden classes, or enumerating live objects on the heap. [V]

---

## 2. Java Object (Android)
### Core Methods
*   **`Java.perform(fn)`**: Ensures thread is attached to VM. Essential for most Java tasks. [V]
*   **`Java.use(className)`**: Gets a JS wrapper for a class. Use `$new()` for constructors. [V]
*   **`Java.choose(className, callbacks)`**: Scans the heap for live instances. [V]
*   **`Java.cast(handle, klass)`**: Casts a raw pointer to a Java object wrapper. [V]
*   **`Java.registerClass(spec)`**: Defines a new Java class at runtime. [V]

### Deoptimization
*   `Java.deoptimizeEverything()` / `deoptimizeBootImage()`: Forces interpreter mode to bypass ART optimizations that might skip hooks. [V]

---

## 3. ObjC Object (iOS/macOS)
### Core Methods
*   **`ObjC.classes`**: Map of all registered classes. Use `className.methodName_()` (underscore for colons). [V]
*   **`ObjC.schedule(queue, work)`**: Runs JS on a specific GCD queue. [V]
*   **`ObjC.choose(specifier, callbacks)`**: Scans heap for ObjC instances. [V]
*   **`new ObjC.Object(handle)`**: JS binding for an existing instance pointer. [V]

### Properties
*   `$kind`, `$super`, `$class`, `$ivars` (instance variables). [V]

---

## 4. Usage Patterns

### Pattern 1: Hooking a Java Method
```javascript
Java.perform(() => {
  const Activity = Java.use('android.app.Activity');
  Activity.onResume.implementation = function () {
    console.log('onResume called!');
    this.onResume(); // Call original
  };
});
```

### Pattern 2: Enumerating ObjC Instances
```javascript
ObjC.choose(ObjC.classes.UIButton, {
  onMatch(btn) {
    console.log('Found button: ' + btn.title().toString());
  },
  onComplete() {}
});
```

---

## 5. Gotchas
- **Frida 17+**: `Java` and `ObjC` bridges are now moved to external NPM packages (`frida-java-bridge`, `frida-objc-bridge`) for standalone use, but still baked into the REPL. [V]
- **Class Loaders**: `Java.use()` uses the app's main class loader by default. For late-loaded DEX files, use `Java.enumerateClassLoaders()`. [V]
- **Naming**: ObjC method colons `:` are replaced by underscores `_` in JavaScript. [V]
- **Block Lifecycle**: When hooking ObjC blocks, keep them alive (e.g., in a `Set`) to prevent premature GC. [V]
