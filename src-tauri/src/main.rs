// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::api::path::data_dir;
use std::fs::{File, OpenOptions};
use std::io::{Read, Write};
use serde_json::Value;

#[tauri::command]
fn save_time_data(data: String) -> Result<(), String> {
  

  let dir_path = data_dir().ok_or("Failed to get data directory")?.join("timestalker");
  
  if !dir_path.exists() {
    std::fs::create_dir_all(&dir_path).map_err(|e| e.to_string())?;
  }

  let path = data_dir().ok_or("Failed to get data directory")?.join("timestalker").join("time_data.json");

  let parsed_data: Value = serde_json::from_str(&data).map_err(|e| e.to_string())?;
  let formatted_data = serde_json::to_string_pretty(&parsed_data).map_err(|e| e.to_string())?;

  let mut file = OpenOptions::new()
      .create(true)
      .write(true)
      .truncate(true)
      .open(path)
      .map_err(|e| e.to_string())?;

  file.write_all(formatted_data.as_bytes()).map_err(|e| e.to_string())?;
  Ok(())
}

#[tauri::command]
fn load_time_data() -> Result<String, String> {
  let dir_path = data_dir().ok_or("Failed to get data directory")?.join("timestalker");
  
  if !dir_path.exists() {
    std::fs::create_dir_all(&dir_path).map_err(|e| e.to_string())?;
  }

  let path = data_dir().ok_or("Failed to get data directory")?.join("timestalker").join("time_data.json");

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
  #[cfg(target_os = "macos")]
  {
    use std::process::Command;

    let output = Command::new("defaults")
      .arg("write")
      .arg("com.timestalker")
      .arg("NSAppSleepDisabled")
      .arg("-bool")
      .arg("YES")
      .output(); // Use output() instead of spawn()

    match output {
      Ok(output) => {
        if output.status.success() {
          println!("Command executed successfully!");
          println!("Standard Output: {}", String::from_utf8_lossy(&output.stdout));
        } else {
          eprintln!("Command failed to execute!");
          eprintln!("Standard Error: {}", String::from_utf8_lossy(&output.stderr));
        }
      }
      Err(error) => {
        eprintln!("Failed to execute command: {}", error);
      }
    }
  }
  tauri::Builder::default()
    .on_window_event(|event| match event.event() {
      tauri::WindowEvent::CloseRequested { api, .. } => {
        event.window().hide().unwrap();
        api.prevent_close();
      }
      tauri::WindowEvent::Focused(false) => println!("Window became inactive"),
      _ => {}
    })
    .invoke_handler(tauri::generate_handler![save_time_data, load_time_data])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

