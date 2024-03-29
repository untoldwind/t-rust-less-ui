import * as React from "react";
import { CSSInterpolation, css, cx } from "@emotion/css";
import { AlignSpec, OffsetSpec, offsetSpecToPadding, SizeSpec } from "./constraints";

export interface FlexItemProps {
  flexGrow?: number
  flexShrink?: number
  flexBasis?: SizeSpec
  alignSelf?: AlignSpec
  overflow?: "visible" | "hidden" | "scroll" | "auto" | "inherit" | "initial" | "unset"
  padding?: OffsetSpec
}

export const FlexItem: React.FC<FlexItemProps> = ({ padding, overflow, alignSelf, flexGrow, flexShrink, flexBasis, children }) => {
  const classes: string[] = [];
  const emotionStyles: CSSInterpolation[] = [];

  flexGrow !== undefined && emotionStyles.push({ flexGrow });
  flexShrink !== undefined && emotionStyles.push({ flexShrink });
  overflow !== undefined && emotionStyles.push({ overflow });
  alignSelf !== undefined && emotionStyles.push({ alignSelf });
  flexBasis !== undefined && emotionStyles.push({ flexBasis: flexBasis.join("") });

  padding !== undefined && emotionStyles.push(offsetSpecToPadding(padding));

  classes.push(css(emotionStyles));

  return (
    <div className={cx(classes)}>
      {children}
    </div>
  )
};