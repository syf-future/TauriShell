use ssh2::Session;
use std::io::prelude::*;
use std::net::TcpStream;
use std::sync::{Arc, Mutex};
use std::thread;
use tokio::sync::mpsc;

pub struct SshTerminal {
    channel: Arc<Mutex<ssh2::Channel>>,
}

impl SshTerminal {
    // 创建一个新的 SSH 客户端
    pub fn new(sender: mpsc::Sender<String>) -> std::io::Result<Self> {
        // 创建 TCP 连接
        let tcp = TcpStream::connect("8.153.66.250:22")?;  // 修改为目标服务器的 IP 地址和端口
        let mut session = Session::new()?;
        session.set_tcp_stream(tcp);
        session.handshake()?;

        // 用户认证
        session.userauth_password("root", "loan!1234")?;

        // 打开一个会话通道
        let channel = session.channel_session()?;
        let channel = Arc::new(Mutex::new(channel));

        // 使用 Arc 和 Mutex 来安全共享和借用通道
        {
            let sender = sender.clone();
            let channel = Arc::clone(&channel);
            thread::spawn(move || {
                let mut channel = channel.lock().unwrap();
                let mut output = String::new();
                channel.read_to_string(&mut output).unwrap();
                println!("{}", output);
                let _ = sender.try_send(output);
            });
        }

        Ok(SshTerminal {
            channel,
        })
    }

    // 异步执行命令
    pub fn execute_command(&mut self, command: &str) {
        if let Ok(mut channel) = self.channel.lock() {
            channel.exec(command).expect("发送命令失败");
        }
    }

    // 关闭 SSH 会话和通道
    pub fn close(&self) {
        if let Ok(mut channel) = self.channel.lock() {
            // 发送 EOF 以关闭通道
            let _ = channel.send_eof();
            // 等待通道关闭
            let _ = channel.wait_close();
            println!("Connection closed successfully.");
        } else {
            println!("Failed to lock the channel.");
        }
    }
}
