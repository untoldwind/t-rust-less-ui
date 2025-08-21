import { DefaultError, useMutation, useQuery } from "@tanstack/react-query";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  addIdentity,
  AppVersion,
  checkAutolock,
  generateId,
  getAppVersion,
  getDefaultStore,
  identities,
  Identity,
  listStores,
  lock,
  setDefaultStore,
  Status,
  status,
  StoreConfig,
  unlock,
  upsertStoreConfig,
} from "./backend-tauri";
import { ErrorContext } from "./error-state";

export type MainPanel = "unlock" | "browse" | "config";

export type MainStateContext = {
  busy: boolean;
  mainPanel: MainPanel;
  setMainPanel: (panel: MainPanel) => void;
  appVersion: AppVersion;
  selectedStore: string | null;
  setSelectedStore: (storeId: string | null) => void;
  status: Status;
  identities: Identity[];
  stores: StoreConfig[];
  defaultStore: string | null;
  setDefaultStore: (storeName: string) => void;
  addIdentity: (
    identity: Identity,
    passphrase: string,
    onSuccess: () => void,
  ) => void;
  upsertStoreConfig: (config: StoreConfig, onSuccess: () => void) => void;
  lock: () => void;
  tryUnlock: (identityId: string, passphrase: string) => void;
};

export const MainStateContext = createContext<MainStateContext>({
  busy: false,
  mainPanel: "unlock",
  setMainPanel: () => {},
  appVersion: {
    version: "",
    tauriVersion: "",
  },
  selectedStore: null,
  setSelectedStore: () => {},
  identities: [],
  status: {
    locked: true,
    autolock_timeout: 0,
    version: "",
  },
  stores: [],
  defaultStore: null,
  setDefaultStore: () => {},
  addIdentity: () => {},
  upsertStoreConfig: () => {},
  lock: () => {},
  tryUnlock: () => {},
});

export const MainStateProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const errors = useContext(ErrorContext);
  const [mainPanel, setMainPanel] = useState<MainPanel>("unlock");
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const {
    data: appVersion,
    isPending: appVersionBusy,
    error: addVerionError,
  } = useQuery({
    queryKey: ["getAppVersion"],
    initialData: () => ({
      version: "",
      tauriVersion: "",
    }),
    queryFn: () => getAppVersion(),
  });
  const {
    data: stores,
    refetch: refreshStores,
    isPending: storesBusy,
    error: storesError,
  } = useQuery({
    queryKey: ["listStores"],
    initialData: () => [],
    queryFn: () => listStores(),
  });
  const {
    data: defaultStore,
    refetch: refreshDefaultStore,
    isPending: defaultStoreBusy,
    error: defaultStoreError,
  } = useQuery({
    queryKey: ["getDefaultStore"],
    initialData: () => null,
    queryFn: () => getDefaultStore(),
  });
  const { data: currentStatus, refetch: refreshStatus } = useQuery<Status>({
    queryKey: ["refreshState", selectedStore],
    initialData: () => ({ locked: true, autolock_timeout: 0, version: "" }),
    queryFn: async () => {
      await checkAutolock();

      if (!selectedStore) {
        return {
          locked: true,
          autolock_timeout: 0,
          version: "",
        };
      }
      return await status(selectedStore);
    },
    refetchInterval: 1000,
  });
  const {
    data: storeIdentities,
    refetch: refreshIdentities,
    isPending: identitiesBusy,
    error: identitiesError,
  } = useQuery<Identity[], DefaultError, Identity[], [string, string | null]>({
    queryKey: ["getIdentities", selectedStore],
    initialData: () => [],
    queryFn: async () => {
      if (!selectedStore) {
        return [];
      }
      return await identities(selectedStore);
    },
  });
  const upsertStoreMutation = useMutation({
    mutationFn: async (storeConfig: StoreConfig) => {
      if (storeConfig.client_id === "") {
        storeConfig.client_id = await generateId();
      }
      await upsertStoreConfig(storeConfig);
    },
    onError: (err) => errors.addError(err.toString()),
    onSuccess: () => refreshStores(),
  });
  const defaultStoreMutation = useMutation({
    mutationFn: (storeName: string) => setDefaultStore(storeName),
    onError: (err) => errors.addError(err.toString()),
    onSuccess: () => refreshDefaultStore(),
  });

  const addIdentityMutation = useMutation({
    mutationFn: async (params: { identity: Identity; passphrase: string }) => {
      if (!selectedStore) return;
      if (params.identity.id === "") {
        params.identity.id = await generateId();
      }
      await addIdentity(selectedStore, params.identity, params.passphrase);
    },
    onError: (err) => errors.addError(err.toString()),
    onSuccess: () => refreshIdentities(),
  });
  const lockMutation = useMutation({
    mutationFn: async () => selectedStore && (await lock(selectedStore)),
    onError: (err) => errors.addError(err.toString()),
    onSuccess: () => refreshStatus(),
  });
  const unlockMutation = useMutation({
    mutationFn: async (params: { identityId: string; passphrase: string }) =>
      selectedStore &&
      (await unlock(selectedStore, params.identityId, params.passphrase)),
    onError: (err) => errors.addError(err.toString()),
    onSuccess: () => refreshStatus(),
  });

  useEffect(() => {
    addVerionError && errors.addError(addVerionError.toString());
    storesError && errors.addError(storesError.toString());
    defaultStoreError && errors.addError(defaultStoreError.toString());
    identitiesError && errors.addError(identitiesError.toString());
  }, [addVerionError, storesError, defaultStoreError, identitiesError]);

  useEffect(() => {
    if (!selectedStore && defaultStore) {
      setSelectedStore(defaultStore);
    }
  }, [selectedStore, defaultStore]);

  useEffect(() => {
    if (currentStatus.locked && mainPanel == "browse") {
      setMainPanel("unlock");
    } else if (!currentStatus.locked && mainPanel == "unlock") {
      setMainPanel("browse");
    }
  }, [mainPanel, currentStatus.locked]);

  return (
    <MainStateContext.Provider
      value={{
        mainPanel,
        busy:
          appVersionBusy ||
          storesBusy ||
          defaultStoreBusy ||
          identitiesBusy ||
          upsertStoreMutation.isPending ||
          addIdentityMutation.isPending ||
          lockMutation.isPending ||
          unlockMutation.isPending,
        setMainPanel,
        appVersion,
        selectedStore,
        setSelectedStore,
        identities: storeIdentities,
        status: currentStatus,
        stores,
        defaultStore,
        setDefaultStore: (storeName: string) =>
          defaultStoreMutation.mutate(storeName),
        upsertStoreConfig: (config: StoreConfig, onSuccess: () => void) =>
          upsertStoreMutation.mutate(config, { onSuccess }),
        addIdentity: (
          identity: Identity,
          passphrase: string,
          onSuccess: () => void,
        ) => {
          addIdentityMutation.mutate({ identity, passphrase }, { onSuccess });
        },
        lock: () => lockMutation.mutate(),
        tryUnlock: (identityId: string, passphrase: string) => {
          unlockMutation.mutate({ identityId, passphrase });
        },
      }}
    >
      {children}
    </MainStateContext.Provider>
  );
};
