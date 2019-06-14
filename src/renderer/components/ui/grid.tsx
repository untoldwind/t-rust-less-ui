import * as React from "react";
import { SizeSpec, Spacing } from "./common";

export interface GridProps {
  columns?: number | SizeSpec[]
  rows?: number | SizeSpec[]
  height?: SizeSpec
  gap?: Spacing | [Spacing, Spacing]
  padding?: Spacing | [Spacing, Spacing]
}

export const Grid: React.FunctionComponent<GridProps> = props => {
  const classes: string[] = ["grid", "grid__container"];
  const style: React.CSSProperties = {
    gridTemplateColumns: typeof props.columns === "number" ? `repeat(${props.columns}, 1fr)` : (props.columns ? props.columns.map(elem => elem.join("")).join(" ") : "1fr"),
  };
  if (props.columns) style.gridTemplateColumns = typeof props.columns === "number" ? `repeat(${props.columns}, 1fr)` : props.columns.map(elem => elem.join("")).join(" ");
  if (props.rows) style.gridTemplateRows = typeof props.rows === "number" ? `repeat(${props.rows}, 1fr)` : props.rows.map(element => element.join("")).join(" ");
  if (props.height) {
    style.height = props.height.join("");
    style.maxHeight = props.height.join("");
  }
  if (props.gap) {
    classes.push(`grid__container--column-gap--${typeof props.gap === "string" ? props.gap : props.gap[0]}`)
    classes.push(`grid__container--row-gap--${typeof props.gap === "string" ? props.gap : props.gap[1]}`)
  }
  if (props.padding) {
    classes.push(`grid__container--pad-x--${typeof props.padding === "string" ? props.padding : props.padding[0]}`)
    classes.push(`grid__container--pad-y--${typeof props.padding === "string" ? props.padding : props.padding[1]}`)
  }

  return (
    <div className={classes.join(" ")} style={style}>
      {props.children}
    </div>
  )
};

export interface GridItemProps {
  colStart?: number
  colEnd?: number
  colSpan?: number
  rowStart?: number
  rowEnd?: number
  rowSpan?: number
  padding?: Spacing | [Spacing, Spacing]
}

export const GridItem: React.FunctionComponent<GridItemProps> = props => {
  const classes: string[] = ["grid__item"];
  const style: React.CSSProperties = {}

  if (props.colStart) style.gridColumnStart = props.colStart;
  if (props.colEnd) style.gridColumnEnd = props.colEnd;
  if (props.colSpan) style.gridColumn = `span ${props.colSpan}`;
  if (props.rowStart) style.gridRowStart = props.rowStart;
  if (props.rowEnd) style.gridRowEnd = props.rowEnd;
  if (props.rowSpan) style.gridRow = `span ${props.rowSpan}`;
  if (props.padding) {
    classes.push(`grid__item--pad-x--${typeof props.padding === "string" ? props.padding : props.padding[0]}`)
    classes.push(`grid__item--pad-y--${typeof props.padding === "string" ? props.padding : props.padding[1]}`)
  }

  return (
    <div className={classes.join(" ")} style={style}>
      {props.children}
    </div>
  )
}