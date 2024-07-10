<template>
  <div class="controls-container">
    <div class="touch-screen">
      <TouchScreen />
    </div>
    <div class="controls">
      <span v-show="!shuffle" @click="sendShuffle" style="opacity: 0.5;">
        <SimpleSVG src="/controls/Shuffle.svg" />
      </span>
      <span v-show="shuffle" @click="sendShuffle" style="opacity: 1">
        <SimpleSVG src="/controls/Shuffle-1.svg" />
      </span>

      <span @click="sendBack" ref="backButton" class="backButton">
        <SimpleSVG src="/controls/Back.svg" />
      </span>
      <span @click="sendPause" v-show="isPlaying">
        <SimpleSVG src="/controls/Pause.svg" />
      </span>
      <span @click="sendPlay" v-show="!isPlaying">
        <SimpleSVG src="/controls/Play.svg" />
      </span>
      <span @click="sendNext" ref="nextButton" class="nextButton">
        <SimpleSVG src="/controls/Next.svg" />
      </span>
      <span
        v-show="repeat === 'off'"
        @click="sendRepeat('context')"
        style="opacity: 0.5;"
      >
        <SimpleSVG src="/controls/Repeat.svg" />
      </span>
      <span
        v-show="repeat === 'context'"
        @click="sendRepeat('track')"
        style="opacity: 1;"
      >
        <SimpleSVG src="/controls/Repeat-1.svg" />
      </span>
      <span
        v-show="repeat === 'track'"
        @click="sendRepeat('off')"
        style="opacity: 1"
      >
        <SimpleSVG src="/controls/Repeat-2.svg" />
      </span>
    </div>
  </div>
</template>

<script>
import { SimpleSVG } from 'vue-simple-svg'
import TouchScreen from './TouchScreen.vue'

export default {
  name: 'Controls',
  components: {
    SimpleSVG,
    TouchScreen
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
    }
  },
  mounted() {
    if (this.player) {
      this.playing = this.player.playing
    }
  },
  computed: {
    isPlaying() {
      //return this.playing || this.player.playing;
      return this.playing
    }
  },
  watch: {
    playerResponse(value) {
      this.playing = value.is_playing
      this.repeat = value.repeat_state
      this.shuffle = value.shuffle_state
      // if (value.playing != this.playing) { }
    }
  },
  methods: {
    sendPlay() {
      document.dispatchEvent(new CustomEvent('PlayThingPlay'))
      //this.playing = true
      console.log(this.playing)
    },
    sendPause() {
      document.dispatchEvent(new CustomEvent('PlayThingPause'))
      //this.playing = false
      console.log(this.playing)
    },
    sendNext() {
      document.dispatchEvent(new CustomEvent('PlayThingNext'))
      this.$refs.nextButton.style.opacity = 1
      setTimeout(() => {
        this.$refs.nextButton.style.opacity = 0.75
      }, 200)
    },
    sendBack() {
      document.dispatchEvent(new CustomEvent('PlayThingBack'))
      this.$refs.backButton.style.opacity = 1
      setTimeout(() => {
        this.$refs.backButton.style.opacity = 0.75
      }, 200)
    },
    sendShuffle() {
      //this.shuffle = !this.shuffle
      document.dispatchEvent(
        new CustomEvent('PlayThingShuffle', {
          detail: { state: !this.shuffle }
        })
      )
    },
    sendRepeat(state) {
      //this.repeat = state
      document.dispatchEvent(
        new CustomEvent('PlayThingRepeat', {
          detail: { state }
        })
      )
    }
  }
}

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
  top: 20;
  max-width: 100%;
}

.touch-screen {
  position: absolute;
  z-index: 2;
  height: 500vh;
  width: 500vw;
  top: -200vh;
  right: -200vw;
  overflow: hidden;
}

.controls svg {
  width: 100% !important;
  fill: var(--controls-color);
}

@media only screen and (min-width: 767px) {
  .controls {
    justify-content: left;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
  }
}

.nextButton,
.backButton {
  opacity: 0.75;
}

.shuffleButton,
.repeatButton {
  opacity: 0.5;
}
</style>
