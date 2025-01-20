<script setup lang="ts">
import SvgIcon from '@/components/icons.vue';
import HostInfo from '@/interfaces/HostInfo';
import { SequenceUtil } from '@/utils/SequenceUtil';
import { onMounted, ref, defineEmits, defineProps } from 'vue'
import MessageInfo from '@/utils/MessagePop'
import { groupInfosStore } from '@/stores/groupInfosStore';
import { hostInfosStore } from '@/stores/hostInfosStore';
import { FormInstance } from 'element-plus';
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
function clickSuccess(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.validate((valid) => {
        console.log(valid);
        if (valid) {
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
            MessageInfo.success("编辑成功")
            dialogFormVisible.value = false
            editHostDialogStatus()
        }
    })

}

/**
 * 点击测试连接
 */
function clickConnectTest() {
    MessageInfo.success("连接测试成功")
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

const ruleFormRef = ref<FormInstance>()
const rules = {
    hostName: [
        { required: true, message: '请输入主机名称', trigger: 'blur' }
    ],
    hostIp: [
        { required: true, message: '请输入主机IP', trigger: 'blur' }
    ],
    hostPort: [
        { required: true, message: '请输入主机端口', trigger: 'blur' }
    ],
    hostConnect: [
        { required: true, message: '请选择连接方式', trigger: 'change' }
    ],
    hostUserName: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    hostPassword: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
};
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
        <el-form :model="form" :rules="rules" class="dialogFormStyle" ref="ruleFormRef">
            <el-form-item label="主机名称：" prop="hostName" class="custom-form-item">
                <el-input v-model="form.hostName" style="width: 240px" placeholder="输入名称" />
            </el-form-item>
            <el-form-item label="主机IP：" prop="hostIp" class="custom-form-item">
                <el-input v-model="form.hostIp" style="width: 240px" placeholder="输入IP" />
            </el-form-item>
            <el-form-item label="主机端口" prop="hostPort" class="custom-form-item">
                <el-input v-model="form.hostPort" style="width: 50px" placeholder="端口" />
            </el-form-item>

            <el-form-item label="连接方式" prop="hostConnect" class="custom-form-item">
                <el-select v-model="form.hostConnect" style="width: 150px">
                    <el-option v-for="item in connectMode" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>

            <el-form-item label="用户名" prop="hostUserName" class="custom-form-item">
                <el-input v-model="form.hostUserName" style="width: 240px" placeholder="输入用户名" />
            </el-form-item>
            <el-form-item label="密码" prop="hostPassword" class="custom-form-item">
                <el-input v-model="form.hostPassword" style="width: 240px" placeholder="输入密码" />
            </el-form-item>
        </el-form>
        <div class="dialogBtn">
            <div>
                <el-button type="success" plain @click="clickConnectTest()">测试连接</el-button>
            </div>
            <div>
                <el-button plain @click="clickClose()">返回</el-button>
                <el-button type="primary" plain @click="clickSuccess(ruleFormRef)">确定</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<style lang="scss">
.hostDialog {
    width: 500px;
    height: 600px;
    background-color: rgb(225, 225, 223);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
}

// 标题
.dialogTitle {
    height: 5%;
    width: 100%;
    color: rgb(82, 77, 77);
    font-size: 26px;
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
            margin-top: 2px;
            font-size: 12px;
            color: #000;
            cursor: default;
        }
    }
}

// 表单部分占据剩余空间
.dialogFormStyle {
    padding: 20px;
    margin-top: 10px;
    border: 1px solid #b9bdbd;

    .custom-form-item {
        margin-bottom: 25px;
    }

    .custom-form-item .el-form-item__label {
        color: #434242;
        font-size: 16px;
        width: 120px;
        justify-content: flex-start;
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