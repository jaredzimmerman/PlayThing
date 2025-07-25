<template>
  <div class="controls-container">
    <div class="touch-screen">
      <TouchScreen />
    </div>
    <div class="controls">
      <span v-show="!shuffleState" @click="shuffle(true)" style="opacity: 0.5;">
        <Shuffle />
      </span>
      <span v-show="shuffleState" @click="shuffle(false)" style="opacity: 1">
        <Shuffle1 />
      </span>

      <span @click="previousTrack()" class="backButton">
        <Back />
      </span>
      <span @click="pause()" v-show="isPlaying">
        <Pause />
      </span>
      <span @click="play()" v-show="!isPlaying">
        <Play />
      </span>
      <span @click="nextTrack()" class="nextButton">
        <Next />
      </span>
      <span v-show="repeatState === 'off'" @click="repeat('context')" style="opacity: 0.5;">
        <Repeat />
      </span>
      <span v-show="repeatState === 'context'" @click="repeat('track')" style="opacity: 1;">
        <Repeat1 />
      </span>
      <span v-show="repeatState === 'track'" @click="repeat('off')" style="opacity: 1">
        <Repeat2 />
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TouchScreen from './TouchScreen.vue'
import Shuffle from '@/assets/controls/Shuffle.svg?component';
import Shuffle1 from '@/assets/controls/Shuffle-1.svg?component';
import Back from '@/assets/controls/Back.svg?component';
import Pause from '@/assets/controls/Pause.svg?component';
import Play from '@/assets/controls/Play.svg?component';
import Next from '@/assets/controls/Next.svg?component';
import Repeat from '@/assets/controls/Repeat.svg?component';
import Repeat1 from '@/assets/controls/Repeat-1.svg?component';
import Repeat2 from '@/assets/controls/Repeat-2.svg?component';
import { useSpotifyStore } from '@/stores/spotify';
import { storeToRefs } from 'pinia'

const spotifyStore = useSpotifyStore();

const { play, pause, shuffle, repeat, nextTrack, previousTrack } = spotifyStore;
const { isPlaying, shuffleState, repeatState } = storeToRefs(spotifyStore);

/*

      this.$refs.nextButton.style.opacity = 1
      setTimeout(() => {
        this.$refs.nextButton.style.opacity = 0.75
      }, 200)

*/


/*export default {
  name: 'Controls',
  components: {
    TouchScreen,
    Shuffle,
    Shuffle1,
    Back,
    Pause,
    Play,
    Next,
    Repeat,
    Repeat1,
    Repeat2
  },
  props: {
    player: {
      type: Object,
      default: null
    },
    playerResponse: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      playing: false,
      repeat: 'off',
      shuffle: false
      //synced: true,
      //lastSynced: new Date()
    }
  },
  mounted() {
    const value = this.playerResponse
    if (value) {
      // this.playing = this.player.playing
      this.playing = value.is_playing
      this.repeat = value.repeat_state
      this.shuffle = value.shuffle_state
    }
  },
  computed: {
    isPlaying() {
      //return this.playing || this.player.playing;
      return this.playing
    }
  },
  methods: {

  }
}*/

/*
    async getNowPlaying() {
      let data = {}

      try {
        const response = await fetch(
          `${this.endpoints.base}/${this.endpoints.nowPlaying}`,
          {
            headers: {
              Authorization: `Bearer ${this.auth.accessToken}`
            }
          }
        )

      } catch (error) {
      }
    },
 */
</script>

<style lang="scss">
.controls-container {
  position: relative;
  background-color: black;
}

.controls {
  position: absolute;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-content: center;
  z-index: 2;
  //top: 20;
  left: -2.3%;
  width: 27.083333333333332vw;
  height: 8.148148148148149vh;
  column-gap: 1.25%;
  //max-width: 100%;
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

.controls svg {
  fill: var(--controls-color);
  stroke: var(--controls-color);
}

.controls span {
  width: 88px;
  //width: 4.583333333333333vw;
  //height: 8.148148148148149vh;
  aspect-ratio: 1;
  // border: 1px solid red;
}


.controls span:active svg {}


/*@media only screen and (min-width: 767px) {
  .controls {
    justify-content: left;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
  }
}*/

.nextButton,
.backButton {
  opacity: 0.75;
}

.nextButton:active,
.backButton:active {
  opacity: 1;
}

.shuffleButton,
.repeatButton {
  opacity: 0.5;
}
</style>
