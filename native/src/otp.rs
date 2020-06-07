use serde_derive::{Serialize, Deserialize};
use neon::prelude::*;
use t_rust_less_lib::otp::{OTPAuthUrl, OTPType};
use std::time::{UNIX_EPOCH, SystemTime};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum OTPToken {
    TOPT {
        token: String,
        valid_until: u64,
        period: u32,
    },
    Invalid,
}

fn calculate_otp_token(otp_url: &str) -> OTPToken {
        match OTPAuthUrl::parse(&otp_url) {
        Ok(otpauth) => {
            let now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
            let (token, valid_until) = otpauth.generate(now);
            match otpauth.otp_type {
            OTPType::TOTP { period } => OTPToken::TOPT {
                token,
                valid_until,
                period,
            },
            _ => OTPToken::Invalid,
          }
        }
        _ => OTPToken::Invalid,
      }
}

pub fn js_calculate_otp_token(mut cx: FunctionContext) -> JsResult<JsValue> {
    let otp_url = cx.argument::<JsString>(0)?.value();
    let token = calculate_otp_token(&otp_url);

    Ok(neon_serde::to_value(&mut cx, &token)?)
}