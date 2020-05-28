use crate::errors::{OrThrow, ToJsResult};
use crate::store::JsStore;
use neon::prelude::*;
use std::sync::Arc;
use t_rust_less_lib::service::{create_service, TrustlessService};

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

        method getDefaultStore(mut cx) {
            let this = cx.this();
            cx.borrow(&this, |handle| {
                handle.service.get_default_store()
            }).to_js(&mut cx)
        }

        method openStore(mut cx) {
            let this = cx.this();
            let arg0 = cx.argument::<JsValue>(0)?;
            let store_name : String = neon_serde::from_value(&mut cx, arg0)?;
            let store = cx.borrow(&this, |handle| {
                handle.service.open_store(&store_name)
            }).or_throw(&mut cx)?;

            let mut js_store = JsStore::new::<_, JsStore, _>(&mut cx, vec![])?;
            cx.borrow_mut(&mut js_store, |mut js_store| {
                js_store.store = Some(store);
            });

            Ok(js_store.upcast())
        }
    }
}
