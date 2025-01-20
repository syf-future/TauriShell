import GroupInfo from "@/interfaces/GroupInfo";
import { SequenceUtil } from "@/utils/SequenceUtil";
import { defineStore } from "pinia";
import { ref } from "vue";
import { StoreGroupInfoUtil } from '@/utils/StoreGroupInfoUtil';
import HostInfo from "@/interfaces/HostInfo";

export const groupInfosStore = defineStore("groupInfosStore", () => {


    const groupInfos = ref<GroupInfo[]>([]);

    /**
    * 获取连接信息
    * @returns 
    */
    async function getGroupInfoStore(): Promise<GroupInfo[]> {
        return await StoreGroupInfoUtil.getGroupInfoStore();
    }

    /**
     * 添加组信息
     * @param groupInfo 
     */
    function addGroupInfo(): void {
        const groupInfo: GroupInfo = {
            groupId: SequenceUtil.nextId(),
            groupName: '新建组',
            groupHosts: [],
            groupEdit: true
        }
        groupInfos.value.push(groupInfo);
        StoreGroupInfoUtil.setGroupInfoStore(groupInfos.value);
    }
    /**
     * 修改组信息
     * @param groupInfo 
     */
    function updateGroupInfo(groupInfo: GroupInfo): void {
        const index = groupInfos.value.findIndex(item => item.groupId === groupInfo.groupId);
        if (index > -1) {
            groupInfos.value[index] = groupInfo;
            StoreGroupInfoUtil.setGroupInfoStore(groupInfos.value)
        }
    }
    /**
     * 删除组信息 
     * @param groupId 
     */
    function deleteGroupInfo(groupId: string): void {
        groupInfos.value = groupInfos.value.filter(groupInfo => groupInfo.groupId !== groupId);
        StoreGroupInfoUtil.setGroupInfoStore(groupInfos.value);
    }


    /**
     * 修改组里host信息
     */
    function updateGroupHostInfo(hostInfo: HostInfo, groupId: string): void {
        console.log("开始编辑组里host信息：", hostInfo, groupId);

        const index = groupInfos.value.findIndex(item => item.groupId === groupId);
        if (index > -1) {
            let hostInfos = groupInfos.value[index].groupHosts
            let hostIndex = hostInfos.findIndex(item => item.hostId === hostInfo.hostId)
            if (hostIndex > -1) {
                hostInfos[hostIndex] = hostInfo
            } else {
                hostInfos.push(hostInfo)
            }
            StoreGroupInfoUtil.setGroupInfoStore(groupInfos.value)
        }
    }
    /**
     * 删除组里host信息
     */
    function deleteGroupHostInfo(hostId: string, groupId: string): void {
        const index = groupInfos.value.findIndex(item => item.groupId === groupId);
        if (index > -1) {
            let hostInfos = groupInfos.value[index].groupHosts
            let hostIndex = hostInfos.findIndex(item => item.hostId === hostId)
            if (hostIndex > -1) {
                hostInfos.splice(hostIndex, 1)
            }
            StoreGroupInfoUtil.setGroupInfoStore(groupInfos.value)
        }
    }
    return { groupInfos, addGroupInfo, deleteGroupInfo, updateGroupInfo, getGroupInfoStore, updateGroupHostInfo, deleteGroupHostInfo }
})