<template>
  <div id="app">
    <Playback v-if="showPlayer" />

    <Clock v-if="!showPlayer" />

    <!-- if v-if or v-show use, TextClamp not working; so we put it out of viewport -->
    <div
      :style="`transform: ${showRecentlyPlayed ? 'auto' : 'translateY(100%)'}; opacity:${showRecentlyPlayed ? '1' : '0'} `"
      class="recent-page">
      <RecentScreen />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Clock from './Clock.vue'
import Playback from './Playback.vue'
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
}
</style>
