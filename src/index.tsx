import React from "react";
import { createRoot } from "react-dom/client";
import { MainFrame } from "./components/main-frame";
import { FocusStyleManager } from "@blueprintjs/core";
import { RecoilRoot } from "recoil";

FocusStyleManager.onlyShowFocusOnTabs();

const root = createRoot(document.getElementById("app")!);

root.render(
  <RecoilRoot>
    <MainFrame />
  </RecoilRoot>
);
