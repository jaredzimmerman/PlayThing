<template>
  <div class="now-playing">
    <div>
      <div class="now-playing__cover">
        <img :src="albumArtURL" :class="`now-playing__image`" :style="`margin-bottom: ${miscellaneousOption.includes('show-progress-bar')
          ? '15px'
          : '0px'
          }`
          " />
        <ProgressBar v-if="miscellaneousOption.includes('show-progress-bar')" />
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
  </div>
</template>

<script lang="ts" setup>
import ProgressBar from '@/components/ProgressBar.vue'
import PlayerControls from '@/components/PlayerControls.vue'
import TouchScreen from '@/components/TouchScreen.vue'
import { useSpotifyStore } from '@/stores/spotify'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import { useAppStore } from '@/stores/app'

const settingsStore = useSettingsStore()
const spotifyStore = useSpotifyStore();
const appStore = useAppStore();

const { miscellaneousOption } = storeToRefs(settingsStore);
const { albumArtURL } = storeToRefs(spotifyStore);
const { hideControls } = storeToRefs(appStore);

</script>

<style lang="scss" scoped>
#app {
  font-size: var(--text-size);
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.now-playing {
  font-size: var(--text-size);
  //background-color: var(--colour-background-now-playing);
  /*background-color: var(--colour-background-now-playing);*/
  // color: var(--color-text-primary);
  color: #fff;
  flex-flow: column nowrap;
  height: 100vh;
  padding: var(--spacing-l);
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  &__cover,
  &__details {
    //padding: var(--spacing-m);
    text-align: center;
    width: 100%;
  }

  &__cover {
    display: block;
  }

  &__image {
    //box-shadow: 1px 1px 16px -2px rgba(0, 0, 0, 0.3);
    height: auto;
    // max-width: 640px; //60vw;
    width: 100%;
    //width: 60vw;
    max-width: 640px;
    width: 60vh;
    aspect-ratio: 1;
    border-radius: 10px;
  }

  &__details {
    text-align: center;
    display: var(--display-text);
  }

  &__controls {
    margin-top: 25%;
    width: 60%;
  }

  &__cover {
    //display: var(--display-album-art);
    display: 'block';
  }

  &__track {
    font-weight: var(--font-weight-heading);
  }

  &__artists {
    opacity: 0.8;
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

  /* @media only screen and (min-width: 767px) {
    flex-flow: row nowrap;
    padding: 10%;

    &__cover,
    &__details {
      width: 50%;
      max-width: 495px;
      display: block;
    }

    &__details {
      text-align: left;
    }
  }*/
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

.now-playing div:first-child {
  //background-color: red;
  //height: 100vh;
  //display: flex;
  align-items: center;
}

.touch-screen {
  position: fixed;
  z-index: 2;
  //height: 500vh;
  //width: 500vw;
  height: 100vh;
  width: 100vw;
  //top: -200vh;
  //right: -200vw;
  top: 0;
  left: 0;
  overflow: hidden;
}


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

<style lang="scss">
.controls {
  left: auto;
}

.controls .touch-screen {
  display: none;
}
</style>
