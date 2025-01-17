<script setup lang="ts">
import SidebarHeader from './templates/sidebar-header.vue';
import SidebarContent from './templates/sidebar-content.vue';
import SidebarFooter from './templates/sidebar-footer.vue';
</script>

<template>
    <div id="sidebar">
        <div class="sidebar-header">
            <SidebarHeader />
        </div>
        <div class="sidebar-content">
            <SidebarContent />
        </div>
        <div class="sidebar-footer">
            <SidebarFooter />
        </div>
    </div>

</template>

<style lang="scss" scoped>
#sidebar {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .sidebar-header {
        height: 45px;
    }

    .sidebar-content {
        flex: 1;
    }

    .sidebar-footer {
        height: 110px;
    }
}
</style>