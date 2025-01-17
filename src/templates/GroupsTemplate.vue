<script setup lang="ts">
import SvgIcon from '@/components/icons.vue';
import GroupInfo from '@/interfaces/GroupInfo';
import HostsTemplate from '@/templates/HostsTemplate.vue';
import { defineProps } from 'vue';

import { ref } from 'vue';

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

const props = defineProps<{
    groupInfos?: GroupInfo[]
}>();
const { groupInfos } = props;
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
                    {{ groupInfo.groupName }}
                </div>
                <div class="groups-desc">
                    {{ groupInfo.groupHosts.length }} Host
                </div>
            </div>
            <!-- 功能按钮 -->
            <div class="groups-btn">
                <!-- 新建连接 -->
                <el-tooltip content="新建连接" placement="top">
                    <div @click.stop="">
                        <SvgIcon class="svg-btn" iconName="icon-lianjie" />
                    </div>
                </el-tooltip>

                <!-- 编辑 -->
                <el-tooltip content="编辑" placement="top">
                    <div @click.stop="">
                        <SvgIcon class="svg-btn" iconName="icon-bianji" />
                    </div>
                </el-tooltip>

                <!-- 删除 -->
                <el-tooltip content="删除" placement="top">
                    <div class="groups-btn-delete" @click.stop="">
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

        .groups-name {
            height: 20px;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
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