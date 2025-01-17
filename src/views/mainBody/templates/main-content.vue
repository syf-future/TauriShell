<script setup lang="ts">
import HostContent from '../contentTemplates/hostContent.vue';
import KeyContent from '../contentTemplates/keyContent.vue';
import SettingContent from '../contentTemplates/settingContent.vue';
import Terminal from '@/views/terminal/index.vue';
import { terminalStore } from '@/stores/terminalStore';
import { storeToRefs } from 'pinia';
const { terminalStatus } = storeToRefs(terminalStore());
</script>

<template>
    <HostContent v-if="terminalStatus === '0'" />
    <KeyContent v-if="terminalStatus === '1'" />
    <SettingContent v-if="terminalStatus === '2'" />
    <KeepAlive>
        <Terminal v-if="terminalStatus === 'terminal'" />
    </KeepAlive>

</template>

<style lang="scss" scoped></style>