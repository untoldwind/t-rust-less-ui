import * as React from "react";

export type SizeSpec = [number, "px" | "fr" | "%" | "vw" | "vh"]

export type Spacing = "sm" | "base" | "md" | "lg" | "xl" | "xxl";

export interface GridProps {
  columns?: number
  colSpec?: SizeSpec[]
  rowSpec?: SizeSpec[]
  height?: SizeSpec
  colGap?: Spacing
  rowGap?: Spacing
}

export const Grid: React.FunctionComponent<GridProps> = props => {
  const classes: string[] = ["grid", "grid__container"];
  const style: React.CSSProperties = {
    gridTemplateColumns: props.colSpec ? props.colSpec.map(elem => elem.join("")).join(" ") : `repeat(${props.columns || 12}, 1fr)`,
  };
  if (props.rowSpec) style.gridTemplateRows = props.rowSpec.map(element => element.join("")).join(" ");
  if (props.height) {
    style.height = props.height.join("");
    style.maxHeight = props.height.join("");
  }
  if (props.colGap) classes.push(`grid__container--column-gap--${props.colGap}`)
  if (props.rowGap) classes.push(`grid__container--row-gap--${props.rowGap}`)

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
}

export const GridItem: React.FunctionComponent<GridItemProps> = props => {
  const classes: string[] = [];
  const style: React.CSSProperties = {}

  if (props.colStart) style.gridColumnStart = props.colStart;
  if (props.colEnd) style.gridColumnEnd = props.colEnd;
  if (props.colSpan) style.gridColumn = `span ${props.colSpan}`;
  if (props.rowStart) style.gridRowStart = props.rowStart;
  if (props.rowEnd) style.gridRowEnd = props.rowEnd;
  if (props.rowSpan) style.gridRow = `span ${props.rowSpan}`;

  return (
    <div className={classes.join(" ")} style={style}>
      {props.children}
    </div>
  )
}