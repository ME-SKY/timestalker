// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::api::path::data_dir;
use std::fs::{File, OpenOptions};
use std::io::{Read, Write};
use serde_json::Value;
use objc::runtime::{Class, Object, Sel};
use objc::{class, msg_send, sel, sel_impl};
use lazy_static::lazy_static;
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Manager};
use objc::declare::ClassDecl;
mod timer;

use timer::{TimerStore, TimerData};
// use tauri::Manager;

#[tauri::command]
async fn start_timer(app_handle: tauri::AppHandle, timer_name: String) {
    let timer_store = app_handle.state::<Arc<TimerStore>>().clone();
    let window = app_handle.get_window("main").unwrap();
    timer_store.start(window, timer_name).await;
}

#[tauri::command]
async fn pause_timer(app_handle: tauri::AppHandle) -> TimerData {
    let timer_store = app_handle.state::<Arc<TimerStore>>().clone();
    timer_store.pause().await
}

#[tauri::command]
async fn resume_timer(app_handle: tauri::AppHandle, timer_data: Option<TimerData>) {
    let timer_store = app_handle.state::<Arc<TimerStore>>().clone();
    let window = app_handle.get_window("main").unwrap();
    timer_store.resume(window, timer_data).await;
}

#[tauri::command]
async fn reset_timer(app_handle: tauri::AppHandle) {
    let timer_store = app_handle.state::<Arc<TimerStore>>().clone();
    timer_store.reset().await;
}

#[tauri::command]
async fn toggle_timer(app_handle: tauri::AppHandle, timer_name: Option<String>) {
    let timer_store = app_handle.state::<Arc<TimerStore>>().clone();
    let window = app_handle.get_window("main").unwrap();

    match &timer_name {
      Some(name) => println!("Received timer name: {}", name),
      None => println!("No timer name provided."),
  }

    timer_store.toggle_timer(window, timer_name).await;
    println!("toggle_timer command completed");
}



// Global state to store the AppHandle
lazy_static! {
  static ref APP_HANDLE: Mutex<Option<tauri::AppHandle>> = Mutex::new(None);
}

fn stop_current_timer(window: tauri::Window) {
  // Emit an event to the frontend
  let data = "This is a message from Rust!";
  window.emit("window_inactivation", data).unwrap();
}

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

#[cfg(target_os = "macos")]
fn setup_background_tracking(app_handle: AppHandle) {
    let ns_app_class = class!(NSApplication);
    let ns_app: *mut Object = unsafe { msg_send![ns_app_class, sharedApplication] };

    // Create a new Objective-C delegate class at runtime
    let mut app_delegate_class = ClassDecl::new("AppDelegate", class!(NSObject)).unwrap();

    // Define the method that gets called when the app is sent to the background
    extern "C" fn application_will_resign_active(_self: &Object, _cmd: Sel, _notification: *mut Object) {
        println!("Application is moving to the background.");
        let app_handle = APP_HANDLE.lock().unwrap();
        if let Some(app_handle) = app_handle.as_ref() {
            let main_window = app_handle.get_window("main").unwrap();
            main_window.emit("app-in-background", "App moved to background").unwrap();
        }
    }

    // Define the method that gets called when the app comes to the foreground
    extern "C" fn application_did_become_active(_self: &Object, _cmd: Sel, _notification: *mut Object) {
        println!("Application is now active.");
        let app_handle = APP_HANDLE.lock().unwrap();
        if let Some(app_handle) = app_handle.as_ref() {
            let main_window = app_handle.get_window("main").unwrap();
            main_window.emit("app-in-foreground", "App is active").unwrap();
        }
    }

    // Register methods in the delegate
    unsafe {
        app_delegate_class.add_method(
            sel!(applicationWillResignActive:),
            application_will_resign_active as extern "C" fn(&Object, Sel, *mut Object),
        );
        app_delegate_class.add_method(
            sel!(applicationDidBecomeActive:),
            application_did_become_active as extern "C" fn(&Object, Sel, *mut Object),
        );
        // Finalize the class and create an instance
        let app_delegate_class = app_delegate_class.register();
        let app_delegate_instance: *mut Object = msg_send![app_delegate_class, new];
        let _: () = msg_send![ns_app, setDelegate: app_delegate_instance];
    }
}



fn main() {
  tauri::Builder::default()
    .setup(|app| {
      // Store the AppHandle globally
      *APP_HANDLE.lock().unwrap() = Some(app.handle().clone());

      #[cfg(target_os = "macos")]
      {
        // setup_background_tracking(app.handle().clone());

        use std::process::Command;

        let output = Command::new("defaults")
          .arg("write")
          .arg("com.timestalker.dev")
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

      Ok(())
    })
    // .on_window_event(|event| match event.event() {
    //   tauri::WindowEvent::CloseRequested { api, .. } => {
    //     event.window().hide().unwrap();
    //     api.prevent_close();
    //   }
    //   tauri::WindowEvent::Focused(false) => {
    //     println!("Window became inactive");
    //     stop_current_timer(event.window().clone());
    //   }
    //   _ => {}
    // })
    .manage(Arc::new(TimerStore::new()))
    .invoke_handler(tauri::generate_handler![
      save_time_data, 
      load_time_data, 
      start_timer,
      pause_timer,
      resume_timer,
      reset_timer,
      toggle_timer])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
