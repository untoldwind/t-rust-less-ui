import { Dispatch } from "redux";
import { ServiceActionCreators } from "./service-action-creators";
import { expectStringList, sendCommand, expectOptionString } from "./backend";

export function doDismissError(dispatch: Dispatch): () => void {
  return () => {
    dispatch(ServiceActionCreators.dismissError.create(undefined));
  }
}

export function doListStores(dispatch: Dispatch): () => void {
  return () => {
    dispatch(ServiceActionCreators.listStoresStart.create(undefined));

    sendCommand("list_stores", expectStringList(
      success => dispatch(ServiceActionCreators.listStoresDone.create(success)),
      error => dispatch(ServiceActionCreators.setError.create(error))
    ));
  }
}

export function doGetDefaultStore(dispatch: Dispatch): (fallback: string) => void {
  return (fallback: string) => {
    sendCommand("get_default_store", expectOptionString(
      success => dispatch(ServiceActionCreators.selectStore.create(success || fallback)),
      error => dispatch(ServiceActionCreators.setError.create(error))
    ))
  }
}

export function doSelectStore(dispatch: Dispatch): (store_name: string) => void {
  return (store_name: string) => {
    dispatch(ServiceActionCreators.selectStore.create(store_name));
  }
}
