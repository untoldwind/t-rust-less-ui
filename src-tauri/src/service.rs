use crate::state::State;
use t_rust_less_lib::api::{PasswordGeneratorParam, StoreConfig};

#[tauri::command]
pub fn service_list_stores(state: tauri::State<State>) -> Result<Vec<StoreConfig>, String> {
  state
    .inner()
    .get_service()?
    .list_stores()
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
pub fn service_get_default_store(state: tauri::State<State>) -> Result<Option<String>, String> {
  state
    .inner()
    .get_service()?
    .get_default_store()
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
pub fn service_set_default_store(store_name: String, state: tauri::State<State>) -> Result<(), String> {
  state
    .inner()
    .get_service()?
    .set_default_store(&store_name)
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
pub fn service_upsert_store_config(store_config: StoreConfig, state: tauri::State<State>) -> Result<(), String> {
  state
    .inner()
    .get_service()?
    .upsert_store_config(store_config)
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
pub fn service_delete_store_config(store_name: String, state: tauri::State<State>) -> Result<(), String> {
  state
    .inner()
    .get_service()?
    .delete_store_config(&store_name)
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
pub fn service_generate_id(state: tauri::State<State>) -> Result<String, String> {
  state
    .inner()
    .get_service()?
    .generate_id()
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
pub fn service_generate_password(param: PasswordGeneratorParam, state: tauri::State<State>) -> Result<String, String> {
  state
    .inner()
    .get_service()?
    .generate_password(param)
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
pub fn service_check_autolock(state: tauri::State<State>) -> Result<(), String> {
  state.inner().get_service()?.check_autolock();
  Ok(())
}
