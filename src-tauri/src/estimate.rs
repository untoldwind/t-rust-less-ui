use t_rust_less_lib::api::PasswordStrength;
use t_rust_less_lib::secrets_store::estimate::{PasswordEstimator, ZxcvbnEstimator};

#[tauri::command]
#[specta::specta]
pub fn estimate_password_strength(password: String) -> PasswordStrength {
    ZxcvbnEstimator::estimate_strength(&password, &[])
}
