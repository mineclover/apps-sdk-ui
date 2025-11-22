# Apps SDK UI - Vanilla Web Components

Zero-dependency web components version of Apps SDK UI, using modern web standards.

## 🎯 Overview

This is a vanilla JavaScript implementation of Apps SDK UI components using Web Components (Custom Elements). It provides the same functionality and design as the React version, but without any framework dependencies.

### Key Features

- ✅ **Zero Dependencies** - Pure web standards, no React or other libraries
- ✅ **adoptedStyleSheets** - Efficient style sharing across shadow DOM
- ✅ **TypeScript Support** - Full type definitions included
- ✅ **Framework Agnostic** - Use with any framework or vanilla JavaScript
- ✅ **Same Design System** - Follows the exact same design tokens as React version
- ✅ **Tree Shakeable** - Import only what you need

## 📁 Project Structure

```
src/vanilla/
├── core/
│   ├── BaseElement.ts       # Base class for all web components
│   ├── types.ts             # Shared TypeScript types
├── styles/
│   ├── StyleManager.ts      # adoptedStyleSheets management
│   └── index.ts             # CSS bundle export
├── components/
│   └── button/
│       └── index.ts         # AppsButton component
└── index.ts                 # Main entry point
```

## 🚀 How It Works

### 1. **adoptedStyleSheets Architecture**

Instead of duplicating styles in each shadow DOM, we use the `adoptedStyleSheets` API to share a single CSSStyleSheet instance across all components:

```typescript
// StyleManager creates a singleton CSSStyleSheet
class StyleManager {
  private static globalSheet: CSSStyleSheet | null = null;

  static initializeSync(cssContent: string): void {
    this.globalSheet = new CSSStyleSheet();
    this.globalSheet.replaceSync(cssContent);
  }

  static getGlobalSheet(): CSSStyleSheet {
    return this.globalSheet;
  }
}

// BaseElement injects styles automatically
class BaseElement extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    // All components share the same stylesheet instance!
    this.shadow.adoptedStyleSheets = [StyleManager.getGlobalSheet()];
  }
}
```

### 2. **Component Implementation**

Each component extends `BaseElement` and implements its own render logic:

```typescript
export class AppsButton extends BaseElement {
  static get observedAttributes() {
    return ['color', 'variant', 'size', 'disabled'];
  }

  get color() {
    return this.getAttribute('color') || 'primary';
  }

  protected render() {
    const button = document.createElement('button');
    button.className = this.buildClassNames();
    button.appendChild(document.createElement('slot'));

    this.clearShadow();
    this.shadow.appendChild(button);
  }
}

customElements.define('apps-button', AppsButton);
```

## 🛠️ Build System

### Rollup Configuration

The build uses Rollup with multiple output formats:

- **ESM** (`dist/vanilla/apps-sdk-ui.esm.js`) - For module imports
- **IIFE** (`dist/vanilla/apps-sdk-ui.js`) - For `<script>` tags
- **Individual components** - Tree-shakeable imports

```bash
npm run build:vanilla
```

### Build Outputs

```
dist/vanilla/
├── apps-sdk-ui.esm.js       # Full ESM bundle
├── apps-sdk-ui.js           # Full IIFE bundle
├── apps-sdk-ui.css          # Tailwind + component styles
├── index.d.ts               # TypeScript definitions
└── components/
    └── button/
        ├── index.esm.js     # Button ESM
        ├── index.js         # Button IIFE
        └── index.d.ts       # Button types
```

## 📝 Usage Examples

### HTML with Script Tag

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="apps-sdk-ui.css">
</head>
<body>
  <apps-button color="primary" variant="solid">
    Click me
  </apps-button>

  <script src="apps-sdk-ui.js"></script>
</body>
</html>
```

### ES Modules

```javascript
import '@openai/apps-sdk-ui/vanilla';

// Components are auto-registered
const button = document.createElement('apps-button');
button.color = 'primary';
button.textContent = 'Click me';
document.body.appendChild(button);
```

### Individual Components

```javascript
import { AppsButton } from '@openai/apps-sdk-ui/vanilla/components/button';

// Only button component is loaded
```

### JavaScript API

```javascript
// Create programmatically
const button = document.createElement('apps-button');
button.setAttribute('color', 'primary');
button.setAttribute('variant', 'solid');
button.disabled = true;
button.loading = true;

// Listen to events
button.addEventListener('apps-click', (e) => {
  console.log('Clicked!', e.detail);
});

// Update properties
button.color = 'success';
button.size = 'lg';
```

## 🎨 Styling System

### adoptedStyleSheets Benefits

1. **Memory Efficient** - Single stylesheet shared across all components
2. **Fast Updates** - Change once, affects all instances
3. **No Style Duplication** - Smaller memory footprint
4. **Scoped Styles** - Shadow DOM prevents style leakage

### Tailwind Integration

The build process bundles Tailwind CSS with component-specific styles:

```typescript
// At build time, CSS is inlined
const GLOBAL_STYLES = `
  /* Tailwind base, components, utilities */
  /* Component-specific CSS modules */
`;

StyleManager.initializeSync(GLOBAL_STYLES);
```

## 🧪 Testing

Open the example HTML file in a browser:

```bash
# Serve the examples directory
npx serve examples/vanilla

# Or just open directly
open examples/vanilla/index.html
```

## 🔧 Development

### Adding a New Component

1. Create component directory:
```bash
mkdir src/vanilla/components/my-component
```

2. Implement the component:
```typescript
// src/vanilla/components/my-component/index.ts
import { BaseElement } from '../../core/BaseElement';

export class AppsMyComponent extends BaseElement {
  static get observedAttributes() {
    return ['prop1', 'prop2'];
  }

  protected render() {
    // Implementation
  }
}

customElements.define('apps-my-component', AppsMyComponent);
```

3. Export from main index:
```typescript
// src/vanilla/index.ts
export { AppsMyComponent } from './components/my-component';
```

4. Build and test:
```bash
npm run build:vanilla
```

## 📊 Browser Support

| Feature | Support |
|---------|---------|
| Custom Elements | ✅ All modern browsers |
| Shadow DOM | ✅ All modern browsers |
| adoptedStyleSheets | ✅ Chrome 73+, Firefox 101+, Safari 16.4+ |

For older browsers, consider:
- Using polyfills (Web Components polyfill)
- Falling back to light DOM
- Loading styles differently

## 🎯 Design Goals

1. **Zero Dependencies** - Only web standards
2. **Same API as React** - Familiar props and behavior
3. **Efficient Styling** - adoptedStyleSheets for performance
4. **TypeScript First** - Full type safety
5. **Framework Agnostic** - Works everywhere

## 🚀 Future Enhancements

- [ ] Add more components (Input, Select, DatePicker, etc.)
- [ ] SSR support with Declarative Shadow DOM
- [ ] Custom themes via CSS custom properties
- [ ] Accessibility improvements
- [ ] Performance benchmarks
- [ ] Component testing suite
- [ ] Storybook integration

## 📄 License

MIT © OpenAI
