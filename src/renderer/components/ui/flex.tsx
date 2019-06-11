import * as React from "react";
import { Spacing, SizeSpec } from "./common";

export interface FlexVerticalProps {
  gap?: Spacing
}

export const FlexVertical: React.FunctionComponent<FlexVerticalProps> = props => {
  const classes: string[] = ["flex", "flex__vertical"];

  if (props.gap) classes.push(`flex__vertical--gap--${props.gap}`);

  return (
    <div className={classes.join(" ")}>
      {props.children}
    </div>
  )
}

export interface FlexHorizontalProps {
  gap?: Spacing
}

export const FlexHorizontal: React.FunctionComponent<FlexHorizontalProps> = props => {
  const classes: string[] = ["flex", "flex__horizontal"];

  if (props.gap) classes.push(`flex__horizontal--gap--${props.gap}`);

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