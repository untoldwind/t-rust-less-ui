import { useEffect, useState } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import moment from "moment";
import { checkAutolock, lock, unlock, status, setDefaultStore, StoreConfig, upsertStoreConfig, Identity, addIdentity, generateId, SecretType, addSecretVersion, secretToClipboard, clipboardDestroy, clipboardCurrentlyProviding, ClipboardProviding } from "./backend-tauri";
import { clipboardProvidingState, defaultStoreNameState, editSecretVersionState, errorState, mainPanelState, secretListFilterState, secretListRequestIdState, secretListState, selectedSecretIdState, selectedSecretState, selectedSecretVersionIdState, selectedSecretVersionState, selectedStoreState, statusState, storeConfigsRequestIdState } from "./state";

export function useStatusRefresh() {
  const refreshStatus = useRecoilCallback(({ set, reset, snapshot }) => async () => {
    const selectedStore = await snapshot.getPromise(selectedStoreState);

    await checkAutolock();

    if (!selectedStore) {
      reset(statusState);
      return;
    }

    const nextStatus = await status(selectedStore);

    if (nextStatus.locked) {
      set(mainPanelState, current => current === "browse" ? "unlock" : current);
    } else if (!nextStatus.locked) {
      set(mainPanelState, current => current === "unlock" ? "browse" : current);
    }
    set(statusState, nextStatus);
    set(clipboardProvidingState, await clipboardCurrentlyProviding())
  });

  useEffect(() => {
    refreshStatus();
    const timerId = setInterval(refreshStatus, 1000);
    return () => clearInterval(timerId);
  }, [refreshStatus]);
}

export function useUpdateDefaultStoreName(): (storeName: string) => void {
  return useRecoilCallback<[string], void>(({ set }) => async (storeName) => {
    await setDefaultStore(storeName);
    set(defaultStoreNameState, storeName);
  });
}

export function useUpsertStoreConfig(): (storeConfig: StoreConfig) => void {
  return useRecoilCallback<[StoreConfig], void>(({ set }) => async (storeConfig) => {
    await upsertStoreConfig(storeConfig);
    set(storeConfigsRequestIdState, current => current + 1);
  });
}

export function useAddIdentity(): (identity: Identity, passphrase: string) => void {
  return useRecoilCallback<[Identity, string], void>(({ set, snapshot }) => async (identity, passphrase) => {
    const selectedStore = await snapshot.getPromise(selectedStoreState);

    if (!selectedStore) return;

    await addIdentity(selectedStore, identity, passphrase);
    set(storeConfigsRequestIdState, current => current + 1);
  });
};

export function useTryUnlock(): [(identityId: string, passphrase: string) => void, boolean] {
  const [unlocking, setUnlocking] = useState(false);
  return [useRecoilCallback<[string, string], void>(({ set, reset, snapshot }) => async (identityId, passphrase) => {
    const storeName = await snapshot.getPromise(selectedStoreState);
    if (!storeName) return;
    setUnlocking(true);
    try {
      await unlock(storeName, identityId, passphrase);
      set(statusState, await status(storeName));
      set(mainPanelState, "browse");
      reset(secretListFilterState);
      reset(selectedSecretIdState);
      reset(selectedSecretVersionIdState);
      reset(editSecretVersionState);
    } catch (err: any) {
      set(errorState, err.toString());
    } finally {
      setUnlocking(false);
    }
  }), unlocking];
}

export function useLock(): () => void {
  return useRecoilCallback(({ set, reset, snapshot }) => async () => {
    const storeName = await snapshot.getPromise(selectedStoreState);
    if (!storeName) return;
    try {
      await lock(storeName);
      await clipboardDestroy();
      set(statusState, await status(storeName));
      set(mainPanelState, "unlock");
      reset(secretListFilterState);
      reset(selectedSecretIdState);
      reset(selectedSecretVersionIdState);
      reset(editSecretVersionState);
    } catch (err: any) {
      set(errorState, err.toString());
    }
  });
}

