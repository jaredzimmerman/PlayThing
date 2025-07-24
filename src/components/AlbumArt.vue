<template>
  <div class="now-playing__image">
    <transition name="fade">
      <img :key="albumArtURL" :src="albumArtURL" />
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useSpotifyStore } from '@/stores/spotify'

const spotifyStore = useSpotifyStore()

const { albumArtURL } = storeToRefs(spotifyStore)
</script>

<style lang="scss" scoped>
.now-playing {
  &__image {
    //box-shadow: 1px 1px 16px -2px rgba(0, 0, 0, 0.3);
    height: auto;
    width: 100%;
    max-width: var(--album-art-size);
    aspect-ratio: 1;
    border-radius: 10px;
  }
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.now-playing__image img {
  position: absolute;
  /* Stack the images */
  top: 0;
  left: 0;
  width: 100%;
  /* Adjust as needed */
  height: auto;
  /* Maintain aspect ratio */
  /* Makes sure the image scales nicely */
  box-shadow: 0px 0px 25px 0px #00000040;
  border-radius: 10px;
  aspect-ratio: 1;
  max-width: 640px;
}
</style>
