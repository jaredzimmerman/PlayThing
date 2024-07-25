<template>
  <div id="app">
    <div :class="`album-art ${miscellaneousOption.includes('animate-blur-spotlight')
      ? 'animate-rotate-circle'
      : 'scale-120-rotate-180'
      }`
      " ref="albumArtRef" />
    <div class="scrim"></div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import { useSpotifyStore } from '@/stores/spotify';
import { useAppStore } from '@/stores/app';
import { ref, watch } from 'vue';

const albumArtRef = ref<HTMLDivElement | null>(null)

const settingsStore = useSettingsStore()
const spotifyStore = useSpotifyStore()

const { miscellaneousOption } = storeToRefs(settingsStore);
const { isPlaying } = storeToRefs(spotifyStore)

// only animate background if playing
if (miscellaneousOption.value.includes('animate-blur-spotlight')) {
  watch(isPlaying, (playing) => {
    if (albumArtRef.value) {
      albumArtRef.value.style.animationPlayState = playing ? 'running' : 'paused'
    }
  })
}

</script>

<style lang="scss" scoped>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: var(--primary-color);
  //transform: scale(120%) rotate(180deg);
}

.album-art {
  background-image: var(--album-image);
  background-size: cover;
  background-position: center;
  width: 100vw;
  height: 100vh;
}

.scrim::before {
  content: '';
  backdrop-filter: blur(100px);
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  //background: linear-gradient(10deg, #ff6ec4, #7873f5);
}

.scrim {
  position: absolute;
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom,
      rgba(0, 0, 0, 0.4),
      rgba(0, 0, 0, 0.6));
}

.scale-120-rotate-180 {
  transform: scale(120%) rotate(180deg);
}

@keyframes rotate {
  from {
    transform: scale(2.04) rotate(0deg);
  }

  to {
    transform: scale(2.04) rotate(360deg);
  }
}

.animate-rotate-circle {
  animation: rotate 120s linear infinite;
}
</style>
