<template>
  <div
    class="now-playing"
    :class="{ 'now-playing--active': isTextOnly }"
  >
    <!-- Text-only layout (TextOnlyPlayer) -->
    <template v-if="isTextOnly">
      <div class="top-details">
        <h1 class="now-playing__track text-clamp-2">
          {{ trackName }}
        </h1>
        <h2 class="now-playing__artists text-clamp-2">
          {{ artistName }}
        </h2>
      </div>

      <transition name="fade-up">
        <div class="bottom-controls" v-show="!hideControls" :style="showSettingButton ? 'translate: 0px -20px;' : ''">
          <PlayerControls />
        </div>
      </transition>

      <div class="bottom-progress" v-if="miscellaneousOption.includes('show-progress-bar')"
        :style="showSettingButton ? ' opacity: 0.5; translate: 0px -20px;' : 'opacity: 1; translate: 0px;'">
        <ProgressBar />
      </div>
    </template>

    <!-- No-text layout (NoTextPlayer) -->
    <template v-else-if="isNoText">
      <div>
        <div class="now-playing__cover now-playing__cover--notext">
          <div class="art-container">
            <AlbumArt />
            <ProgressBar v-if="miscellaneousOption.includes('show-progress-bar')" />
          </div>
          <div class="touch-screen">
            <TouchScreen />
          </div>
          <transition name="fade-up">
            <div class="controls" v-show="!hideControls">
              <PlayerControls />
            </div>
          </transition>
        </div>
      </div>
    </template>

    <!-- Regular layout (RegularPlayer) -->
    <template v-else>
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
            <h1 class="now-playing__track text-clamp-2">
              {{ trackName }}
            </h1>
            <h2 class="now-playing__artists text-clamp-2">
              {{ artistName }}
            </h2>
          </div>
          <div class="now-playing__controls" v-show="!hideControls">
            <PlayerControls />
          </div>
        </div>
      </div>
    </template>

    <!-- Touch screen overlay for no-text mode when controls are hidden -->
    <div class="touch-screen" v-if="hideControls && isNoText">
      <TouchScreen />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ProgressBar from '@/components/ProgressBar.vue'
import PlayerControls from '@/components/PlayerControls.vue'
import { useSpotifyStore } from '@/stores/spotify'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import { useAppStore } from '@/stores/app'
import AlbumArt from './AlbumArt.vue'
import TouchScreen from './TouchScreen.vue'
import { computed } from 'vue'

const settingsStore = useSettingsStore()
const spotifyStore = useSpotifyStore()
const appStore = useAppStore()

const { textOption, miscellaneousOption } = storeToRefs(settingsStore)
const { trackName, artistName } = storeToRefs(spotifyStore)
const { lineNumber, lineNumberArtist, hideControls, showSettingButton } = storeToRefs(appStore)

const isTextOnly = computed(() => textOption.value === 'text-only')
const isNoText = computed(() => textOption.value === 'none')
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
  font-size: var(--text-size);

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

  &__cover--notext {
    width: auto;
    height: auto;
    display: block;
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
    font-size: 0.8em;
    max-width: 100%;
    margin-top: 0.75em;
  }

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

/* No-text variant styles */
.art-container {
  display: flex;
  flex-direction: column;
  gap: 1vh;
  align-items: center;
  width: var(--album-art-size);
}

.controls {
  margin-top: 8.333333333333332vh;
  width: 100%;
  display: block;
  position: relative;
  left: auto;
}

.controls .controls-container {
  display: flex;
  justify-content: center;
  scale: 0.884;
}

.touch-screen {
  position: fixed;
  z-index: 2;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  overflow: hidden;
}

/* Text-only variant styles */
.top-details {
  position: absolute;
  width: 90vw;
  top: 5.1vh;
  left: 5.20833333333333vw;
  gap: 0px;
}

.now-playing__track {
  font-family: Inter;
  font-size: 6.4453125vw;
  font-weight: 700;
  line-height: 17.542592592592595vh;
  letter-spacing: 0.07em;
  text-align: left;
  margin-block-start: 0;
  margin-block-end: 0;
  margin: 0;
  padding: 0;
  margin-bottom: 3vh;
  width: 83vw;
}

.now-playing__artists {
  opacity: 0.6;
  font-family: Inter;
  font-size: 5.208333333333334vw;
  font-weight: 500;
  line-height: 13.88888888888889vh;
  letter-spacing: 0.07em;
  text-align: left;
  margin-block-start: 0;
  margin-block-end: 0;
  margin: 0;
  padding: 0;
  width: 63vw;
}

.bottom-controls {
  position: absolute;
  width: 26vw;
  height: 11.148148vh;
  top: 77.5vh;
  left: 67vw;
  transition: translate 0.5s ease;
}

.bottom-controls :deep(.controls) {
  left: 0;
}

.bottom-progress {
  position: absolute;
  width: 89.58333333333334vw;
  height: 5px;
  top: 94.9074074074074vh;
  left: 50%;
  transform: translateX(-50%);
  gap: 0px;
  border-radius: 2px 0px 0px 0px;
  transition: opacity 0.5s ease, translate 0.5s ease;
}

.multiline-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
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

.text-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>

<style lang="scss">
.controls {
  left: auto;
}

.controls .touch-screen {
  display: none;
}

.controls {
  gap: 1.25%;
}
</style>
