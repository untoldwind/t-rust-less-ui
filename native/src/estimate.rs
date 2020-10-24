use neon::prelude::*;
use t_rust_less_lib::secrets_store::estimate::{PasswordEstimator, ZxcvbnEstimator};

pub fn js_estimate_password_strength(mut cx: FunctionContext) -> JsResult<JsValue> {
  let password = cx.argument::<JsString>(0)?.value();
  let token = ZxcvbnEstimator::estimate_strength(&password, &[]);

  Ok(neon_serde::to_value(&mut cx, &token)?)
}
