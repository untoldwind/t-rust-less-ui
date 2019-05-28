import * as React from "react";
import { FieldProps } from "./fields";
import { bind } from "decko";

export type Option = { value: string, label: string, disabled?: boolean };

export interface Props extends FieldProps {
  options: Option[]
}

export class SelectField extends React.Component<Props>  {
  render() {
    return (
      <select className="components__field components__field__select" {...this.props} onChange={this.onChange}>
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