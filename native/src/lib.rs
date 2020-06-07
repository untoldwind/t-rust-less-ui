use neon::prelude::*;

mod clipboard;
mod errors;
mod service;
mod store;
mod otp;

register_module!(mut m, {
    m.export_class::<service::JsService>("Service")?;
    m.export_function("calculateOtpToken", otp::js_calculate_otp_token)?;

    Ok(())
});
