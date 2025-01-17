<script setup lang="ts">
/**
 * 自定义按钮
 */
import { defineProps, defineEmits } from 'vue';
import SvgIcon from '@/components/icons.vue';

// 接收父组件传递的参数
const props = defineProps({
    customClass: {
        type: String,
        default: '',
    },
    customStyle: {
        type: Object,
        default: () => ({}),
    },
    isDisabled: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '',
    },
    svgIcon: {
        type: String,
        default: '',
    }
});

// 触发点击事件
const emit = defineEmits(['click']);

const handleClick = (event: any) => {    
    if (!props.isDisabled) {
        emit('click', event); // 向父组件传递点击事件
    }
};
</script>

<template>
    <button :class="['custom-button', customClass]" :style="customStyle" :disabled="isDisabled" @click="handleClick">
        <span class="svg-icon" v-if="svgIcon">
            <SvgIcon :iconName="svgIcon" />
        </span>
        <span>{{ title }}</span>
    </button>
</template>

<style scoped>
.custom-button {
    padding: 5px 10px;
    font-size: 14px;
    border: none;
    border-radius: 10px;
    background-color: #474848;
    color: white;
    transition: background-color 0.3s;

    .svg-icon {
        width: 14px;
        height: 14px;
        margin-right: 2px;
    }
}

.custom-button:hover {
    background-color: #727373;
}

.custom-button:active {
    background-color: #3b3e3e;
}

.custom-button:disabled {
    cursor: not-allowed;
}
</style>