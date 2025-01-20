use async_trait::async_trait;
use russh::client::Handle;
use russh::keys::*;
use russh::*;
use std::error::Error;
use std::sync::Arc;
use tokio::sync::{mpsc, Mutex};

pub struct SshTerminal {
    session: Arc<Mutex<Handle<CustomClient>>>, // SSH 客户端会话
    input_sender: mpsc::Sender<String>,        // 用于发送命令到输入任务
}

impl SshTerminal {
    pub async fn new(sender: mpsc::Sender<String>) -> Result<SshTerminal, Box<dyn Error>> {
        let host = "8.153.66.250".to_string();
        let port = 22;
        let username = "root".to_string();
        let password = "loan!1234".to_string();
        let addrs = (host, port);

        let config = client::Config {
            ..<_>::default() // 使用默认配置
        };

        let config = Arc::new(config);
        let sh = CustomClient {}; // 创建一个自定义客户端实例

        // 异步连接到 SSH 服务端
        let mut session = client::connect(config, addrs, sh).await?;

        // 使用密码进行身份验证
        let auth_res = session.authenticate_password(username, &password).await?;
        if !auth_res {
            return Err("密码验证失败".into());
        }

        // 启动交互式 shell
        let mut channel = session.channel_open_session().await?;
        let (w, h) = (40, 30); // 获取终端尺寸

        // 请求伪终端 (PTY)
        channel
            .request_pty(false, "xterm".into(), w as u32, h as u32, 0, 0, &[])
            .await?;

        channel.exec(true, "bash -i").await?;

        let session = Arc::new(Mutex::new(session));

        // 创建输入和输出的 MPSC 通道
        let (input_sender, mut input_receiver) = mpsc::channel(32);

        tokio::spawn(async move {
            loop {
                tokio::select! {
                // 从输入接收器接收命令并发送到服务器
                    Some(command) = input_receiver.recv() => {
                        if command == "CLOSE-SSH" {
                            break; // 如果标准输入已关闭，退出循环
                        }
                        println!("发送命令：{}", command);
                        // 发送命令到服务器
                        if let Err(e) = channel.data(format!("{}\n", command).as_bytes()).await {
                            eprintln!("发送命令失败：{}", e);
                        }
                    },

                    // 接收并处理服务器返回的数据
                    Some(msg) = channel.wait() => {
                        match msg {
                            ChannelMsg::Data { ref data } => {
                                let out_data = String::from_utf8_lossy(&data);
                                println!("返回数据：{}", out_data);
                                let _ = sender.try_send(out_data.to_string());
                            },
                            // 处理命令退出状态
                            ChannelMsg::ExitStatus { exit_status } => {
                                println!("命令退出状态：{}", exit_status);
                                // stdin_closed = true;
                            },
                            // 其他未处理的消息
                            _ => {
                                eprintln!("收到未处理的消息：{:?}", msg); // 捕获并打印未处理的消息
                            }
                        }
                    },
                    // 默认情况，防止 select 阻塞
                    else => {}
                }
            }
        });

        // 返回新的 SshTerminal 实例
        Ok(SshTerminal {
            session,
            input_sender,
        })
    }

    // 异步执行命令
    pub async fn execute_command(&self, command: &str) {
        self.input_sender
            .send(command.to_string())
            .await
            .expect("执行命令失败");
    }

    // 关闭 SSH 会话
    pub async fn close(self) {
        self.input_sender
            .send("CLOSE-SSH".to_string())
            .await
            .expect("执行命令失败");
        let mut session = self.session.lock().await;
        session
            .disconnect(Disconnect::ByApplication, "", "Chinese")
            .await
            .expect("关闭 SSH 异常");
        println!("SSH 客户端已关闭");
    }
}

// 实现客户端处理器，处理 SSH 协议中的一些事件
struct CustomClient;

#[async_trait]
impl client::Handler for CustomClient {
    type Error = russh::Error;

    // 简单地接受所有服务器公钥
    async fn check_server_key(
        &mut self,
        _server_public_key: &PublicKey,
    ) -> Result<bool, Self::Error> {
        Ok(true) // 始终返回 true，表示信任所有公钥
    }
}
