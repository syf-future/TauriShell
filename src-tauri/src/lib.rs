use std::thread;
use crate::terminal::ssh_terminal::SshTerminal;

mod server;
mod terminal;
mod interfaces;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn is_connect(ip: &str, port: u16, username: &str, password: &str) -> Result<String, String> {
    let result = SshTerminal::is_connect(ip, port, username, password).await;
    if result == "连接成功" {
        Ok(result)  // 如果连接成功，返回 Ok
    } else {
        Err(result) // 如果连接失败，返回 Err
    }
}

// 异步创建webSocket服务端
fn create_server() {
    // 创建一个独立的线程
    thread::spawn(|| {
        // 在独立线程中创建 Tokio 的运行时
        let runtime = tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .unwrap();

        // 运行异步任务
        runtime.block_on(async {
            println!("WebSocket 服务端启动中...");
            server::web_socket_server::start().await;
        });
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    create_server(); //启动服务端
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![greet,is_connect])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
