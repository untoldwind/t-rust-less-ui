import * as React from "react";
import { Spacing, SizeSpec } from "./common";

export interface FlexVerticalProps {
  gap?: Spacing
  reverse?: boolean
}

export const FlexVertical: React.FunctionComponent<FlexVerticalProps> = props => {
  const baseClass = props.reverse ? "flex__vertical_reverse" : "flex__vertical";
  const classes: string[] = ["flex", baseClass];

  if (props.gap) classes.push(`${baseClass}--gap--${props.gap}`);

  return (
    <div className={classes.join(" ")}>
      {props.children}
    </div>
  )
}

export interface FlexHorizontalProps {
  gap?: Spacing
  reverse?: boolean
}

export const FlexHorizontal: React.FunctionComponent<FlexHorizontalProps> = props => {
  const baseClass = props.reverse ? "flex__horizontal_reverse" : "flex__horizontal";
  const classes: string[] = ["flex", baseClass];

  if (props.gap) classes.push(`${baseClass}--gap--${props.gap}`);

  return (
    <div className={classes.join(" ")}>
      {props.children}
    </div>
  )
}

export interface FlexItemProps {
  grow?: number
  shrink?: number
  basis?: SizeSpec
}

export const FlexItem: React.FunctionComponent<FlexItemProps> = props => {
  const style: React.CSSProperties = {};

  if (typeof props.grow !== "undefined") style.flexGrow = props.grow;
  if (typeof props.shrink !== "undefined") style.flexShrink = props.shrink;
  if (typeof props.basis !== "undefined") style.flexBasis = props.basis.join("");

  return (
    <div style={style}>
      {props.children}
    </div>
  )
}