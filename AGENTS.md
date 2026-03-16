# Agent Info: Image Transformer & Animator

## Project Overview
A React-based web application for AI-powered image transformations (ASCII, pixel art, Gemini description) and animations. Designed as an offline-first PWA.

## Tech Stack
- **Framework**: React 18 & Vite
- **Language**: TypeScript
- **AI**: Google Gemini API (`@google/genai`)
- **Styling**: Vanilla CSS

## Core Structure
- `index.tsx`: Main application logic and UI.
- `sw.js`: Service worker for offline-first capabilities.
- `vite.config.ts`: Build and environment configuration.

## Guidelines for Jules
1. **Type Safety**: Strictly use TypeScript. Avoid `any`.
2. **AI Prompts**: Prompts for Gemini should be descriptive and handle edge cases.
3. **Offline First**: Ensure new assets are correctly cached in `sw.js`.
4. **Base Path**: The app is hosted on GitHub Pages at `/img-transform-animator/`.

## Current Goals
- Implement animated GIF/WebP export.
- Add batch processing for multiple images.
- Improve ASCII art color support.
