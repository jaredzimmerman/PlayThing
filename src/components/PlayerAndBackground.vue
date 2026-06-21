<template>
  <div class="container">
    <div class="background" :style="`opacity: ${fadePlayer ? 0.5 : 1}`">
      <BlobBackground v-if="backgroundOption === 'spotlight'" />
      <MatchBackground v-else-if="backgroundOption === 'match'" />
      <MatchDarkBackground v-else-if="backgroundOption === 'match-dark'" />
      <MatchContrastBackground v-else-if="backgroundOption === 'contrast'" />
      <BlurBackground v-else-if="backgroundOption === 'blur'" />
      <BlackBackground v-else />
    </div>
    <div class="player" :style="`opacity: ${fadePlayer ? 0.5 : 1}`">
      <Player />
    </div>
  </div>
</template>

<script lang="ts" setup>
import BlobBackground from './BlobBackground.vue'
import MatchBackground from './MatchBackground.vue'
import BlackBackground from './BlackBackground.vue'
import MatchContrastBackground from './MatchContrastBackground.vue'
import MatchDarkBackground from './MatchDarkBackground.vue'
import BlurBackground from './BlurBackground.vue'
import Player from './Player.vue'
import { useAppStore } from '@/stores/app';
import { useSettingsStore } from '@/stores/settings';
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const { fadePlayer } = storeToRefs(appStore)
const { backgroundOption } = storeToRefs(settingsStore)
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  background-color: #000;
}

.player {
  position: absolute;
  height: 100vh;
  width: 100%;
  z-index: 2;
}

.background {
  position: absolute;
  height: 100vh;
  width: 100%;
  z-index: 1;
}
</style>

<style lang="scss">
.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-enter-to,
.fade-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
