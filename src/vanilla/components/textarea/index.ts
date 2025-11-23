import { BaseElement } from "../../core/BaseElement";
import type { ControlSize } from "../../core/types";

type TextareaVariant = "outline" | "soft";
type GutterSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl";

/**
 * AppsTextarea - Web component version of the Textarea component
 *
 * Usage:
 * <apps-textarea placeholder="Enter text" rows="3"></apps-textarea>
 *
 * Attributes:
 * - variant: outline | soft
 * - size: 3xs | 2xs | xs | sm | md | lg | xl | 2xl | 3xl
 * - gutter-size: 2xs | xs | sm | md | lg | xl
 * - disabled: boolean
 * - invalid: boolean
 * - readonly: boolean
 * - rows: number (default: 3)
 * - auto-resize: boolean
 * - max-rows: number
 * - placeholder, value, name, etc. (standard textarea attributes)
 */
export class AppsTextarea extends BaseElement {
  static readonly tagName = "apps-textarea";

  static get observedAttributes(): string[] {
    return [
      "variant",
      "size",
      "gutter-size",
      "disabled",
      "invalid",
      "readonly",
      "placeholder",
      "value",
      "name",
      "rows",
      "auto-resize",
      "max-rows",
    ];
  }

  private textareaElement: HTMLTextAreaElement | null = null;
  private wrapperElement: HTMLDivElement | null = null;

  constructor() {
    super("AppsTextarea");
  }

  // Properties
  get variant(): TextareaVariant {
    return this.getStringAttr("variant", "outline") as TextareaVariant;
  }

  set variant(value: TextareaVariant) {
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
    if (this.textareaElement) {
      this.textareaElement.disabled = value;
    }
  }

  get invalid(): boolean {
    return this.getBooleanAttr("invalid");
  }

  set invalid(value: boolean) {
    this.setTypedAttribute("invalid", value);
  }

  get readonly(): boolean {
    return this.getBooleanAttr("readonly");
  }

  set readonly(value: boolean) {
    this.setTypedAttribute("readonly", value);
    if (this.textareaElement) {
      this.textareaElement.readOnly = value;
    }
  }

  get value(): string {
    return this.textareaElement?.value || this.getStringAttr("value", "");
  }

  set value(val: string) {
    this.setAttribute("value", val);
    if (this.textareaElement) {
      this.textareaElement.value = val;
      this.autoResize();
    }
  }

  get placeholder(): string {
    return this.getStringAttr("placeholder", "");
  }

  set placeholder(value: string) {
    this.setAttribute("placeholder", value);
    if (this.textareaElement) {
      this.textareaElement.placeholder = value;
    }
  }

  get name(): string {
    return this.getStringAttr("name", "");
  }

  set name(value: string) {
    this.setAttribute("name", value);
    if (this.textareaElement) {
      this.textareaElement.name = value;
    }
  }

  get rows(): number {
    const value = this.getAttribute("rows");
    return value ? parseInt(value, 10) : 3;
  }

  set rows(value: number) {
    this.setAttribute("rows", value.toString());
    if (this.textareaElement) {
      this.textareaElement.rows = value;
    }
    this.updateCSSVariables();
  }

  get autoResizeEnabled(): boolean {
    return this.getBooleanAttr("auto-resize");
  }

  set autoResizeEnabled(value: boolean) {
    this.setTypedAttribute("auto-resize", value);
    if (value) {
      this.autoResize();
    }
  }

  get maxRows(): number {
    const value = this.getAttribute("max-rows");
    return value ? parseInt(value, 10) : Math.max(this.rows, 10);
  }

  set maxRows(value: number) {
    this.setAttribute("max-rows", value.toString());
    this.updateCSSVariables();
  }

