import * as React from "react";
import { UIState } from "./common";

export interface ButtonProps {
  disabled?: boolean
  type?: "button" | "reset" | "submit"
  state: UIState
  onClick?: () => void
}

export class Button extends React.Component<ButtonProps, {}> {
  render() {
    return (
      <button className={`buttons buttons__standard buttons__standard--${this.props.state}`} {...this.props}>
        {this.props.children}
      </button>
    )
  }
}