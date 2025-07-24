<template>
  <div class="progress-container">
    <div class="progress-fill" :style="`width: ${progressPercentage}%;`"></div>
  </div>
</template>

<script lang="ts" setup>
import { useSpotifyStore } from '@/stores/spotify'
import { storeToRefs } from 'pinia'

const spotifyStore = useSpotifyStore()

const { progressPercentage } = storeToRefs(spotifyStore)
</script>

<style lang="scss" progress>
.progress-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
  height: 0.5vh;
  margin-left: auto;
  margin-right: auto;
  border-radius: 2px;
}

.progress-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // background: var(--color-text-primary);
  background: var(--controls-color);
  opacity: 0.5;
  z-index: 1;
  width: 100%;
}

.progress-fill {
  position: relative;
  height: 100%;
  // background: var(--color-text-primary);
  background: var(--controls-color);
  text-align: center;
  line-height: 20px;
  z-index: 2;
  transition: width 0.1s ease;
  border: 1px solid var(--controls-color);
  border-radius: 2px;
}
</style>
