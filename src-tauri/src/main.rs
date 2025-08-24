#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::error::Error;

fn main() -> Result<(), Box<dyn Error + Send + Sync>> {
  t_rust_less_ui_lib::try_run()
}
