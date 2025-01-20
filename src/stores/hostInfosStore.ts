import HostInfo from "@/interfaces/HostInfo";
import { defineStore } from "pinia";
import { ref } from "vue";
import { StoreHostInfoUtil } from "@/utils/StoreHostInfoUtil";
export const hostInfosStore = defineStore("hostInfosStore", () => {
    const hostInfos = ref<HostInfo[]>([]);

    /**
     * 获取连接信息
     * @returns 
     */
    async function getHostInfoStore(): Promise<HostInfo[]> {
        return await StoreHostInfoUtil.getHostInfoStore();
    }
    /**
     * 添加连接信息
     * @param hostInfo 
     */
    function addHostInfo(hostInfo: HostInfo): void {
        hostInfos.value.push(hostInfo);
        StoreHostInfoUtil.setHostInfoStore(hostInfos.value);
    }
    /**
    * 修改连接信息
    * @param hostInfo 
    */
    function updateHostInfo(hostInfo: HostInfo): void {
        const index = hostInfos.value.findIndex(item => item.hostId === hostInfo.hostId);
        if (index > -1) {
            hostInfos.value[index] = hostInfo;
        }
        StoreHostInfoUtil.setHostInfoStore(hostInfos.value);
    }
    /**
     * 删除连接信息 
     * @param hostId 
     */
    function deleteHostInfo(hostId: string): void {
        const index = hostInfos.value.findIndex(item => item.hostId === hostId);
        if (index > -1) {
            hostInfos.value.splice(index, 1);
            StoreHostInfoUtil.setHostInfoStore(hostInfos.value);
        }
    }
    return { hostInfos, addHostInfo, deleteHostInfo, updateHostInfo, getHostInfoStore }
})