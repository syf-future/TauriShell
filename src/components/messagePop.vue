<template>
    <div class="message-container" :class="position" v-if="visible">
        <div class="message" :class="type">
            <el-icon v-if="type === 'info'">
                <InfoFilled />
            </el-icon>
            <el-icon v-if="type === 'success'">
                <SuccessFilled />
            </el-icon>
            <el-icon v-if="type === 'warning'">
                <WarningFilled />
            </el-icon>
            <el-icon v-if="type === 'error'">
                <CircleCloseFilled />
            </el-icon>
            <span class="title">{{ message }}</span>
            <!-- <button class="close" @click="close">x</button> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { InfoFilled, SuccessFilled, WarningFilled, CircleCloseFilled } from '@element-plus/icons-vue'

const props = defineProps({
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: 'info', // 支持 info, success, warning, error
    },
    duration: {
        type: Number,
        default: 1000, // 默认1秒后自动关闭
    },
    position: {
        type: String,
        default: 'top', // 支持 top-right, top-left, bottom-right, bottom-left
    },
});

const visible = ref(true);

// 自动关闭
onMounted(() => {
    setTimeout(() => {
        visible.value = false;
    }, props.duration);
});
</script>

<style scoped>
.message-container {
    /* 固定定位 */
    position: fixed;
    /* 堆叠顺序，值越大，元素越靠上显示 */
    z-index: 9999;
    /* padding: 10px; */
}

.message-container.top {
    top: 20px;
    /* 距离顶部 20px */
    left: 50%;
    /* 将容器的左侧移动到页面宽度的 50% */
    transform: translateX(-50%);
    /* 再向左偏移自身宽度的 50%，实现居中 */
}

.message-container.top-right {
    top: 20px;
    right: 20px;
}

.message-container.top-left {
    top: 20px;
    left: 20px;
}

.message-container.bottom-right {
    bottom: 20px;
    right: 20px;
}

.message-container.bottom-left {
    bottom: 20px;
    left: 20px;
}

.message {
    padding: 10px 10px;
    border-radius: 5px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    /* 动画效果 */
    animation: slideIn 0.3s ease-in-out forwards;

    .title {
        margin-left: 10px;
    }
}

/* 定义动画 */
@keyframes slideIn {
    from {
        transform: translateY(-100px);
        /* 从上方滑入 */
        /* 初始位置从上方滑入 */
        opacity: 0;
    }

    to {
        transform: translateY(0);
        /* 完全显示 */
        /* 最终位置 */
        opacity: 1;
    }
}

.message.info {
    background-color: #2196f3;
}

.message.success {
    background-color: #82cd84;
}

.message.warning {
    background-color: #ffc107;
}

.message.error {
    background-color: #f26b61;
}
</style>
