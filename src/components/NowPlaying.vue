<template>
  <div id="app">
    <PlayerAndBackground v-if="showPlayer" />

    <div v-if="!showPlayer" class="clock-selector-container">
      <TwelveHourClock v-if="nothingPlayingOption === 'regular-clock-12'" />
      <TwentyFourHourClock v-else-if="nothingPlayingOption === 'regular-clock-24'" />
      <WordClock v-else-if="nothingPlayingOption === 'word-clock'" />
      <div class="touch-screen">
        <TouchScreen />
      </div>
    </div>

    <!-- if v-if or v-show use, TextClamp not working; so we put it out of viewport -->
    <div
      :style="`transform: ${showRecentlyPlayed ? 'auto' : 'translateY(-100%)'}; opacity:${showRecentlyPlayed ? '1' : '0'}; backdrop-filter: ${showRecentlyPlayed ? 'blur(15px)' : 'blur(0px)'} `"
      class="recent-page">
      <RecentScreen />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TwelveHourClock from './TwelveHourClock.vue'
import TwentyFourHourClock from './TwentyFourHourClock.vue'
import WordClock from './WordClock.vue'
import TouchScreen from './TouchScreen.vue'
import PlayerAndBackground from './PlayerAndBackground.vue'
import RecentScreen from './RecentScreen.vue'
import { useAppStore } from '@/stores/app'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'

const appStore = useAppStore();
const settingsStore = useSettingsStore();

const { showRecentlyPlayed, showPlayer } = storeToRefs(appStore);
const { nothingPlayingOption } = storeToRefs(settingsStore);
</script>

<style src="@/styles/components/now-playing.scss" lang="scss" scoped></style>
<style lang="scss" scoped>
.recent-page {
  position: absolute;
  z-index: 2;
  top: 0;
  transition: transform 0.5s ease, opacity 0.5s ease;

  //backdrop-filter: blur(15px);
}

.clock-selector-container {
  font-family: Inter;
  background-color: #000;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
}
</style>
