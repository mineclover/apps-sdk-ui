import { BaseElement } from "../../core/BaseElement";
import type { SemanticColor, Variant } from "../../core/types";

type BadgeSize = "sm" | "md" | "lg";
type BadgeColor = "secondary" | "success" | "danger" | "warning" | "info" | "discovery";

/**
 * AppsBadge - Web component version of the Badge component
 *
 * Usage:
 * <apps-badge color="success" variant="soft">New</apps-badge>
 *
 * Attributes:
 * - color: secondary | success | danger | warning | info | discovery
 * - variant: solid | soft | outline
 * - size: sm | md | lg
 * - pill: boolean
 */
export class AppsBadge extends BaseElement {
  static readonly tagName = "apps-badge";

  static get observedAttributes(): string[] {
    return ["color", "variant", "size", "pill"];
  }

  constructor() {
    super("AppsBadge");
  }

  // Properties
  get color(): BadgeColor {
    return this.getStringAttr("color", "secondary") as BadgeColor;
  }

  set color(value: BadgeColor) {
    this.setAttribute("color", value);
  }

  get variant(): Variant {
    return this.getStringAttr("variant", "soft") as Variant;
  }

  set variant(value: Variant) {
    this.setAttribute("variant", value);
  }

  get size(): BadgeSize {
    return this.getStringAttr("size", "sm") as BadgeSize;
  }

  set size(value: BadgeSize) {
    this.setAttribute("size", value);
  }

  get pill(): boolean {
    return this.getBooleanAttr("pill");
  }

  set pill(value: boolean) {
    this.setTypedAttribute("pill", value);
  }

  protected render(): void {
    // Build class names using Tailwind classes
    const classes = this.buildClassNames();

    // Create badge container
    const badge = this.createElement("div", classes);

    // Apply data attributes for potential CSS targeting
    badge.setAttribute("data-color", this.color);
    badge.setAttribute("data-variant", this.variant);
    badge.setAttribute("data-size", this.size);
    if (this.pill) badge.setAttribute("data-pill", "");

    // Add content wrapper with slot for children
    const slot = document.createElement("slot");
    badge.appendChild(slot);

    // Clear and append
    this.clearShadow();
    this.shadow.appendChild(badge);
  }

  private buildClassNames(): string {
    const classes = [
      // Base badge classes
      "inline-flex",
      "items-center",
      "justify-center",
      "font-medium",
      "text-center",
      "select-none",
    ];

    // Add size-based classes
    const sizeClasses: Record<BadgeSize, string[]> = {
      sm: ["h-[18px]", "px-2", "text-xs"],
      md: ["h-[22px]", "px-2.5", "text-xs"],
      lg: ["h-[24px]", "px-3", "text-sm"],
    };
    classes.push(...(sizeClasses[this.size] || sizeClasses.sm));

    // Add pill/rounded classes
    if (this.pill) {
      classes.push("rounded-full");
    } else {
      classes.push("rounded-md");
    }

    // Add color/variant classes
    classes.push(...this.getColorVariantClasses());

    return classes.join(" ");
  }

  private getColorVariantClasses(): string[] {
    const { color, variant } = this;

    // Color mappings for different variants
    const colorMap: Record<
      BadgeColor,
      { solid: string[]; soft: string[]; outline: string[] }
    > = {
      secondary: {
        solid: ["bg-gray-600", "text-white"],
        soft: ["bg-gray-100", "text-gray-700"],
        outline: ["border", "border-gray-600", "text-gray-600"],
      },
      success: {
        solid: ["bg-green-600", "text-white"],
        soft: ["bg-green-100", "text-green-700"],
        outline: ["border", "border-green-600", "text-green-600"],
      },
      danger: {
        solid: ["bg-red-600", "text-white"],
        soft: ["bg-red-100", "text-red-700"],
        outline: ["border", "border-red-600", "text-red-600"],
      },
      warning: {
        solid: ["bg-orange-600", "text-white"],
        soft: ["bg-orange-100", "text-orange-700"],
        outline: ["border", "border-orange-600", "text-orange-600"],
      },
      info: {
        solid: ["bg-cyan-600", "text-white"],
        soft: ["bg-cyan-100", "text-cyan-700"],
        outline: ["border", "border-cyan-600", "text-cyan-600"],
      },
      discovery: {
        solid: ["bg-purple-600", "text-white"],
        soft: ["bg-purple-100", "text-purple-700"],
        outline: ["border", "border-purple-600", "text-purple-600"],
      },
    };

    return colorMap[color]?.[variant] || colorMap.secondary.soft;
  }
}

// Register the custom element
if (!customElements.get(AppsBadge.tagName)) {
  customElements.define(AppsBadge.tagName, AppsBadge);
}
