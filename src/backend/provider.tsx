import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Identity, StoreConfig, commands } from "./bindings";
import { useBackend } from "./use-backend";

export interface BackendState {
  stores?: StoreConfig[];
  selectedStore?: string;
  identities?: Identity[];
  loading: boolean;
  selectStore: (storeId: string) => void;
}

export const BackendContext = React.createContext<BackendState>({
  loading: false,
  selectStore: () => {},
});

export const BackendProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [stores, storesLoading] = useBackend(() =>
    commands.serviceListStores()
  );
  const [defaultStore, defaultStoreLoading] = useBackend(() =>
    commands.serviceGetDefaultStore()
  );
  const [selectedStore, setSelectedStore] = useState<string | undefined>(
    undefined
  );
  const [identities, identitiesLoading] = useBackend(() => {
    if (!selectedStore || !stores) return undefined;

    return commands.storeIdentities(selectedStore);
  }, [stores, selectedStore]);

  useEffect(() => {
    if (!selectedStore && defaultStore) setSelectedStore(defaultStore);
  }, [defaultStore]);

  return (
    <BackendContext.Provider
      value={{
        loading: storesLoading || defaultStoreLoading || identitiesLoading,
        stores,
        identities,
        selectStore: setSelectedStore,
      }}
    >
      {children}
    </BackendContext.Provider>
  );
};
