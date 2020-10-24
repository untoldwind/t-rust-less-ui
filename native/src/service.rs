use crate::clipboard::JsClipboardControl;
use crate::errors::{OrThrow, ToJsResult};
use crate::store::JsStore;
use neon::prelude::*;
use std::sync::Arc;
use t_rust_less_lib::api::PasswordGeneratorParam;
use t_rust_less_lib::service::{create_service, TrustlessService, StoreConfig};

pub struct ServiceHandle {
  service: Arc<dyn TrustlessService>,
}

declare_types! {
  pub class JsService for ServiceHandle {
    init(_) {
      Ok(
        ServiceHandle {
          service: create_service().unwrap(),
        }
      )
    }

    method listStores(mut cx) {
      let this = cx.this();
      cx.borrow(&this, |handle| {
        handle.service.list_stores()
      }).to_js(&mut cx)
    }

    method upsertStoreConfig(mut cx) {
      let this = cx.this();
      let store_config : StoreConfig = {
        let arg = cx.argument::<JsValue>(0)?;
        neon_serde::from_value(&mut cx, arg)?
      };
      cx.borrow(&this, |handle| {
        handle.service.upsert_store_config(store_config)
      }).to_js(&mut cx)
    }

    method deleteStoreConfig(mut cx) {
      let this = cx.this();
      let store_name = cx.argument::<JsString>(0)?.value();
      cx.borrow(&this, |handle| {
        handle.service.delete_store_config(&store_name)
      }).to_js(&mut cx)
    }

    method getDefaultStore(mut cx) {
      let this = cx.this();
      cx.borrow(&this, |handle| {
        handle.service.get_default_store()
      }).to_js(&mut cx)
    }

    method openStore(mut cx) {
      let this = cx.this();
      let store_name = cx.argument::<JsString>(0)?.value();
      let store = cx.borrow(&this, |handle| {
        handle.service.open_store(&store_name)
      }).or_throw(&mut cx)?;

      let mut js_store = JsStore::new::<_, JsStore, _>(&mut cx, vec![])?;
      cx.borrow_mut(&mut js_store, |mut js_store| {
        js_store.store = Some(store);
      });

      Ok(js_store.upcast())
    }

    method secretToClipboard(mut cx) {
      let this = cx.this();
      let store_name = cx.argument::<JsString>(0)?.value();
      let secret_id = cx.argument::<JsString>(1)?.value();
      let properties: Vec<String> = {
        let arg = cx.argument::<JsValue>(2)?;
        neon_serde::from_value(&mut cx, arg)?
      };
      let properties_str : Vec<&str> = properties.iter().map(String::as_ref).collect();
      let display_name = cx.argument::<JsString>(3)?.value();
      let clipboard = cx.borrow(&this, |handle| {
          handle.service.secret_to_clipboard(&store_name, &secret_id, &properties_str, &display_name)
      }).or_throw(&mut cx)?;  
      
      let mut js_clipboard = JsClipboardControl::new::<_, JsClipboardControl, _>(&mut cx, vec![])?;
      cx.borrow_mut(&mut js_clipboard, |mut js_clipboard| {
        js_clipboard.clipboard = Some(clipboard);
      });  

      Ok(js_clipboard.upcast())
    }

    method generateId(mut cx) {
      let this = cx.this();

      cx.borrow(&this, |handle| {
        handle.service.generate_id()
      }).to_js(&mut cx)
    }

    method generatePassword(mut cx) {
      let this = cx.this();
      let arg0 = cx.argument::<JsValue>(0)?;
      let param : PasswordGeneratorParam = neon_serde::from_value(&mut cx, arg0)?;

      cx.borrow(&this, |handle| {
        handle.service.generate_password(param)
      }).to_js(&mut cx)
    }

    method checkAutolock(mut cx) {
      let this = cx.this();

      cx.borrow(&this, |handle| {
        handle.service.check_autolock();
      });

      Ok(cx.undefined().upcast())
    }
  }
}
