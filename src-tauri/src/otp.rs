use chrono::{DateTime, TimeZone, Utc};
use serde_derive::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};
use t_rust_less_lib::otp::{OTPAuthUrl, OTPType};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum OTPToken {
  Totp {
    token: String,
    valid_until: DateTime<Utc>,
    valid_for: i64,
    period: u32,
  },
  Invalid,
}

#[tauri::command]
pub fn calculate_otp_token(otp_url: String) -> OTPToken {
  match OTPAuthUrl::parse(&otp_url) {
    Ok(otpauth) => {
      let now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
      let (token, valid_until_secs) = otpauth.generate(now);
      let valid_until = Utc.timestamp(valid_until_secs as i64, 0);
      let valid_for = (valid_until - Utc::now()).num_seconds();
      match otpauth.otp_type {
        OTPType::Totp { period } => OTPToken::Totp {
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
