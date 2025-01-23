import { EnumCommand } from "@/enums/EnumCommand";

interface CommandInfo {
    message_type: EnumCommand;         // 终端ID
    message_info: string;       // 终端名称
    connect_info: ConnectInfo | null;   // 连接信息
}

interface ConnectInfo {
    ip: string,       // 主机ip
    port: number | null,        // 主机端口
    connect_type: string,      // 主机连接方式
    username: string,     // 主机用户名
    password: string,     // 主机密码
}
export default CommandInfo;