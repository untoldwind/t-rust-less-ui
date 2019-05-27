import { Dispatch } from "redux";
import { StoreActionCreators } from "./store-action-creators";
import { sendCommand, expectStatus, expectIdentities } from "./backend";
import { ServiceActionCreators } from "./service-action-creators";

export function doListIdentities(dispatch: Dispatch): (store_name: string) => void {
  return (store_name: string) => {
    dispatch(StoreActionCreators.listIdentitiesStart.create(undefined));

    sendCommand({ "list_identities": { store_name } }, expectIdentities(
      success => dispatch(StoreActionCreators.listIdentitiesDone.create(success)),
      error => dispatch(ServiceActionCreators.setError.create(error))
    ));
  }
}

export function doGetStatus(dispatch: Dispatch): (store_name: string) => void {
  return (store_name: string) => {
    dispatch(StoreActionCreators.statusStart.create(undefined));

    sendCommand({ "status": { store_name } }, expectStatus(
      success => dispatch(StoreActionCreators.statusDone.create(success)),
      error => dispatch(ServiceActionCreators.setError.create(error))
    ));
  }
}
