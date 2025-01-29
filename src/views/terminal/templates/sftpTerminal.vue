<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import SvgIcon from '@/components/icons.vue';
import { ref } from 'vue';

const directory = ref('');
</script>

<template>
    <div id="sftp-terminal">
        <!-- 标题 -->
        <div class="sftp-title">
            <span>
                文件系统
            </span>
        </div>
        <!-- 功能栏 -->
        <div class="sftp-function">
            <div class="function-input">
                <el-input v-model="directory" style="width: 240px">
                    <template #append>
                        <el-button :icon="Search" />
                    </template>
                </el-input>
            </div>
            <div class="function-button">
                <el-tooltip content="刷新" placement="top">
                    <div class="icon-item">
                        <SvgIcon class="svg-icon" iconName="icon-shuaxin" />
                    </div>
                </el-tooltip>
                <el-tooltip content="返回" placement="top">
                    <div class="icon-item">
                        <SvgIcon class="svg-icon" iconName="icon-fanhui" />
                    </div>
                </el-tooltip>
                <el-tooltip content="下载" placement="top">
                    <div class="icon-item">
                        <SvgIcon class="svg-icon" iconName="icon-xiazai" />
                    </div>
                </el-tooltip>
                <el-tooltip content="上传" placement="top">
                    <div class="icon-item">
                        <SvgIcon class="svg-icon" iconName="icon-shangchuan" />
                    </div>
                </el-tooltip>
            </div>
        </div>
        <!-- 文件列表 -->
        <div class="sftp-file">

        </div>
    </div>
</template>

<style lang="scss" scoped>
#sftp-terminal {
    height: 100%;
    width: 100%;

    .sftp-title {
        width: 100%;
        height: 30px;
        line-height: 30px;
        letter-spacing: 2px;
        font-weight: bold;
        background-color: rgb(150, 151, 151);

        span {
            margin-left: 20px;
        }

        &:hover {
            cursor: default
        }
    }
}

.sftp-function {
    width: 100%;
    height: 50px;
    background-color: rgb(196, 197, 197);
    display: flex;
    align-items: center;

    .function-input {
        margin-left: 10px;
    }

    .function-button {
        display: flex;
        align-items: center;

        .icon-item {
            margin-left: 10px;
            width: 32px;
            height: 32px;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;

            .svg-icon {
                width: 20px;
                height: 20px;
            }

            &:hover {
                background-color: rgb(130, 127, 127);
            }
        }
    }
}
</style>