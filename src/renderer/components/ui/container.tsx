import * as React from "react";

export interface ContainerProps {
  fluid?: boolean
}

export const Container: React.FunctionComponent<ContainerProps> = props => (
  <div className={props.fluid ? "container-fluid" : "container"}>
    {props.children}
  </div>
);

export interface RowProps {

}

export const Row: React.FunctionComponent<RowProps> = props => {
  const classes: string[] = ["row"];

  return (
    <div className={classes.join(" ")}>
      {props.children}
    </div>
  )
};

export interface ColProps {
  width?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "auto"
  offset?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
}

export const Col: React.FunctionComponent<ColProps> = props => {
  const classes: string[] = [];

  if (props.width)
    classes.push(`col-${props.width}`);
  else
    classes.push("col");
  if (props.offset)
    classes.push(`offset-${props.offset}`)

  return (
    <div className={classes.join(" ")}>
      {props.children}
    </div>
  )
};

