# Contributing to Image Transformer & Animator

Welcome to the **Image Transformer & Animator** project! We appreciate your interest in contributing and helping the community create amazing AI-powered visual transformations.

## 🤝 How Can I Contribute?

### 🐛 Reporting Bugs

- Use the **Bug Report** template when opening an issue.
- Provide a clear, descriptive title.
- Include detailed steps to reproduce the issue.
- Specify your browser, OS, and any error messages from the console.
- Include the image file that causes the issue (if possible).

### ✨ Suggesting Enhancements

- Use the **Feature Request** template.
- Explain the value of the enhancement for the community.
- Describe the user story or use case.
- Consider if it aligns with our offline-first PWA philosophy.

### 🔧 Pull Requests

1. **Fork the repository** and create your branch from `main`.
2. **Set up your development environment**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/img-transform-animator.git
   cd img-transform-animator
   npm install
   cp .env.example .env.local  # Add your API key
   ```
3. **Run the test suite**:
   ```bash
   npm test
   ```
4. **Start development**:
   ```bash
   npm run dev
   ```
5. **Make your changes** following our guidelines.
6. **Test thoroughly** in different browsers.
7. **Submit a Pull Request** with a comprehensive description.

## 📋 Development Guidelines

### Code Style
- Follow the existing React/TypeScript patterns.
- Ensure all types are properly defined (avoid `any`).
- Use functional components with hooks.
- Follow the existing file structure and naming conventions.

### TypeScript Standards
- Use strict TypeScript configuration.
- Provide proper type definitions for all functions.
- Use interfaces for object shapes.
- Enable all recommended TypeScript rules.

### AI Integration
- Handle API errors gracefully.
- Provide fallbacks when AI services are unavailable.
- Include loading states for AI operations.
- Respect rate limits and implement retry logic where appropriate.

### PWA Considerations
- Ensure new assets are properly cached in `sw.js`.
- Test offline functionality regularly.
- Consider performance impact on mobile devices.
- Use progressive enhancement for advanced features.

## 🚀 Quick Start for Contributors

1. **Clone and setup**:
   ```bash
   git clone https://github.com/socialawy/img-transform-animator.git
   cd img-transform-animator
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env.local
   # Add your Gemini API key to .env.local
   echo "VITE_GEMINI_API_KEY=your_key_here" > .env.local
   ```

3. **Run tests**:
   ```bash
   npm test
   ```

4. **Start development**:
   ```bash
   npm run dev
   # Open http://localhost:5173 in your browser
   ```

5. **Build for production**:
   ```bash
   npm run build
   # Test the built version with npm run preview
   ```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Categories
- **Unit Tests**: Individual component and function tests
- **Integration Tests**: API and service worker tests
- **E2E Tests**: Full user workflow tests (planned)
- **Performance Tests**: PWA and offline functionality tests

## 🎯 Current Community Needs

We're especially looking for help with:
- **Animated GIF/WebP export** implementation
- **Batch processing** for multiple images
- **Enhanced ASCII art** color support
- **More animation templates** and effects
- **Mobile responsiveness** improvements
- **Additional AI models** integration
- **Performance optimizations** for large images

## 📚 Resources for Contributors

- **Architecture Guide**: Check `AGENTS.md` for technical details
- **API Documentation**: Gemini API docs for AI integration
- **PWA Guidelines**: Google's PWA best practices
- **Test Suite**: Run `npm test` to understand functionality
- **Style Guide**: Existing codebase serves as the style reference

## 🔧 Development Tools

### Recommended VS Code Extensions
- TypeScript and JavaScript Language Features
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- GitLens

### Browser Development
- Use Chrome DevTools for debugging
- Test in Firefox and Safari for cross-browser compatibility
- Use Network throttling for performance testing
- Test offline functionality in Application tab

## 📄 License

By contributing to Image Transformer & Animator, you agree that your contributions will be licensed under its MIT License.

## 🙏 Community Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub's contributor statistics
- Special mentions in project updates

## 🌟 Contributing Examples

### Adding a New Transformation
1. Create the transformation function in `src/transforms/`
2. Add TypeScript types for the transformation
3. Update the UI to include the new option
4. Add tests for the new functionality
5. Update the README with documentation

### Improving AI Prompts
1. Test different prompt variations
2. Add error handling for edge cases
3. Document the prompt strategy in comments
4. Add tests for various input scenarios

Thank you for helping make Image Transformer & Animator better for everyone! 🎨✨
