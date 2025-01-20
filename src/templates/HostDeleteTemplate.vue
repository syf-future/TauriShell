<script setup lang="ts">
import { onMounted, ref, defineEmits, defineProps } from 'vue'
import MessageInfo from '@/utils/MessagePop'
import { groupInfosStore } from '@/stores/groupInfosStore';
import { hostInfosStore } from '@/stores/hostInfosStore';
const { deleteGroupInfo, deleteGroupHostInfo } = groupInfosStore()
const { deleteHostInfo } = hostInfosStore()
// 组件展示状态
const dialogTableVisible = ref(false)
onMounted(() => {
    dialogTableVisible.value = true
})
// 接收父组件传来的数据
const props = defineProps<{
    hostId?: string;
    groupId?: string
}>();
const { hostId, groupId } = props;

// 向父组件传递状态
const emit = defineEmits(['deleteHostDialogStatus'])
const deleteHostDialogStatus = () => {
    emit('deleteHostDialogStatus', false)
}
// 组件关闭时触发子传父
function clickClose() {
    dialogTableVisible.value = false
    deleteHostDialogStatus()
}



// 点击确定
function clickSuccess() {
    console.log(hostId, groupId);
    // 删除host信息
    if (hostId && !groupId) {
        deleteHostInfo(hostId)
    } else if (groupId && !hostId) {
        // 删除group信息
        deleteGroupInfo(groupId)
    } else if (groupId && hostId) {
        // 删除group里的host信息
        deleteGroupHostInfo(hostId, groupId)
    }
    MessageInfo.success('删除成功')
    clickClose()
}
</script>

<template>
    <el-dialog v-model="dialogTableVisible" title="删除信息" width="500" @close="clickClose">
        <span>确定要删除吗？</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="clickClose()">取消</el-button>
                <el-button type="danger" @click="clickSuccess()">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped></style>