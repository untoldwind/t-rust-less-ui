import React from "react";
import { UnlockStore } from "./unlock-store";
import { ListSecretsHotkeys } from "./list-secrets-hotkeys";
import { Configuration } from "./configuration";
import { mainPanelState } from "../machines/state";
import { useRecoilValue } from "recoil";
import { useStatusRefresh } from "../machines/actions";
import { Loading } from "./loading";

export const MainFrame: React.FC = () => {
  const mainPanel = useRecoilValue(mainPanelState);

  useStatusRefresh();

  switch (mainPanel) {
    case "unlock":
      return (
        <React.Suspense fallback={<Loading />}>
          <UnlockStore />
        </React.Suspense>
      );
    case "browse":
      return (<ListSecretsHotkeys />);
    case "config":
      return (
        <React.Suspense fallback={<Loading />}>
          <Configuration />
        </React.Suspense>
      )
  }
}
