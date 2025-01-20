<script setup lang="ts">
import CustomButton from '@/templates/CustomButton.vue';
import GroupsTemplate from '@/templates/GroupsTemplate.vue';
import { SequenceUtil } from '@/utils/SequenceUtil'
import { terminalStore } from '@/stores/terminalStore';
import HostsTemplate from '@/templates/HostsTemplate.vue';
const { setTerminalStatus } = terminalStore()
import TerminalLabel from '@/interfaces/TerminalInfo';
import { terminalLabelStore } from '@/stores/terminalLabelStore';
import { ref, onBeforeUnmount } from 'vue';
import HostConnectTemplate from '@/templates/HostConnectTemplate.vue';
import { storeToRefs } from 'pinia';
import { hostInfosStore } from '@/stores/hostInfosStore';
import { groupInfosStore } from '@/stores/groupInfosStore';
const { addGroupInfo } = groupInfosStore();
/**
 * 新建终端
 */
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

/**
 * 打开新建连接子页面
 */
const hostDialogStatus = ref<boolean>(false);
// 回调函数 用于设置子页面的关闭
const editHostDialogStatus = (status: boolean) => {
    hostDialogStatus.value = status;
}

/**
 * 获取pinia的hostInfos信息
 */
const { hostInfos } = storeToRefs(hostInfosStore());
const { getHostInfoStore } = hostInfosStore()
onBeforeUnmount(async () => {
    hostInfos.value = await getHostInfoStore();
});
</script>

<template>
    <div id="hostContent">
        <div class="hostHeader">
            <div class="hostTitle" @click="onNewTermial()">
                <CustomButton :title="'终端'" :svgIcon="'icon-terminal'" />
            </div>
            <div class="hostTitle" @click="addGroupInfo()">
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
                    <GroupsTemplate />
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