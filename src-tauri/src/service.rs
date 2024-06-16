use t_rust_less_lib::api::StoreConfig;

use crate::state::State;


#[tauri::command]
#[specta::specta]
pub fn service_list_stores(state: tauri::State<State>) -> Result<Vec<StoreConfig>, String> {
  state
    .inner()
    .get_service()?
    .list_stores()
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
#[specta::specta]
pub fn service_get_default_store(state: tauri::State<State>) -> Result<Option<String>, String> {
  state
    .inner()
    .get_service()?
    .get_default_store()
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
#[specta::specta]
pub fn service_set_default_store(store_name: String, state: tauri::State<State>) -> Result<(), String> {
  state
    .inner()
    .get_service()?
    .set_default_store(&store_name)
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
#[specta::specta]
pub fn service_upsert_store_config(store_config: StoreConfig, state: tauri::State<State>) -> Result<(), String> {  
  state
    .inner()
    .get_service()?
    .upsert_store_config(store_config)
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
#[specta::specta]
pub fn service_check_autolock(state: tauri::State<State>) -> Result<(), String> {
  state.inner().get_service()?.check_autolock();
  Ok(())
}
