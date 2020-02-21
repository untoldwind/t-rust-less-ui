import * as React from "react";
import { AlignSpec, OffsetSpec, offsetSpecToPadding, JustifySpec } from "./constraints";
import { ObjectInterpolation, css, cx } from "emotion";

export interface GridItemProps {
  colStart?: number
  colEnd?: number
  rowStart?: number
  rowEnd?: number
  rowSpan?: number
  colSpan?: number
  alignSelf?: AlignSpec
  justifySelf?: JustifySpec
  overflow?: "visible" | "hidden" | "scroll" | "auto" | "inherit" | "initial" | "unset"
  padding?: OffsetSpec
}

type GridProp = {
  start?: number
  span?: number
  end?: number
}

function computeGridAttribute(span: number | undefined, start: number | undefined, end: number | undefined): string {
  if (span && end) {
    return `span ${span} / ${end}`
  } else if (span && start) {
    return `${start} / span ${span}`
  } else if (span) {
    return `span ${span} / auto`
  } else {
    return `${start || "auto"} / ${end || "auto"}`
  }
}

function rawGridSpecToGridProp(start: number | undefined, span: number | undefined, end: number | undefined): GridProp | undefined {
  if (start || span || end) {
    return {
      start: start,
      span: span,
      end: end,
    }
  } else {
    return undefined
  }
}

export const GridItem: React.FunctionComponent<GridItemProps> = props => {
  const classes: string[] = [];
  const { padding, overflow, alignSelf, justifySelf } = props;
  const emotionStyles: ObjectInterpolation<undefined>[] = [];

  const colProps = rawGridSpecToGridProp(props.colStart, props.colSpan, props.colEnd);
  const rowProps = rawGridSpecToGridProp(props.rowStart, props.rowSpan, props.rowEnd);

  colProps !== undefined && emotionStyles.push({ gridColumn: computeGridAttribute(colProps.span, colProps.start, colProps.end) });
  rowProps !== undefined && emotionStyles.push({ gridRow: computeGridAttribute(rowProps.span, rowProps.start, rowProps.end) });
  overflow !== undefined && emotionStyles.push({ overflow });
  alignSelf !== undefined && emotionStyles.push({ alignSelf });
  justifySelf !== undefined && emotionStyles.push({ justifySelf });

  padding !== undefined && emotionStyles.push(offsetSpecToPadding(padding));

  classes.push(css(emotionStyles));

  return (
    <div className={cx(classes)}>
      {props.children}
    </div>
  )
};
