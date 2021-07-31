use crate::state::State;
use t_rust_less_lib::api::{Identity, Secret, SecretList, SecretListFilter, SecretVersion, Status};
use t_rust_less_lib::memguard::SecretBytes;

#[tauri::command]
pub fn store_status(store_name: String, state: tauri::State<State>) -> Result<Status, String> {
  state
    .inner()
    .get_store(store_name)?
    .status()
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
pub fn store_identities(store_name: String, state: tauri::State<State>) -> Result<Vec<Identity>, String> {
  state
    .inner()
    .get_store(store_name)?
    .identities()
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
pub fn store_lock(store_name: String, state: tauri::State<State>) -> Result<(), String> {
  state
    .inner()
    .get_store(store_name)?
    .lock()
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
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

#[tauri::command]
pub fn store_change_passphrase(
  store_name: String,
  passphrase: String,
  state: tauri::State<State>,
) -> Result<(), String> {
  state
    .inner()
    .get_store(store_name)?
    .change_passphrase(SecretBytes::from(passphrase))
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
pub fn store_list(
  store_name: String,
  filter: SecretListFilter,
  state: tauri::State<State>,
) -> Result<SecretList, String> {
  state
    .inner()
    .get_store(store_name)?
    .list(&filter)
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
pub fn store_get(store_name: String, secret_id: String, state: tauri::State<State>) -> Result<Secret, String> {
  state
    .inner()
    .get_store(store_name)?
    .get(&secret_id)
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
pub fn store_get_version(
  store_name: String,
  block_id: String,
  state: tauri::State<State>,
) -> Result<SecretVersion, String> {
  state
    .inner()
    .get_store(store_name)?
    .get_version(&block_id)
    .map_err(|err| format!("{}", err))
}

#[tauri::command]
pub fn store_add(
  store_name: String,
  secret_version: SecretVersion,
  state: tauri::State<State>,
) -> Result<String, String> {
  let store = state.inner().get_store(store_name)?;
  let secret_version_id = store.add(secret_version).map_err(|err| format!("{}", err))?;

  store.update_index().map_err(|err| format!("{}", err))?;

  Ok(secret_version_id)
}
