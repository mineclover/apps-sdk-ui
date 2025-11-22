import { BaseElement } from "../../core/BaseElement";
import type { ControlSize, Variant } from "../../core/types";

type InputVariant = "outline" | "soft";
type GutterSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl";

/**
 * AppsInput - Web component version of the Input component
 *
 * Usage:
 * <apps-input type="text" placeholder="Enter text" value=""></apps-input>
 *
 * Attributes:
 * - variant: outline | soft
 * - size: 3xs | 2xs | xs | sm | md | lg | xl | 2xl | 3xl
 * - gutter-size: 2xs | xs | sm | md | lg | xl
 * - disabled: boolean
 * - invalid: boolean
 * - pill: boolean
 * - readonly: boolean
 * - placeholder, value, type, name, etc. (standard input attributes)
 */
export class AppsInput extends BaseElement {
  static readonly tagName = "apps-input";

  static get observedAttributes(): string[] {
    return [
      "variant",
      "size",
      "gutter-size",
      "disabled",
      "invalid",
      "pill",
      "readonly",
      "placeholder",
      "value",
      "type",
      "name",
    ];
  }

  private inputElement: HTMLInputElement | null = null;

  constructor() {
    super("AppsInput");
  }

  // Properties
  get variant(): InputVariant {
    return this.getStringAttr("variant", "outline") as InputVariant;
  }

  set variant(value: InputVariant) {
    this.setAttribute("variant", value);
  }

  get size(): ControlSize {
    return this.getStringAttr("size", "md") as ControlSize;
  }

  set size(value: ControlSize) {
    this.setAttribute("size", value);
  }

  get gutterSize(): GutterSize | undefined {
    const value = this.getAttribute("gutter-size");
    return value as GutterSize | undefined;
  }

  set gutterSize(value: GutterSize | undefined) {
    if (value) {
      this.setAttribute("gutter-size", value);
    } else {
      this.removeAttribute("gutter-size");
    }
  }

  get disabled(): boolean {
    return this.getBooleanAttr("disabled");
  }

  set disabled(value: boolean) {
    this.setTypedAttribute("disabled", value);
    if (this.inputElement) {
      this.inputElement.disabled = value;
    }
  }

  get invalid(): boolean {
    return this.getBooleanAttr("invalid");
  }

  set invalid(value: boolean) {
    this.setTypedAttribute("invalid", value);
  }

  get pill(): boolean {
    return this.getBooleanAttr("pill");
  }

  set pill(value: boolean) {
    this.setTypedAttribute("pill", value);
  }

  get readonly(): boolean {
    return this.getBooleanAttr("readonly");
  }

  set readonly(value: boolean) {
    this.setTypedAttribute("readonly", value);
    if (this.inputElement) {
      this.inputElement.readOnly = value;
    }
  }

  get value(): string {
    return this.inputElement?.value || this.getStringAttr("value", "");
  }

  set value(val: string) {
    this.setAttribute("value", val);
    if (this.inputElement) {
      this.inputElement.value = val;
    }
  }

  get placeholder(): string {
    return this.getStringAttr("placeholder", "");
  }

  set placeholder(value: string) {
    this.setAttribute("placeholder", value);
    if (this.inputElement) {
      this.inputElement.placeholder = value;
    }
  }

  get type(): string {
    return this.getStringAttr("type", "text");
  }

  set type(value: string) {
    this.setAttribute("type", value);
    if (this.inputElement) {
      this.inputElement.type = value;
    }
  }

  get name(): string {
    return this.getStringAttr("name", "");
  }

  set name(value: string) {
    this.setAttribute("name", value);
    if (this.inputElement) {
      this.inputElement.name = value;
    }
  }

