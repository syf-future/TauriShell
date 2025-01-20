use encoding::all::GBK;
use encoding::{DecoderTrap, Encoding};
use std::io::{BufReader, Read, Write};
use std::process::{Child, Command, Stdio};
use std::sync::{Arc, Mutex};
use std::thread;
use tokio::sync::mpsc;
// WebSocket 消息类型

pub struct LocalTerminal {
    child: Arc<Mutex<Child>>,
}

impl LocalTerminal {
    // 创建一个新的 LocalTerminal 实例
    pub fn new(sender: mpsc::Sender<String>) -> std::io::Result<Self> {
        // 启动 PowerShell 进程
        let child = Command::new("powershell")
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()?;

        let child = Arc::new(Mutex::new(child));

        // 启动线程处理 stdout
        {
            let child_stdout = Arc::clone(&child);
            let stdout = child_stdout.lock().unwrap().stdout.take();
            let sender = sender.clone();
            thread::spawn(move || {
                if let Some(stdout) = stdout {
                    let reader = BufReader::new(stdout);
                    LocalTerminal::process_output(reader, sender, "stdout");
                }
            });
        }

        // 启动线程处理 stderr
        {
            let child_stderr = Arc::clone(&child);
            let stderr = child_stderr.lock().unwrap().stderr.take();
            let sender = sender.clone();
            thread::spawn(move || {
                if let Some(stderr) = stderr {
                    let reader = BufReader::new(stderr);
                    LocalTerminal::process_output(reader, sender, "stderr");
                }
            });
        }
        Ok(LocalTerminal { child })
    }

    /// 执行一个命令
    pub fn execute_command(&self, command: &str) {
        if let Ok(mut child_guard) = self.child.lock() {
            if let Some(stdin) = child_guard.stdin.as_mut() {
                writeln!(stdin, "{}", command).expect("发送命令失败"); // 写入命令
            } else {
                eprintln!("Failed to write to child process stdin.");
            }
        }
    }

    /// 关闭 LocalTerminal
    pub fn close(self) {
        if let Ok(mut child_guard) = self.child.lock() {
            child_guard.kill().expect("关闭终端失败"); // 终止进程
            let status = child_guard.wait().expect("结束进程异常"); // 等待进程结束
            println!("PowerShell已关闭: {}", status);
        }
    }

    /// 处理输出的通用方法
    fn process_output<R: Read>(reader: BufReader<R>, sender: mpsc::Sender<String>, out_type: &str) {
        let mut buffer = Vec::new();
        for byte in reader.bytes() {
            match byte {
                Ok(b) => {
                    if b == b'\n' {
                        let result = GBK.decode(&buffer, DecoderTrap::Strict);
                        match result {
                            Ok(mut decoded) => {
                                // 将终端输出通过通道发送到主线程 接收端
                                if out_type == "stderr" {
                                    decoded = "[ERROR]".to_owned() + &decoded;
                                }
                                let _ = sender.try_send(decoded); // 不阻塞主线程
                            }
                            Err(err) => println!("Failed to decode: {}", err),
                        }
                        buffer.clear();
                    } else {
                        buffer.push(b);
                    }
                }
                Err(e) => println!("Error reading byte: {:?}", e),
            }
        }
    }
}
