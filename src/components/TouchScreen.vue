<template>
  <div id="screen" v-touch:tap="tap" v-touch:swipe.left="previousTrack" v-touch:swipe.right="nextTrack">
    <div class="top" v-touch:swipe.down="swipeDown"></div>
    <div class="bottom" v-touch:swipe.up="swipeUp"></div>
  </div>
</template>

<script lang="ts" setup>
/**
 * TouchScreen — transparent gesture capture layer.
 *
 * Sits as an absolute overlay over the player UI and translates touch gestures
 * (via vue3-touch-events) into app-level actions:
 *
 *   Tap             → show the settings button (auto-hides after 15 s)
 *   Swipe left      → previous track
 *   Swipe right     → next track
 *   Swipe up        → toggle playback controls visibility (hideControls)
 *   Swipe down      → toggle recently-played overlay
 *
 * The component itself is fully transparent and pointer-events-all so it
 * captures all touch input without visually obscuring the content beneath it.
 *
 * NOTE: swipe up/down are restricted to the top/bottom 25 % zones to reduce
 * accidental triggers when the user is scrolling vertically in an inner view.
 */
import { useSpotifyStore } from '@/stores/spotify';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';

const spotifyStore = useSpotifyStore();
const appStore = useAppStore();

const { showSettingButton, showRecentlyPlayed, hideControls } = storeToRefs(appStore);
const { nextTrack, previousTrack } = spotifyStore;

function tap() {
  showSettingButton.value = true
}

function swipeUp() {
  hideControls.value = !hideControls.value
}

function swipeDown() {
  showRecentlyPlayed.value = !showRecentlyPlayed.value
}


/*export default {
  name: 'TouchScreen',
  emits: ['show-setting-button'],
  methods: {
    tap() {
      document.dispatchEvent(new Event('showSettingButton'))
    },
    swipeUp() {
      console.log('show controls')
      document.dispatchEvent(new Event('showPlaybackControls'))
    },
    swipeDown() {
      document.dispatchEvent(new Event('PlayThingRecentScreen'))
    },
    swipeLeft() {
      document.dispatchEvent(new Event('PlayThingBack'))
    },
    swipeRight() {
      document.dispatchEvent(new Event('PlayThingNext'))
    }
  }
}*/
</script>

<style lang="scss" scoped>
#screen {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  background-color: transparent;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: all;
  //background-color: red;
  flex-direction: column;
}

.top {
  height: 25%;
  width: 100%;
  //background-color: red;
}

.bottom {
  height: 25%;
  width: 100%;
  //background-color: yellow;
}
</style>
