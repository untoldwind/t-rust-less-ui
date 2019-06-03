import * as React from "react";
import { FieldProps } from "./fields";
import { bind } from "decko";

export type Option = { value: string, label: string, disabled?: boolean };

export interface Props extends FieldProps {
  options: Option[]
}

export class SelectField extends React.Component<Props>  {
  render() {
    const p = {
      className: "custom-select",
      autoFocus: this.props.autoFocus,
      disabled: this.props.disabled,
      value: this.props.value,
      onChange: this.onChange,
    };

    return (
      <select {...p} >
        {this.props.options.map((option, idx) => (
          <option key={idx} {...option} />
        ))}
      </select>
    )
  }

  @bind
  private onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const { onValueChange } = this.props;

    onValueChange && onValueChange(event.target.value);
  }
}