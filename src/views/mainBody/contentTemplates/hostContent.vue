<script setup lang="ts">
import CustomButton from '@/templates/CustomButton.vue';
import GroupsTemplate from '@/templates/GroupsTemplate.vue';
import { SequenceUtil } from '@/utils/SequenceUtil'
import { terminalStore } from '@/stores/terminalStore';
import HostsTemplate from '@/templates/HostsTemplate.vue';
const { setTerminalStatus } = terminalStore()
import TerminalLabel from '@/interfaces/TerminalInfo';
import { terminalLabelStore } from '@/stores/terminalLabelStore';
import { ref } from 'vue';
import HostInfo from '@/interfaces/HostInfo';
import GroupInfo from '@/interfaces/GroupInfo';
import HostConnectTemplate from '@/templates/HostConnectTemplate.vue';
const { addTerminalLabel, setTerminalLabelStoreId } = terminalLabelStore();

const onNewTermial = () => {
    //打开终端界面
    setTerminalStatus('terminal')
    const terminalLabel: TerminalLabel = {
        terminalId: SequenceUtil.nextId(),
        terminalName: 'Local Terminal',
        terminalType: '0',
        terminalIp: '',
        terminalPort: '',
        terminalUserName: '',
        terminalPassword: ''
    }
    addTerminalLabel(terminalLabel);
    setTerminalLabelStoreId(terminalLabel.terminalId)
}
const hostInfos = ref<HostInfo[]>([
    {
        hostId: SequenceUtil.nextId(),
        hostName: 'CentOs',
        hostIp: '8.153.66.250',
        hostPort: '22',
        hostUserName: 'root',
        hostPassword: 'loan!1234',
    },
    {
        hostId: SequenceUtil.nextId(),
        hostName: '测试1',
        hostIp: '127.0.0.1',
        hostPort: '22',
        hostUserName: 'root',
        hostPassword: 'loan!1234',
    }
]);
// Groups Hosts 初始数据
const groupInfos = ref<GroupInfo[]>([
    {
        groupId: SequenceUtil.nextId(),
        groupName: '测试组1',
        groupHosts: hostInfos.value
    },
    {
        groupId: SequenceUtil.nextId(),
        groupName: '测试组2',
        groupHosts: hostInfos.value
    }
]);

// 编辑连接信息窗口
const hostDialogStatus = ref<boolean>(false);
const editHostDialogStatus = (status: boolean) => {
    hostDialogStatus.value = status;
}
</script>

<template>
    <div id="hostContent">
        <div class="hostHeader">
            <div class="hostTitle">
                <CustomButton :title="'终端'" :svgIcon="'icon-terminal'" @click="onNewTermial()" />
            </div>
            <div class="hostTitle">
                <CustomButton :title="'新建组'" :svgIcon="'icon-zuzhiqunzu'" />
            </div>
            <div class="hostTitle" @click="hostDialogStatus = true">
                <CustomButton :title="'新建连接'" :svgIcon="'icon-host'" />
            </div>
        </div>
        <div class="hostBody">
            <div class="body-groups">
                <div class="body-title">
                    Groups
                </div>
                <div class="body-style">
                    <GroupsTemplate :groupInfos="groupInfos" />
                </div>
            </div>
            <div class="body-hosts">
                <div class="body-title">
                    Hosts
                </div>
                <div class="body-style">
                    <HostsTemplate :hostInfos="hostInfos" />
                </div>
            </div>
        </div>
    </div>
    <div v-if="hostDialogStatus == true">
        <HostConnectTemplate @editHostDialogStatus="editHostDialogStatus" />
    </div>
</template>

<style lang="scss" scoped>
#hostContent {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .hostHeader {
        height: 60px;
        width: 100%;
        background-color: #30303c;
        display: flex;
        align-items: center;

        .hostTitle {
            margin-left: 10px;
        }
    }

    .hostBody {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;

        .body-style {
            width: 100%;
        }

        .body-title {
            width: 100%;
            height: 30px;
            display: flex;
            align-items: center;
            color: white;
            font-weight: bold;
        }

        .body-groups {
            width: 90%;
            margin-top: 50px;
        }

        .body-hosts {
            margin-top: 50px;
            width: 90%;
        }
    }
}
</style>