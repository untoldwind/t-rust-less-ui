import { Dispatch } from "redux";
import { ServiceActionCreators } from "./service-action-creators";
import { expectStringList, sendCommand, expectOptionString, expectSuccess } from "./backend";
import { Actions } from "./actions";

declare global {
  interface Window {
    displayName: string
  }
}

export function doDismissError(dispatch: Dispatch<Actions>): () => void {
  return () => {
    dispatch(ServiceActionCreators.dismissError.create(undefined));
  }
}

export function doListStores(dispatch: Dispatch<Actions>): () => void {
  return () => {
    dispatch(ServiceActionCreators.listStoresStart.create(undefined));

    sendCommand("list_stores", expectStringList(
      success => dispatch(ServiceActionCreators.listStoresDone.create(success)),
      error => dispatch(ServiceActionCreators.setError.create(error))
    ));
  }
}

export function doGetDefaultStore(dispatch: Dispatch<Actions>): (fallback: string) => void {
  return (fallback: string) => {
    sendCommand("get_default_store", expectOptionString(
      success => dispatch(ServiceActionCreators.selectStore.create(success || fallback)),
      error => dispatch(ServiceActionCreators.setError.create(error))
    ))
  }
}

export function doSelectStore(dispatch: Dispatch<Actions>): (store_name: string) => void {
  return (store_name: string) => {
    dispatch(ServiceActionCreators.selectStore.create(store_name));
  }
}

export function doSecretToClipboard(dispatch: Dispatch<Actions>): (store_name: string, secret_id: string, properties: string[]) => void {
  return (store_name: string, secret_id: string, properties: string[]) => {
    sendCommand({ "secret_to_clipboard": { store_name, secret_id, properties, display_name: window.displayName } }, expectSuccess(
      () => { },
      error => dispatch(ServiceActionCreators.setError.create(error))
    ))
  }
}