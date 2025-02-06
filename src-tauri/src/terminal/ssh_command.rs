use async_trait::async_trait;
use russh::client;
use russh::ChannelMsg;
use russh_keys::PublicKey;
use std::sync::Arc;

pub async fn execute_command(
    ip: &str,
    port: u16,
    username: &str,
    password: &str,
    command: &str,
) -> Result<String, String> {
    let host = ip;
    let port = port;
    let username = username;
    let password = password;
    let addrs = (host, port);

    let config = client::Config {
        ..<_>::default() // 使用默认配置
    };

    let config = Arc::new(config);
    let sh = CustomClient {}; // 创建一个自定义客户端实例

    // 异步连接到 SSH 服务端
    let mut session = match client::connect(config, addrs, sh).await {
        Ok(session) => session,
        Err(e) => return Err(format!("连接失败: {}", e)),
    };

    // 使用密码进行身份验证
    let auth_res = match session.authenticate_password(username, password).await {
        Ok(res) => res,
        Err(e) => return Err(format!("身份验证失败: {}", e)),
    };

    if !auth_res {
        return Err(String::from("密码验证失败"));
    }

    // 打开一个会话通道
    let mut channel = match session.channel_open_session().await {
        Ok(channel) => channel,
        Err(e) => return Err(format!("打开通道失败: {}", e)),
    };

    // 执行命令
    if let Err(e) = channel.exec(true, command).await {
        return Err(format!("执行命令失败: {}", e));
    }

    // 读取命令输出
    let mut output = String::new();
    while let Some(msg) = channel.wait().await {
        match msg {
            ChannelMsg::Data { data } => {
                output.push_str(&String::from_utf8_lossy(&data));
            }
            ChannelMsg::ExitStatus { exit_status } => {
                if exit_status != 0 {
                    return Err(format!("命令执行失败，退出状态: {}", exit_status));
                }
            }
            _ => {}
        }
    }

    Ok(output)
}

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
