use chrono::{DateTime, TimeZone, Utc};
use neon::prelude::*;
use serde_derive::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};
use t_rust_less_lib::otp::{OTPAuthUrl, OTPType};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum OTPToken {
    TOPT {
        token: String,
        valid_until: DateTime<Utc>,
        valid_for: i64,
        period: u32,
    },
    Invalid,
}

fn calculate_otp_token(otp_url: &str) -> OTPToken {
    match OTPAuthUrl::parse(&otp_url) {
        Ok(otpauth) => {
            let now = SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs();
            let (token, valid_until_secs) = otpauth.generate(now);
            let valid_until = Utc.timestamp(valid_until_secs as i64, 0);
            let valid_for = (valid_until - Utc::now()).num_seconds();
            match otpauth.otp_type {
                OTPType::TOTP { period } => OTPToken::TOPT {
                    token,
                    valid_until,
                    valid_for,
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
