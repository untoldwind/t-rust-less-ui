use t_rust_less_lib::{api::StoreConfig, service::ServiceError};

use crate::state::State;

#[tauri::command]
#[specta::specta]
pub fn service_list_stores(state: tauri::State<State>) -> Result<Vec<StoreConfig>, ServiceError> {
    state.inner().get_service()?.list_stores()
}

#[tauri::command]
#[specta::specta]
pub fn service_get_default_store(
    state: tauri::State<State>,
) -> Result<Option<String>, ServiceError> {
    state.inner().get_service()?.get_default_store()
}

#[tauri::command]
#[specta::specta]
pub fn service_set_default_store(
    store_name: String,
    state: tauri::State<State>,
) -> Result<(), ServiceError> {
    state.inner().get_service()?.set_default_store(&store_name)
}

#[tauri::command]
#[specta::specta]
pub fn service_upsert_store_config(
    store_config: StoreConfig,
    state: tauri::State<State>,
) -> Result<(), ServiceError> {
    state
        .inner()
        .get_service()?
        .upsert_store_config(store_config)
}

#[tauri::command]
#[specta::specta]
pub fn service_check_autolock(state: tauri::State<State>) -> Result<(), ServiceError> {
    state.inner().get_service()?.check_autolock();
    Ok(())
}
