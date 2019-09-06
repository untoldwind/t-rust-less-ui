import * as React from "react";
import { Spacing, SizeSpec, size2CSS } from "./common";

export interface FlexVerticalProps {
  gap?: Spacing
  reverse?: boolean
  height?: SizeSpec
}

export const FlexVertical: React.FunctionComponent<FlexVerticalProps> = props => {
  const baseClass = props.reverse ? "flex__vertical_reverse" : "flex__vertical";
  const classes: string[] = ["flex", baseClass];
  const style: React.CSSProperties = {};

  if (props.height) {
    style.height = size2CSS(props.height);
    style.maxHeight = size2CSS(props.height);
  }
  if (props.gap) classes.push(`${baseClass}--gap--${props.gap}`);

  return (
    <div style={style} className={classes.join(" ")}>
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
  if (typeof props.basis !== "undefined") style.flexBasis = size2CSS(props.basis);

  return (
    <div style={style}>
      {props.children}
    </div>
  )
}