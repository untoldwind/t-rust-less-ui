mod clipboard;
mod clipboard_fallback;
mod estimate;
mod otp;
mod service;
mod state;
mod store;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
#[specta::specta]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let invoke_handler = {
        let builder = tauri_specta::ts::builder()
            .commands(tauri_specta::collect_commands![
                greet,
                estimate::estimate_password_strength,
                otp::calculate_otp_token,
                service::service_list_stores,
                service::service_get_default_store,
                service::service_set_default_store,
                service::service_upsert_store_config,
                service::service_check_autolock,
                service::service_secret_to_clipboard,
                store::store_status,
                store::store_identities,
                store::store_lock,
                store::store_unlock,
                store::store_add_identity,
                store::store_list,
                store::store_get,
                store::store_get_version,
                clipboard::clipboard_currently_providing,
                clipboard::clipboard_provide_next,
                clipboard::clipboard_destroy,
            ])
            //            .events(tauri_specta::collect_events![crate::DemoEvent, EmptyEvent])
            //            .types(TypeCollection::default().register::<Custom>())
            .config(
                specta::ts::ExportConfig::default()
                    .formatter(specta::ts::formatter::prettier)
                    .bigint(specta::ts::BigIntExportBehavior::Number),
            )
            //            .types(TypeCollection::default().register::<Testing>())
            //            .statics(StaticCollection::default().register("universalConstant", 42))
            .header("// @ts-nocheck");

        #[cfg(all(debug_assertions, not(mobile)))]
        let builder = builder.path("../src/backend/bindings.ts");

        builder.build().unwrap()
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .manage(state::State::new())
        .invoke_handler(invoke_handler)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
