import * as React from "react";
import { render } from "react-dom";
import { MainFrame } from "./components/main-frame";
import { Provider } from "react-redux";
import { store } from "./store";

render((
    <Provider store={store}>
        <MainFrame/>
    </Provider>
), document.getElementById("app"));
