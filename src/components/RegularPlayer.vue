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

const settingsStore = useSettingsStore()
const spotifyStore = useSpotifyStore()
const appStore = useAppStore()

const { miscellaneousOption } = storeToRefs(settingsStore)
const { trackName, artistName, albumArtURL } = storeToRefs(spotifyStore)
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
    width: var(--album-art-size);
    max-width: 95vmin;
  }

  &__image {
    aspect-ratio: 1;
    max-width: 640px;
    width: 100%;
    border-radius: 10px;
  }

  &__details {
    text-align: left;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 38.02083333333333vw;
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

  &__cover {
    display: flex;
    flex-direction: column;
    gap: 1.3888888888888888vh;
    height: 61.111111111111114vh;
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
  display: grid;
  gap: 5.729166666666666vw;
  grid-template-columns: repeat(2, 1fr);
  position: absolute;
  top: 20.37037037037037vh;
  left: 11.458333333333332vw;
  width: 77.08333333333334vw;
  height: 61.111111111111114vh;
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
