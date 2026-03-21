<template>
  <TextOnlyPlayer v-if="textOption === 'text-only'" />
  <NoTextPlayer v-else-if="textOption === 'none'" />
  <RegularPlayer v-else />
  <div class="touch-screen" v-if="hideControls && textOption !== 'none'">
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

<style lang="scss" scoped>
.touch-screen {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
