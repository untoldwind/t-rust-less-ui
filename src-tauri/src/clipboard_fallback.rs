use std::sync::RwLock;

use t_rust_less_lib::{
  api::ClipboardProviding,
  clipboard::SelectionProvider,
  service::{ClipboardControl, ServiceError, ServiceResult},
};
use tauri_plugin_clipboard_manager::ClipboardExt;

pub struct ClipboardFallback {
  app: tauri::AppHandle,
  provider: RwLock<Box<dyn SelectionProvider>>,
}

impl ClipboardFallback {
  pub fn new<T>(app: tauri::AppHandle, provider: T) -> ServiceResult<Self>
  where
    T: SelectionProvider + 'static,
  {
    let clipboard = ClipboardFallback {
      app,
      provider: RwLock::new(Box::new(provider)),
    };
    clipboard.push_current()?;

    Ok(clipboard)
  }

  fn push_current(&self) -> ServiceResult<()> {
    match self.provider.read()?.get_selection_value() {
      Some(secret) => self
        .app
        .clipboard()
        .write_text(secret.as_str())
        .map_err(|err| ServiceError::IO(format!("{err}")))?,
      _ => self
        .app
        .clipboard()
        .write_text("")
        .map_err(|err| ServiceError::IO(format!("{err}")))?,
    };
    Ok(())
  }
}

impl ClipboardControl for ClipboardFallback {
  fn is_done(&self) -> ServiceResult<bool> {
    Ok(self.provider.read()?.current_selection().is_none())
  }

  fn currently_providing(&self) -> ServiceResult<Option<ClipboardProviding>> {
    Ok(self.provider.read()?.current_selection())
  }

  fn provide_next(&self) -> ServiceResult<()> {
    {
      self.provider.write()?.next_selection();
    }
    self.push_current()
  }

  fn destroy(&self) -> ServiceResult<()> {
    self
      .app
      .clipboard()
      .write_text("")
      .map_err(|err| ServiceError::IO(format!("{err}")))?;
    Ok(())
  }
}
