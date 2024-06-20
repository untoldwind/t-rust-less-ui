import React, { PropsWithChildren } from "react";

export interface BackendState {
  loading: boolean;
}

export const BackendContext = React.createContext<BackendState>({
  loading: false,
});

export const BackendProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <BackendContext.Provider value={{ loading: false }}>
      {children}
    </BackendContext.Provider>
  );
};
