import * as React from "react";
import { FieldProps } from "./fields";

export type Option = { value: string, label: string, disabled?: boolean };

export interface Props extends FieldProps {
    options: Option[]
}

export const SelectField : React.FunctionComponent<Props> = props => {
    return (
        <select className="components__field components__field__select" {...props}>
            {props.options.map(option => (
                <option key={option.value} {...option}/>
            ))}
        </select>
    )
}