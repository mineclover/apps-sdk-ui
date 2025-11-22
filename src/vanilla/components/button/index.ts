import { BaseElement } from "../../core/BaseElement";
import type { SemanticColor, Variant, ControlSize } from "../../core/types";

/**
 * AppsButton - Web component version of the Button component
 *
 * Usage:
 * <apps-button color="primary" variant="solid" size="md">Click me</apps-button>
 *
 * Attributes:
 * - color: primary | secondary | danger | success | info | discovery | caution | warning
 * - variant: solid | soft | outline | ghost
 * - size: 3xs | 2xs | xs | sm | md | lg | xl | 2xl | 3xl
 * - disabled: boolean
 * - loading: boolean
 * - pill: boolean
 * - block: boolean
 */
export class AppsButton extends BaseElement {
  static readonly tagName = "apps-button";

  static get observedAttributes(): string[] {
    return ["color", "variant", "size", "disabled", "loading", "pill", "block", "uniform"];
  }

  constructor() {
    super("AppsButton");
  }

  // Properties
  get color(): SemanticColor {
    return this.getStringAttr("color", "primary") as SemanticColor;
  }

  set color(value: SemanticColor) {
    this.setAttribute("color", value);
  }

  get variant(): Variant {
    return this.getStringAttr("variant", "solid") as Variant;
  }

  set variant(value: Variant) {
    this.setAttribute("variant", value);
  }

  get size(): ControlSize {
    return this.getStringAttr("size", "md") as ControlSize;
  }

  set size(value: ControlSize) {
    this.setAttribute("size", value);
  }

  get disabled(): boolean {
    return this.getBooleanAttr("disabled");
  }

  set disabled(value: boolean) {
    this.setTypedAttribute("disabled", value);
  }

  get loading(): boolean {
    return this.getBooleanAttr("loading");
  }

  set loading(value: boolean) {
    this.setTypedAttribute("loading", value);
  }

  get pill(): boolean {
    return this.getBooleanAttr("pill");
  }

  set pill(value: boolean) {
    this.setTypedAttribute("pill", value);
  }

  get block(): boolean {
    return this.getBooleanAttr("block");
  }

  set block(value: boolean) {
    this.setTypedAttribute("block", value);
  }

  get uniform(): boolean {
    return this.getBooleanAttr("uniform");
  }

  set uniform(value: boolean) {
    this.setTypedAttribute("uniform", value);
  }

