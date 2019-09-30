
export type SizeSpec = [number, "px" | "fr" | "%" | "vw" | "vh"] | "min-content";

export type Spacing = "none" | "sm" | "base" | "md" | "lg" | "xl" | "xxl";

export function size2CSS(size: SizeSpec): string {
  return typeof size === "string" ? size : size.join("");
}