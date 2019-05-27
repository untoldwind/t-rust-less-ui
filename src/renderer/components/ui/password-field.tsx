import * as React from "react";
import { FieldProps } from "./fields";

export interface Props extends FieldProps{
}

export const PasswordField : React.FunctionComponent<Props> = props => {
    return (
        <input className="components__field components__passwordfield" type="password" {...props}/>
    )
}