<script setup lang="ts">
import SvgIcon from '@/components/icons.vue';
import { storeToRefs } from 'pinia';
import { terminalStore } from '@/stores/terminalStore';
import { terminalLabelStore } from '@/stores/terminalLabelStore';
const { terminalStatus } = storeToRefs(terminalStore());
const { setTerminalStatus } = terminalStore()
const { setTerminalLabelStoreId } = terminalLabelStore();
function clickSidebar(status: string): void {
    setTerminalStatus(status)
    setTerminalLabelStoreId('')
}
</script>

<template>
    <div class="sidebar-content">
        <el-tooltip effect="light" content="主页" placement="right">
            <div class="icon-item" @click="clickSidebar('0')" :class="{ active: terminalStatus === '0' }">
                <SvgIcon class="svg-icon" iconName="icon-hosts" />
            </div>
        </el-tooltip>
        <el-tooltip effect="light" content="密钥" placement="right">
            <div class="icon-item" @click="clickSidebar('1')" :class="{ active: terminalStatus === '1' }">
                <SvgIcon class="svg-icon" iconName="icon-key" />
            </div>
        </el-tooltip>

    </div>
</template>

<style lang="scss" scoped>
.sidebar-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;

    .icon-item {
        width: 50px;
        height: 50px;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;

        &:hover {
            cursor: pointer;
            background-color: #4b4b53;
        }

        &.active {
            background-color: #4b4b53;
        }
    }
}
</style>