/**
 * 终端标签
 */
import TerminalInfo from "@/interfaces/TerminalInfo";
import { defineStore } from "pinia";
import { ref } from "vue";

export const terminalLabelStore = defineStore("terminalLabelStore", () => {
    // 终端标签列表
    const terminalLabelStoreMap = ref<Map<string, TerminalInfo>>(new Map<string, TerminalInfo>());
    // 当前选中的终端标签ID
    const terminalLabelStoreId = ref<string>("");
    function setTerminalLabelStoreId(terminalId: string): void {
        terminalLabelStoreId.value = terminalId;
        console.log("设置终端id：{}", terminalId);

    }
    function getTerminalLabelStoreId(): string {
        return terminalLabelStoreId.value;
    }
    /**
     * 添加终端标签
     * @param terminalLabel 
     */
    function addTerminalLabel(terminalLabel: TerminalInfo): void {
        terminalLabelStoreMap.value.set(terminalLabel.terminalId, terminalLabel);
    }
    /**
     * 删除终端标签
     * @param terminalId 
     */
    function deleteTerminalLabel(terminalId: string): void {
        terminalLabelStoreMap.value.delete(terminalId);
    }
    /**
     * 遍历终端标签
     */
    function forEachTerminalLabel(): TerminalInfo[] {
        const terminalLabelList: TerminalInfo[] = [];
        terminalLabelStoreMap.value.forEach((value) => {
            terminalLabelList.push(value);
        })
        return terminalLabelList;
    }
    return {
        terminalLabelStoreMap, terminalLabelStoreId,
        setTerminalLabelStoreId, getTerminalLabelStoreId,
        addTerminalLabel, deleteTerminalLabel, forEachTerminalLabel
    }
})