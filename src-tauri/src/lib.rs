#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

use std::error::Error;

mod clipboard;
mod clipboard_fallback;
mod estimate;
mod otp;
mod service;
mod state;
mod store;
mod view;

use tauri::Manager;
use tauri_plugin_log::{Target, TargetKind};

pub fn try_run() -> Result<(), Box<dyn Error + Send + Sync>> {
  tauri::Builder::default()
    .plugin(
      tauri_plugin_log::Builder::new()
        .targets([
          Target::new(TargetKind::Stdout),
          Target::new(TargetKind::LogDir { file_name: None }),
          Target::new(TargetKind::Webview),
        ])
        .build(),
    )
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_clipboard_manager::init())
    .manage(state::State::new())
    .setup(|app| {
      app.state::<state::State>().setup(app.handle())?;
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      service::service_list_stores,
      service::service_get_default_store,
      service::service_set_default_store,
      service::service_upsert_store_config,
      service::service_delete_store_config,
      service::service_generate_id,
      service::service_generate_password,
      service::service_check_autolock,
      service::service_secret_to_clipboard,
      store::store_status,
      store::store_identities,
      store::store_lock,
      store::store_unlock,
      store::store_add_identity,
      store::store_change_passphrase,
      store::store_list,
      store::store_get,
      store::store_get_version,
      store::store_add,
      clipboard::clipboard_currently_providing,
      clipboard::clipboard_provide_next,
      clipboard::clipboard_destroy,
      estimate::estimate_password_strength,
      otp::calculate_otp_token,
      view::view_insets,
    ])
    .run(tauri::generate_context!())?;

  Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  try_run().unwrap()
}
