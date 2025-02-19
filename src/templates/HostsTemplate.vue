<script setup lang="ts">
import { defineProps, ref } from 'vue';
import SvgIcon from '@/components/icons.vue';
import HostInfo from '@/interfaces/HostInfo';
import HostConnectTemplate from './HostConnectTemplate.vue';
import HostDeleteTemplate from './HostDeleteTemplate.vue';

// 接收父组件传来的数据
const props = defineProps<{
    hostInfos: HostInfo[];
    groupId?: string;
}>();
const { hostInfos, groupId } = props;



/**
 * 点击编辑 打开编辑子页面
 */
const hostDialogStatus = ref<boolean>(false);
// 编辑子页面回调函数(子传父)
const editHostDialogStatus = (status: boolean) => {
    hostDialogStatus.value = status;
}
const hostInfo = ref<HostInfo | undefined>(undefined);
// 点击编辑
function clickEditHost(host_info: HostInfo) {
    hostInfo.value = host_info;
    hostDialogStatus.value = true;
}

/**
 * 点击删除  打开删除确认弹窗
 */
const hostDeleteStatus = ref<boolean>(false);
// 点击删除确认弹窗回调函数(子传父)
const deleteHostDialogStatus = (status: boolean) => {
    hostDeleteStatus.value = status;
}
// 点击删除确认弹窗确定按钮
const hostId = ref<string | undefined>(undefined);
function clickDeleteHost(host_id: string) {
    hostDeleteStatus.value = true;
    hostId.value = host_id;
}




/**
 * 双击打开终端
 */
import { terminalStore } from '@/stores/terminalStore';
import { terminalLabelStore } from '@/stores/terminalLabelStore';
import { SequenceUtil } from '@/utils/SequenceUtil';
import TerminalLabel from '@/interfaces/TerminalInfo';

/**
 * 新建终端
 */
const { setTerminalStatus } = terminalStore()
const { addTerminalLabel, setTerminalLabelStoreId } = terminalLabelStore();
// 连接服务器
function connectServer(hostInfo: HostInfo): void {
    //打开终端界面
    const terminalLabel: TerminalLabel = {
        terminalId: SequenceUtil.nextId(),
        terminalName: hostInfo.hostName,
        terminalType: '1',
        terminalIp: hostInfo.hostIp,
        terminalPort: hostInfo.hostPort,
        terminalUserName: hostInfo.hostUserName,
        terminalPassword: hostInfo.hostPassword,
        terminalIsSftp: false
    }
    // 设置界面为终端界面
    setTerminalStatus('terminal')
    // 保存终端信息到store
    addTerminalLabel(terminalLabel);
    // 设置当前终端的storeId  (选中标签)
    setTerminalLabelStoreId(terminalLabel.terminalId)
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
                <div @click.stop="clickEditHost(hostInfo)">
                    <SvgIcon class="svg-btn" iconName="icon-bianji" />
                </div>
                <!-- 删除 -->
                <div class="groups-btn-delete" @click.stop="clickDeleteHost(hostInfo.hostId)">
                    <SvgIcon class="svg-btn" iconName="icon-ai-delete" />
                </div>
            </div>
        </div>
    </div>
    <div v-if="hostDialogStatus == true">
        <HostConnectTemplate :hostInfo="hostInfo" :groupId="groupId" @editHostDialogStatus="editHostDialogStatus" />
    </div>
    <div v-if="hostDeleteStatus == true">
        <HostDeleteTemplate :hostId="hostId" :groupId="groupId" @deleteHostDialogStatus="deleteHostDialogStatus" />
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