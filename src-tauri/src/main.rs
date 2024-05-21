// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::api::path::data_dir;
use std::fs::{File, OpenOptions};
use std::io::{Read, Write};

#[tauri::command]
fn save_time_data(data: String) -> Result<(), String> {
  let path = data_dir().ok_or("Failed to get data directory")?.join("time_data.json");

  let mut file = OpenOptions::new()
      .create(true)
      .write(true)
      .truncate(true)
      .open(path)
      .map_err(|e| e.to_string())?;

  file.write_all(data.as_bytes()).map_err(|e| e.to_string())?;
  Ok(())
}

#[tauri::command]
fn load_time_data() -> Result<String, String> {
  let path = data_dir().ok_or("Failed to get data directory")?.join("time_data.json");

  let mut file = File::open(path).map_err(|e| e.to_string())?;
  let mut data = String::new();
  file.read_to_string(&mut data).map_err(|e| e.to_string())?;
  Ok(data)
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_time_data, load_time_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
