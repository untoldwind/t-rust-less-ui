use log::error;
use std::collections::HashMap;
use std::error::Error;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use t_rust_less_lib::secrets_store::SecretsStore;
#[cfg(target_os = "android")]
use t_rust_less_lib::service::config::LocalConfigProvider;
#[cfg(not(target_os = "android"))]
use t_rust_less_lib::service::create_service;
#[cfg(target_os = "android")]
use t_rust_less_lib::service::local::LocalTrustlessService;
use t_rust_less_lib::service::{ClipboardControl, ServiceError, ServiceResult, TrustlessService};
use tauri::{AppHandle, Manager};

pub struct State {
  data_path: Mutex<Option<PathBuf>>,
  service: Mutex<Option<Arc<dyn TrustlessService>>>,
  stores: Mutex<HashMap<String, Arc<dyn SecretsStore>>>,
  clipboard: Mutex<Option<Arc<dyn ClipboardControl>>>,
}

fn handle_error<E: Error>(err: E) -> String {
  error!("State: {err}");
  format!("{err}")
}

impl State {
  pub fn new() -> State {
    State {
      data_path: Mutex::new(None),
      service: Mutex::new(None),
      stores: Mutex::new(HashMap::new()),
      clipboard: Mutex::new(None),
    }
  }

  pub fn setup(&self, app: &AppHandle) -> ServiceResult<()> {
    let data_path = app
      .path()
      .app_local_data_dir()
      .map_err(|err| ServiceError::IO(format!("{err}")))?;

    let mut maybe_data_path = self.data_path.lock()?;
    maybe_data_path.replace(data_path.join("files"));
    Ok(())
  }

  pub fn get_service(&self) -> Result<Arc<dyn TrustlessService>, String> {
    let mut maybe_service = self.service.lock().map_err(handle_error)?;

    match maybe_service.as_ref() {
      Some(service) => Ok(service.clone()),
      None => {
        #[cfg(target_os = "android")]
        let service = {
          let data_file = self
            .data_path
            .lock()
            .map_err(handle_error)?
            .clone()
            .unwrap_or("/data/data/io.github.unotldwind/files".into());
          let config_file = data_file.join("config.toml");
          log::info!("Use config file: {:?}", config_file);
          Arc::new(LocalTrustlessService::new(LocalConfigProvider::new(config_file)).map_err(handle_error)?)
        };
        #[cfg(not(target_os = "android"))]
        let service = create_service().map_err(handle_error)?;
        *maybe_service = Some(service.clone());
        Ok(service)
      }
    }
  }

  pub fn get_store(&self, store_name: String) -> Result<Arc<dyn SecretsStore>, String> {
    let mut stores = self.stores.lock().map_err(handle_error)?;

    match stores.get(&store_name) {
      Some(store) => Ok(store.clone()),
      None => {
        let store = self.get_service()?.open_store(&store_name).map_err(handle_error)?;
        stores.insert(store_name, store.clone());
        Ok(store)
      }
    }
  }

  pub fn get_clipboard(&self) -> Result<Option<Arc<dyn ClipboardControl>>, String> {
    let maybe_clipboard = self.clipboard.lock().map_err(handle_error)?;

    Ok(maybe_clipboard.clone())
  }

  pub fn set_clipboard(&self, clipboard: Arc<dyn ClipboardControl>) -> Result<(), String> {
    let mut maybe_clipboard = self.clipboard.lock().map_err(handle_error)?;

    if let Some(prev_clipboard) = maybe_clipboard.take() {
      prev_clipboard.destroy().map_err(handle_error)?;
    }

    maybe_clipboard.replace(clipboard);

    Ok(())
  }

  pub fn clear_clipboard(&self) -> Result<(), String> {
    let mut maybe_clipboard = self.clipboard.lock().map_err(handle_error)?;

    if let Some(prev_clipboard) = maybe_clipboard.take() {
      prev_clipboard.destroy().map_err(handle_error)?;
    }

    Ok(())
  }
}
