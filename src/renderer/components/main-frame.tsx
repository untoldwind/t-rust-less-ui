import * as React from "react";
import * as backend from "../backend";

export class MainFrame extends React.Component<{}, {}> {
    componentDidMount() {
        backend.sendCommand("list_stores", result => {
            console.log(result);
        })
    }
    
    render() {
        return (
            <div>bla</div>
        );
    }
}