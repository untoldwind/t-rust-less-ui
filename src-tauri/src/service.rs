use std::sync::Arc;

use t_rust_less_lib::{
    api::StoreConfig,
    service::{secrets_provider::SecretsProvider, ServiceError},
};

use crate::clipboard_fallback::ClipboardFallback;
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

#[tauri::command]
#[specta::specta]
pub fn service_secret_to_clipboard(
    store_name: String,
    block_id: String,
    properties: Vec<String>,
    state: tauri::State<State>,
    app: tauri::AppHandle,
) -> Result<(), ServiceError> {
    state.inner().clear_clipboard()?;

    let properties_ref = properties.iter().map(AsRef::as_ref).collect::<Vec<&str>>();
    match state
        .inner()
        .get_service()?
        .secret_to_clipboard(&store_name, &block_id, &properties_ref)
    {
        Ok(clipboard_control) => state.inner().set_clipboard(clipboard_control)?,
        Err(ServiceError::NotAvailable) => {
            let store = state.inner().get_store(store_name.clone())?;
            let secret_version = store.get_version(&block_id)?;
            let secret_provider =
                SecretsProvider::new(store_name, block_id, secret_version, &properties_ref);
            let fallback = ClipboardFallback::new(app, secret_provider)?;
            state.inner().set_clipboard(Arc::new(fallback))?
        }
        Err(err) => return Err(err),
    }

    Ok(())
}
