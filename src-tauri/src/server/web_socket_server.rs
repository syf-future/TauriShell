use crate::terminal::local_terminal::LocalTerminal;
use crate::terminal::ssh_terminal::SshTerminal;
use futures_util::stream::StreamExt;
use futures_util::SinkExt;
use std::sync::Arc;
use tokio::net::TcpListener;
use tokio::sync::mpsc; // 用于通道通信
use tokio::sync::Mutex;
use tokio_tungstenite::accept_async;
use tokio_tungstenite::tungstenite::Message;
use crate::interfaces::message_data::MessageData;
pub async fn start() {
    // 创建一个 TcpListener，绑定到 127.0.0.1:9001 地址，监听进入的 TCP 连接
    let listener = TcpListener::bind("127.0.0.1:9001").await.unwrap();
    println!("Listening on: 127.0.0.1:9001");

    // 进入一个无限循环，等待并接受传入的 TCP 连接
    while let Ok((stream, addr)) = listener.accept().await {
        // 使用 tokio::spawn 启动一个新的异步任务来处理连接
        tokio::spawn(async move {
            // 打印连接信息
            println!("新的客户端连接: {}", addr);
            // 将 TCP 流转换为 WebSocket 流
            let ws_stream = accept_async(stream).await.expect("Failed to accept");
            // 拆分 WebSocket 流为发送端和接收端
            let (ws_sender, mut ws_receiver) = ws_stream.split();

            // 将 ws_sender 包装为 Arc<Mutex<_>>，以便可以共享和借用
            let ws_sender = Arc::new(Mutex::new(ws_sender));

            // 创建一个通道，用于将终端输出发送回 WebSocket
            let (tx, mut rx) = mpsc::channel::<String>(100);

            // 启动一个任务，用于异步地发送终端输出到 WebSocket
            tokio::spawn({
                let ws_sender = Arc::clone(&ws_sender); // 使用 Arc::clone() 来共享引用
                async move {
                    while let Some(output) = rx.recv().await {
                        let _ = ws_sender.lock().await.send(Message::from(output)).await;
                    }
                }
            });

            // 创建 terminal 变量，保证它在整个连接生命周期内
            let mut local_terminal: Option<LocalTerminal> = None;
            let mut ssh_terminal: Option<SshTerminal> = None;

            // 处理 WebSocket 消息
            while let Some(msg) = ws_receiver.next().await {
                match msg {
                    Ok(msg) => {
                        match msg {
                            Message::Text(text) => {
                                println!("收到客户端消息: {}", text);
                                // 解析 JSON 字符串到 Rust 结构体
                                match serde_json::from_str::<MessageData>(&text) {
                                    Ok(message_data) => {
                                        let message_type = message_data.message_type;
                                        let message_info = message_data.message_info;
                                        if message_type == "CONNECT" {
                                            match message_info.as_str() {
                                                "LOCAL" => {
                                                    println!("开始创建本地终端");
                                                    if local_terminal.is_none() {
                                                        // 创建终端并传入发送端
                                                        local_terminal = Some(
                                                            LocalTerminal::new(tx.clone()).expect("启动终端异常"),
                                                        );
                                                        if let Some(t) = &mut local_terminal {
                                                            t.execute_command("");
                                                        }
                                                    }
                                                }
                                                "SSH" => {
                                                    println!("开始连接ssh远程服务器");
                                                    let connect_info = message_data.connect_info;
                                                    if ssh_terminal.is_none() {
                                                        let mut error_msg: String = "".to_string();
                                                        match SshTerminal::new(tx.clone(), connect_info.unwrap()).await {
                                                            Ok(new_terminal) => {
                                                                ssh_terminal = Some(new_terminal);
                                                                println!("SSH 连接成功！");
                                                            }
                                                            Err(e) => {
                                                                error_msg = e.to_string();
                                                                eprintln!("SSH 连接失败: {}", e);
                                                            }
                                                        }
                                                        ws_sender.lock().await.send(Message::from(error_msg)).await.expect("");
                                                    }
                                                }
                                                _ => {}
                                            }
                                            if message_info == "LOCAL" {}
                                        } else if message_type == "CHAT" {
                                            // 向终端发送命令
                                            if let Some(t) = &mut local_terminal {
                                                println!("开始向终端发送命令: {}", message_info);
                                                t.execute_command(&message_info);
                                            } else if let Some(ssh) = &mut ssh_terminal {
                                                println!("开始向终端发送命令: {}", message_info);
                                                ssh.execute_command(&message_info).await;
                                            }
                                        }
                                    }
                                    Err(e) => {
                                        println!("解析 JSON 失败: {}", e);
                                    }
                                }
                            }
                            Message::Ping(_) => {}
                            Message::Pong(_) => {}
                            Message::Binary(_) => {}
                            Message::Frame(_) => {}
                            Message::Close(close_data) => {
                                println!("连接关闭: {:?}", close_data);
                                break;
                            }
                        }
                    }
                    Err(_e) => {
                        if let Err(e) = ws_sender.lock().await.close().await {
                            println!("关闭发送端时发生错误: {}", e);
                        }
                        if let Some(t) = local_terminal {
                            t.close();
                        }
                        if let Some(ssh) = ssh_terminal {
                            ssh.close().await;
                        }
                        break;
                    }
                }
            }
        });
    }
}
