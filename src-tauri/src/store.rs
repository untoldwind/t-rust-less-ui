use t_rust_less_lib::{
    api::{Identity, Status},
    memguard::SecretBytes,
    service::ServiceError,
};

use crate::state::State;

#[tauri::command]
#[specta::specta]
pub fn store_status(
    store_name: String,
    state: tauri::State<State>,
) -> Result<Status, ServiceError> {
    Ok(state.inner().get_store(store_name)?.status()?)
}

#[tauri::command]
#[specta::specta]
pub fn store_identities(
    store_name: String,
    state: tauri::State<State>,
) -> Result<Vec<Identity>, ServiceError> {
    Ok(state.inner().get_store(store_name)?.identities()?)
}

#[tauri::command]
#[specta::specta]
pub fn store_lock(store_name: String, state: tauri::State<State>) -> Result<(), ServiceError> {
    state.inner().get_store(store_name)?.lock()?;
    state.inner().clear_clipboard()
}

#[tauri::command]
#[specta::specta]
pub fn store_unlock(
    store_name: String,
    identity_id: String,
    passphrase: String,
    state: tauri::State<State>,
) -> Result<(), ServiceError> {
    Ok(state
        .inner()
        .get_store(store_name)?
        .unlock(&identity_id, SecretBytes::from(passphrase))?)
}

#[tauri::command]
#[specta::specta]
pub fn store_add_identity(
    store_name: String,
    identity: Identity,
    passphrase: String,
    state: tauri::State<State>,
) -> Result<(), ServiceError> {
    Ok(state
        .inner()
        .get_store(store_name)?
        .add_identity(identity, SecretBytes::from(passphrase))?)
}
