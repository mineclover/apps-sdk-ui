/**
 * Apps SDK UI - Vanilla Web Components
 *
 * Zero-dependency web components version of @openai/apps-sdk-ui
 * Uses adoptedStyleSheets for efficient style sharing
 */

import { StyleManager } from "./styles/StyleManager";
import { initializeStyles, GLOBAL_STYLES } from "./styles";

// Export core utilities
export { StyleManager } from "./styles/StyleManager";
export { BaseElement } from "./core/BaseElement";
export * from "./core/types";

// Import and register components
export { AppsButton } from "./components/button";
export { AppsBadge } from "./components/badge";
export { AppsInput } from "./components/input";
export { AppsCheckbox } from "./components/checkbox";
export { AppsSwitch } from "./components/switch";

/**
 * Initialize the library
 * Call this before using any components, or load styles separately
 */
export function initialize(cssContent?: string): void {
  initializeStyles(cssContent);
  console.log('[Apps SDK UI Vanilla] Initialized');
}

/**
 * Auto-initialize with bundled styles
 * This will run automatically when the module is imported
 */
if (typeof window !== 'undefined') {
  // Auto-initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!StyleManager.isReady()) {
        initialize(GLOBAL_STYLES);
      }
    });
  } else {
    if (!StyleManager.isReady()) {
      initialize(GLOBAL_STYLES);
    }
  }
}

// Export version
export const VERSION = '0.1.0-vanilla';
