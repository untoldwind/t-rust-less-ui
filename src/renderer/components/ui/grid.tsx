import * as React from "react";

export interface Props {
    columns?: number
}

export const Grid : React.FunctionComponent<Props> = props => {
    const classes : string[] = ["components__grid"];
    const style: React.CSSProperties = {
        gridTemplateColumns: `repeat(${props.columns || 12}, fr)`,
    };

    return (
        <div className={classes.join(" ")} style={style}>
            {props.children}
        </div>
    )
};