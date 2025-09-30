# 🎨 Visual IDE

> Transform code into visual blocks - Making programming accessible to everyone

**Visual IDE** is a revolutionary platform that converts textual code into an intuitive graphical interface, making coding accessible to everyone - from beginners to experienced developers.

![Project Status](https://img.shields.io/badge/status-MVP_Complete-success)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Features

### 🎯 Core Functionality
- **📥 Code Import** - Paste Python code and instantly see it as visual blocks
- **📤 Code Export** - Convert visual blocks back to clean, working Python code
- **🔄 Bi-directional** - Seamlessly switch between visual and code views

### 🧱 Visual Blocks
- **Function Blocks** - Create and edit functions with parameters
- **Variable Blocks** - Declare and assign variables
- **Conditional Blocks** - If/Else statements with visual conditions
- **Loop Blocks** - For loops with iterators
- **Return Blocks** - Function return values

### 🎨 Smart Features
- **Variable Tracking** - Automatically tracks all available variables in scope
- **Variable Highlighting** - Variables are highlighted with colored pills for easy identification
- **Variable Suggestions** - Quick-insert menu for available variables
- **Nested Blocks** - Full support for nested code structures
- **Parameter Editing** - Add/remove function parameters with ease
- **Block Deletion** - Remove blocks with a single click

---

## 🚀 Quick Start

### Prerequisites
- Node.js v20.9.0 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Visual-IDE.git
   cd Visual-IDE
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 💡 How to Use

### Import Python Code
1. Click **"📥 Import Python Code"**
2. Paste your Python code
3. Click **"Import"** - Watch it transform into visual blocks!

### Create from Scratch
1. Click block buttons (Function, Variable, If/Else, Loop, Return)
2. Fill in the details
3. Nest blocks by clicking **"+ Add Statement"** inside blocks

### Export Code
1. Click **"Show Python Code"**
2. Copy the generated code
3. Use it in your Python projects!

### Use Variables
1. Inside any block, look for the **📦 button**
2. Click it to see available variables
3. Select a variable to insert it
4. Variables are automatically highlighted in green!

---

## 🏗️ Project Structure

```
Visual-IDE/
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── blocks/   # Block components (Function, Variable, etc.)
│   │   │   ├── canvas/   # Main canvas component
│   │   │   └── common/   # Shared components (ValueInput)
│   │   ├── core/         # Core logic
│   │   │   ├── compiler/ # Python code compiler
│   │   │   └── parser/   # Python code parser
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Utility functions
│   └── package.json
├── CLAUDE.md             # Project vision and roadmap
└── README.md            # This file
```

---

## 🎨 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v3
- **Build Tool**: Vite
- **Language Support**: Python (more coming soon!)

---

## 🗺️ Roadmap

### Phase 1: MVP - Python Only ✅ (COMPLETE!)
- [x] 5 basic blocks (Function, Variable, If/Else, Loop, Return)
- [x] Code Import (Python → Visual)
- [x] Code Export (Visual → Python)
- [x] Parameter editing
- [x] Delete blocks
- [x] Variable tracking and highlighting

### Phase 2: Language Engine 🔜
- [ ] Modular language support
- [ ] JavaScript/TypeScript support
- [ ] Language plugin system

### Phase 3: Advanced Features 📋
- [ ] Advanced blocks (classes, async, exceptions)
- [ ] Visual debugger
- [ ] AI integration
- [ ] Drag & drop reordering

### Phase 4: Full IDE 🚀
- [ ] Multi-file projects
- [ ] Terminal & execution
- [ ] Git UI
- [ ] Package management

---

## 🎯 Vision

**"Making programming as accessible as using a computer"**

Visual IDE transforms coding from a text-based activity into an intuitive visual experience. Just like you configure settings in an app, you can now "configure" your code through visual blocks.

### Why Visual IDE?

- ✅ **Real Code** - Unlike Scratch, generates actual production code
- ✅ **Full Power** - Support for complex, real-world projects
- ✅ **Bi-directional** - Switch between visual and code anytime
- ✅ **Language Agnostic** - Works with Python, JavaScript, and more
- ✅ **Universal** - For beginners learning to code AND experts reading complex code

---

## 🤝 Contributing

Contributions are welcome! Whether you're:
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📝 Improving documentation
- 🔧 Submitting pull requests

Please feel free to open an issue or PR!

---

## 📄 License

MIT License - feel free to use this project for learning and development!

---

## 🙏 Acknowledgments

Built with the assistance of Claude AI by Anthropic.

---

## 📧 Contact

Have questions or suggestions? Open an issue on GitHub!

---

**Made with ❤️ for the coding community**