import HostInfo from "./HostInfo";

interface GroupInfo {
    groupId: string;         // 组id
    groupName: string;         // 组名
    groupHosts: HostInfo[];    // 组内主机信息
}
export default GroupInfo;  