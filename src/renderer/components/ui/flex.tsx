import * as React from "react";

export interface FlexVerticalProps {

}

export const FlexVertical : React.FunctionComponent<FlexVerticalProps> = props => {
    return (
        <div className="flex flex__vertical">
            {props.children}
        </div>
    )
}