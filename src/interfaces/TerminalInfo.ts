interface TerminalInfo {
    terminalId: string;         // 终端ID
    terminalName: string;       // 终端名称
    terminalType: string;       // 终端类型 0: 本地终端 1: SSH终端 2: SFTP终端
    terminalIp: string;         // 远程终端IP
    terminalPort: string;       // 远程终端端口
    terminalUserName: string;   // 远程终端用户名
    terminalPassword: string | null;   // 远程终端密码
}
export default TerminalInfo;