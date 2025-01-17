<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import TerminalLabel from '@/interfaces/TerminalInfo';
import { terminalLabelStore } from '@/stores/terminalLabelStore';
import Terminal from './templates/terminal.vue';
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
        <KeepAlive>
            <Terminal v-for="(terminalLabel) in terminalLabelList" :key="terminalLabel.terminalId"
                v-show="terminalLabel.terminalId === terminalLabelId" />
        </KeepAlive>
    </div>
</template>

<style lang="scss" scoped>
#terminal-view {
    height: 100%;
    width: 100%;
}
</style>