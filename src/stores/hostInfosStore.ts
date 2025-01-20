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
     * 删除连接信息 
     * @param hostId 
     */
    function deleteHostInfo(hostId: string): void {
        hostInfos.value = hostInfos.value.filter(hostInfo => hostInfo.hostId !== hostId);
        StoreHostInfoUtil.setHostInfoStore(hostInfos.value);
    }

    return { hostInfos, addHostInfo, deleteHostInfo, getHostInfoStore }
})