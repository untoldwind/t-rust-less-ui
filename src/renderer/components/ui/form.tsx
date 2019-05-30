import * as React from "react";
import { bind } from "decko";

export interface FormProps {
  onSubmit?: () => void
}

export class Form extends React.Component<FormProps, {}> {
  render() {
    return (
      <form onSubmit={this.onSubmit}>
        {this.props.children}
      </form>
    )
  }

  @bind
  private onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    this.props.onSubmit && this.props.onSubmit();
  }
}