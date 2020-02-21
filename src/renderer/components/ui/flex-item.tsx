import * as React from "react";
import { ObjectInterpolation, css, cx } from "emotion";
import { AlignSpec, OffsetSpec, offsetSpecToPadding, SizeSpec } from "./constraints";

export interface FlexItemProps {
  flexGrow?: number
  flexShrink?: number
  flexBasis?: SizeSpec
  alignSelf?: AlignSpec
  overflow?: "visible" | "hidden" | "scroll" | "auto" | "inherit" | "initial" | "unset"
  padding?: OffsetSpec
}

export const FlexItem: React.FunctionComponent<FlexItemProps> = props => {
  const classes: string[] = [];
  const { padding, overflow, alignSelf, flexGrow, flexShrink, flexBasis } = props;
  const emotionStyles: ObjectInterpolation<undefined>[] = [];

  flexGrow !== undefined && emotionStyles.push({ flexGrow });
  flexShrink !== undefined && emotionStyles.push({ flexShrink });
  overflow !== undefined && emotionStyles.push({ overflow });
  alignSelf !== undefined && emotionStyles.push({ alignSelf });
  flexBasis !== undefined && emotionStyles.push({ flexBasis: flexBasis.join("") });

  padding !== undefined && emotionStyles.push(offsetSpecToPadding(padding));

  classes.push(css(emotionStyles));

  return (
    <div className={cx(classes)}>
      {props.children}
    </div>
  )
};