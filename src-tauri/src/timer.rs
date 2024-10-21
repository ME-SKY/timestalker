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
        drop(data);

        self.start_interval(window).await;
    }

    pub async fn pause(&self) -> TimerData {
        self.clear_interval().await;

        let mut data = self.data.lock().await;
        data.state = "paused".to_string();
        data.clone()
    }

    pub async fn resume(&self, window: Window, timer_data: Option<TimerData>) {
        if let Some(new_data) = timer_data {
            let mut data = self.data.lock().await;
            *data = new_data;
        }

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

    async fn start_interval(&self, window: Window) {
        let data_arc = Arc::clone(&self.data);

        // Clear any existing interval
        self.clear_interval().await;

        // Create a new interval task
        let interval_task = tokio::spawn(async move {
            loop {
                let mut data = data_arc.lock().await;
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
                window.emit("timer-tick", &data.string_representation).unwrap();
                
                drop(data);

                // Wait for 1 second
                sleep(Duration::from_secs(1)).await;
            }
        });

        // Store the interval task
        *self.interval_handle.lock().await = Some(interval_task);
    }

    async fn clear_interval(&self) {
        if let Some(handle) = self.interval_handle.lock().await.take() {
            handle.abort();
        }
    }
}
