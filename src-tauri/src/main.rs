#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

mod estimate;
mod otp;
mod service;
mod state;
mod store;

fn main() {
  tauri::Builder::default()
    .manage(state::State::new())
    .invoke_handler(tauri::generate_handler![
      service::service_list_stores,
      service::service_get_default_store,
      service::service_set_default_store,
      service::service_upsert_store_config,
      service::service_delete_store_config,
      service::service_generate_id,
      service::service_generate_password,
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
      estimate::estimate_password_strength,
      otp::calculate_otp_token,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
