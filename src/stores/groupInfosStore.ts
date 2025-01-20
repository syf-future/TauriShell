import GroupInfo from "@/interfaces/GroupInfo";
import { SequenceUtil } from "@/utils/SequenceUtil";
import { defineStore } from "pinia";
import { ref } from "vue";
import { StoreGroupInfoUtil } from '@/utils/StoreGroupInfoUtil';

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

    return { groupInfos, addGroupInfo, deleteGroupInfo, updateGroupInfo, getGroupInfoStore }
})