  protected render(): void {
    // Build class names for wrapper
    const wrapperClasses = this.buildWrapperClasses();

    // Create wrapper container
    const wrapper = this.createElement("div", wrapperClasses);

    // Apply data attributes
    wrapper.setAttribute("data-variant", this.variant);
    wrapper.setAttribute("data-size", this.size);
    if (this.gutterSize) wrapper.setAttribute("data-gutter-size", this.gutterSize);
    if (this.disabled) wrapper.setAttribute("data-disabled", "");
    if (this.invalid) wrapper.setAttribute("data-invalid", "");
    if (this.pill) wrapper.setAttribute("data-pill", "");
    if (this.readonly) wrapper.setAttribute("data-readonly", "");

    // Create input element
    const input = this.createElement("input", this.buildInputClasses());
    input.type = this.type;
    input.placeholder = this.placeholder;
    input.value = this.value;
    input.disabled = this.disabled;
    input.readOnly = this.readonly;
    if (this.name) input.name = this.name;

    // Store reference
    this.inputElement = input;

    // Forward input events
    input.addEventListener("input", (e) => {
      this.dispatchEvent(
        new CustomEvent("apps-input", {
          bubbles: true,
          composed: true,
          detail: { value: (e.target as HTMLInputElement).value, originalEvent: e },
        }),
      );
    });

    input.addEventListener("change", (e) => {
      this.dispatchEvent(
        new CustomEvent("apps-change", {
          bubbles: true,
          composed: true,
          detail: { value: (e.target as HTMLInputElement).value, originalEvent: e },
        }),
      );
    });

    input.addEventListener("focus", (e) => {
      this.dispatchEvent(
        new CustomEvent("apps-focus", {
          bubbles: true,
          composed: true,
          detail: { originalEvent: e },
        }),
      );
    });

    input.addEventListener("blur", (e) => {
      this.dispatchEvent(
        new CustomEvent("apps-blur", {
          bubbles: true,
          composed: true,
          detail: { originalEvent: e },
        }),
      );
    });

    wrapper.appendChild(input);

    // Clear and append
    this.clearShadow();
    this.shadow.appendChild(wrapper);
  }

  private buildWrapperClasses(): string {
    const classes = [
      "relative",
      "inline-flex",
      "items-center",
      "w-full",
      "transition-colors",
    ];

    // Size-based height
    const sizeClasses: Record<string, string[]> = {
      "3xs": ["h-[22px]"],
      "2xs": ["h-[24px]"],
      xs: ["h-[26px]"],
      sm: ["h-[28px]"],
      md: ["h-[32px]"],
      lg: ["h-[36px]"],
      xl: ["h-[40px]"],
      "2xl": ["h-[44px]"],
      "3xl": ["h-[48px]"],
    };
    classes.push(...(sizeClasses[this.size] || sizeClasses.md));

    // Rounded corners
    if (this.pill) {
      classes.push("rounded-full");
    } else {
      classes.push("rounded-lg");
    }

    // Variant styles
    if (this.variant === "outline") {
      classes.push("border", "border-gray-300", "bg-white");
      if (!this.disabled && !this.readonly) {
        classes.push("hover:border-gray-600");
      }
    } else if (this.variant === "soft") {
      classes.push("bg-gray-100");
      if (!this.disabled && !this.readonly) {
        classes.push("hover:bg-gray-200");
      }
    }

    // Invalid state
    if (this.invalid) {
      classes.push("border-red-600", "bg-red-50");
    }

    // Disabled state
    if (this.disabled) {
      classes.push("opacity-50", "cursor-not-allowed");
    }

    return classes.join(" ");
  }

  private buildInputClasses(): string {
    const classes = [
      "w-full",
      "h-full",
      "bg-transparent",
      "outline-none",
      "text-base",
      "text-gray-700",
    ];

    // Padding based on size/gutter
    const gutterSize = this.gutterSize || this.getDefaultGutterSize();
    const gutterClasses: Record<string, string> = {
      "2xs": "px-2",
      xs: "px-2.5",
      sm: "px-3",
      md: "px-4",
      lg: "px-5",
      xl: "px-6",
    };
    classes.push(gutterClasses[gutterSize] || gutterClasses.md);

    if (this.disabled) {
      classes.push("cursor-not-allowed");
    }

    return classes.join(" ");
  }

  private getDefaultGutterSize(): GutterSize {
    const sizeToGutter: Record<string, GutterSize> = {
      "3xs": "2xs",
      "2xs": "2xs",
      xs: "xs",
      sm: "sm",
      md: "md",
      lg: "lg",
      xl: "xl",
      "2xl": "xl",
      "3xl": "xl",
    };
    return sizeToGutter[this.size] || "md";
  }

  // Public method to focus the input
  focus(): void {
    this.inputElement?.focus();
  }

  // Public method to blur the input
  blur(): void {
    this.inputElement?.blur();
  }
}

// Register the custom element
if (!customElements.get(AppsInput.tagName)) {
  customElements.define(AppsInput.tagName, AppsInput);
}
