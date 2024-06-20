import React from "react";
import { Unlock } from "./unlock/unlock";

export interface NavigationState {
  page: "Unlock";
}

export const NavigationContext = React.createContext<NavigationState>({
  page: "Unlock",
});

export const Navigation: React.FC = () => {
  const [page, _] = React.useState<NavigationState["page"]>("Unlock");

  function pageComponent() {
    switch (page) {
      case "Unlock":
        return <Unlock />;
    }
  }

  return (
    <NavigationContext.Provider value={{ page }}>
      {pageComponent()}
    </NavigationContext.Provider>
  );
};
