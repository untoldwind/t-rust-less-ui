import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import {
  Identity,
  Result,
  ServiceError,
  StoreConfig,
  commands,
} from "./bindings";

export interface BackendState {
  stores?: StoreConfig[];
  selectedStore?: string;
  identities?: Identity[];
  errors: ServiceError[];
  loading: boolean;
  clearError: (idx: number) => void;
}

export const BackendContext = React.createContext<BackendState>({
  loading: false,
  errors: [],
  clearError: () => {},
});

export const BackendProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [stores, setStores] = useState<StoreConfig[] | undefined>(undefined);
  const [selectedStore, setSelectedStore] = useState<string | undefined>(
    undefined
  );
  const [identities, setIdentities] = useState<Identity[] | undefined>(
    undefined
  );
  const tasks = useRef<Set<string>>(new Set());
  const [errors, setErrors] = useState<ServiceError[]>([]);

  function runTask<T>(
    taskName: string,
    taskFn: () => Promise<Result<T, ServiceError>>,
    handleOk: (value: T) => void
  ) {
    if (tasks.current.has("identities")) return;
    tasks.current.add(taskName);
    taskFn()
      .then((result) => {
        tasks.current.delete(taskName);
        if (result.status === "ok") {
          handleOk(result.data);
        } else {
          setErrors([...errors, result.error]);
        }
      })
      .catch((error) => {
        tasks.current.delete(taskName);
        setErrors([...errors, { IO: error.toString() }]);
      });
  }

  function clearError(idx: number): void {
    setErrors([...errors.slice(0, idx), ...errors.slice(idx + 1)]);
  }

  useEffect(() => {
    runTask(
      "stores",
      () => commands.serviceListStores(),
      (stores) => {
        setStores(stores);
        if (selectedStore === undefined && stores.length > 0) {
          setSelectedStore(stores[0].name);
        }
      }
    );
  }, []);

  useEffect(() => {
    if (selectedStore === undefined) return;
    runTask(
      "identities",
      () => commands.storeIdentities(selectedStore),
      setIdentities
    );
  }, [selectedStore]);

  return (
    <BackendContext.Provider
      value={{
        loading: tasks.current.size === 0,
        stores,
        identities,
        errors,
        clearError,
      }}
    >
      {children}
    </BackendContext.Provider>
  );
};
