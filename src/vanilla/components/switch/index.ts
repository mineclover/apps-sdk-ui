import { BaseElement } from "../../core/BaseElement";

/**
 * AppsSwitch - Web component version of the Switch component
 *
 * Usage:
 * <apps-switch label="Enable notifications"></apps-switch>
 * <apps-switch checked></apps-switch>
 *
 * Attributes:
 * - checked: boolean
 * - disabled: boolean
 * - label: string
 * - name: string
 * - value: string
 * - label-position: "start" | "end"
 */
export class AppsSwitch extends BaseElement {
  static readonly tagName = "apps-switch";

  static get observedAttributes(): string[] {
    return ["checked", "disabled", "label", "name", "value", "label-position"];
  }

  private inputElement: HTMLInputElement | null = null;
  private thumbElement: HTMLElement | null = null;
  private trackElement: HTMLElement | null = null;

  constructor() {
    super("AppsSwitch");
  }

  // Properties
  get checked(): boolean {
    return this.getBooleanAttr("checked");
  }

  set checked(value: boolean) {
    this.setTypedAttribute("checked", value);
    this.updateSwitchState();
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
    if (this.inputElement) {
      this.inputElement.name = value;
    }
  }

  get value(): string {
    return this.getStringAttr("value", "on");
  }

  set value(val: string) {
    this.setAttribute("value", val);
    if (this.inputElement) {
      this.inputElement.value = val;
    }
  }

  get labelPosition(): "start" | "end" {
    return this.getStringAttr("label-position", "end") as "start" | "end";
  }

  set labelPosition(value: "start" | "end") {
    this.setAttribute("label-position", value);
  }

  protected render(): void {
    // Create container
    const container = this.createElement("div", this.buildContainerClasses());
    container.setAttribute("data-label-position", this.labelPosition);
    if (this.disabled) container.setAttribute("data-disabled", "");
    if (this.label) container.setAttribute("data-has-label", "");

    // Create hidden native checkbox for form integration
    const checkbox = this.createElement("input", "sr-only") as HTMLInputElement;
    checkbox.type = "checkbox";
    checkbox.disabled = this.disabled;
    checkbox.checked = this.checked;
    if (this.name) checkbox.name = this.name;
    checkbox.value = this.value;

    this.inputElement = checkbox;

    // Create switch track (the background)
    const track = this.createElement("button", this.buildTrackClasses(), {
      type: "button",
      role: "switch",
      "aria-checked": String(this.checked),
    });

    if (this.disabled) {
      track.disabled = true;
      track.setAttribute("aria-disabled", "true");
    }

    this.trackElement = track;

    // Create switch thumb (the moving part)
    const thumb = this.createElement("span", this.buildThumbClasses());
    this.thumbElement = thumb;

    track.appendChild(thumb);

    // Handle click
    track.addEventListener("click", () => {
      if (this.disabled) return;

      const newValue = !this.checked;
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
      label.addEventListener("click", () => track.click());

      if (this.labelPosition === "start") {
        container.appendChild(label);
        container.appendChild(track);
      } else {
        container.appendChild(track);
        container.appendChild(label);
      }
    } else {
      container.appendChild(track);
    }

    container.appendChild(checkbox);

    // Update initial state
    this.updateSwitchState();

    // Clear and append
    this.clearShadow();
    this.shadow.appendChild(container);
  }

  private buildContainerClasses(): string {
    return ["inline-flex", "items-center", "gap-2"].join(" ");
  }

  private buildTrackClasses(): string {
    const classes = [
      "relative",
      "inline-flex",
      "items-center",
      "w-[44px]",
      "h-[24px]",
      "rounded-full",
      "transition-colors",
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-blue-600",
      "focus-visible:ring-offset-2",
    ];

    if (!this.disabled) {
      classes.push("cursor-pointer");
    } else {
      classes.push("opacity-50", "cursor-not-allowed");
    }

    // Background color will be updated in updateSwitchState
    classes.push("bg-gray-300");

    return classes.join(" ");
  }

  private buildThumbClasses(): string {
    const classes = [
      "block",
      "w-[20px]",
      "h-[20px]",
      "rounded-full",
      "bg-white",
      "shadow",
      "transition-transform",
      "translate-x-[2px]",
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

  private updateSwitchState(): void {
    if (!this.inputElement || !this.thumbElement || !this.trackElement) return;

    // Update checkbox
    this.inputElement.checked = this.checked;

    // Update track aria
    this.trackElement.setAttribute("aria-checked", String(this.checked));

    // Update track background
    if (this.checked) {
      this.trackElement.classList.remove("bg-gray-300");
      this.trackElement.classList.add("bg-blue-600");
    } else {
      this.trackElement.classList.add("bg-gray-300");
      this.trackElement.classList.remove("bg-blue-600");
    }

    // Update thumb position
    if (this.checked) {
      this.thumbElement.classList.remove("translate-x-[2px]");
      this.thumbElement.classList.add("translate-x-[22px]");
    } else {
      this.thumbElement.classList.add("translate-x-[2px]");
      this.thumbElement.classList.remove("translate-x-[22px]");
    }
  }
}

// Register the custom element
if (!customElements.get(AppsSwitch.tagName)) {
  customElements.define(AppsSwitch.tagName, AppsSwitch);
}
