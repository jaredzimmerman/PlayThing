<template>
  <div class="container">
    <div class="background" :style="`opacity: ${fadePlayer ? 0.5 : 1}`">
      <Background />
    </div>
    <div class="player" :style="`opacity: ${fadePlayer ? 0.5 : 1}`">
      <Player />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Background from './Background.vue'
import Player from './Player.vue'
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
