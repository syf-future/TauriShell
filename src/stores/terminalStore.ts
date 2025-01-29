import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * 终端状态管理   用于显示点击侧边栏的界面
 */
export const terminalStore = defineStore("terminalStore", () => {
    const terminalStatus = ref<string>('0');
    function setTerminalStatus(state: string): void {
        terminalStatus.value = state;
    }

    return { terminalStatus, setTerminalStatus }
})