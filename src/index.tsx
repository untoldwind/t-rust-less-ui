import React from "react";
import { render } from "react-dom";
import { MainFrame } from "./components/main-frame";
import { FocusStyleManager } from "@blueprintjs/core";
import { RecoilRoot } from "recoil";

FocusStyleManager.onlyShowFocusOnTabs();

render((
  <RecoilRoot>
    <MainFrame />
  </RecoilRoot>
), document.getElementById("app"));
