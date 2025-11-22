/**
 * Style exports for vanilla web components
 *
 * The CSS will be bundled as a string and injected into adoptedStyleSheets
 */

// This will be replaced by the bundler with actual CSS content
// For now, we'll use a placeholder that can be replaced during build
export const GLOBAL_STYLES = `
/* Placeholder for bundled Tailwind + component styles */
/* This will be replaced by rollup-plugin-postcss or a custom plugin */
`;

/**
 * Initialize styles
 * This should be called before any components are used
 */
export function initializeStyles(cssContent?: string): void {
  const { StyleManager } = require('./StyleManager');
  const styles = cssContent || GLOBAL_STYLES;

  if (styles && styles.trim() !== '') {
    StyleManager.initializeSync(styles);
  } else {
    console.warn('[Vanilla] No styles provided, components may not render correctly');
  }
}
