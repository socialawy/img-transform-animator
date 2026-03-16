
# 🖼️ Image Transformer & Animator

An advanced **image transformation and animation tool** designed to import various image formats, convert them into ASCII art, pixel art, or an AI-powered accurate visual mimic, apply pre-set animation templates, and export the results in standard static and animated formats.

### **Core Features**
1.  **Universal Image Import**
    *   Supports all major image formats (JPG, PNG, BMP, WEBP, SVG, etc.).
    *   (Roadmap) Batch processing for handling multiple files.

2.  **Conversion Types**
    *   **ASCII Art:** Converts images into character-based visuals, with customizable density (via character cell size), character ramp, contrast, and color options.
    *   **Pixelation:** Mimics the image using fixed-size pixel blocks, allowing for varying resolution.
    *   **Accurate Rendering (AI):** AI-powered textual description of the image using the Gemini API. The AI's insights are rendered as an SVG for preview.

3.  **Animation Templates**
    *   Built-in effects like glitching, morphing, dynamic overlays, etc.
    *   Customizable frame rates for GIF/APNG-style exports.
    *   Layered effects for retro-style flickering, neon glow, or distortion.

4.  **Export Formats**
    *   **Static Exports:** PNG, JPG. (BMP also possible)
    *   **Animated Exports:** GIF, MP4, WebP. (Future)
    *   **Text-based Output:** ASCII format saved as TXT or SVG. AI description as SVG.

### **Workflow**
1.  **User uploads an image** (any supported format).
2.  **Selects conversion type** (ASCII, pixel art, AI textual description).
3.  Optionally **applies animation templates** (fade, glitch, rotate).
4.  **Exports** to the chosen format.

### **Technology Stack**
*   **Frontend:** React, TypeScript
*   **Styling:** CSS with a focus on responsive design
*   **AI Integration:** Offline trained models
*   **Offline Capabilities:** Service Workers

### **Current Status**
The application currently features:
*   A responsive user interface structure.
*   Image upload functionality.
*   Client-side pixelation with adjustable block size.
*   Client-side ASCII art generation with adjustable character cell size, custom character ramps, contrast control, SVG preview, and TXT/SVG export options. (Color ASCII in development)
*   **AI-powered "Accurate Rendering"**: Generates a textual description of the uploaded image using the Gemini API and displays it as an SVG. SVG export of this description is also available.
*   Placeholders for animation and advanced export logic.
*   Initial setup for offline-first caching of the application shell.
*   The API key for Gemini API is expected to be available via `process.env.API_KEY` and is managed externally.

### **Roadmap**

**Phase 1: Core Client-Side Functionality (MVP)**
*   [x] Implement robust image upload handling various formats.
*   [x] **Client-side Pixelation:**
    *   [x] Develop core pixelation logic.
### **Get Started**

```bash
# Clone the repository
git clone https://github.com/socialawy/img-transform-animator.git

# Install dependencies
npm install

# Run the development server
npm run dev
```

---
Developed by [socialawy](https://github.com/socialawy)
    *   [x] Add UI controls for pixel block size.
*   [x] **Client-side ASCII Art Generation:**
    *   [x] Develop core ASCII conversion logic (SVG preview and raw text).
    *   [x] Add UI controls for density/scale (via Character Cell Size).
*   [x] **Preview:**
    *   [x] Ensure clear preview of original and transformed images.
*   [x] **Static Export:**
    *   [x] Enable PNG and JPG export for client-side transformations.
    *   [x] Enable TXT export for ASCII art.
    *   [x] Enable SVG export for ASCII art.
*   [x] **Offline First:**
    *   [x] Implement Service Worker for caching app shell and static assets.

**Phase 2: Offilne AI Models.** (Offline first app)
*   [ ] **Accurate Rendering (AI) -  Research for trained models that can provide:** 

Gemini API Integration & Advanced Features** (2nd option if online and has an API key)
*   [~] **Accurate Rendering (AI) - Textual Description:** 
    *   [x] Integrate `GoogleGenAI` SDK for the "Accurate Rendering" feature (using `gemini-2.5-flash-preview-04-17`).
    *   [x] Develop prompt engineering for image description.
    *   [x] Implement API call logic, display AI text as SVG, loading states, and robust error handling.
    *   [x] Ensure graceful handling if `process.env.API_KEY` is not available.
    *   [x] Enable SVG export for the AI-generated textual description.

*   [ ] **Advanced ASCII Art:**
    *   [x] Allow custom character maps/ramps.
    *   [x] Add contrast control.
    *   [ ] Explore color ASCII options.

**Phase 3: Animation Implementation**
*   [ ] **Client-side Animation Templates:**
    *   [ ] Implement basic animations (e.g., glitch, flicker) on static transformed images.
    *   [ ] Add UI controls for selecting animation templates.
*   [ ] **Animated Export:**
    *   [ ] Enable animated GIF export.
    *   [ ] Enable animated WebP export.
*   [ ] **(Optional) AI-Powered Animation:**
    *   [ ] Investigate Gemini API capabilities for generating or assisting with animations.

**Phase 4: Advanced Enhancements & Polish**
*   [ ] **Batch Processing:**
    *   [ ] Allow users to upload and process multiple images simultaneously.
*   [ ] **Advanced AnimationControls:**
    *   [ ] Add UI controls for frame rate, duration, and other animation parameters.
*   [ ] **MP4 Export:**
    *   [ ] Investigate client-side libraries (e.g., WebAssembly-based ffmpeg) or server-side solutions for MP4 export.
*   [ ] **UI/UX Refinements:**
    *   [ ] Conduct accessibility audit and implement improvements (ARIA attributes, keyboard navigation).
    *   [ ] Optimize performance for large images and complex operations.
    *   [ ] Consider theming options.
*   [ ] **Comprehensive Testing:**
    *   [ ] Unit tests and integration tests for key functionalities.

### **Offline First Architecture**
This application is designed to be "offline first." A **Service Worker** is employed to cache the core application assets, including:
*   `index.html`
*   `index.css`
*   `index.tsx` (and its compiled JavaScript output)
*   Static assets like icons or placeholder images.

This ensures that once the application is loaded, it can be accessed even without an internet connection.

**Important Considerations for Offline Mode:**
*   **API-Dependent Features:** Features like "Accurate Rendering," which rely on the Gemini API, will require an active internet connection. The UI will gracefully handle these situations by informing the user or disabling the feature when offline.
*   **Updates:** The Service Worker will also handle updates to the application, ensuring users get the latest version when they are online.

### **Cross-Platform Compatibility**
The application aims for broad compatibility across modern web browsers and devices. This is achieved through:
*   **Responsive Design:** The UI adapts to different screen sizes, from desktops to mobile devices.
*   **Standard Web Technologies:** Utilization of HTML5, CSS3, and modern JavaScript (ES6+) features that are widely supported.
*   **Progressive Enhancement:** Core functionality is prioritized, with advanced features layered on top.

Regular testing across different browsers (Chrome, Firefox, Safari, Edge) and operating systems will be part of the development lifecycle to ensure a consistent user experience.
