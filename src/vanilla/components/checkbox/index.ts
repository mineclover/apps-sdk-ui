import { BaseElement } from "../../core/BaseElement";

type CheckedState = boolean | "indeterminate";

/**
 * AppsCheckbox - Web component version of the Checkbox component
 *
 * Usage:
 * <apps-checkbox label="Accept terms"></apps-checkbox>
 * <apps-checkbox checked></apps-checkbox>
 *
 * Attributes:
 * - checked: boolean | "indeterminate"
 * - disabled: boolean
 * - label: string
 * - name: string
 * - value: string
 * - orientation: "left" | "right"
 */
export class AppsCheckbox extends BaseElement {
  static readonly tagName = "apps-checkbox";

  static get observedAttributes(): string[] {
    return ["checked", "disabled", "label", "name", "value", "orientation"];
  }

  private checkboxElement: HTMLInputElement | null = null;
  private checkmarkElement: HTMLElement | null = null;

  constructor() {
    super("AppsCheckbox");
  }

  // Properties
  get checked(): CheckedState {
    const attr = this.getAttribute("checked");
    if (attr === "indeterminate") return "indeterminate";
    return this.getBooleanAttr("checked");
  }

  set checked(value: CheckedState) {
    if (value === "indeterminate") {
      this.setAttribute("checked", "indeterminate");
    } else {
      this.setTypedAttribute("checked", value);
    }
    this.updateCheckboxState();
  }

  get disabled(): boolean {
    return this.getBooleanAttr("disabled");
  }

  set disabled(value: boolean) {
    this.setTypedAttribute("disabled", value);
    if (this.checkboxElement) {
      this.checkboxElement.disabled = value;
    }
  }

  get label(): string {
    return this.getStringAttr("label", "");
  }

  set label(value: string) {
    this.setAttribute("label", value);
  }

  get name(): string {
    return this.getStringAttr("name", "");
  }

  set name(value: string) {
    this.setAttribute("name", value);
    if (this.checkboxElement) {
      this.checkboxElement.name = value;
    }
  }

  get value(): string {
    return this.getStringAttr("value", "on");
  }

  set value(val: string) {
    this.setAttribute("value", val);
    if (this.checkboxElement) {
      this.checkboxElement.value = val;
    }
  }

  get orientation(): "left" | "right" {
    return this.getStringAttr("orientation", "left") as "left" | "right";
  }

  set orientation(value: "left" | "right") {
    this.setAttribute("orientation", value);
  }

  protected render(): void {
    // Create container
    const container = this.createElement("div", this.buildContainerClasses());
    container.setAttribute("data-orientation", this.orientation);
    if (this.disabled) container.setAttribute("data-disabled", "");
    if (this.label) container.setAttribute("data-has-label", "");

    // Create hidden native checkbox for form integration
    const checkbox = this.createElement("input", "sr-only") as HTMLInputElement;
    checkbox.type = "checkbox";
    checkbox.disabled = this.disabled;
    if (this.name) checkbox.name = this.name;
    checkbox.value = this.value;

    this.checkboxElement = checkbox;

    // Create custom checkbox button
    const button = this.createElement("button", this.buildCheckboxClasses(), {
      type: "button",
      role: "checkbox",
      "aria-checked": String(this.checked),
    });

    if (this.disabled) {
      button.disabled = true;
      button.setAttribute("aria-disabled", "true");
    }

    // Create checkmark indicator
    const checkmark = this.createElement("span", this.buildCheckmarkClasses());
    this.checkmarkElement = checkmark;

    // Add SVG checkmark
    checkmark.innerHTML = this.getCheckmarkSVG();

    button.appendChild(checkmark);

    // Handle click
    button.addEventListener("click", () => {
      if (this.disabled) return;

      const newValue = !this.getActualChecked();
      this.checked = newValue;
      checkbox.checked = newValue;

      // Dispatch change event
      this.dispatchEvent(
        new CustomEvent("apps-change", {
          bubbles: true,
          composed: true,
          detail: { checked: newValue },
        }),
      );

      // Trigger native change event on hidden checkbox for form integration
      checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    });

    // Create label if provided
    if (this.label) {
      const label = this.createElement("label", this.buildLabelClasses());
      label.textContent = this.label;
      label.addEventListener("click", () => button.click());

      if (this.orientation === "right") {
        container.appendChild(label);
        container.appendChild(button);
      } else {
        container.appendChild(button);
        container.appendChild(label);
      }
    } else {
      container.appendChild(button);
    }

    container.appendChild(checkbox);

    // Update initial state
    this.updateCheckboxState();

    // Clear and append
    this.clearShadow();
    this.shadow.appendChild(container);
  }

