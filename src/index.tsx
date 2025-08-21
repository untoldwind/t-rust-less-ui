import React from "react";
import { createRoot } from "react-dom/client";
import { MainFrame } from "./components/main-frame";
import { FocusStyleManager } from "@blueprintjs/core";
import { MainStateProvider } from "./contexts/main-state";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TranslationsProvider } from "./i18n";
import { ErrorContextProvider } from "./contexts/error-state";

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
