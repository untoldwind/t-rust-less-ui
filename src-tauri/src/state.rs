use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use t_rust_less_lib::secrets_store::SecretsStore;
use t_rust_less_lib::service::{create_service, ClipboardControl, TrustlessService};

pub struct State {
  service: Mutex<Option<Arc<dyn TrustlessService>>>,
  stores: Mutex<HashMap<String, Arc<dyn SecretsStore>>>,
  clipboard: Mutex<Option<Arc<dyn ClipboardControl>>>,
}

impl State {
  pub fn new() -> State {
    State {
      service: Mutex::new(None),
      stores: Mutex::new(HashMap::new()),
      clipboard: Mutex::new(None),
    }
  }

  pub fn get_service(&self) -> Result<Arc<dyn TrustlessService>, String> {
    let mut maybe_service = self.service.lock().map_err(|err| format!("{}", err))?;

    match maybe_service.as_ref() {
      Some(service) => Ok(service.clone()),
      None => {
        let service = create_service().map_err(|err| format!("{}", err))?;
        *maybe_service = Some(service.clone());
        Ok(service)
      }
    }
  }

  pub fn get_store(&self, store_name: String) -> Result<Arc<dyn SecretsStore>, String> {
    let mut stores = self.stores.lock().map_err(|err| format!("{}", err))?;

    match stores.get(&store_name) {
      Some(store) => Ok(store.clone()),
      None => {
        let store = self
          .get_service()?
          .open_store(&store_name)
          .map_err(|err| format!("{}", err))?;
        stores.insert(store_name, store.clone());
        Ok(store)
      }
    }
  }

  pub fn get_clipboard(&self) -> Result<Option<Arc<dyn ClipboardControl>>, String> {
    let maybe_clipboard = self.clipboard.lock().map_err(|err| format!("{}", err))?;

    Ok(maybe_clipboard.clone())
  }

  pub fn set_clipboard(&self, clipboard: Arc<dyn ClipboardControl>) -> Result<(), String> {
    let mut maybe_clipboard = self.clipboard.lock().map_err(|err| format!("{}", err))?;

    if let Some(prev_clipboard) = maybe_clipboard.take() {
      prev_clipboard.destroy().map_err(|err| format!("{}", err))?;
    }

    maybe_clipboard.replace(clipboard);

    Ok(())
  }

  pub fn clear_clipboard(&self) -> Result<(), String> {
    let mut maybe_clipboard = self.clipboard.lock().map_err(|err| format!("{}", err))?;

    if let Some(prev_clipboard) = maybe_clipboard.take() {
      prev_clipboard.destroy().map_err(|err| format!("{}", err))?;
    }

    Ok(())
  }
}
