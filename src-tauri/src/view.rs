use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Rect {
  top: u32,
  bottom: u32,
  left: u32,
  right: u32,
}

#[tauri::command]
pub fn view_insets() -> Result<Rect, String> {
  #[cfg(target_os = "android")]
  let rect = Rect {
    top: 30,
    bottom: 0,
    left: 0,
    right: 0,
  };

  #[cfg(not(target_os = "android"))]
  let rect = Rect {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  Ok(rect)
}
