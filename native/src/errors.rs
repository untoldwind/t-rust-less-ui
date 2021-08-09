use neon::prelude::*;
use t_rust_less_lib::secrets_store::SecretStoreResult;
use t_rust_less_lib::service::ServiceResult;

pub trait OrThrow<T> {
  fn or_throw<'b, C: Context<'b>>(self, cx: &mut C) -> NeonResult<T>;
}

impl<T> OrThrow<T> for ServiceResult<T> {
  fn or_throw<'b, C: Context<'b>>(self, cx: &mut C) -> NeonResult<T> {
    match self {
      Ok(value) => Ok(value),
      Err(err) => cx.throw_error(format!("{}", err)),
    }
  }
}

impl<T> OrThrow<T> for SecretStoreResult<T> {
  fn or_throw<'b, C: Context<'b>>(self, cx: &mut C) -> NeonResult<T> {
    match self {
      Ok(value) => Ok(value),
      Err(err) => cx.throw_error(format!("{}", err)),
    }
  }
}

pub trait ToJsResult {
  fn to_js<'b, C: Context<'b>>(self, cx: &mut C) -> JsResult<'b, JsValue>;
}

impl<T> ToJsResult for ServiceResult<T>
where
  T: serde::Serialize,
{
  fn to_js<'b, C: Context<'b>>(self, cx: &mut C) -> JsResult<'b, JsValue> {
    match self {
      Ok(value) => Ok(neon_serde::to_value(cx, &value)?),
      Err(err) => cx.throw_error(format!("{}", err)),
    }
  }
}

impl<T> ToJsResult for SecretStoreResult<T>
where
  T: serde::Serialize,
{
  fn to_js<'b, C: Context<'b>>(self, cx: &mut C) -> JsResult<'b, JsValue> {
    match self {
      Ok(value) => Ok(neon_serde::to_value(cx, &value)?),
      Err(err) => cx.throw_error(format!("{}", err)),
    }
  }
}
