import React from "react";
import { css, cx, CSSInterpolation } from "@emotion/css";
import { SizeSpec, AlignSpec, OffsetSpec, offsetSpecToPadding, Size } from "./constraints";

export type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";

const flexClass = css({
  display: "flex",
});

export interface FlexProps {
  flexDirection: FlexDirection
  alignItems?: AlignSpec
  flexGrow?: number
  flexShrink?: number
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse"
  width?: SizeSpec
  maxWidth?: SizeSpec
  height?: SizeSpec
  padding?: OffsetSpec
  gap?: Size
  backgroundColor?: string
}

export const Flex: React.FC<FlexProps> = React.memo(({ flexDirection, alignItems, flexGrow, flexShrink, flexWrap, width, height, maxWidth, gap, padding, backgroundColor, children }) => {
  const classes = [flexClass];
  const emotionStyles: CSSInterpolation[] = []

  emotionStyles.push({ flexDirection });
  alignItems !== undefined && emotionStyles.push({ alignItems });
  flexGrow !== undefined && emotionStyles.push({ flexGrow });
  flexShrink !== undefined && emotionStyles.push({ flexShrink });
  flexWrap != undefined && emotionStyles.push({ flexWrap });
  height !== undefined && emotionStyles.push({ height: height.join("") });
  width !== undefined && emotionStyles.push({ width: width.join(""), });
  maxWidth !== undefined && emotionStyles.push({ maxWidth: maxWidth.join(""), });
  padding !== undefined && emotionStyles.push(offsetSpecToPadding(padding))
  backgroundColor !== undefined && emotionStyles.push({ backgroundColor });

  if (gap !== undefined) {
    switch (flexDirection) {
      case "row": emotionStyles.push({ "> :not(:last-child)": { marginRight: `${gap}px` } }); break;
      case "row-reverse": emotionStyles.push({ "> :not(:first-child)": { marginRight: `${gap}px` } }); break;
      case "column": emotionStyles.push({ "> :not(:last-child)": { marginBottom: `${gap}px` } }); break;
      case "column-reverse": emotionStyles.push({ "> :not(:first-child)": { marginBottom: `${gap}px` } }); break;
    }
  }

  classes.push(css(emotionStyles))

  return (
    <div className={cx(classes)}>
      {children}
    </div>
  )
});
