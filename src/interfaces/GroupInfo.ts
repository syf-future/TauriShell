import HostInfo from "./HostInfo";

interface GroupInfo {
    groupId: string;         // 组id
    groupName: string;         // 组名
    groupHosts: HostInfo[];    // 组内主机信息
    groupEdit: boolean;        // 是否要编辑  
}
export default GroupInfo;  