import { Translations } from "./translations";
import { EN } from "./en";
import React, { createContext, PropsWithChildren } from "react";

export function translations(): Translations {
  return EN;
}

export const TranslationsContext = createContext<Translations>(EN);

export const TranslationsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <TranslationsContext.Provider value={EN}>
      {children}
    </TranslationsContext.Provider>
  );
};
