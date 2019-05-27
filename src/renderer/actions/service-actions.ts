import { Dispatch } from "redux";
import { ServiceActionCreators } from "./service-action-creators";
import { expectStringList, sendCommand } from "./backend";

export function doListStores(dispatch: Dispatch): () => void {
  return () => {
    dispatch(ServiceActionCreators.listStoresStart.create(undefined));

    sendCommand("list_stores", expectStringList(
      success => dispatch(ServiceActionCreators.listStoresDone.create(success)),
      error => dispatch(ServiceActionCreators.setError.create(error))
    ));
  }
}

export function doSelectStore(dispatch: Dispatch): (store_name: string) => void {
  return (store_name: string) => {
    dispatch(ServiceActionCreators.selectStore.create(store_name));
  }
}