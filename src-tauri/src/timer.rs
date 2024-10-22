use std::sync::Arc;
use std::time::Duration;
use tokio::time::sleep;
use tauri::Window;
use tokio::sync::Mutex;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct TimerData {
    pub h: u32,
    pub m: u32,
    pub s: u32,
    pub string_representation: String,
    pub state: String, // "running", "paused", "stopped"
    pub timer_name: String,
}

#[derive(Clone)]
pub struct TimerStore {
    data: Arc<Mutex<TimerData>>,
    interval_handle: Arc<Mutex<Option<tokio::task::JoinHandle<()>>>>,
}

impl TimerStore {
    pub fn new() -> Self {
        Self {
            data: Arc::new(Mutex::new(TimerData {
                h: 0,
                m: 0,
                s: 0,
                string_representation: "00:00:00".to_string(),
                state: "stopped".to_string(),
                timer_name: "".to_string(),
            })),
            interval_handle: Arc::new(Mutex::new(None)),
        }
    }

    pub async fn start(&self, window: Window, timer_name: String) {
        let mut data = self.data.lock().await;
        data.state = "running".to_string();
        data.timer_name = timer_name.clone();
        drop(data); // Drop the lock before starting the interval

        self.start_interval(window).await;
    }

    pub async fn pause(&self) -> TimerData {
      println!("pause method starts");
  
      // Clear the interval
      self.clear_interval().await;
      println!("after clear interval");
  
      // Try to acquire the lock without blocking
      match self.data.try_lock() {
          Ok(mut data) => {
              println!("Acquired data lock in pause");
  
              // Update the timer state
              data.state = "paused".to_string();
              println!("Timer state updated to paused");
  
              // Clone the data to return it later
              let cloned_data = data.clone();
              println!("Cloned data");
  
              // Drop the lock explicitly
              drop(data);
              println!("Data lock dropped in pause");
  
              // Return the cloned data
              cloned_data
          }
          Err(_) => {
              // Handle the case where the lock is already held
              println!("Could not acquire data lock: already locked");
              // Return a default or handle error case
              self.data.lock().await.clone() // Block and wait if you want to retry
          }
      }
  }

    pub async fn resume(&self, window: Window, timer_data: Option<TimerData>) {
        if let Some(new_data) = timer_data {
            let mut data = self.data.lock().await;
            *data = new_data; // Update with the new data
        }

        // Start the interval task again
        self.start_interval(window).await;
    }

    pub async fn reset(&self) {
        self.clear_interval().await;

        let mut data = self.data.lock().await;
        *data = TimerData {
            state: "stopped".to_string(),
            h: 0,
            m: 0,
            s: 0,
            string_representation: "00:00:00".to_string(),
            timer_name: "".to_string(),
        };
    }

    pub async fn toggle_timer(&self, window: Window, timer_name: Option<String>) {
        let mut data = self.data.lock().await;

        println!("toggle_timer called");

        match data.state.as_str() {
            "running" => {
                // Log message for paused state
                println!("Timer paused: {}", data.timer_name);

                drop(data);
                // Pause the timer
                self.pause().await;

                // Emit event and log after pausing
                // window.emit("timer-paused", self.data.string_representation).unwrap();
                // println!("Timer is now paused: {}", data.timer_name);
            }
            "paused" => {
                // Log message for resumed state
                println!("Timer resumed: {}", data.timer_name);

                // Emit event before resuming to avoid reusing the window
                window.emit("timer-resumed", &data.string_representation).unwrap();

                // Resume the timer
                self.resume(window, Some(data.clone())).await;

                // Log after resuming the timer
                println!("Timer is now resumed: {}", data.timer_name);
            }
            "stopped" => {
                // Only start the timer if timer_name is provided
                if let Some(name) = timer_name {
                    // Log message for starting the timer
                    println!("Timer will start for the first time: {}", name);
                    
                    drop(data); // Release the lock before calling `start()`
                    self.start(window, name).await;

                    // Log after starting the timer
                    println!("Timer started from stopped");
                } else {
                    // Handle the case where no timer name is provided
                    println!("Cannot start timer: No timer name provided.");
                }
            }
            _ => {
                println!("Unrecognized timer state.");
            }
        }

        // Final log to indicate completion
        println!("toggle_timer completed");
    }

    async fn start_interval(&self, window: Window) {
      let data_arc = Arc::clone(&self.data);
  
      // Clear any existing interval
      self.clear_interval().await;
  
      // Create a new interval task
      let interval_task = tokio::spawn(async move {
          loop {
              println!("Interval task running...");
              let mut data = data_arc.lock().await;
  
              // Update time
              if data.s == 59 {
                  data.s = 0;
                  if data.m == 59 {
                      data.m = 0;
                      data.h += 1;
                  } else {
                      data.m += 1;
                  }
              } else {
                  data.s += 1;
              }
  
              data.string_representation = format!("{:02}:{:02}:{:02}", data.h, data.m, data.s);
  
              // Emit the updated time to the frontend
              if let Err(e) = window.emit("timer-tick", &data.string_representation) {
                  println!("Failed to emit timer-tick: {:?}", e);
              }
  
              drop(data);
  
              // Wait for 1 second
              sleep(Duration::from_secs(1)).await;
          }
      });
  
      // Store the interval task
      let mut handle_lock = self.interval_handle.lock().await;
      println!("Storing new interval task");
      *handle_lock = Some(interval_task);
  }

  async fn clear_interval(&self) {
    println!("clear_interval called");

    let mut interval_handle = self.interval_handle.lock().await;
    if let Some(handle) = interval_handle.take() {
        println!("Interval handle found, aborting");
        handle.abort(); // Abort the interval task if it exists
        // drop(handle);
        println!("after drop handle");
    } else {
        println!("No interval handle to clear");
    }

    println!("clear_interval completed");
  }

}
