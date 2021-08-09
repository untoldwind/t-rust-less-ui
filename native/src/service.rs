use crate::clipboard::ClipboardHandle;
use crate::errors::{OrThrow, ToJsResult};
use crate::store::StoreHandle;
use neon::prelude::*;
use std::sync::Arc;
use t_rust_less_lib::api::{PasswordGeneratorParam, StoreConfig};
use t_rust_less_lib::service::{create_service, TrustlessService};
pub struct ServiceHandle {
  service: Arc<dyn TrustlessService>,
}

impl Finalize for ServiceHandle {}

pub fn service_create(mut cx: FunctionContext) -> JsResult<JsBox<ServiceHandle>> {
  match create_service() {
    Ok(service) => Ok(cx.boxed(ServiceHandle { service })),
    Err(err) => cx.throw_error(format!("{}", err)),
  }
}

pub fn service_list_stores(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<ServiceHandle>>(0)?;

  handle.service.list_stores().to_js(&mut cx)
}

pub fn service_upsert_store_config(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<ServiceHandle>>(0)?;
  let store_config: StoreConfig = {
    let arg = cx.argument::<JsValue>(1)?;
    neon_serde::from_value(&mut cx, arg)?
  };

  handle.service.upsert_store_config(store_config).to_js(&mut cx)
}

pub fn service_delete_store_config(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<ServiceHandle>>(0)?;
  let store_name = cx.argument::<JsString>(1)?.value(&mut cx);

  handle.service.delete_store_config(&store_name).to_js(&mut cx)
}

pub fn service_get_default_store(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<ServiceHandle>>(0)?;

  handle.service.get_default_store().to_js(&mut cx)
}

pub fn service_set_default_store(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<ServiceHandle>>(0)?;
  let store_name = cx.argument::<JsString>(1)?.value(&mut cx);

  handle.service.set_default_store(&store_name).to_js(&mut cx)
}

pub fn service_open_store(mut cx: FunctionContext) -> JsResult<JsBox<StoreHandle>> {
  let handle = cx.argument::<JsBox<ServiceHandle>>(0)?;
  let store_name = cx.argument::<JsString>(1)?.value(&mut cx);
  let store = handle.service.open_store(&store_name).or_throw(&mut cx)?;

  Ok(cx.boxed(StoreHandle { store }))
}

pub fn service_secret_to_clipboard(mut cx: FunctionContext) -> JsResult<JsBox<ClipboardHandle>> {
  let handle = cx.argument::<JsBox<ServiceHandle>>(0)?;
  let store_name = cx.argument::<JsString>(1)?.value(&mut cx);
  let secret_id = cx.argument::<JsString>(2)?.value(&mut cx);
  let properties: Vec<String> = {
    let arg = cx.argument::<JsValue>(3)?;
    neon_serde::from_value(&mut cx, arg)?
  };
  let properties_str: Vec<&str> = properties.iter().map(String::as_ref).collect();
  let display_name = cx.argument::<JsString>(4)?.value(&mut cx);
  let clipboard = handle
    .service
    .secret_to_clipboard(&store_name, &secret_id, &properties_str, &display_name)
    .or_throw(&mut cx)?;

  Ok(cx.boxed(ClipboardHandle { clipboard }))
}

pub fn service_generate_id(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<ServiceHandle>>(0)?;
  handle.service.generate_id().to_js(&mut cx)
}

pub fn service_generate_password(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<ServiceHandle>>(0)?;
  let arg0 = cx.argument::<JsValue>(1)?;
  let param: PasswordGeneratorParam = neon_serde::from_value(&mut cx, arg0)?;

  handle.service.generate_password(param).to_js(&mut cx)
}

pub fn service_check_autolock(mut cx: FunctionContext) -> JsResult<JsUndefined> {
  let handle = cx.argument::<JsBox<ServiceHandle>>(0)?;

  handle.service.check_autolock();

  Ok(cx.undefined())
}
