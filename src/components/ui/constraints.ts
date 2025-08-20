import { CSSInterpolation } from "@emotion/serialize";

export type Size = 0 | 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50;
export type OffsetSpec = Size | [Size, Size] | [Size, Size, Size] | [Size, Size, Size, Size];

export type SizeSpec = [number, "px" | "fr" | "%" | "em" | "cm" | "en" | "vw" | "vh"];

export type AlignSpec = "auto" | "stretch" | "baseline" | "center" | "start" | "end";
export type JustifySpec = "auto" | "stretch" | "center" | "start" | "end";

export function offsetSpecToPadding(size: OffsetSpec): CSSInterpolation {
  if (Array.isArray(size)) {
    return {
      padding: `${size.join('px ')}px`,
    }
  } else {
    return {
      padding: `${size}px`,
    }
  }
}
