import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  addSecretVersion,
  clipboardCurrentlyProviding,
  clipboardDestroy,
  clipboardProvideNext,
  ClipboardProviding,
  getSecret,
  getSecretVersion,
  Identity,
  listSecrets,
  Secret,
  SecretList,
  SecretListFilter,
  secretToClipboard,
  SecretType,
  SecretVersion,
} from "./backend-tauri";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorContext } from "./error-state";

export type BrowseStateContext = {
  storeName: string;
  unlockedBy: Identity;
  listBusy: boolean;
  detailsBusy: boolean;
  editSecretVersion: SecretVersion | undefined;
  setEditSecretVersion: (secretVersion: SecretVersion | undefined) => void;
  secretListFilter: SecretListFilter;
  setSecretListFilterName: (filter: string | undefined) => void;
  setSecretListFilterType: (filter: SecretType | undefined) => void;
  setSecretListFilterTag: (filter: string | undefined) => void;
  setSecretListFilterDeleted: (filter: boolean | undefined) => void;
  secretList: SecretList;
  selectedSecret: Secret | undefined;
  setSelectedSecretId: (secretId: string | null) => void;
  selectedSecretVersion: SecretVersion | undefined;
  setSelectedSecretVersionId: (secretId: string | null) => void;
  selectSecretUp: () => void;
  selectSecretDown: () => void;
  createSecretVersion: (secretVersion: SecretVersion) => void;
  copySecretProperties: (properties: string[]) => void;
  clipboardProviding: ClipboardProviding | null;
  clipboardProvideNext: () => void;
  clipboardDestroy: () => void;
};

export const BrowseStateContext = createContext<BrowseStateContext>({
  storeName: "",
  unlockedBy: {
    id: "",
    name: "",
    email: "",
    hidden: false,
  },
  listBusy: false,
  detailsBusy: false,
  editSecretVersion: undefined,
  setEditSecretVersion: () => {},
  secretListFilter: {},
  setSecretListFilterName: () => {},
  setSecretListFilterType: () => {},
  setSecretListFilterTag: () => {},
  setSecretListFilterDeleted: () => {},
  secretList: {
    all_tags: [],
    entries: [],
  },
  selectedSecret: undefined,
  setSelectedSecretId: () => {},
  selectedSecretVersion: undefined,
  setSelectedSecretVersionId: () => {},
  selectSecretUp: () => {},
  selectSecretDown: () => {},
  createSecretVersion: () => {},
  copySecretProperties: () => {},
  clipboardProviding: null,
  clipboardProvideNext: () => {},
  clipboardDestroy: () => {},
});

export interface BrowseStateProviderProps {
  storeName: string;
  unlockedBy: Identity;
}

export const BrowseStateProvider: React.FC<
  PropsWithChildren<BrowseStateProviderProps>
