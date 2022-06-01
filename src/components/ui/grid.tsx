import React, { PropsWithChildren } from "react";
import { Size, SizeSpec, OffsetSpec, offsetSpecToPadding, JustifySpec, AlignSpec } from "./constraints";
import { css, cx, CSSInterpolation } from "@emotion/css";

const gridClass = css({
  display: "grid",
});

export interface GridProps extends React.DOMAttributes<HTMLElement> {
  padding?: OffsetSpec
  gap?: Size
  rowGap?: Size
  colGap?: Size
  width?: SizeSpec
  maxWidth?: SizeSpec
  height?: SizeSpec
  columns?: number
  columnSpec?: SizeSpec[] | string
  rowSpec?: SizeSpec[] | string
  alignItems?: AlignSpec
  justifyItems?: JustifySpec
  backgroundColor?: string
}

export const Grid: React.FC<PropsWithChildren<GridProps>> = React.memo(({ gap, rowGap, colGap, padding, columns, columnSpec, rowSpec, height, width, maxWidth, alignItems, justifyItems, backgroundColor, children, ...attrs }) => {
  const classes = [gridClass];

  const emotionStyles: CSSInterpolation[] = []

  padding !== undefined && emotionStyles.push(offsetSpecToPadding(padding))
  gap !== undefined && emotionStyles.push({ gridGap: `${gap}px` });
  rowGap !== undefined && emotionStyles.push({ gridRowGap: `${rowGap}px` });
  colGap !== undefined && emotionStyles.push({ gridColumnGap: `${colGap}px` });
  height !== undefined && emotionStyles.push({ height: height.join("") });
  width !== undefined && emotionStyles.push({ width: width.join(""), });
  maxWidth !== undefined && emotionStyles.push({ maxWidth: maxWidth.join(""), });
  alignItems !== undefined && emotionStyles.push({ alignItems });
  justifyItems !== undefined && emotionStyles.push({ justifyItems });
  backgroundColor !== undefined && emotionStyles.push({ backgroundColor });

  classes.push(css(emotionStyles))

  classes.push(css({
    gridTemplateColumns: columnSpec ? (typeof columnSpec === "string" ? columnSpec : columnSpec.map(elem => elem.join("")).join(" ")) : `repeat(${columns || 12}, 1fr)`,
  }));

  rowSpec && classes.push(css({
    gridTemplateRows: typeof rowSpec === "string" ? rowSpec : rowSpec.map(elem => elem.join("")).join(" "),
  }));

  return (
    <div className={cx(classes)} {...attrs}>
      {children}
    </div>
  )
});
