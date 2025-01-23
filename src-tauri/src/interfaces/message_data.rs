use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct MessageData {
    // 消息类型
    pub(crate) message_type: String,
    // 消息内容
    pub(crate) message_info: String,
    // 连接信息
    pub(crate) connect_info: Option<HostInfo>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct HostInfo {
    pub(crate) ip: String,       // 主机ip
    pub(crate) port: u16,        // 主机端口
    pub(crate) connect_type: String,      // 主机连接方式
    pub(crate) username: String,     // 主机用户名
    pub(crate) password: String,     // 主机密码
}