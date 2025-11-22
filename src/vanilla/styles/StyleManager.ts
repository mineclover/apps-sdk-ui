/**
 * StyleManager - Manages shared CSSStyleSheet instances for web components
 *
 * This class provides a centralized way to manage styles across all web components
 * using the adoptedStyleSheets API, which allows efficient style sharing without
 * duplicating style tags in each shadow root.
 */

export class StyleManager {
  private static globalSheet: CSSStyleSheet | null = null;
  private static componentSheets: Map<string, CSSStyleSheet> = new Map();
  private static isInitialized = false;

  /**
   * Initialize the style manager with the global Tailwind CSS
   * This should be called once when the library loads
   */
  static async initialize(cssContent: string): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Create and populate the global stylesheet
      this.globalSheet = new CSSStyleSheet();
      await this.globalSheet.replace(cssContent);
      this.isInitialized = true;
      console.log('[StyleManager] Initialized with global styles');
    } catch (error) {
      console.error('[StyleManager] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Initialize synchronously (for bundled CSS)
   */
  static initializeSync(cssContent: string): void {
    if (this.isInitialized) {
      return;
    }

    try {
      this.globalSheet = new CSSStyleSheet();
      this.globalSheet.replaceSync(cssContent);
      this.isInitialized = true;
      console.log('[StyleManager] Initialized with global styles (sync)');
    } catch (error) {
      console.error('[StyleManager] Failed to initialize (sync):', error);
      throw error;
    }
  }

  /**
   * Get the global stylesheet
   * Returns an array to be spread into adoptedStyleSheets
   */
  static getGlobalSheet(): CSSStyleSheet {
    if (!this.globalSheet) {
      // Create empty stylesheet if not initialized
      this.globalSheet = new CSSStyleSheet();
      console.warn('[StyleManager] Global sheet accessed before initialization');
    }
    return this.globalSheet;
  }

  /**
   * Create or get a component-specific stylesheet
   * Useful for component-scoped styles
   */
  static getComponentSheet(componentName: string, cssContent?: string): CSSStyleSheet {
    let sheet = this.componentSheets.get(componentName);

    if (!sheet) {
      sheet = new CSSStyleSheet();
      if (cssContent) {
        try {
          sheet.replaceSync(cssContent);
        } catch (error) {
          console.error(`[StyleManager] Failed to load styles for ${componentName}:`, error);
        }
      }
      this.componentSheets.set(componentName, sheet);
    }

    return sheet;
  }

  /**
   * Get all stylesheets for a component (global + component-specific)
   */
  static getSheetsForComponent(componentName?: string): CSSStyleSheet[] {
    const sheets: CSSStyleSheet[] = [this.getGlobalSheet()];

    if (componentName && this.componentSheets.has(componentName)) {
      sheets.push(this.componentSheets.get(componentName)!);
    }

    return sheets;
  }

  /**
   * Update component-specific styles
   */
  static updateComponentStyles(componentName: string, cssContent: string): void {
    const sheet = this.getComponentSheet(componentName);
    try {
      sheet.replaceSync(cssContent);
    } catch (error) {
      console.error(`[StyleManager] Failed to update styles for ${componentName}:`, error);
    }
  }

  /**
   * Check if styles are initialized
   */
  static isReady(): boolean {
    return this.isInitialized && this.globalSheet !== null;
  }

  /**
   * Reset (mainly for testing)
   */
  static reset(): void {
    this.globalSheet = null;
    this.componentSheets.clear();
    this.isInitialized = false;
  }
}
