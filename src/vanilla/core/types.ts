/**
 * Common types for vanilla web components
 */

export type SemanticColor =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "info"
  | "discovery"
  | "caution"
  | "warning";

export type Variant = "solid" | "soft" | "outline" | "ghost";

export type ControlSize = "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type GutterSize = "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Base props that all components might use
 */
export interface BaseComponentProps {
  className?: string;
  id?: string;
}

/**
 * Attribute to property mapper utility type
 */
export type AttributeMap<T = Record<string, unknown>> = {
  [K in keyof T]: {
    attribute: string;
    type: "string" | "number" | "boolean" | "json";
    defaultValue?: T[K];
  };
};
