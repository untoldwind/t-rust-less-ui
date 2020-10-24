use neon::prelude::*;

mod clipboard;
mod errors;
mod estimate;
mod otp;
mod service;
mod store;

register_module!(mut m, {
  m.export_class::<service::JsService>("Service")?;
  m.export_function("calculateOtpToken", otp::js_calculate_otp_token)?;
  m.export_function("estimatePassword", estimate::js_estimate_password_strength)?;

  Ok(())
});