  protected render(): void {
    // Build class names using Tailwind classes
    const classes = this.buildClassNames();

    // Create button element
    const button = this.createElement("button", classes, {
      type: "button",
    });

    // Apply data attributes for styling (similar to React version)
    button.setAttribute("data-color", this.color);
    button.setAttribute("data-variant", this.variant);
    button.setAttribute("data-size", this.size);

    if (this.pill) button.setAttribute("data-pill", "");
    if (this.block) button.setAttribute("data-block", "");
    if (this.uniform) button.setAttribute("data-uniform", "");
    if (this.loading) button.setAttribute("data-loading", "");

    // Handle disabled state
    if (this.disabled || this.loading) {
      button.disabled = true;
      button.setAttribute("aria-disabled", "true");
      button.tabIndex = -1;
    }

    if (this.disabled) {
      button.setAttribute("data-disabled", "");
    }

    // Add loading indicator if loading
    if (this.loading) {
      const loader = this.createLoadingIndicator();
      button.appendChild(loader);
    }

    // Add content wrapper with slot for children
    const inner = this.createElement("span", "inline-flex items-center gap-2");
    const slot = document.createElement("slot");
    inner.appendChild(slot);
    button.appendChild(inner);

    // Add click handler
    button.addEventListener("click", (e) => {
      if (this.disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      // Dispatch custom event
      this.dispatchEvent(
        new CustomEvent("apps-click", {
          bubbles: true,
          composed: true,
          detail: { originalEvent: e },
        }),
      );
    });

    // Clear and append
    this.clearShadow();
    this.shadow.appendChild(button);
  }

  private buildClassNames(): string {
    const classes = [
      // Base button classes
      "inline-flex",
      "items-center",
      "justify-center",
      "gap-2",
      "font-medium",
      "transition-colors",
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-offset-2",
      "disabled:pointer-events-none",
      "disabled:opacity-50",
    ];

    // Add size-based classes
    const sizeClasses: Record<string, string[]> = {
      "3xs": ["h-[22px]", "px-2", "text-xs"],
      "2xs": ["h-[24px]", "px-2", "text-xs"],
      xs: ["h-[26px]", "px-2.5", "text-sm"],
      sm: ["h-[28px]", "px-3", "text-sm"],
      md: ["h-[32px]", "px-4", "text-base"],
      lg: ["h-[36px]", "px-5", "text-base"],
      xl: ["h-[40px]", "px-6", "text-lg"],
      "2xl": ["h-[44px]", "px-7", "text-lg"],
      "3xl": ["h-[48px]", "px-8", "text-xl"],
    };
    classes.push(...(sizeClasses[this.size] || sizeClasses.md));

    // Add pill classes
    if (this.pill) {
      classes.push("rounded-full");
    } else {
      classes.push("rounded-lg");
    }

    // Add block classes
    if (this.block) {
      classes.push("w-full");
    }

    // Add uniform classes
    if (this.uniform) {
      classes.push("aspect-square", "p-0");
    }

    // Add color/variant classes (simplified - you'll want to expand this)
    classes.push(...this.getColorVariantClasses());

    return classes.join(" ");
  }

  private getColorVariantClasses(): string[] {
    const { color, variant } = this;

    // Color mappings (simplified - expand based on your design system)
    const colorMap: Record<SemanticColor, { solid: string[]; soft: string[]; outline: string[]; ghost: string[] }> = {
      primary: {
        solid: ["bg-blue-600", "text-white", "hover:bg-blue-700"],
        soft: ["bg-blue-100", "text-blue-700", "hover:bg-blue-200"],
        outline: ["border", "border-blue-600", "text-blue-600", "hover:bg-blue-50"],
        ghost: ["text-blue-600", "hover:bg-blue-50"],
      },
      secondary: {
        solid: ["bg-gray-600", "text-white", "hover:bg-gray-700"],
        soft: ["bg-gray-100", "text-gray-700", "hover:bg-gray-200"],
        outline: ["border", "border-gray-600", "text-gray-600", "hover:bg-gray-50"],
        ghost: ["text-gray-600", "hover:bg-gray-50"],
      },
      danger: {
        solid: ["bg-red-600", "text-white", "hover:bg-red-700"],
        soft: ["bg-red-100", "text-red-700", "hover:bg-red-200"],
        outline: ["border", "border-red-600", "text-red-600", "hover:bg-red-50"],
        ghost: ["text-red-600", "hover:bg-red-50"],
      },
      success: {
        solid: ["bg-green-600", "text-white", "hover:bg-green-700"],
        soft: ["bg-green-100", "text-green-700", "hover:bg-green-200"],
        outline: ["border", "border-green-600", "text-green-600", "hover:bg-green-50"],
        ghost: ["text-green-600", "hover:bg-green-50"],
      },
      info: {
        solid: ["bg-cyan-600", "text-white", "hover:bg-cyan-700"],
        soft: ["bg-cyan-100", "text-cyan-700", "hover:bg-cyan-200"],
        outline: ["border", "border-cyan-600", "text-cyan-600", "hover:bg-cyan-50"],
        ghost: ["text-cyan-600", "hover:bg-cyan-50"],
      },
      discovery: {
        solid: ["bg-purple-600", "text-white", "hover:bg-purple-700"],
        soft: ["bg-purple-100", "text-purple-700", "hover:bg-purple-200"],
        outline: ["border", "border-purple-600", "text-purple-600", "hover:bg-purple-50"],
        ghost: ["text-purple-600", "hover:bg-purple-50"],
      },
      caution: {
        solid: ["bg-yellow-600", "text-white", "hover:bg-yellow-700"],
        soft: ["bg-yellow-100", "text-yellow-700", "hover:bg-yellow-200"],
        outline: ["border", "border-yellow-600", "text-yellow-600", "hover:bg-yellow-50"],
        ghost: ["text-yellow-600", "hover:bg-yellow-50"],
      },
      warning: {
        solid: ["bg-orange-600", "text-white", "hover:bg-orange-700"],
        soft: ["bg-orange-100", "text-orange-700", "hover:bg-orange-200"],
        outline: ["border", "border-orange-600", "text-orange-600", "hover:bg-orange-50"],
        ghost: ["text-orange-600", "hover:bg-orange-50"],
      },
    };

    return colorMap[color]?.[variant] || colorMap.primary.solid;
  }

  private createLoadingIndicator(): HTMLElement {
    const loader = this.createElement("span", "absolute inset-0 flex items-center justify-center");
    const spinner = this.createElement("span", "animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent");
    loader.appendChild(spinner);
    return loader;
  }
}

// Register the custom element
if (!customElements.get(AppsButton.tagName)) {
  customElements.define(AppsButton.tagName, AppsButton);
}
