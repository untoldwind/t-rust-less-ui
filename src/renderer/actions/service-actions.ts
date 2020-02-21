import { Dispatch } from "redux";
import { ServiceActionCreators } from "./service-action-creators";
import { expectStringList, sendCommand, expectOptionString } from "./backend";
import { Actions } from "./actions";

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
