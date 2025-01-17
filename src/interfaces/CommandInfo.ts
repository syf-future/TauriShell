import { EnumCommand } from "@/enums/EnumCommand";

interface CommandInfo {
    message_type: EnumCommand;         // 终端ID
    message_info: string;       // 终端名称
}
export default CommandInfo;