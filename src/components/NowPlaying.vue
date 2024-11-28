<template>
  <div id="app">
    <PlayerAndBackground v-if="showPlayer" />

    <ClockSelector v-if="!showPlayer" />

    <!-- if v-if or v-show use, TextClamp not working; so we put it out of viewport -->
    <div
      :style="`transform: ${showRecentlyPlayed ? 'auto' : 'translateY(-100%)'}; opacity:${showRecentlyPlayed ? '1' : '0'}; backdrop-filter: ${showRecentlyPlayed ? 'blur(15px)' : 'blur(0px)'} `"
      class="recent-page">
      <RecentScreen />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ClockSelector from './ClockSelector.vue'
import PlayerAndBackground from './PlayerAndBackground.vue'
import RecentScreen from './RecentScreen.vue'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

const appStore = useAppStore();

const { showRecentlyPlayed, showPlayer } = storeToRefs(appStore);
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
</style>
