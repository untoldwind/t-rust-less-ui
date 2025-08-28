use crate::{clipboard_fallback::ClipboardFallback, state::State};
use log::error;
use std::{error::Error, sync::Arc};
use t_rust_less_lib::{
  api::{PasswordGeneratorParam, StoreConfig},
  service::{secrets_provider::SecretsProvider, ServiceError},
};

fn handle_error<E: Error>(err: E) -> String {
  error!("Service: {err}");
  format!("{err}")
}

#[tauri::command]
pub fn service_list_stores(state: tauri::State<State>) -> Result<Vec<StoreConfig>, String> {
  state.inner().get_service()?.list_stores().map_err(handle_error)
}

#[tauri::command]
pub fn service_get_default_store(state: tauri::State<State>) -> Result<Option<String>, String> {
  state.inner().get_service()?.get_default_store().map_err(handle_error)
}

#[tauri::command]
pub fn service_set_default_store(store_name: String, state: tauri::State<State>) -> Result<(), String> {
  state
    .inner()
    .get_service()?
    .set_default_store(&store_name)
    .map_err(handle_error)
}

#[tauri::command]
pub fn service_upsert_store_config(store_config: StoreConfig, state: tauri::State<State>) -> Result<(), String> {
  state
    .inner()
    .get_service()?
    .upsert_store_config(store_config)
    .map_err(handle_error)
}

#[tauri::command]
pub fn service_delete_store_config(store_name: String, state: tauri::State<State>) -> Result<(), String> {
  state
    .inner()
    .get_service()?
    .delete_store_config(&store_name)
    .map_err(handle_error)
}

#[tauri::command]
pub fn service_generate_id(state: tauri::State<State>) -> Result<String, String> {
  state.inner().get_service()?.generate_id().map_err(handle_error)
}

#[tauri::command]
pub fn service_generate_password(param: PasswordGeneratorParam, state: tauri::State<State>) -> Result<String, String> {
  state
    .inner()
    .get_service()?
    .generate_password(param)
    .map_err(handle_error)
}

#[tauri::command]
pub fn service_check_autolock(state: tauri::State<State>) -> Result<(), String> {
  state.inner().get_service()?.check_autolock();
  Ok(())
}

#[tauri::command]
pub fn service_secret_to_clipboard(
  store_name: String,
  block_id: String,
  properties: Vec<String>,
  state: tauri::State<State>,
  app: tauri::AppHandle,
) -> Result<(), String> {
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
      let secret_version = store.get_version(&block_id).map_err(handle_error)?;
      let secret_provider = SecretsProvider::new(store_name, block_id, secret_version, &properties_ref);
      let fallback = ClipboardFallback::new(app, secret_provider).map_err(handle_error)?;
      state.inner().set_clipboard(Arc::new(fallback))?
    }
    Err(err) => return Err(format!("{err}")),
  }

  Ok(())
}
