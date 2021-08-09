use crate::errors::ToJsResult;
use neon::prelude::*;
use std::sync::Arc;
use t_rust_less_lib::api::{Identity, SecretListFilter, SecretVersion};
use t_rust_less_lib::memguard::SecretBytes;
use t_rust_less_lib::secrets_store::SecretsStore;

pub struct StoreHandle {
  pub store: Arc<dyn SecretsStore>,
}

impl Finalize for StoreHandle {}

pub fn store_status(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<StoreHandle>>(0)?;

  handle.store.status().to_js(&mut cx)
}

pub fn store_lock(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<StoreHandle>>(0)?;

  handle.store.lock().to_js(&mut cx)
}

pub fn store_unlock(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<StoreHandle>>(0)?;
  let identity_id = cx.argument::<JsString>(1)?.value(&mut cx);
  let passphrase = {
    let str = cx.argument::<JsString>(2)?.value(&mut cx);
    SecretBytes::from(str)
  };

  handle.store.unlock(&identity_id, passphrase).to_js(&mut cx)
}

pub fn store_identities(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<StoreHandle>>(0)?;

  handle.store.identities().to_js(&mut cx)
}

pub fn store_add_identity(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<StoreHandle>>(0)?;
  let identity: Identity = {
    let arg = cx.argument::<JsValue>(1)?;
    neon_serde::from_value(&mut cx, arg)?
  };
  let passphrase = {
    let str = cx.argument::<JsString>(2)?.value(&mut cx);
    SecretBytes::from(str)
  };

  handle.store.add_identity(identity, passphrase).to_js(&mut cx)
}

pub fn store_change_passphrase(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<StoreHandle>>(0)?;
  let passphrase = {
    let str = cx.argument::<JsString>(1)?.value(&mut cx);
    SecretBytes::from(str)
  };

  handle.store.change_passphrase(passphrase).to_js(&mut cx)
}

pub fn store_list(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<StoreHandle>>(0)?;
  let arg0 = cx.argument::<JsValue>(1)?;
  let filter: SecretListFilter = neon_serde::from_value(&mut cx, arg0)?;

  handle.store.list(&filter).to_js(&mut cx)
}

pub fn store_update_index(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<StoreHandle>>(0)?;

  handle.store.update_index().to_js(&mut cx)
}

pub fn store_add(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<StoreHandle>>(0)?;
  let secret_version: SecretVersion = {
    let arg = cx.argument::<JsValue>(1)?;
    neon_serde::from_value(&mut cx, arg)?
  };

  handle.store.add(secret_version).to_js(&mut cx)
}

pub fn store_get(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<StoreHandle>>(0)?;
  let secret_id = cx.argument::<JsString>(1)?.value(&mut cx);

  handle.store.get(&secret_id).to_js(&mut cx)
}

pub fn store_get_version(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<StoreHandle>>(0)?;
  let block_id = cx.argument::<JsString>(1)?.value(&mut cx);

  handle.store.get_version(&block_id).to_js(&mut cx)
}
