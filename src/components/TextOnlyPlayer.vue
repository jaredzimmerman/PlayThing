<template>
  <div class="now-playing now-playing--active">
    <!--<div class="ruler"></div>-->
    <div class="top-details">
      <h1 class="now-playing__track">
        <TextClamp :text="trackName" :max-lines="2" autoresize />
      </h1>
      <h2 class="now-playing__artists">
        <TextClamp :text="artistName" :max-lines="2" autoresize />
      </h2>
    </div>

    <transition name="fade-up">
      <div class="bottom-controls" v-show="!hideControls">
        <PlayerControls />
      </div>
    </transition>

    <div class="bottom-progress" v-if="miscellaneousOption.includes('show-progress-bar')"
      :style="`opacity: ${showSettingButton ? 0.5 : 1}`">
      <ProgressBar />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ProgressBar from '@/components/ProgressBar.vue'
import PlayerControls from '@/components/PlayerControls.vue'
import TextClamp from 'vue3-text-clamp';
import { useSpotifyStore } from '@/stores/spotify'
import { useSettingsStore } from '@/stores/settings'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

const settingsStore = useSettingsStore();
const spotifyStore = useSpotifyStore();
const appStore = useAppStore();

const { miscellaneousOption } = storeToRefs(settingsStore);
const { trackName, artistName } = storeToRefs(spotifyStore);
const { hideControls, showSettingButton } = storeToRefs(appStore);
</script>

<style lang="scss" scoped>
/*.ruler {
  background-color: red;
  height: 5px;
  width: 1720px;
  position: absolute;
  top: 1025px;
  left: 100px
}*/

.now-playing {
  font-size: var(--text-size);
  /*background-color: var(--colour-background-now-playing);*/
  color: var(--color-text-primary);
  display: flex;
  flex-flow: column nowrap;
  padding: var(--spacing-l);
  height: 100vh;
  width: 100%;
  overflow: hidden;

  &__cover,
  &__details {
    //padding: var(--spacing-m);
    text-align: center;
    width: 100%;
  }

  &__track {
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
    //margin-bottom: 9vh;
    margin-bottom: 3vh;
  }

  &__artists {
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

  /*@media only screen and (min-width: 767px) {
    flex-flow: row nowrap;
    padding: 10%;

    &__cover,
    &__details {
      width: 50%;
      max-width: 495px;
    }

    &__details {
      text-align: left;
    }
  }*/
}

.top-details {
  position: absolute;
  //width: 47.083333333333336vw;
  width: 56.1vw;
  top: 5.1vh;
  left: 5.20833333333333vw;
  gap: 0px;
  //background-color: red;
}

.bottom-controls {
  position: absolute;
  width: 26vw;
  height: 11.148148vh;
  top: 77.5vh;
  //left: 70vw;
  left: 67vw;
  //padding-top: 500px;
  //top: 0;

  //width: 27.083333333333332vw;
  //height: 8.148148148148149vh;
  //top: 77.5vh;
  //left: 71.1875vw;
}


.bottom-controls .controls {
  left: 0 !important;
}

/*.bottom-progress {
  position: absolute;
  width: 89.58333333333334vw;
  height: 5px;
  top: 94.9074074074074vh;
  left: 5.208333333333334vw;
  gap: 0px;
  border-radius: 2px 0px 0px 0px;
  opacity: 0px;
}*/

.bottom-progress {
  position: absolute;
  width: 89.58333333333334vw;
  height: 5px;
  top: 94.9074074074074vh;
  left: 50%;
  transform: translateX(-50%);
  gap: 0px;
  border-radius: 2px 0px 0px 0px;
  transition: opacity 0.5s ease;
  //opacity: 0px;
}

.multiline-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<style>
.controls {
  gap: 1.5vw;
}
</style>
