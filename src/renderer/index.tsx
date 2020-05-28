import * as React from "react";
import { render } from "react-dom";
import { MainFrame } from "./components/main-frame";
import { mainInterpreter } from "./machines/main";

mainInterpreter.start();

render((
  <MainFrame />
), document.getElementById("app"));