  private buildContainerClasses(): string {
    return ["inline-flex", "items-center", "gap-2"].join(" ");
  }

  private buildCheckboxClasses(): string {
    const classes = [
      "inline-flex",
      "items-center",
      "justify-center",
      "w-[18px]",
      "h-[18px]",
      "rounded",
      "border",
      "border-gray-300",
      "bg-white",
      "transition-colors",
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-blue-600",
      "focus-visible:ring-offset-2",
    ];

    if (!this.disabled) {
      classes.push("hover:border-gray-600", "cursor-pointer");
    } else {
      classes.push("opacity-50", "cursor-not-allowed");
    }

    return classes.join(" ");
  }

  private buildCheckmarkClasses(): string {
    const classes = [
      "inline-flex",
      "items-center",
      "justify-center",
      "w-full",
      "h-full",
      "text-white",
      "opacity-0",
      "scale-0",
      "transition-all",
    ];

    return classes.join(" ");
  }

  private buildLabelClasses(): string {
    const classes = ["text-sm", "text-gray-700", "select-none"];

    if (!this.disabled) {
      classes.push("cursor-pointer");
    } else {
      classes.push("opacity-50", "cursor-not-allowed");
    }

    return classes.join(" ");
  }

  private getCheckmarkSVG(): string {
    // Check icon
    const checkIcon = `
      <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    // Indeterminate icon (horizontal line)
    const indeterminateIcon = `
      <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 6H10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;

    return this.checked === "indeterminate" ? indeterminateIcon : checkIcon;
  }

  private getActualChecked(): boolean {
    return this.checked === true;
  }

  private updateCheckboxState(): void {
    if (!this.checkboxElement || !this.checkmarkElement) return;

    const button = this.checkboxElement.previousElementSibling as HTMLButtonElement;
    if (!button) return;

    const isChecked = this.checked === true;
    const isIndeterminate = this.checked === "indeterminate";
    const isCheckedOrIndeterminate = isChecked || isIndeterminate;

    // Update checkbox
    this.checkboxElement.checked = isChecked;
    this.checkboxElement.indeterminate = isIndeterminate;

    // Update button aria
    button.setAttribute("aria-checked", this.checked === "indeterminate" ? "mixed" : String(isChecked));

    // Update button styles
    if (isCheckedOrIndeterminate) {
      button.classList.add("bg-blue-600", "border-blue-600");
      button.classList.remove("bg-white", "border-gray-300");
    } else {
      button.classList.remove("bg-blue-600", "border-blue-600");
      button.classList.add("bg-white", "border-gray-300");
    }

    // Update checkmark visibility
    if (isCheckedOrIndeterminate) {
      this.checkmarkElement.classList.remove("opacity-0", "scale-0");
      this.checkmarkElement.classList.add("opacity-100", "scale-100");
    } else {
      this.checkmarkElement.classList.add("opacity-0", "scale-0");
      this.checkmarkElement.classList.remove("opacity-100", "scale-100");
    }

    // Update checkmark icon
    this.checkmarkElement.innerHTML = this.getCheckmarkSVG();
  }
}

// Register the custom element
if (!customElements.get(AppsCheckbox.tagName)) {
  customElements.define(AppsCheckbox.tagName, AppsCheckbox);
}
