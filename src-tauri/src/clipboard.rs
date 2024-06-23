use t_rust_less_lib::{api::ClipboardProviding, service::ServiceError};

use crate::state::State;

#[tauri::command]
#[specta::specta]
pub fn clipboard_currently_providing(
    state: tauri::State<State>,
) -> Result<Option<ClipboardProviding>, ServiceError> {
    match state.inner().get_clipboard()? {
        Some(clipboard) => clipboard.currently_providing(),
        None => Ok(None),
    }
}

#[tauri::command]
#[specta::specta]
pub fn clipboard_provide_next(
    state: tauri::State<State>,
) -> Result<Option<ClipboardProviding>, ServiceError> {
    match state.inner().get_clipboard()? {
        Some(clipboard) => {
            clipboard.provide_next()?;
            clipboard.currently_providing()
        }
        None => Ok(None),
    }
}

#[tauri::command]
#[specta::specta]
pub fn clipboard_destroy(state: tauri::State<State>) -> Result<(), ServiceError> {
    state.inner().clear_clipboard()
}
