<template>
  <div class="now-playing" :class="'now-playing-active'">
    <div class="container">
      <div
        class="now-playing__cover"
        :style="{ width: albumArtSize + 'px', height: albumArtSize + 'px' }"
      >
        <AlbumArt />
        <ProgressBar v-if="miscellaneousOption.includes('show-progress-bar')" />
      </div>
      <div
        class="now-playing__details"
        :style="`justify-content: ${hideControls ? 'center' : 'space-between'}`"
      >
        <div ref="textRef">
          <h1 class="now-playing__track">
            <TextClamp :text="trackName" :max-lines="lineNumber" />
          </h1>
          <h2 class="now-playing__artists">
            <TextClamp :text="artistName" :max-lines="lineNumberArtist" />
          </h2>
        </div>
        <div class="now-playing__controls" v-show="!hideControls" ref="controlsRef">
          <PlayerControls />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ProgressBar from '@/components/ProgressBar.vue'
import PlayerControls from '@/components/PlayerControls.vue'
import TextClamp from 'vue3-text-clamp'
import { useSpotifyStore } from '@/stores/spotify'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import { useAppStore } from '@/stores/app'
import AlbumArt from './AlbumArt.vue'
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'

const settingsStore = useSettingsStore()
const spotifyStore = useSpotifyStore()
const appStore = useAppStore()

const { miscellaneousOption } = storeToRefs(settingsStore)
const { trackName, artistName, albumArtURL } = storeToRefs(spotifyStore)
const { lineNumber, lineNumberArtist, hideControls } = storeToRefs(appStore)

const textRef = ref<HTMLElement | null>(null)
const controlsRef = ref<HTMLElement | null>(null)
const albumArtSize = ref(0)

function updateAlbumArtSize() {
  nextTick(() => {
    const textHeight = textRef.value?.offsetHeight || 0
    const controlsHeight = controlsRef.value?.offsetHeight || 0
    albumArtSize.value = textHeight + controlsHeight
  })
}

onMounted(() => {
  updateAlbumArtSize()
  window.addEventListener('resize', updateAlbumArtSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateAlbumArtSize)
})

watch([trackName, artistName, lineNumber, lineNumberArtist, hideControls], () =>
  updateAlbumArtSize()
)
</script>

<style lang="scss" scoped>
.now-playing {
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  overflow: hidden;

  &__cover,
  &__details {
    text-align: center;
    width: 100%;
  }

  &__cover {
    grid-row: 1 / span 3;
    max-width: 95vmin;
    margin-top: 10%;
    margin-bottom: 10%;
    /* Nudge album art slightly left */
    transform: translateX(-3vw);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1vh;
  }

  &__image {
    aspect-ratio: 1;
    max-width: 640px;
    width: 100%;
    border-radius: 10px;
  }

  &__details {
    grid-row: 1 / span 3;
    text-align: left;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    min-width: 0;
    /* Shift text and controls slightly right */
    transform: translateX(3vw);
  }

  &__details > div:first-child {
    font-size: var(--track-text-size);
    line-height: 1.33;
  }

  &__controls {
    margin-bottom: 15%;
    width: 80%;
    position: relative;
    transition: all 1s ease-out;
  }

  &__track {
    font-size: var(--track-text-size);
  }

  &__artists {
    opacity: 0.8;
    //font-size: var(--artist-text-size);
    font-size: 0.8em;
    max-width: 100%;
    margin-top: 30px;
    //max-height: 275px;
  }

  /*&__artists div {
    max-height: 275px;
  }

  &__track div {
    max-height: 275px;
  }*/

  &--active {
    align-items: center;
    justify-content: center;
  }

  &--idle {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.container {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: min-content 1fr min-content;
  column-gap: 5%;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 5vh 5vw;
  align-items: stretch;
}

.multiline-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  display: block;
}
</style>
