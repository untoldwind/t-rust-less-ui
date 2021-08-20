use t_rust_less_lib::api::ClipboardProviding;

use crate::state::State;

#[tauri::command]
pub fn clipboard_currently_providing(state: tauri::State<State>) -> Result<Option<ClipboardProviding>, String> {
  match state.inner().get_clipboard()? {
    Some(clipboard) => clipboard.currently_providing().map_err(|err| format!("{}", err)),
    None => Ok(None),
  }
}

#[tauri::command]
pub fn clipboard_provide_next(state: tauri::State<State>) -> Result<Option<ClipboardProviding>, String> {
  match state.inner().get_clipboard()? {
    Some(clipboard) => {
      clipboard.provide_next().map_err(|err| format!("{}", err))?;
      clipboard.currently_providing().map_err(|err| format!("{}", err))
    }
    None => Ok(None),
  }
}

#[tauri::command]
pub fn clipboard_destroy(state: tauri::State<State>) -> Result<(), String> {
  state.inner().clear_clipboard()
}
