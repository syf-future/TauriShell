use std::thread;

mod server;
mod terminal;
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
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
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
