# 🖼️ Image Transformer & Animator

An advanced, AI-powered image transformation and animation tool. Convert images into ASCII art, pixel art, or AI-generated visual descriptions using Gemini, and apply dynamic animation templates.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)](https://vitejs.dev/)
[![Gemini](https://img.shields.io/badge/AI-Gemini_Pro-red.svg)](https://ai.google.dev/)
[![GitHub Pages](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://socialawy.github.io/img-transform-animator/)

---

### **🚀 Core Features**

*   🎨 **Conversion Styles**: 
    *   **ASCII Art**: Character-based visuals with custom ramps and density control.
    *   **Pixelation**: Retro-style block rendering with adjustable resolution.
    *   **AI Accurate Rendering**: Intelligent textual mimicry powered by Gemini API.
*   ✨ **Animation Templates**: Built-in effects like glitching, morphing, and retro flickering.
*   📥 **Universal Import**: Supports JPG, PNG, BMP, WEBP, and SVG.
*   📤 **High-Quality Export**: Save as PNG, JPG, or SVG (for ASCII/AI descriptions).
*   🌐 **Offline First**: PWA-ready with Service Worker support for core functionality.

---

## 🛠️ Getting Started

### Prerequisites

*   **Node.js** (v18 or higher)
*   **Gemini API Key**: [Get one here](https://ai.google.dev/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/socialawy/img-transform-animator.git
   cd img-transform-animator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env.local` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

---

## 🏗️ Architecture

*   **Frontend**: React & TypeScript for a type-safe, component-based UI.
*   **Styling**: Pure CSS with modern layouts and responsive design.
*   **AI Integration**: `@google/genai` SDK for interacting with Gemini models.
*   **PWA**: Service Workers for offline availability and caching.

---

## 🗺️ Roadmap

- [ ] **Phase 3**: Animated GIF/WebP export implementation.
- [ ] **Phase 4**: Batch processing for multiple images.
- [ ] **Future**: Deep integration with Gemini for video-to-animation generation.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Developed with ❤️ by [socialawy](https://github.com/socialawy)
