# Contributing to Final Fantasy CSS

Thank you for your interest in contributing! This project aims to create authentic Final Fantasy-themed UI components for the web.

## 🎯 What We Need

The current themes are **rough approximations** that need refinement. We're looking for contributors to help make these themes pixel-perfect matches to the original games.

### High Priority

1. **Theme Refinement** - The existing themes (FF1, FF4, FF6, FF7, FF8, FF9, FF13, FF15) need significant work:
   - Colors, gradients, and borders should match the original games exactly
   - Typography and spacing need adjustment
   - Cursor animations and interactive states need polish
   
2. **Missing Game-Specific Components** - Each game has unique UI elements:
   - Limit Break meters
   - Summon selection screens
   - Battle menus
   - Party management interfaces

3. **Animation and Transitions** - The original games had specific timing and animation styles that should be replicated

### Medium Priority

- Cross-browser testing and fixes
- Accessibility improvements (keyboard navigation, ARIA labels, screen reader support)
- Documentation and examples
- Performance optimizations

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Final-Fantasy-CSS.git
   cd Final-Fantasy-CSS
   ```

3. **Make your changes**
   - Theme files are in `css/` (e.g., `css/ff7.css`)
   - Components are in `css/components/`
   - Test your changes by opening `index.html` in a browser

4. **Test thoroughly**
   - Check all themes switch properly
   - Verify components work in different browsers
   - Ensure your changes don't break existing functionality

5. **Submit a Pull Request**
   - Describe what you changed and why
   - Include screenshots if you modified visual elements
   - Reference any issues your PR addresses

## 📝 Style Guide

- Use CSS custom properties (CSS variables) for theme values
- Prefix all classes with `ff-` (e.g., `.ff-button`, `.ff-window`)
- Theme-specific overrides should be scoped (e.g., `.theme-ff7 .ff-button`)
- Comment your code, especially for complex visual effects
- Follow the existing naming conventions

## 🎨 Design Resources

When refining themes, reference:
- Original game screenshots and videos
- Game manuals and art books
- Fan wikis and sprite databases

## 💬 Questions?

- Open an issue for discussion
- Check existing issues to see if your question was answered
- Be respectful and patient - we're all fans working together!

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project.
