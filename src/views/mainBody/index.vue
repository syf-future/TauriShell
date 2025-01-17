<script setup lang="ts">
import MainLabel from './templates/main-label.vue';
import MainContent from './templates/main-content.vue';
</script>

<template>
    <div id="mainBody">
        <div class="label-style">
            <MainLabel />
        </div>
        <div class="content-style">
            <MainContent />
        </div>
    </div>
</template>

<style lang="scss" scoped>
#mainBody {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .label-style {
        height: 50px;
        width: 100%;
        background-color: #454343;
    }

    .content-style {
        flex: 1;
    }
}
</style>