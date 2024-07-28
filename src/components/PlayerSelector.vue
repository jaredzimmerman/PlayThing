<template>
  <TextOnlyPlayer v-if="textOption === 'text-only'" />
  <NoTextPlayer v-else-if="textOption === 'none'" />
  <RegularPlayer v-else />
  <div class="touch-screen" v-if="hideControls">
    <TouchScreen />
  </div>
</template>

<script lang="ts" setup>
import TextOnlyPlayer from '@/components/TextOnlyPlayer.vue';
import NoTextPlayer from '@/components/NoTextPlayer.vue';
import RegularPlayer from '@/components/RegularPlayer.vue';
import { useSettingsStore } from '@/stores/settings';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia'
import TouchScreen from './TouchScreen.vue';

const settingsStore = useSettingsStore();
const appStore = useAppStore()
const { textOption } = storeToRefs(settingsStore);
const { hideControls } = storeToRefs(appStore)
</script>

<style lang="scss" scoped></style>
