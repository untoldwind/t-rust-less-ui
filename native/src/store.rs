use crate::errors::ToJsResult;
use neon::prelude::*;
use std::sync::Arc;
use t_rust_less_lib::api::{Identity, SecretListFilter, SecretVersion};
use t_rust_less_lib::memguard::SecretBytes;
use t_rust_less_lib::secrets_store::SecretsStore;

pub struct StoreHandle {
    pub store: Option<Arc<dyn SecretsStore>>,
}

declare_types! {
    pub class JsStore for StoreHandle {
        init(_) {
            Ok(
                StoreHandle {
                    store: None,
                }
            )
        }

        method status(mut cx) {
            let this = cx.this();
            cx.borrow(&this, |handle| {
                handle.store.as_ref().map(|store| store.status())
            }).to_js(&mut cx)
        }

        method lock(mut cx) {
            let this = cx.this();
            cx.borrow(&this, |handle| {
                handle.store.as_ref().map(|store| store.lock())
            }).to_js(&mut cx)
        }

        method unlock(mut cx) {
            let this = cx.this();
            let identity_id = cx.argument::<JsString>(0)?.value();
            let passphrase = {
                let mut str = cx.argument::<JsString>(1)?.value();
                unsafe { SecretBytes::from(str.as_bytes_mut()) }
            };

            cx.borrow(&this, |handle| {
                handle.store.as_ref().map(|store| store.unlock(&identity_id, passphrase))
            }).to_js(&mut cx)
        }

        method identities(mut cx) {
            let this = cx.this();
            cx.borrow(&this, |handle| {
                handle.store.as_ref().map(|store| store.identities())
            }).to_js(&mut cx)
        }

        method addIdentity(mut cx) {
            let this = cx.this();
            let identity : Identity = {
                let arg = cx.argument::<JsValue>(0)?;
                neon_serde::from_value(&mut cx, arg)?
            };
            let passphrase = {
                let mut str = cx.argument::<JsString>(1)?.value();
                unsafe { SecretBytes::from(str.as_bytes_mut()) }
            };

            cx.borrow(&this, |handle| {
                handle.store.as_ref().map(|store| store.add_identity(identity, passphrase))
            }).to_js(&mut cx)
        }

        method changePassphrase(mut cx) {
            let this = cx.this();
            let passphrase = {
                let mut str = cx.argument::<JsString>(0)?.value();
                unsafe { SecretBytes::from(str.as_bytes_mut()) }
            };

            cx.borrow(&this, |handle| {
                handle.store.as_ref().map(|store| store.change_passphrase(passphrase))
            }).to_js(&mut cx)
        }

        method list(mut cx) {
            let this = cx.this();
            let arg0 = cx.argument::<JsValue>(0)?;
            let filter : SecretListFilter = neon_serde::from_value(&mut cx, arg0)?;

            cx.borrow(&this, |handle| {
                handle.store.as_ref().map(|store| store.list(&filter))
            }).to_js(&mut cx)
        }

        method updateIndex(mut cx) {
            let this = cx.this();

            cx.borrow(&this, |handle| {
                handle.store.as_ref().map(|store| store.update_index())
            }).to_js(&mut cx)
        }

        method add(mut cx) {
            let this = cx.this();
            let secret_version : SecretVersion = {
                let arg = cx.argument::<JsValue>(0)?;
                neon_serde::from_value(&mut cx, arg)?
            };

            cx.borrow(&this, |handle| {
                handle.store.as_ref().map(|store| store.add(secret_version))
            }).to_js(&mut cx)
        }

        method get(mut cx) {
            let this = cx.this();
            let secret_id = cx.argument::<JsString>(0)?.value();

            cx.borrow(&this, |handle| {
                handle.store.as_ref().map(|store| store.get(&secret_id))
            }).to_js(&mut cx)
        }

        method getVersion(mut cx) {
            let this = cx.this();
            let block_id = cx.argument::<JsString>(0)?.value();

            cx.borrow(&this, |handle| {
                handle.store.as_ref().map(|store| store.get_version(&block_id))
            }).to_js(&mut cx)
        }
    }
}
