/**
 * Style exports for vanilla web components
 *
 * The CSS will be bundled as a string and injected into adoptedStyleSheets
 */

// Import CSS as a string using the ?inline query parameter
// This will be processed by rollup-plugin-css-string
// @ts-ignore - Dynamic import handled by bundler
import vanillaCSS from './vanilla.css?inline';

import { StyleManager } from './StyleManager';

export const GLOBAL_STYLES = vanillaCSS || '';

/**
 * Initialize styles
 * This should be called before any components are used
 */
export function initializeStyles(cssContent?: string): void {
  const styles = cssContent || GLOBAL_STYLES;

  if (styles && styles.trim() !== '') {
    StyleManager.initializeSync(styles);
  } else {
    console.warn('[Vanilla] No styles provided, components may not render correctly');
  }
}
