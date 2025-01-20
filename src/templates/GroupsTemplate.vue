<script setup lang="ts">
import SvgIcon from '@/components/icons.vue';
import HostsTemplate from '@/templates/HostsTemplate.vue';
import { nextTick } from 'vue';
import { ref, onBeforeMount, onUpdated } from 'vue';
import HostConnectTemplate from './HostConnectTemplate.vue';
import { storeToRefs } from 'pinia';
import { groupInfosStore } from '@/stores/groupInfosStore';
// 用于选择哪些组是展开的
const groupIds = ref<string[]>([]); // 子页面展开状态
function handleClick(groupId: string): void {
    const index = groupIds.value.indexOf(groupId); // 查找 groupId 的索引
    if (index === -1) {
        // 如果 groupId 不存在，添加它
        groupIds.value.push(groupId);
    } else {
        // 如果 groupId 已存在，删除它
        groupIds.value.splice(index, 1);
    }
}

/**
 * 获取pinia grouo和host信息
 */
const { groupInfos } = storeToRefs(groupInfosStore());
const { deleteGroupInfo, updateGroupInfo, getGroupInfoStore } = groupInfosStore()

onBeforeMount(async () => {
    groupInfos.value = await getGroupInfoStore()
})
/**
 * 点击编辑按钮
 */
function handleEdit(groupId: string): void {
    groupInfos.value?.forEach((groupInfo) => {
        if (groupInfo.groupId === groupId) {
            groupInfo.groupEdit = true;
        }
    })
    // 聚焦到输入框
    nextTick(() => {
        const inputRef = document.querySelector(`#groupNameInputRef_${groupId}`) as HTMLInputElement;
        inputRef?.focus();
    })
}
/**
 * 编辑组名称
 * @param groupId 
 * @param groupName 
 */
function editGroupInfo(groupId: string, groupName: string): void {
    const index = groupInfos.value.findIndex(item => item.groupId === groupId);
    if (index > -1) {
        const groupInfo = groupInfos.value[index];
        groupInfo.groupName = groupName;
        groupInfo.groupEdit = false;
        updateGroupInfo(groupInfo);
    }
}

/**
 * 监听groupIds变化，使input框聚焦
 */
onUpdated(() => {
    if (groupInfos.value) {
        groupInfos.value.forEach(groupInfo => {
            if (groupInfo.groupEdit) {
                nextTick(() => {
                    const inputRef = document.querySelector(`#groupNameInputRef_${groupInfo.groupId}`) as HTMLInputElement;
                    inputRef?.focus();
                })
            }
        })
    }
})

// 新建连接窗口的状态和回调
const hostDialogStatus = ref<boolean>(false);
const editHostDialogStatus = (status: boolean) => {
    hostDialogStatus.value = status;
}
</script>

<template>
    <div id="groupsStyle" v-for="groupInfo in groupInfos" :key="groupInfo.groupId">
        <div class="groups-template" @click="handleClick(groupInfo.groupId)">
            <!-- 图标 -->
            <div class="groups-icon">
                <SvgIcon class="svg-icon" iconName="icon-zuzhiqunzu" />
            </div>
            <!-- groups信息 -->
            <div class="groups-info">
                <div class="groups-name">
                    <span v-if="groupInfo.groupEdit == false">
                        {{ groupInfo.groupName }}
                    </span>
                    <input v-else v-model="groupInfo.groupName"
                        @blur="editGroupInfo(groupInfo.groupId, groupInfo.groupName)"
                        @keyup.enter=" editGroupInfo(groupInfo.groupId, groupInfo.groupName)"
                        :id="'groupNameInputRef_' + groupInfo.groupId" />
                </div>
                <div class="groups-desc">
                    {{ groupInfo.groupHosts.length }} Host
                </div>
            </div>
            <!-- 功能按钮 -->
            <div class="groups-btn">
                <!-- 新建连接 -->
                <el-tooltip content="新建连接" placement="top">
                    <div @click.stop="editHostDialogStatus(true)">
                        <SvgIcon class="svg-btn" iconName="icon-lianjie" />
                    </div>
                </el-tooltip>

                <!-- 编辑 -->
                <el-tooltip content="编辑" placement="top">
                    <div @click.stop="handleEdit(groupInfo.groupId)">
                        <SvgIcon class="svg-btn" iconName="icon-bianji" />
                    </div>
                </el-tooltip>

                <!-- 删除 -->
                <el-tooltip content="删除" placement="top">
                    <div class="groups-btn-delete" @click.stop="deleteGroupInfo(groupInfo.groupId)">
                        <SvgIcon class="svg-btn" iconName="icon-ai-delete" />
                    </div>
                </el-tooltip>
            </div>
        </div>
        <!-- 子组件 Hosts -->
        <div class="groups-hosts">
            <HostsTemplate :hostInfos="groupInfo.groupHosts" v-if="groupIds.includes(groupInfo.groupId)" />
        </div>
    </div>
    <div v-if="hostDialogStatus == true">
        <HostConnectTemplate @editHostDialogStatus="editHostDialogStatus" />
    </div>
</template>

<style lang="scss" scoped>
.groups-template {
    width: 100%;
    min-height: 60px;
    display: flex;
    align-items: center;

    &:hover {
        background-color: rgb(87, 87, 88);
    }

    .groups-icon {
        width: 40px;
        height: 40px;
        border-radius: 20%;
        margin-left: 10px;
        background-color: rgb(49, 75, 109);
        display: flex;
        justify-content: center;
        align-items: center;

        .svg-icon {
            width: 30px;
            height: 30px;
        }
    }

    .groups-info {
        margin-left: 20px;
        height: 40px;
        color: rgb(205, 202, 202);
        cursor: default;

        .groups-name {
            height: 20px;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;

            input {
                outline: none;
                border: none;
                background-color: rgb(217, 219, 222);
                width: 60%;
                height: 100%;
                font-size: 16px;
                border-radius: 5px;
            }
        }

        .groups-desc {
            height: 20px;
            font-size: 13px;
        }
    }

    .groups-btn {
        margin-left: auto; // 使按钮靠右对齐
        margin-right: 10px;
        display: flex;
        align-items: center;
        opacity: 0; // 初始时隐藏
        visibility: hidden; // 初始时隐藏

        div {
            width: 35px;
            height: 35px;
            background-color: rgb(57, 69, 69);
            margin-right: 10px;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;

            &:hover {
                background-color: rgb(111, 132, 132);
                cursor: pointer;
            }
        }

        .groups-btn-delete {
            background-color: rgb(108, 66, 66);

            &:hover {
                background-color: rgb(132, 93, 93);
            }
        }

        .svg-btn {
            width: 20px;
            height: 20px;
        }
    }

    &:hover .groups-btn {
        opacity: 1; // 鼠标悬停时显示按钮
        visibility: visible; // 鼠标悬停时显示按钮
    }
}

.groups-hosts {
    width: 90%;
    margin-left: 30px;
    border-left: 1px solid rgb(102, 102, 102);
}
</style>