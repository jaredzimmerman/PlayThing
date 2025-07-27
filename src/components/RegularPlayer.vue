<template>
  <div class="now-playing" :class="'now-playing-active'">
    <div class="container">
      <div class="now-playing__cover">
        <AlbumArt />
        <ProgressBar v-if="miscellaneousOption.includes('show-progress-bar')" />
      </div>
      <div
        class="now-playing__details"
        :style="`justify-content: ${hideControls ? 'center' : 'space-between'}`"
      >
        <div>
          <h1 class="now-playing__track">
            <TextClamp :text="trackName" :max-lines="lineNumber" />
          </h1>
          <h2 class="now-playing__artists">
            <TextClamp :text="artistName" :max-lines="lineNumberArtist" />
          </h2>
        </div>
        <div class="now-playing__controls" v-show="!hideControls">
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
import { ref } from 'vue'

const settingsStore = useSettingsStore()
const spotifyStore = useSpotifyStore()
const appStore = useAppStore()

const { miscellaneousOption } = storeToRefs(settingsStore)
const { trackName, artistName } = storeToRefs(spotifyStore)
const { lineNumber, lineNumberArtist, hideControls } = storeToRefs(appStore)
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
    width: 24rem;
    height: 24rem;
    margin-top: auto;
    margin-bottom: auto;
    position: relative;
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
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    min-width: 0;
  }

  @media (min-width: 768px) {
    &__details {
      text-align: left;
    }
  }

  &__details > div:first-child {
    font-size: var(--track-text-size);
    line-height: 1.33;
  }

  &__controls {
    margin-top: 1.25vw;
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
    margin-top: 0.75em;
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
  display: flex;
  flex-direction: column;
  gap: 5vmin;
  width: 100%;
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
  padding: 5vmin;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .container {
    flex-direction: row;
    align-items: center;
  }
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
