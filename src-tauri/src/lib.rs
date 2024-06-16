
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
            ])
//            .events(tauri_specta::collect_events![crate::DemoEvent, EmptyEvent])
//            .types(TypeCollection::default().register::<Custom>())
            .config(specta::ts::ExportConfig::default().formatter(specta::ts::formatter::prettier))
//            .types(TypeCollection::default().register::<Testing>())
//            .statics(StaticCollection::default().register("universalConstant", 42))
            .header("/* These are my Tauri Specta Bindings! */");

        #[cfg(debug_assertions)]
        let builder = builder.path("../src/bindings.ts");

        builder.build().unwrap()
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(invoke_handler)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
