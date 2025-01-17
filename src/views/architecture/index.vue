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
    width: 100%;
    height: 100%;
    display: flex;
    overflow: auto;

    .architecture-sidebar {
        width: 65px;
        height: 100vh;
        background-color: #30303c;
    }

    .architecture-mainBody {
        flex-grow: 1;
        background-color: #221f27;
    }
}
</style>