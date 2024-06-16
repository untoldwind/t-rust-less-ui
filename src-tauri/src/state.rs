use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use t_rust_less_lib::secrets_store::SecretsStore;
use t_rust_less_lib::service::{create_service, ClipboardControl, ServiceError, TrustlessService};

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

    pub fn get_service(&self) -> Result<Arc<dyn TrustlessService>, ServiceError> {
        let mut maybe_service = self.service.lock()?;

        match maybe_service.as_ref() {
            Some(service) => Ok(service.clone()),
            None => {
                let service = create_service()?;
                *maybe_service = Some(service.clone());
                Ok(service)
            }
        }
    }

    pub fn get_store(&self, store_name: String) -> Result<Arc<dyn SecretsStore>, ServiceError> {
        let mut stores = self.stores.lock()?;

        match stores.get(&store_name) {
            Some(store) => Ok(store.clone()),
            None => {
                let store = self.get_service()?.open_store(&store_name)?;
                stores.insert(store_name, store.clone());
                Ok(store)
            }
        }
    }

    pub fn get_clipboard(&self) -> Result<Option<Arc<dyn ClipboardControl>>, ServiceError> {
        let maybe_clipboard = self.clipboard.lock()?;

        Ok(maybe_clipboard.clone())
    }

    pub fn set_clipboard(&self, clipboard: Arc<dyn ClipboardControl>) -> Result<(), ServiceError> {
        let mut maybe_clipboard = self.clipboard.lock()?;

        if let Some(prev_clipboard) = maybe_clipboard.take() {
            prev_clipboard.destroy()?;
        }

        maybe_clipboard.replace(clipboard);

        Ok(())
    }

    pub fn clear_clipboard(&self) -> Result<(), ServiceError> {
        let mut maybe_clipboard = self.clipboard.lock()?;

        if let Some(prev_clipboard) = maybe_clipboard.take() {
            prev_clipboard.destroy()?;
        }

        Ok(())
    }
}
