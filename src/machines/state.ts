import { atom, DefaultValue, selector, useRecoilValue } from "recoil";
import { EN } from "../i18n/en";
import { Translations } from "../i18n/translations";
import { AppVersion, ClipboardProviding, getAppVersion, getDefaultStore, getSecret, getSecretVersion, identities, Identity, listSecrets, listStores, Secret, SecretList, SecretListFilter, SecretType, SecretVersion, Status, StoreConfig } from "./backend-tauri";
import moment from "moment";

export const translateState = atom<Translations>({
  key: "translate",
  default: EN,
})

export function useTranslate() {
  return useRecoilValue(translateState);
}

export const appVersionState = atom<AppVersion>({
  key: "appVersion",
  default: getAppVersion(),
});

export const errorState = atom<string | undefined>({
  key: "error",
  default: undefined,
});

export type MainPanel = "unlock" | "browse" | "config";

export const mainPanelState = atom<MainPanel>({
  key: "mainPanel",
  default: "unlock",
});

export const selectedStoreState = atom<string | null>({
  key: "selectedStore",
  default: getDefaultStore(),
});

export const statusState = atom<Status>({
  key: "status",
  default: {
    locked: true,
    autolock_timeout: 0,
    version: "",
  },
});

export const autolockInState = selector<{ autolockIn: number, autolockTimeout: number }>({
  key: "autolockIn",
  get: ({ get }) => {
    const status = get(statusState);
    if (status.locked) return { autolockIn: 0, autolockTimeout: 0 };

    const autoLockIn = moment(status.autolock_at).diff(moment()) / 1000.0;

    return { autolockIn: autoLockIn < 0 ? 0 : autoLockIn, autolockTimeout: status.autolock_timeout };
  },
  cachePolicy_UNSTABLE: { eviction: "most-recent" },
});

export const storeConfigsRequestIdState = atom<number>({
  key: "storeConfigsRequestId",
  default: 0,
});

export const identitiesState = selector<Identity[]>({
  key: "identities",
  get: ({ get }) => {
    const storeName = get(selectedStoreState);

    if (!storeName) return [];

    get(storeConfigsRequestIdState);

    return identities(storeName);
  },
  cachePolicy_UNSTABLE: { eviction: "most-recent" },
});

export const storeConfigsState = selector<StoreConfig[]>({
  key: "storeConfigs",
  get: ({ get }) => {
    get(storeConfigsRequestIdState);

    return listStores();
  },
  cachePolicy_UNSTABLE: { eviction: "most-recent" },
});

export const defaultStoreNameState = atom<string | null>({
  key: "defaultStoreName",
  default: getDefaultStore(),
})

export const secretListFilterState = atom<SecretListFilter | undefined>({
  key: "secretListFilter",
  default: undefined,
});

export const secretListFilterNameState = selector<string | undefined>({
  key: "secretListFilterName",
  get: ({ get }) => get(secretListFilterState)?.name,
  set: ({ set, reset }, name) => {
    reset(selectedSecretIdState);
    reset(selectedSecretVersionIdState);
    set(secretListFilterState, filter => ({
      ...filter,
      name: name instanceof DefaultValue ? undefined : name,
    }));
  },
  cachePolicy_UNSTABLE: { eviction: "most-recent" },
});

export const secretListFilterTypeState = selector<SecretType | undefined>({
  key: "secretListFilterType",
  get: ({ get }) => get(secretListFilterState)?.type,
  set: ({ set, reset }, secretType) => {
    reset(selectedSecretIdState);
    reset(selectedSecretVersionIdState);
    set(secretListFilterState, filter => ({
      name: filter?.name,
      type: secretType instanceof DefaultValue ? undefined : secretType,
    }));
  },
  cachePolicy_UNSTABLE: { eviction: "most-recent" },
});

export const secretListFilterTagState = selector<string | undefined>({
  key: "secretListFilterTag",
  get: ({ get }) => get(secretListFilterState)?.tag,
  set: ({ set, reset }, tag) => {
    reset(selectedSecretIdState);
    reset(selectedSecretVersionIdState);
    set(secretListFilterState, filter => ({
      name: filter?.name,
      tag: tag instanceof DefaultValue ? undefined : tag,
    }));
  },
  cachePolicy_UNSTABLE: { eviction: "most-recent" },
})

export const secretListFilterDeletedState = selector<boolean | undefined>({
  key: "secretListFilterDeleted",
  get: ({ get }) => get(secretListFilterState)?.deleted,
  set: ({ set, reset }, deleted) => {
    reset(selectedSecretIdState);
    reset(selectedSecretVersionIdState);
    set(secretListFilterState, filter => ({
      name: filter?.name,
      deleted: deleted instanceof DefaultValue ? undefined : deleted,
    }));
  },
  cachePolicy_UNSTABLE: { eviction: "most-recent" },
});

export const secretListRequestIdState = atom<number>({
  key: "secretListRequestId",
  default: 0,
});

export const secretListState = selector<SecretList>({
  key: "secretList",
  get: ({ get }) => {
    get(secretListRequestIdState);

    const storeName = get(selectedStoreState);

    if (!storeName) throw "No store";

    const filter = get(secretListFilterState);

    if(filter)
      return listSecrets(storeName, filter);
    else
      return {
        all_tags: [],
        entries: [],
      };
  },
  cachePolicy_UNSTABLE: { eviction: "most-recent" },
});

export const selectedSecretIdState = atom<string | undefined>({
  key: "selectedSecretId",
  default: undefined,
});

export const editSecretVersionState = atom<SecretVersion | undefined>({
  key: "editSecretId",
  default: undefined,
});

export const selectedSecretState = selector<Secret | undefined>({
  key: "selectedSecret",
  get: async ({ get }) => {
    get(secretListRequestIdState);
    const storeName = get(selectedStoreState);
    const secretId = get(selectedSecretIdState);

    if (!storeName || !secretId) return undefined;

    return await getSecret(storeName, secretId);
  },
  cachePolicy_UNSTABLE: { eviction: "most-recent" },
});

export const selectedSecretVersionIdState = atom<string | undefined>({
  key: "selectedSecretVersionId",
  default: undefined,
});

export const selectedSecretVersionState = selector<SecretVersion | undefined>({
  key: "selectedSecretVersion",
  get: async ({ get }) => {
    get(secretListRequestIdState);
    const secretVersionId = get(selectedSecretVersionIdState);

    if (!secretVersionId) {
      return get(selectedSecretState)?.current;
    }

    const storeName = get(selectedStoreState);

    return storeName ? await getSecretVersion(storeName, secretVersionId) : undefined;
  },
  cachePolicy_UNSTABLE: { eviction: "most-recent" },
});

export const clipboardProvidingState = atom<ClipboardProviding | null>({
  key: "clipboard",
  default: null,
});

export const zoomSecretPropertyState = atom<string | null>({
  key: "zoomSecretPropertyState",
  default: null,
});
