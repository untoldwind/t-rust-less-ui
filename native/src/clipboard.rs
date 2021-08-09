use crate::errors::ToJsResult;
use neon::prelude::*;
use std::sync::Arc;
use t_rust_less_lib::service::ClipboardControl;

pub struct ClipboardHandle {
  pub clipboard: Arc<dyn ClipboardControl>,
}

impl Finalize for ClipboardHandle {}

pub fn clipboard_is_done(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<ClipboardHandle>>(0)?;

  handle.clipboard.is_done().to_js(&mut cx)
}

pub fn clipboard_currently_providing(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<ClipboardHandle>>(0)?;

  handle.clipboard.currently_providing().to_js(&mut cx)
}

pub fn clipboard_destroy(mut cx: FunctionContext) -> JsResult<JsValue> {
  let handle = cx.argument::<JsBox<ClipboardHandle>>(0)?;

  handle.clipboard.destroy().to_js(&mut cx)
}
