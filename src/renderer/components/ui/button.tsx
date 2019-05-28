import * as React from "react";

export interface ButtonProps {
  disabled?: boolean
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