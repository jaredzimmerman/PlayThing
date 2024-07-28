<template>
  <div id="app">
    <TwelveHourClock v-if="nothingPlayingOption === 'regular-clock-12'" />
    <TwentyFourHourClock v-else-if="nothingPlayingOption === 'regular-clock-24'" />
    <WordClock v-else-if="nothingPlayingOption === 'word-clock'" />
    <div class="touch-screen">
      <TouchScreen />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TwelveHourClock from './TwelveHourClock.vue'
import TwentyFourHourClock from './TwentyFourHourClock.vue'
import WordClock from './WordClock.vue'
import TouchScreen from './TouchScreen.vue'
import { useSettingsStore } from '@/stores/settings';
import { storeToRefs } from 'pinia'

const settingsStore = useSettingsStore();

const { nothingPlayingOption } = storeToRefs(settingsStore);
</script>

<style scoped>
#app {
  font-family: Inter;
  background-color: #000;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
}
</style>
