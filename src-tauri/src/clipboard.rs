use log::error;
use std::error::Error;
use t_rust_less_lib::api::ClipboardProviding;

use crate::state::State;

fn handle_error<E: Error>(err: E) -> String {
  error!("State: {err}");
  format!("{err}")
}

#[tauri::command]
pub fn clipboard_currently_providing(state: tauri::State<State>) -> Result<Option<ClipboardProviding>, String> {
  match state.inner().get_clipboard()? {
    Some(clipboard) => clipboard.currently_providing().map_err(handle_error),
    None => Ok(None),
  }
}

#[tauri::command]
pub fn clipboard_provide_next(state: tauri::State<State>) -> Result<Option<ClipboardProviding>, String> {
  match state.inner().get_clipboard()? {
    Some(clipboard) => {
      clipboard.provide_next().map_err(handle_error)?;
      clipboard.currently_providing().map_err(handle_error)
    }
    None => Ok(None),
  }
}

#[tauri::command]
pub fn clipboard_destroy(state: tauri::State<State>) -> Result<(), String> {
  state.inner().clear_clipboard()
}
