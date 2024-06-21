import React, { PropsWithChildren, useEffect, useState } from "react";
import { Identity, Status, StoreConfig, commands } from "./bindings";
import {
  errorToSnackbar,
  serviceErrorToSnackbar,
  useBackend,
} from "./use-backend";
import { useSnackbar } from "notistack";

export interface BackendState {
  stores?: StoreConfig[];
  selectedStore?: string;
  identities?: Identity[];
  status?: Status;
  loading: boolean;
  lockingUnlocking: boolean;
  selectStore: (storeId: string) => void;
  lockStore: () => void;
  unlockStore: (identityId: string, passphrase: string) => void;
}

export const BackendContext = React.createContext<BackendState>({
  loading: false,
  lockingUnlocking: false,
  selectStore: () => {},
  lockStore: () => {},
  unlockStore: () => {},
});

export const BackendProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [stores, storesLoading] = useBackend(() =>
    commands.serviceListStores(),
  );
  const [defaultStore, defaultStoreLoading] = useBackend(() =>
    commands.serviceGetDefaultStore(),
  );
  const [selectedStore, setSelectedStore] = useState<string | undefined>(
    undefined,
  );
  const [identities, identitiesLoading] = useBackend(() => {
    if (!selectedStore || !stores) return undefined;

    return commands.storeIdentities(selectedStore);
  }, [stores, selectedStore]);
  const [status, statusLoading, refreshStatus] = useBackend(() => {
    if (!selectedStore || !stores) return undefined;

    return commands.storeStatus(selectedStore);
  }, [stores, selectedStore]);
  const [lockingUnlocking, setLockingUnlocking] = useState(false);

  function lockStore() {
    if (!selectedStore || lockingUnlocking) return;

    setLockingUnlocking(true);
    commands.storeLock(selectedStore).then(
      () => {
        setLockingUnlocking(false);
        refreshStatus();
      },
      (error) => {
        setLockingUnlocking(false);
        enqueueSnackbar(errorToSnackbar(error));
      },
    );
  }

  function unlockStore(identityId: string, passphrase: string) {
    if (!selectedStore || lockingUnlocking) return;

    setLockingUnlocking(true);
    commands.storeUnlock(selectedStore, identityId, passphrase).then(
      (result) => {
        setLockingUnlocking(false);
        if (result.status === "ok") {
          refreshStatus();
        } else {
          enqueueSnackbar(serviceErrorToSnackbar(result.error));
        }
      },
      (error) => {
        setLockingUnlocking(false);
        enqueueSnackbar(errorToSnackbar(error));
      },
    );
  }

  useEffect(() => {
    if (!selectedStore && defaultStore) setSelectedStore(defaultStore);
  }, [defaultStore]);

  useEffect(() => {
    if (!status || statusLoading) return;
    const id = setTimeout(refreshStatus, 1000);
    return () => {
      clearTimeout(id);
    };
  }, [status, statusLoading]);

  return (
    <BackendContext.Provider
      value={{
        loading: storesLoading || defaultStoreLoading || identitiesLoading,
        lockingUnlocking,
        stores,
        identities,
        status,
        selectStore: setSelectedStore,
        lockStore,
        unlockStore,
      }}
    >
      {children}
    </BackendContext.Provider>
  );
};
