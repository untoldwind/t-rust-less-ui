use t_rust_less_lib::{api::{Identity, Status}, memguard::SecretBytes};

use crate::state::State;

#[tauri::command]
#[specta::specta]
pub fn store_status(store_name: String, state: tauri::State<State>) -> Result<Status, String> {
  state
    .inner()
    .get_store(store_name)?
    .status()
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
#[specta::specta]
pub fn store_identities(store_name: String, state: tauri::State<State>) -> Result<Vec<Identity>, String> {
  state
    .inner()
    .get_store(store_name)?
    .identities()
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
#[specta::specta]
pub fn store_lock(store_name: String, state: tauri::State<State>) -> Result<(), String> {
  state
    .inner()
    .get_store(store_name)?
    .lock()
    .map_err(|err| format!("{}", err))?;
  state.inner().clear_clipboard()
}

#[tauri::command]
#[specta::specta]
pub fn store_unlock(
  store_name: String,
  identity_id: String,
  passphrase: String,
  state: tauri::State<State>,
) -> Result<(), String> {
  state
    .inner()
    .get_store(store_name)?
    .unlock(&identity_id, SecretBytes::from(passphrase))
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
#[specta::specta]
pub fn store_add_identity(
  store_name: String,
  identity: Identity,
  passphrase: String,
  state: tauri::State<State>,
) -> Result<(), String> {
  state
    .inner()
    .get_store(store_name)?
    .add_identity(identity, SecretBytes::from(passphrase))
    .map_err(|err| format!("{}", err))
}
