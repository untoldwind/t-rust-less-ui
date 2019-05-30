import * as React from "react";
import { UIState } from "./common";

export interface PanelProps {
  state: UIState
}

export class Panel extends React.Component<PanelProps, {}> {
  render() {
    return (
      <div className={`panel panel--${this.props.state}`}>
        {this.props.children}
      </div>
    )
  }
}