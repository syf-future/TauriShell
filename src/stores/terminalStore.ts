import { defineStore } from "pinia";
import { ref } from "vue";

export const terminalStore = defineStore("terminalStore", () => {
    const terminalStatus = ref<string>('0');
    function setTerminalStatus(state: string): void {
        terminalStatus.value = state;
    }

    return { terminalStatus, setTerminalStatus }
})