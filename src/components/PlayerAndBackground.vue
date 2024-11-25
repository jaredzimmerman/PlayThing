<template>
  <div class="container">
    <div class="background" :style="`opacity: ${fadePlayer ? 0.5 : 1}`">
      <BackgroundSelector />
    </div>
    <div class="player" :style="`opacity: ${fadePlayer ? 0.5 : 1}`">
      <PlayerSelector />
    </div>
  </div>
</template>

<script lang="ts" setup>
import BackgroundSelector from './BackgroundSelector.vue'
import PlayerSelector from './PlayerSelector.vue'
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { fadePlayer } = storeToRefs(appStore)
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
