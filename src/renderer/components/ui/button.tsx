import * as React from "react";

export interface ButtonProps {
  disabled?: boolean
  type?: "button" | "reset" | "submit"
  onClick?: () => void
}

export class Button extends React.Component<ButtonProps, {}> {
  render() {
    return (
      <button className="buttons__standard" {...this.props}>
        {this.props.children}
      </button>
    )
  }
}