export function useSecretNavigate(): { secretUp: () => void, secretDown: () => void } {
  const secretUp = useRecoilCallback(({ set, reset, snapshot }) => async () => {
    const [secretList, selectedSecretId] = await Promise.all([snapshot.getPromise(secretListState), snapshot.getPromise(selectedSecretIdState)]);
    const idx = secretList.entries.findIndex(match => match.entry.id === selectedSecretId);

    if (idx - 1 >= 0) {
      set(selectedSecretIdState, secretList.entries[idx - 1].entry.id);
      reset(selectedSecretVersionIdState);
    }
  });
  const secretDown = useRecoilCallback(({ set, reset, snapshot }) => async () => {
    const [secretList, selectedSecretId] = await Promise.all([snapshot.getPromise(secretListState), snapshot.getPromise(selectedSecretIdState)]);
    const idx = secretList.entries.findIndex(match => match.entry.id === selectedSecretId);

    if (idx + 1 < secretList.entries.length) {
      set(selectedSecretIdState, secretList.entries[idx + 1].entry.id);
      reset(selectedSecretVersionIdState);
    }
  });

  return { secretUp, secretDown };
}

export function useCreateSecret(): (secretType: SecretType) => void {
  return useRecoilCallback<[SecretType], void>(({ set, snapshot }) => async (secretType) => {
    const status = await snapshot.getPromise(statusState);

    if (status.locked) return;

    const secret_id = await generateId();

    set(editSecretVersionState, {
      secret_id,
      type: secretType,
      name: "",
      timestamp: moment().format(),
      tags: [],
      urls: [],
      properties: {},
      deleted: false,
      attachments: [],
      recipients: [status.unlocked_by.id],
    });
  });
}

export function useAddSecretVersion(): () => void {
  return useRecoilCallback(({ set, snapshot }) => async () => {
    const currentSecretVersion = await snapshot.getPromise(selectedSecretVersionState);

    if (!currentSecretVersion) return;

    set(editSecretVersionState, {
      ...currentSecretVersion,
      timestamp: moment().format(),
    });
  });
}

export function useToggleArchiveSecret(): () => void {
  return useRecoilCallback(({ set, snapshot }) => async () => {
    const [storeName, currentSecret] = await Promise.all([snapshot.getPromise(selectedStoreState), snapshot.getPromise(selectedSecretState)]);

    if (!storeName || !currentSecret) return;

    try {
      await addSecretVersion(storeName, {
        ...currentSecret.current,
        timestamp: moment().format(),
        deleted: !currentSecret.current.deleted,
      })
    } catch (error: any) {
      set(errorState, error.toString());
    }
    set(secretListRequestIdState, current => current + 1);
  });
}

export function useStoreSecretVersion(): () => void {
  return useRecoilCallback(({ set, snapshot }) => async () => {
    const [storeName, editSecretVersion] = await Promise.all([snapshot.getPromise(selectedStoreState), snapshot.getPromise(editSecretVersionState)]);

    if (!storeName || !editSecretVersion) return;

    try {
      await addSecretVersion(storeName, editSecretVersion);
    } catch (error: any) {
      set(errorState, error.toString());
    }
    set(secretListRequestIdState, current => current + 1);
  });
}

export function useCopySecretProperties(): (properties: string[]) => void {
  return useRecoilCallback<[string[]], void>(({ set, snapshot }) => async (properties) => {
    if (properties.length === 0) return;

    const [storeName, currentSecretVersionId, currentSecret] = await Promise.all([snapshot.getPromise(selectedStoreState), snapshot.getPromise(selectedSecretVersionIdState), snapshot.getPromise(selectedSecretState)]);

    if (!storeName || !currentSecret) return;

    await secretToClipboard(storeName, currentSecretVersionId ?? currentSecret.current_block_id, properties);

    set(clipboardProvidingState, await clipboardCurrentlyProviding());
  });
}

export function useClipboardControl(): [ClipboardProviding | null, () => void, () => void] {
  return [
    useRecoilValue(clipboardProvidingState),
    useRecoilCallback<[], void>(({ }) => async () => {
    }),
    useRecoilCallback<[], void>(({ set }) => async () => {
      await clipboardDestroy();

      set(clipboardProvidingState, null);
    }),
  ]
}