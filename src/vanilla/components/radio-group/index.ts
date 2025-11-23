import { BaseElement } from "../../core/BaseElement";

/**
 * AppsRadio - Web component version of radio button
 *
 * Usage:
 * <apps-radio name="group1" value="option1" label="Option 1"></apps-radio>
 * <apps-radio name="group1" value="option2" label="Option 2"></apps-radio>
 *
 * Attributes:
 * - name: radio group name (required for grouping)
 * - value: value of this radio option
 * - label: label text
 * - checked: boolean - if this radio is checked
 * - disabled: boolean
 * - orientation: left | right (label position)
 */
export class AppsRadio extends BaseElement {
  static readonly tagName = "apps-radio";

  static get observedAttributes(): string[] {
    return ["name", "value", "label", "checked", "disabled", "orientation"];
  }

  private radioElement: HTMLInputElement | null = null;
  private labelElement: HTMLLabelElement | null = null;

  constructor() {
    super("AppsRadio");
  }

  // Properties
  get name(): string {
    return this.getStringAttr("name", "");
  }

  set name(value: string) {
    this.setAttribute("name", value);
    if (this.radioElement) {
      this.radioElement.name = value;
    }
  }

  get value(): string {
    return this.getStringAttr("value", "");
  }

  set value(val: string) {
    this.setAttribute("value", val);
    if (this.radioElement) {
      this.radioElement.value = val;
    }
  }

  get label(): string {
    return this.getStringAttr("label", "");
  }

  set label(value: string) {
    this.setAttribute("label", value);
  }

  get checked(): boolean {
    return this.radioElement?.checked || this.getBooleanAttr("checked");
  }

  set checked(value: boolean) {
    this.setTypedAttribute("checked", value);
    if (this.radioElement) {
      this.radioElement.checked = value;
    }
  }

  get disabled(): boolean {
    return this.getBooleanAttr("disabled");
  }

  set disabled(value: boolean) {
    this.setTypedAttribute("disabled", value);
    if (this.radioElement) {
      this.radioElement.disabled = value;
    }
  }

  get orientation(): "left" | "right" {
    return this.getStringAttr("orientation", "left") as "left" | "right";
  }

  set orientation(value: "left" | "right") {
    this.setAttribute("orientation", value);
  }

  protected render(): void {
    const label = this.createElement("label", this.buildLabelClasses());
    this.labelElement = label;

    // Radio input
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = this.name;
    radio.value = this.value;
    radio.checked = this.checked;
    radio.disabled = this.disabled;
    radio.className = this.buildRadioClasses();
    this.radioElement = radio;

    // Radio change event
    radio.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      this.checked = target.checked;

      // Uncheck other radios with the same name
      if (this.checked) {
        this.uncheckOthersInGroup();
      }

      this.dispatchEvent(
        new CustomEvent("apps-change", {
          bubbles: true,
          composed: true,
          detail: { checked: this.checked, value: this.value },
        }),
      );
    });

    // Radio visual indicator
    const indicator = this.createElement("div", this.buildIndicatorClasses());
    const innerDot = this.createElement("div", this.buildInnerDotClasses());
    indicator.appendChild(innerDot);

    // Label text
    const labelText = this.createTextElement("span", this.buildLabelTextClasses(), this.label);

    // Assemble based on orientation
    if (this.orientation === "left") {
      label.appendChild(radio);
      label.appendChild(indicator);
      if (this.label) label.appendChild(labelText);
    } else {
      if (this.label) label.appendChild(labelText);
      label.appendChild(radio);
      label.appendChild(indicator);
    }

    // Clear and append
    this.clearShadow();
    this.shadow.appendChild(label);
  }

  private uncheckOthersInGroup(): void {
    // Find all radio elements with the same name in the document
    if (!this.name) return;

    // Query all apps-radio elements in the same document/shadow root context
    const allRadios = document.querySelectorAll(`apps-radio[name="${this.name}"]`);
    allRadios.forEach((radio) => {
      if (radio !== this && radio instanceof AppsRadio) {
        radio.checked = false;
      }
    });
  }

  private buildLabelClasses(): string {
    const classes = ["inline-flex", "items-center", "gap-2", "cursor-pointer", "select-none"];

    if (this.disabled) {
      classes.push("opacity-50", "cursor-not-allowed");
    }

    if (this.orientation === "right") {
      classes.push("flex-row-reverse");
    }

    return classes.join(" ");
  }

  private buildRadioClasses(): string {
    // Hidden radio input
    return "absolute opacity-0 w-0 h-0 pointer-events-none";
  }

  private buildIndicatorClasses(): string {
    const classes = [
      "relative",
      "inline-flex",
      "items-center",
      "justify-center",
      "w-[20px]",
      "h-[20px]",
      "border-2",
      "rounded-full",
      "transition-colors",
    ];

    if (this.disabled) {
      classes.push("border-gray-300", "bg-gray-100");
    } else if (this.checked) {
      classes.push("border-blue-600", "bg-blue-600");
    } else {
      classes.push("border-gray-300", "bg-white", "hover:border-blue-600");
    }

    return classes.join(" ");
  }

  private buildInnerDotClasses(): string {
    const classes = ["w-2", "h-2", "rounded-full", "bg-white", "transition-transform"];

    if (this.checked) {
      classes.push("scale-100");
    } else {
      classes.push("scale-0");
    }

    return classes.join(" ");
  }

  private buildLabelTextClasses(): string {
    const classes = ["text-sm", "text-gray-700", "select-none"];

    if (this.disabled) {
      classes.push("cursor-not-allowed");
    }

    return classes.join(" ");
  }

  // Public method to focus the radio
  focus(): void {
    this.radioElement?.focus();
  }

  // Public method to blur the radio
  blur(): void {
    this.radioElement?.blur();
  }
}

// Register the custom element
if (!customElements.get(AppsRadio.tagName)) {
  customElements.define(AppsRadio.tagName, AppsRadio);
}