> = ({ children, storeName, unlockedBy }) => {
  const errors = useContext(ErrorContext);
  const [editSecretVersion, setEditSecretVersion] = useState<
    SecretVersion | undefined
  >(undefined);
  const [secretListFilter, setSecretListFilter] = useState<SecretListFilter>(
    {},
  );
  const [selectedSecretId, setSelectedSecretId] = useState<string | null>(null);
  const [selectedSecretVersionId, setSelectedSecretVersionId] = useState<
    string | null
  >(null);

  const {
    data: secretList,
    isPending: secretListBusy,
    error: secretListError,
    refetch: refreshSecretList,
  } = useQuery({
    queryKey: [
      "listSecrets",
      storeName,
      secretListFilter.name,
      secretListFilter.type,
      secretListFilter.tag,
      secretListFilter.deleted,
    ],
    initialData: () => ({ entries: [], all_tags: [] }),
    queryFn: () => listSecrets(storeName, secretListFilter),
  });

  const {
    data: selectedSecret,
    isPending: secretBusy,
    error: secretError,
  } = useQuery({
    queryKey: ["getSecret", selectedSecretId],
    queryFn: async () => {
      if (!selectedSecretId) return null;
      return await getSecret(storeName, selectedSecretId);
    },
  });
  const {
    data: selectedSecretVersion,
    isPending: secretVersionBusy,
    error: secretVersionError,
  } = useQuery({
    queryKey: ["getSecretVersion", selectedSecretId, selectedSecretVersionId],
    queryFn: async () => {
      if (!selectedSecretVersionId) return null;
      return await getSecretVersion(storeName, selectedSecretVersionId);
    },
  });
  const addSecretMutation = useMutation({
    mutationFn: (secretVersion: SecretVersion) =>
      addSecretVersion(storeName, secretVersion),
    onSuccess: () => {
      refreshSecretList();
      setSelectedSecretVersionId(null);
      setEditSecretVersion(undefined);
    },
  });
  const { data: clipboardProviding, refetch: refreshClipboardProviding } =
    useQuery({
      queryKey: ["clipboardCurrentlyProviding"],
      initialData: () => null,
      queryFn: () => clipboardCurrentlyProviding(),
    });
  const clipboardCopyMutation = useMutation({
    mutationFn: async (properties: string[]) => {
      const secretVersionId =
        selectedSecretVersion?.id ?? selectedSecret?.current_block_id;
      if (!secretVersionId) return;
      await secretToClipboard(storeName, secretVersionId, properties);
    },
    onError: (err) => errors.addError(err.toString()),
    onSuccess: () => refreshClipboardProviding(),
  });
  const clipboardProvideNextMutation = useMutation({
    mutationFn: () => clipboardProvideNext(),
    onError: (err) => errors.addError(err.toString()),
    onSuccess: () => refreshClipboardProviding(),
  });
  const clipboardDestroyMutation = useMutation({
    mutationFn: () => clipboardDestroy(),
    onError: (err) => errors.addError(err.toString()),
    onSuccess: () => refreshClipboardProviding(),
  });
  useEffect(() => {
    secretListError && errors.addError(secretListError.toString());
    secretError && errors.addError(secretError.toString());
    secretVersionError && errors.addError(secretVersionError.toString());
  }, [secretListError, secretError, secretVersionError]);

  return (
    <BrowseStateContext.Provider
      value={{
        storeName,
        unlockedBy,
        listBusy: secretListBusy,
        detailsBusy:
          secretBusy || secretVersionBusy || addSecretMutation.isPending,
        editSecretVersion,
        setEditSecretVersion,
        secretListFilter,
        setSecretListFilterName(filter: string | undefined) {
          setSelectedSecretId(null);
          setSelectedSecretVersionId(null);
          setSecretListFilter({ ...secretListFilter, name: filter });
        },
        setSecretListFilterType(filter: SecretType | undefined) {
          setSelectedSecretId(null);
          setSelectedSecretVersionId(null);
          setSecretListFilter({ name: secretListFilter.name, type: filter });
        },
        setSecretListFilterTag(filter: string | undefined) {
          setSelectedSecretId(null);
          setSelectedSecretVersionId(null);
          setSecretListFilter({ name: secretListFilter.name, tag: filter });
        },
        setSecretListFilterDeleted(filter: boolean | undefined) {
          setSelectedSecretId(null);
          setSelectedSecretVersionId(null);
          setSecretListFilter({ name: secretListFilter.name, deleted: filter });
        },
        secretList,
        selectedSecret: selectedSecret ?? undefined,
        setSelectedSecretId,
        selectedSecretVersion: selectedSecretVersion ?? selectedSecret?.current,
        setSelectedSecretVersionId,
        selectSecretUp() {
          const idx = secretList.entries.findIndex(
            (match) => match.entry.id === selectedSecretId,
          );

          if (idx - 1 >= 0) {
            setSelectedSecretId(secretList.entries[idx - 1].entry.id);
          }
        },
        selectSecretDown() {
          const idx = secretList.entries.findIndex(
            (match) => match.entry.id === selectedSecretId,
          );

          if (idx + 1 < secretList.entries.length) {
            setSelectedSecretId(secretList.entries[idx + 1].entry.id);
          }
        },
        createSecretVersion(secretVersion: SecretVersion) {
          addSecretMutation.mutate(secretVersion);
        },
        copySecretProperties(properties: string[]) {
          clipboardCopyMutation.mutate(properties);
        },
        clipboardProviding,
        clipboardProvideNext() {
          clipboardProvideNextMutation.mutate();
        },
        clipboardDestroy() {
          clipboardDestroyMutation.mutate();
        },
      }}
    >
      {children}
    </BrowseStateContext.Provider>
  );
};
