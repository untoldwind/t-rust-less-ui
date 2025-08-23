import React from "react";
import { createRoot } from "react-dom/client";
import { MainFrame } from "./components/main-frame";
import { FocusStyleManager } from "@blueprintjs/core";
import { MainStateProvider } from "./contexts/main-state";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TranslationsProvider } from "./i18n";
import { ErrorContextProvider } from "./contexts/error-state";

import "hack-font/build/web/hack.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";

FocusStyleManager.onlyShowFocusOnTabs();

const root = createRoot(document.getElementById("app")!);

const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <TranslationsProvider>
      <ErrorContextProvider>
        <MainStateProvider>
          <MainFrame />
        </MainStateProvider>
      </ErrorContextProvider>
    </TranslationsProvider>
  </QueryClientProvider>,
);
