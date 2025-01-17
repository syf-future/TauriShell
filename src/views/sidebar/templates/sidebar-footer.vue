<script setup lang="ts">
import SvgIcon from '@/components/icons.vue';
import { storeToRefs } from 'pinia';
import { terminalStore } from '@/stores/terminalStore';
const { terminalStatus } = storeToRefs(terminalStore());
const { setTerminalStatus } = terminalStore()

const goToGithub = () => {
    window.open('https://github.com', '_blank');
};
</script>

<template>
    <div class="sidebar-content">
        <div class="icon-item" @click="goToGithub()">
            <SvgIcon class="svg-icon" iconName="icon-github" />
        </div>
        <el-tooltip effect="light" content="设置" placement="right">
            <div class="icon-item" @click="setTerminalStatus('2')" :class="{ active: terminalStatus === '2' }">
                <SvgIcon class="svg-icon" iconName="icon-shezhi" />
            </div>
        </el-tooltip>

    </div>
</template>

<style lang="scss" scoped>
.sidebar-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    .icon-item {
        width: 45px;
        height: 45px;
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