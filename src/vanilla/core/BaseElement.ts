import { StyleManager } from "../styles/StyleManager";

/**
 * BaseElement - Base class for all web components
 *
 * Features:
 * - Automatic adoptedStyleSheets injection
 * - Lifecycle management
 * - Attribute to property mapping
 * - Shadow DOM setup
 */
export abstract class BaseElement extends HTMLElement {
  protected shadow: ShadowRoot;
  protected componentName: string;
  private _isConnected = false;

  constructor(componentName: string, useShadowDOM = true) {
    super();
    this.componentName = componentName;

    if (useShadowDOM) {
      // Attach shadow root
      this.shadow = this.attachShadow({ mode: "open" });

      // Inject global styles via adoptedStyleSheets
      this.injectStyles();
    } else {
      // Use the element itself as shadow root for light DOM
      this.shadow = this as unknown as ShadowRoot;
    }
  }

  /**
   * Inject styles using adoptedStyleSheets
   * This is called automatically in constructor
   */
  protected injectStyles(): void {
    try {
      const sheets = StyleManager.getSheetsForComponent(this.componentName);
      this.shadow.adoptedStyleSheets = sheets;
    } catch (error) {
      console.error(`[${this.componentName}] Failed to inject styles:`, error);
    }
  }

  /**
   * Called when element is added to DOM
   */
  connectedCallback(): void {
    if (!this._isConnected) {
      this._isConnected = true;
      this.onConnect();
      this.render();
    }
  }

  /**
   * Called when element is removed from DOM
   */
  disconnectedCallback(): void {
    this._isConnected = false;
    this.onDisconnect();
  }

  /**
   * Called when an observed attribute changes
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue !== newValue && this._isConnected) {
      this.onAttributeChange(name, oldValue, newValue);
      this.render();
    }
  }

  /**
   * Hook called when element is connected (override in subclasses)
   */
  protected onConnect(): void {
    // Override in subclasses
  }

  /**
   * Hook called when element is disconnected (override in subclasses)
   */
  protected onDisconnect(): void {
    // Override in subclasses
  }

  /**
   * Hook called when attribute changes (override in subclasses)
   */
  protected onAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null,
  ): void {
    // Override in subclasses
  }

  /**
   * Abstract render method - must be implemented by subclasses
   */
  protected abstract render(): void;

  /**
   * Helper: Get attribute as string
   */
  protected getStringAttr(name: string, defaultValue = ""): string {
    return this.getAttribute(name) ?? defaultValue;
  }

  /**
   * Helper: Get attribute as boolean
   */
  protected getBooleanAttr(name: string): boolean {
    return this.hasAttribute(name);
  }

  /**
   * Helper: Get attribute as number
   */
  protected getNumberAttr(name: string, defaultValue = 0): number {
    const value = this.getAttribute(name);
    if (value === null) return defaultValue;
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  }

  /**
   * Helper: Get attribute as JSON
   */
  protected getJsonAttr<T>(name: string, defaultValue: T): T {
    const value = this.getAttribute(name);
    if (!value) return defaultValue;
    try {
      return JSON.parse(value) as T;
    } catch {
      console.warn(`[${this.componentName}] Failed to parse JSON attribute "${name}":`, value);
      return defaultValue;
    }
  }

  /**
   * Helper: Set attribute (handles different types)
   */
  protected setTypedAttribute(name: string, value: unknown): void {
    if (value === null || value === undefined) {
      this.removeAttribute(name);
    } else if (typeof value === "boolean") {
      if (value) {
        this.setAttribute(name, "");
      } else {
        this.removeAttribute(name);
      }
    } else if (typeof value === "object") {
      this.setAttribute(name, JSON.stringify(value));
    } else {
      this.setAttribute(name, String(value));
    }
  }

  /**
   * Helper: Create element with classes
   */
  protected createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    className?: string,
    attributes?: Record<string, string>,
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
    return element;
  }

  /**
   * Helper: Clear shadow root
   */
  protected clearShadow(): void {
    while (this.shadow.firstChild) {
      this.shadow.removeChild(this.shadow.firstChild);
    }
  }

  /**
   * Helper: Check if StyleManager is ready
   */
  protected isStylesReady(): boolean {
    return StyleManager.isReady();
  }
}
