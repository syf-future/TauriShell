<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import TerminalLabel from '@/interfaces/TerminalInfo';
import { terminalLabelStore } from '@/stores/terminalLabelStore';
import Terminal from './templates/terminal.vue';
import SshTerminal from './templates/sshTerminal.vue';
const { terminalLabelStoreMap, terminalLabelStoreId } = storeToRefs(terminalLabelStore());
const { forEachTerminalLabel, getTerminalLabelStoreId } = terminalLabelStore();


//监听终端标签的变化
const terminalLabelList = ref<TerminalLabel[]>(forEachTerminalLabel());
watch(terminalLabelStoreMap.value, () => {
    terminalLabelList.value = forEachTerminalLabel();
});

//监听点击终端标签的变化
const terminalLabelId = ref<string>(getTerminalLabelStoreId());
watch(terminalLabelStoreId, () => {
    terminalLabelId.value = terminalLabelStoreId.value;
});
</script>

<template>
    <div id="terminal-view">
        <KeepAlive v-for="terminalLabel in terminalLabelList" :key="terminalLabel.terminalId"
            v-show="terminalLabel.terminalId === terminalLabelId">
            <Terminal v-if="terminalLabel.terminalType === '0'" />
            <SshTerminal v-else-if="terminalLabel.terminalType === '1'" :connectInfo="terminalLabel" />
        </KeepAlive>
    </div>
</template>

<style lang="scss" scoped>
#terminal-view {
    height: 100%;
    width: 100%;
}
</style>