  protected render(): void {
    // Build class names for wrapper
    const wrapperClasses = this.buildWrapperClasses();

    // Create wrapper container
    const wrapper = this.createElement("div", wrapperClasses);
    this.wrapperElement = wrapper;

    // Apply data attributes
    wrapper.setAttribute("data-variant", this.variant);
    wrapper.setAttribute("data-size", this.size);
    if (this.gutterSize) wrapper.setAttribute("data-gutter-size", this.gutterSize);
    if (this.disabled) wrapper.setAttribute("data-disabled", "");
    if (this.invalid) wrapper.setAttribute("data-invalid", "");
    if (this.readonly) wrapper.setAttribute("data-readonly", "");

    // Apply CSS variables for rows
    this.updateCSSVariables();

    // Create textarea element
    const textarea = document.createElement("textarea");
    textarea.className = this.buildTextareaClasses();
    textarea.placeholder = this.placeholder;
    textarea.value = this.value;
    textarea.disabled = this.disabled;
    textarea.readOnly = this.readonly;
    textarea.rows = this.rows;
    if (this.name) textarea.name = this.name;

    // Store reference
    this.textareaElement = textarea;

    // Setup auto-resize if enabled
    if (this.autoResizeEnabled) {
      setTimeout(() => this.autoResize(), 0);
    }

    // Forward textarea events
    textarea.addEventListener("input", (e) => {
      if (this.autoResizeEnabled) {
        this.autoResize();
      }
      this.dispatchEvent(
        new CustomEvent("apps-input", {
          bubbles: true,
          composed: true,
          detail: { value: (e.target as HTMLTextAreaElement).value, originalEvent: e },
        }),
      );
    });

    textarea.addEventListener("change", (e) => {
      this.dispatchEvent(
        new CustomEvent("apps-change", {
          bubbles: true,
          composed: true,
          detail: { value: (e.target as HTMLTextAreaElement).value, originalEvent: e },
        }),
      );
    });

    textarea.addEventListener("focus", (e) => {
      if (this.wrapperElement) {
        this.wrapperElement.setAttribute("data-focused", "true");
      }
      this.dispatchEvent(
        new CustomEvent("apps-focus", {
          bubbles: true,
          composed: true,
          detail: { originalEvent: e },
        }),
      );
    });

    textarea.addEventListener("blur", (e) => {
      if (this.wrapperElement) {
        this.wrapperElement.removeAttribute("data-focused");
      }
      this.dispatchEvent(
        new CustomEvent("apps-blur", {
          bubbles: true,
          composed: true,
          detail: { originalEvent: e },
        }),
      );
    });

    wrapper.appendChild(textarea);

    // Clear and append
    this.clearShadow();
    this.shadow.appendChild(wrapper);
  }

  private updateCSSVariables(): void {
    if (this.wrapperElement) {
      this.wrapperElement.style.setProperty("--textarea-min-rows", this.rows.toString());
      this.wrapperElement.style.setProperty("--textarea-max-rows", this.maxRows.toString());
    }
  }

  private autoResize(): void {
    if (!this.autoResizeEnabled || !this.textareaElement) return;

    // Reset height to calculate scrollHeight
    this.textareaElement.style.height = "0px";
    const scrollHeight = this.textareaElement.scrollHeight;
    this.textareaElement.style.height = scrollHeight + "px";
  }

  private buildWrapperClasses(): string {
    const classes = [
      "relative",
      "flex",
      "w-full",
      "rounded-lg",
      "transition-colors",
    ];

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

  private buildTextareaClasses(): string {
    const classes = [
      "w-full",
      "bg-transparent",
      "outline-none",
      "text-base",
      "text-gray-700",
      "resize-none",
    ];

    // Padding based on size/gutter
    const gutterSize = this.gutterSize || this.getDefaultGutterSize();
    const gutterClasses: Record<string, string> = {
      "2xs": "px-2 py-1",
      xs: "px-2.5 py-1",
      sm: "px-3 py-2",
      md: "px-4 py-2",
      lg: "px-5 py-2",
      xl: "px-6 py-3",
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

  // Public method to focus the textarea
  focus(): void {
    this.textareaElement?.focus();
  }

  // Public method to blur the textarea
  blur(): void {
    this.textareaElement?.blur();
  }
}

// Register the custom element
if (!customElements.get(AppsTextarea.tagName)) {
  customElements.define(AppsTextarea.tagName, AppsTextarea);
}
