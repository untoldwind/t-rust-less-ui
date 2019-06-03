import * as React from "react";
import { UIState } from "./common";

export interface ButtonProps {
  disabled?: boolean
  outline?: boolean
  type?: "button" | "reset" | "submit"
  state: UIState
  size?: "small" | "large"
  onClick?: () => void
}

export const Button: React.FunctionComponent<ButtonProps> = props => {
  const classes: string[] = ["btn"];

  if (props.outline)
    classes.push(`btn-outline-${props.state}`);
  else
    classes.push(`btn-${props.state}`);

  if (props.size === "small") classes.push("btn-sm");
  if (props.size === "large") classes.push("btn-lg");

  const p = {
    disabled: props.disabled,
    type: props.type,
    onClick: props.onClick,
  };

  return (
    <button className={classes.join(" ")} {...p}>
      {props.children}
    </button>
  )
}
