<script setup lang="ts">
import SvgIcon from '@/components/icons.vue';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import TerminalLabel from '@/interfaces/TerminalInfo';
import { terminalLabelStore } from '@/stores/terminalLabelStore';
const { terminalLabelStoreMap } = storeToRefs(terminalLabelStore());
const { terminalLabelStoreId } = storeToRefs(terminalLabelStore());
const { forEachTerminalLabel, deleteTerminalLabel, getTerminalLabelStoreId, setTerminalLabelStoreId } = terminalLabelStore();
import { terminalStore } from '@/stores/terminalStore';
const { setTerminalStatus } = terminalStore()


const terminalLabelList = ref<TerminalLabel[]>(forEachTerminalLabel());
//监听终端标签的变化
watch(terminalLabelStoreMap.value, () => {
    terminalLabelList.value = forEachTerminalLabel();
});
watch(terminalLabelStoreId, () => {
    terminalLabelId.value = terminalLabelStoreId.value;
})

//当前终端标签id
const terminalLabelId = ref<string>(getTerminalLabelStoreId());

//点击终端标签
function clickTerminalLabel(terminalId: string): void {
    console.log("切换终端");
    setTerminalLabelStoreId(terminalId)
    setTerminalStatus('terminal')
    terminalLabelId.value = getTerminalLabelStoreId();
}

// 关闭终端标签
function closeTerminalLabel(terminalId: string): void {
    deleteTerminalLabel(terminalId)
    const terminalLabels = forEachTerminalLabel();
    console.log("终端剩余数量：" + terminalLabels.length);

    if (terminalLabels.length === 0) {
        console.log("没有终端标签");
        setTerminalStatus('0')
        setTerminalLabelStoreId('')
    } else {
        if (terminalId === terminalLabelId.value) {
            setTerminalLabelStoreId(terminalLabelList.value[0].terminalId)
        }
    }
}


//点击sftp
// import { invoke } from '@tauri-apps/api/core';
function clickSftpLabel(): void {
    // invoke('local_terminal', { command: 'pwd', terminalId:'0'})
    //     .then((res) => {
    //         console.log('调用成功');
    //         console.log(res)
    //     }).catch((err) => {
    //         console.log('调用失败')
    //         console.log(err)
    //     })
}
</script>

<template>
    <div id="main-label">
        <!-- SFTP标签 -->
        <div class="label-sftp" @click="clickSftpLabel()">
            <SvgIcon class="svg-icon-style" iconName="icon-SFTPguanli" />
            <span class="label-text">SFTP</span>
        </div>
        <!-- 终端标签 -->
        <div class="label-terminal">
            <!-- 终端标签子项 -->
            <div class="label-terminal-item" v-for="(terminalLabel) in terminalLabelList"
                :key="terminalLabel.terminalId" :class="{ active: terminalLabelId === terminalLabel.terminalId }"
                @click="clickTerminalLabel(terminalLabel.terminalId)">
                <!-- 终端图标 -->
                <SvgIcon class=" svg-icon-style" iconName="icon-terminal" />
                <!-- 终端名称 -->
                <span class="label-text">{{ terminalLabel.terminalName }}</span>
                <!-- 关闭按钮 -->
                <div class="closeIcon" @click.stop="closeTerminalLabel(terminalLabel.terminalId)">
                    <SvgIcon class="svg-icon" iconName="icon-guanbi" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#main-label {
    background-color: #25252e;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
}

.label-sftp {
    height: 35px;
    // width: 70px;
    background-color: rgb(89, 107, 109);
    margin-left: 10px;
    border-radius: 10px;
    display: flex;
    align-items: center;

    &:hover {
        box-shadow: 0 0 6px rgb(107, 101, 113);
        background-color: rgb(114, 131, 133);
        cursor: pointer;
    }
}

.svg-icon-style {
    width: 20px;
    height: 20px;
    margin-left: 5px;
}

.label-terminal {
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    // background-color: rgb(34, 69, 73);

    .label-terminal-item {
        height: 35px;
        background-color: rgb(89, 107, 109);
        margin-left: 10px;
        border-radius: 10px;
        display: flex;
        align-items: center;

        &:hover {
            box-shadow: 0 0 6px rgb(107, 101, 113);
            background-color: rgb(114, 131, 133);
            cursor: default;
        }

        &.active {
            background-color: rgb(140, 153, 156);
            // border: #c1c1c6 1px solid;
        }
    }
}

.closeIcon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    border-radius: 20%;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: rgb(111, 109, 109);
        cursor: pointer;
    }

    .svg-icon {
        width: 15px;
        height: 15px;
    }
}

.label-text {
    margin-left: 5px;
    margin-right: 5px;
    color: white;
    font-size: 14px;
}
</style>