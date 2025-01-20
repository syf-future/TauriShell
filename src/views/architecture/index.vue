<script setup lang="ts">
import Sidebar from '@/views/sidebar/index.vue'
import MainBody from '@/views/mainBody/index.vue'
</script>

<template>
    <div id="architecture">
        <div class="architecture-sidebar">
            <Sidebar />
        </div>
        <div class="architecture-mainBody">
            <MainBody />
        </div>
    </div>
</template>

<style lang="scss" scoped>
#architecture {
    width: 100vw; // 视口宽度
    height: 100vh; // 视口高度
    display: flex;
    flex-direction: row;
    overflow: hidden;

    /* 元素按列垂直排列 */
    .architecture-sidebar {
        width: 65px;
        height: 100%;
        background-color: #30303c;
    }

    .architecture-mainBody {
        width: 100%;
        height: 100%;
        background-color: #221f27;
    }
}
</style>