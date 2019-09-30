import { Dispatch } from "redux";
import { StoreActionCreators } from "./store-action-creators";
import { sendCommand, expectStatus, expectIdentities, expectSuccess, expectSecretList, expectSecret } from "./backend";
import { ServiceActionCreators } from "./service-action-creators";
import { SecretListFilter, SecretList, Secret } from "../../common/model";
import { debounce } from "../helpers/debounce";

export function doListIdentities(dispatch: Dispatch): (store_name: string) => void {
  return (store_name: string) => {
    dispatch(StoreActionCreators.listIdentitiesStart.create(undefined));

    sendCommand({ list_identities: { store_name } }, expectIdentities(
      success => dispatch(StoreActionCreators.listIdentitiesDone.create(success)),
      error => dispatch(ServiceActionCreators.setError.create(error))
    ));
  }
}

let getStatusInProgress: boolean = false;

export function doGetStatus(dispatch: Dispatch): (store_name: string) => void {
  return (store_name: string) => {
    if (!getStatusInProgress) {
      getStatusInProgress = true;
      sendCommand({ status: { store_name } }, expectStatus(
        success => {
          dispatch(StoreActionCreators.setStatus.create(success));
          getStatusInProgress = false;
        },
        error => {
          dispatch(ServiceActionCreators.setError.create(error));
          getStatusInProgress = false;
        }
      ));
    }
  }
}

export function doLockStore(dispatch: Dispatch): (store_name: string) => void {
  return (store_name: string) => {
    sendCommand({ lock: { store_name } }, expectSuccess(
      () => doGetStatus(dispatch)(store_name),
      error => dispatch(ServiceActionCreators.setError.create(error))
    ));
  }
}

export function doUnlockStore(dispatch: Dispatch): (store_name: string, identity_id: string, passphrase: string) => void {
  return (store_name: string, identity_id: string, passphrase: string) => {
    sendCommand({ unlock: { store_name, identity_id, passphrase } }, expectSuccess(
      () => doGetStatus(dispatch)(store_name),
      error => dispatch(ServiceActionCreators.setError.create(error))
    ))
  }
}

export function doUpdateSecretList(dispatch: Dispatch): (store_name: string, filter: SecretListFilter) => void {
  return debounce((store_name: string, filter: SecretListFilter) => {
    dispatch(StoreActionCreators.listEntriesStart.create(undefined));

    sendCommand({ "list_secrets": { store_name, filter } }, expectSecretList(
      success => dispatch(StoreActionCreators.listEntriesDone.create(success)),
      error => dispatch(ServiceActionCreators.setError.create(error))
    ))
  }, 100)
}

let expected_secret_id: string | null = null;

export function doSelectEntry(dispatch: Dispatch): (store_name: string, secret_id: string) => void {
  return (store_name: string, secret_id: string) => {
    expected_secret_id = secret_id;
    sendCommand({ "get_secret": { store_name, secret_id } }, expectSecret(
      success => {
        if (expected_secret_id === success.id) dispatch(StoreActionCreators.setCurrentSecret.create(success))
      },
      error => dispatch(ServiceActionCreators.setError.create(error))
    ))
  }
}

export function doSelectUp(dispatch: Dispatch): (store_name: string, secret_list: SecretList, current_secret: Secret | null) => void {
  return (store_name: string, secret_list: SecretList, current_secret: Secret | null) => {
    if (secret_list.entries.length === 0) return;

    const current_index = current_secret ? secret_list.entries.findIndex(entry => entry.entry.id === current_secret.id) : -1;
    if (current_index < 1) {
      const last = secret_list.entries[secret_list.entries.length - 1].entry;

      doSelectEntry(dispatch)(store_name, last.id);
    } else {
      const prev = secret_list.entries[current_index - 1].entry;

      doSelectEntry(dispatch)(store_name, prev.id);
    }
  }
}

export function doSelectDown(dispatch: Dispatch): (store_name: string, secret_list: SecretList, current_secret: Secret | null) => void {
  return (store_name: string, secret_list: SecretList, current_secret: Secret | null) => {
    if (secret_list.entries.length === 0) return;
    const current_index = current_secret ? secret_list.entries.findIndex(entry => entry.entry.id === current_secret.id) : -1;
    if (current_index < 0 || current_index >= secret_list.entries.length - 1) {
      const first = secret_list.entries[0].entry;

      doSelectEntry(dispatch)(store_name, first.id);
    } else {
      const next = secret_list.entries[current_index + 1].entry;

      doSelectEntry(dispatch)(store_name, next.id);
    }
  }
}

export function doUpdateListFilter(dispatch: Dispatch): (filter: SecretListFilter) => void {
  return (filter: SecretListFilter) => {
    dispatch(StoreActionCreators.setListFilter.create(filter))
  }
}
