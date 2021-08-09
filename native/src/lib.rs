use neon::prelude::*;

mod clipboard;
mod errors;
mod estimate;
mod otp;
mod service;
mod store;

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
  cx.export_function("calculateOtpToken", otp::js_calculate_otp_token)?;
  cx.export_function("estimatePassword", estimate::js_estimate_password_strength)?;

  cx.export_function("clipboard_is_done", clipboard::clipboard_is_done)?;
  cx.export_function(
    "clipboard_currently_providing",
    clipboard::clipboard_currently_providing,
  )?;
  cx.export_function("clipboard_destroy", clipboard::clipboard_destroy)?;

  cx.export_function("service_create", service::service_create)?;
  cx.export_function("service_list_stores", service::service_list_stores)?;
  cx.export_function("service_upsert_store_config", service::service_upsert_store_config)?;
  cx.export_function("service_delete_store_config", service::service_delete_store_config)?;
  cx.export_function("service_get_default_store", service::service_get_default_store)?;
  cx.export_function("service_set_default_store", service::service_set_default_store)?;
  cx.export_function("service_open_store", service::service_open_store)?;
  cx.export_function("service_secret_to_clipboard", service::service_secret_to_clipboard)?;
  cx.export_function("service_generate_id", service::service_generate_id)?;
  cx.export_function("service_generate_password", service::service_generate_password)?;
  cx.export_function("service_check_autolock", service::service_check_autolock)?;

  cx.export_function("store_status", store::store_status)?;
  cx.export_function("store_lock", store::store_lock)?;
  cx.export_function("store_unlock", store::store_unlock)?;
  cx.export_function("store_identities", store::store_identities)?;
  cx.export_function("store_add_identity", store::store_add_identity)?;
  cx.export_function("store_change_passphrase", store::store_change_passphrase)?;
  cx.export_function("store_list", store::store_list)?;
  cx.export_function("store_update_index", store::store_update_index)?;
  cx.export_function("store_add", store::store_add)?;
  cx.export_function("store_get", store::store_get)?;
  cx.export_function("store_get_version", store::store_get_version)?;

  Ok(())
}
