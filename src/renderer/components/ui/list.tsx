import * as React from "react";

export interface ListProps {

}

export class List extends React.Component<ListProps, {}> {
  render() {
    return (
      <div className="list">
        {this.props.children}
      </div>
    )
  }
}