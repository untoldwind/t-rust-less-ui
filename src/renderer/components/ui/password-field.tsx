import * as React from "react";
import { FieldProps } from "./fields";
import { bind } from "decko";

export interface Props extends FieldProps {
}

export class PasswordField extends React.Component<Props, {}> {
  render() {
    return (
      <input className="components__field components__field__password" type="password" {...this.props} onChange={this.onChange} />
    )
  }

  @bind
  private onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { onValueChange } = this.props;

    onValueChange && onValueChange(event.target.value);
  }
}