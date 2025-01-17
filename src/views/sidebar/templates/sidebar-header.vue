<script setup lang="ts">
import SvgIcon from '@/components/icons.vue';

</script>

<template>
    <div class="sidebar-header">
        <SvgIcon class="svg-icon" iconName="icon-SHELL" />
    </div>
</template>

<style lang="scss" scoped>
.sidebar-header {
    display: flex;
    // align-items: center;
    justify-content: center;

    .svg-icon {
        width: 50px;
        height: 50px;
    }
}
</style>