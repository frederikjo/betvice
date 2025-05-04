# Betvice - Betting Advice with Precision

Betvice is a modern betting advice and statistics application built
with React, TypeScript, and Vite, offering extensive stats and a
clean, intuitive UI.

## About Betvice

Betvice helps users make informed betting decisions through:

- Comprehensive statistical analysis
- Expert betting tips
- Performance tracking
- Intuitive data visualizations

## Style Guide

Betvice follows a consistent design system to create a professional
and engaging user experience:

### Color Palette

- **Primary Colors**: Deep Blue (#183153), Electric Blue (#3b82f6),
  Steel Gray (#64748b)
- **Secondary Colors**: Success Green (#10b981), Alert Red (#ef4444),
  Highlight Gold (#f59e0b)
- **Neutrals**: Various background and text colors for light/dark
  modes

### Typography

- **Primary Font**: Inter (Sans-serif)
- **Numerical Font**: IBM Plex Mono (for statistics and odds)
- **Hierarchy**: Clear heading structure with consistent spacing

### Components

All UI components follow established patterns including buttons,
cards, inputs, and data visualizations. See the full style guide in
the `docs/style-guide.md` file for detailed specifications.

### Accessibility

Betvice is designed with accessibility in mind, following WCAG
guidelines for color contrast, touch targets, and screen reader
compatibility.

## Technology Stack

### React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite
with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)
  uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)
  uses [SWC](https://swc.rs/) for Fast Refresh

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating
the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to
  `plugin:@typescript-eslint/recommended-type-checked` or
  `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install
  [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)
  and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to
  the `extends` list

## Contributing

Contributions are welcome! Please follow the existing code style and
make sure to update tests as appropriate.

## License

[MIT License](LICENSE)
