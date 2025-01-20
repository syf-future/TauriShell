<script setup lang="ts">
import { defineProps, ref } from 'vue';
import SvgIcon from '@/components/icons.vue';
import HostInfo from '@/interfaces/HostInfo';
import HostConnectTemplate from './HostConnectTemplate.vue';

// 接收父组件传来的数据
const props = defineProps<{
    hostInfos?: HostInfo[];
}>();
const { hostInfos } = props;

// 连接服务器
function connectServer(hostInfo: HostInfo): void {
    console.log("开始连接服务器：", hostInfo);
};

// 编辑连接信息窗口
const hostDialogStatus = ref<boolean>(false);
const editHostDialogStatus = (status: boolean) => {
    hostDialogStatus.value = status;
}

function clickEditHost() {
    hostDialogStatus.value = true;
}
</script>

<template>
    <div id="hostsStyle" v-for="hostInfo in hostInfos" :key="hostInfo.hostId">
        <div class="hosts-template" @dblclick="connectServer(hostInfo)">
            <!-- 图标 -->
            <div class="groups-icon">
                <SvgIcon class="svg-icon" iconName="icon-terminal" />
            </div>
            <!-- Hosts信息 -->
            <div class="groups-info">
                <div class="groups-name">
                    {{ hostInfo.hostName }}
                </div>
                <div class="groups-desc">
                    ({{ hostInfo.hostIp }}:{{ hostInfo.hostPort }})
                </div>
            </div>
            <!-- 功能按钮 -->
            <div class="groups-btn">
                <!-- 编辑 -->
                <div @click.stop="clickEditHost()">
                    <SvgIcon class="svg-btn" iconName="icon-bianji" />
                </div>
                <!-- 删除 -->
                <div class="groups-btn-delete" @click.stop="">
                    <SvgIcon class="svg-btn" iconName="icon-ai-delete" />
                </div>
            </div>
        </div>
    </div>
    <div v-if="hostDialogStatus == true">
        <HostConnectTemplate @editHostDialogStatus="editHostDialogStatus" />
    </div>
</template>


<style lang="scss" scoped>
#hostsStyle {
    width: 100%;
}

.hosts-template {
    width: 100%;
    min-height: 40px;
    display: flex;
    align-items: center;

    &:hover {
        background-color: rgb(87, 87, 88);
    }

    .groups-icon {
        width: 30px;
        height: 30px;
        border-radius: 20%;
        margin-left: 10px;
        background-color: rgb(90, 138, 67);
        display: flex;
        justify-content: center;
        align-items: center;

        .svg-icon {
            width: 15px;
            height: 15px;
        }
    }

    .groups-info {
        margin-left: 20px;
        height: 40px;
        color: rgb(205, 202, 202);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: default;

        .groups-name {
            height: 20px;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
        }

        .groups-desc {
            margin-left: 5px;
            color: #afadad;
            height: 20px;
            font-size: 13px;
            display: flex;
            align-items: center;
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
            width: 30px;
            height: 30px;
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
            width: 15px;
            height: 15px;
        }
    }

    &:hover .groups-btn {
        opacity: 1; // 鼠标悬停时显示按钮
        visibility: visible; // 鼠标悬停时显示按钮
    }
}
</style>