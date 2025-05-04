# File Header Generator

**A Visual Studio Code extension to automatically insert professional file headers into source code files.**

---

## ✨ Features

* Adds a standard, customizable file header to the top of your source code files
* Header includes project name, file name, path, author, creation time
* Real-time "Last Modified" information is shown on hover (not editable)
* Supports a wide range of languages: Python, JavaScript, TypeScript, Java, C, C++, HTML, Shell, Go, Ruby, XML, and more
* Works via right-click context menu, file explorer menu, or `Ctrl+Alt+H` shortcut
* Supports multi-file header generation via selection in Explorer

---


## ⚙️ Extension Settings

This extension contributes the following settings:

```json
"fileHeaderGenerator.author": {
  "type": "string",
  "default": "default",
  "description": "Default author name to include in headers."
}
```

You can set this in your `settings.json` to customize the author field globally.

---

## 💻 How to Use

### In the Editor:

1. Open a supported source code file
2. Right-click and choose **"Add Standard File Header"**
3. Or use keyboard shortcut: `Ctrl+Alt+H`

### In File Explorer:

1. Right-click any single file and choose **"Add Header to This File"**
2. Or right-click a folder and choose **"Add Header to Selected Files"** to apply headers to multiple files at once

### Hover Feature:

* Hover your cursor over the file content to see the real filesystem-based `Last Modified` timestamp

---

## 📦 Requirements

* Visual Studio Code version >= 1.99.0

---

## 🚧 Known Issues

* Non-supported languages will not trigger header generation or update
* `Last Modified` is not auto-updated in the header to avoid Ctrl+Z/undo issues

---

## 📝 Release Notes

### 0.0.2

* Added context menu integration for file explorer (single + multiple files)
* Converted Last Modified to hover-only display (no in-header update)

### 0.0.1

* Initial release with full support for header generation and automatic timestamping

---

## 🛠️ Development & Contribution

* Built using TypeScript and VS Code API
* Hover info via `fs.statSync` and `HoverProvider`
* Open to contributions and feature suggestions via GitHub

---

## 📚 Resources

* [VS Code Extension Docs](https://code.visualstudio.com/api)
* [VS Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

---

**Enjoy using File Header Generator! 🧐📝**
