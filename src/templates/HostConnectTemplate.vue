<script setup lang="ts">
import SvgIcon from '@/components/icons.vue';
import HostInfo from '@/interfaces/HostInfo';
import { SequenceUtil } from '@/utils/SequenceUtil';
import { onMounted, ref, defineEmits, defineProps } from 'vue'
import { groupInfosStore } from '@/stores/groupInfosStore';
import { hostInfosStore } from '@/stores/hostInfosStore';
const { updateGroupHostInfo } = groupInfosStore()
const { addHostInfo, updateHostInfo } = hostInfosStore()

// 接收父组件传来的数据
const props = defineProps<{
    hostInfo?: HostInfo;
    groupId?: string
}>();
const { hostInfo, groupId } = props;
const addOrEdit = ref<boolean>(false)
// 向父组件传递状态
const emit = defineEmits(['editHostDialogStatus'])
const editHostDialogStatus = () => {
    emit('editHostDialogStatus', false)
}

// 组件展示状态
const dialogFormVisible = ref<boolean>(true)
onMounted(() => {
    dialogFormVisible.value = true
    if (hostInfo) {
        addOrEdit.value = true
        form.value = hostInfo
    }
})
/**
 * 点击关闭
 */
function clickClose() {
    dialogFormVisible.value = false
    editHostDialogStatus()
}
/**
 * 点击确定
 */
function clickSuccess() {
    // 新增或编辑
    if (hostInfo) {
        // 编辑
        if (groupId) {
            updateGroupHostInfo(form.value, groupId)
        } else {
            updateHostInfo(form.value)
        }
    } else {
        // 新增
        if (groupId) {
            updateGroupHostInfo(form.value, groupId)
        } else {
            addHostInfo(form.value)
        }
    }
    dialogFormVisible.value = false
    editHostDialogStatus()
}
// 表单数据
const form = ref<HostInfo>({
    hostId: SequenceUtil.nextId(),
    hostName: '',
    hostIp: '',
    hostPort: '22',
    hostUserName: '',
    hostPassword: '',
    hostConnect: '账号/密码'
})
const connectTypeStatus = ref<string>('0')
function clickConnectType(type: string) {
    connectTypeStatus.value = type
}
// 连接方式
const connectMode = ref(['账号/密码', '公钥'])
</script>

<template>
    <el-dialog v-model="dialogFormVisible" @close="clickClose" class="hostDialog">
        <div class="dialogTitle" v-if="!addOrEdit">
            新建连接
        </div>
        <div class="dialogTitle" v-if="addOrEdit">
            编辑连接
        </div>
        <div class="dialogConnectType">
            <div class="dialogConnectTypeItem" :class="{ active: connectTypeStatus === '0' }"
                @click="clickConnectType('0')">
                <SvgIcon class="svg-icon" iconName="icon-yuanchenglianjie" />
                <span>SSH</span>
            </div>
            <div class="dialogConnectTypeItem" :class="{ active: connectTypeStatus === '1' }"
                @click="clickConnectType('1')">
                <SvgIcon class="svg-icon" iconName="icon-SFTP" />
                <span>SFTP</span>
            </div>
        </div>
        <el-form :model="form" class="dialogFormStyle">
            <div class="formItemInput">
                <span>主机名称：</span>
                <el-input v-model="form.hostName" style="width: 240px" placeholder="输入名称" />
            </div>
            <div class="formItemInput">
                <span>主机IP：</span>
                <el-input v-model="form.hostIp" style="width: 240px" placeholder="输入IP" />
            </div>
            <div class="formItemInput">
                <span>主机端口：</span>
                <el-input v-model="form.hostPort" style="width: 50px" placeholder="端口" />
            </div>

            <div class="formItemInput">
                <span>连接方式：</span>
                <el-select v-model="form.hostConnect" style="width: 150px">
                    <el-option v-for="item in connectMode" :key="item" :label="item" :value="item" />
                </el-select>
            </div>

            <div class="formItemInput">
                <span>用户名：</span>
                <el-input v-model="form.hostUserName" style="width: 240px" placeholder="输入用户名" />
            </div>
            <div class="formItemInput">
                <span>密码：</span>
                <el-input v-model="form.hostPassword" style="width: 240px" placeholder="输入密码" />
            </div>
        </el-form>
        <div class="dialogBtn">
            <div>
                <el-button plain>测试连接</el-button>
            </div>
            <div>
                <el-button plain @click="clickClose()">返回</el-button>
                <el-button type="primary" plain @click="clickSuccess()">确定</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<style lang="scss">
.hostDialog {
    width: 35%;
    height: 70%;
    background-color: rgb(225, 225, 223);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
}

// 标题
.dialogTitle {
    height: 24px;
    width: 100%;
    color: rgb(82, 77, 77);
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 4px;
    text-align: center;
}

// 连接类型
.dialogConnectType {
    margin-top: 10px;
    width: 100%;
    height: 45px;
    display: flex;
    align-items: center;

    .dialogConnectTypeItem {
        width: 45px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid transparent;
        border-radius: 5px;

        &:hover {
            border: 1px solid #aaabab;
            background-color: #d3d5d5;
        }

        &.active {
            border: 1px solid #8e9090;
            background-color: #b1b3b3;
        }

        .svg-icon {
            width: 20px;
            height: 20px;
        }

        span {
            font-size: 12px;
            cursor: default;
        }
    }
}

// 表单部分占据剩余空间
.dialogFormStyle {
    padding: 20px;
    margin-top: 10px;
    border: 1px solid #d3d5d5;
    overflow-y: auto;

    .formItemInput {
        margin-top: 20px;
        display: flex;
        align-items: center;

        span {
            width: 100px;
            font-size: 16px;
            cursor: default;
            color: #000;
        }
    }
}

// 按钮部分
.dialogBtn {
    width: 100%;
    height: 50px;
    margin-top: 10px;
    display: flex;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>