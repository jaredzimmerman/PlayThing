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
  watch: {
    /*playerResponse(value) {
      //if (!this.synced && this.secondsFromNow(this.lastSynced) >= 5) {
      if (!this.synced && value.is_playing === this.playing) {
        this.synced = true
        this.lastSynced = new Date()
        this.playing = value.is_playing
        // this.repeat = value.repeat_state
        // this.shuffle = value.shuffle_state
      }
    }*/
  },
  methods: {
    sendPlay() {
      //if (!this.synced) return
      document.dispatchEvent(new CustomEvent('PlayThingPlay'))
      this.playing = true
      //this.synced = false
    },
    sendPause() {
      //if (!this.synced) return
      document.dispatchEvent(new CustomEvent('PlayThingPause'))
      this.playing = false
      //this.synced = false
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
      document.dispatchEvent(
        new CustomEvent('PlayThingShuffle', {
          detail: { state: !this.shuffle }
        })
      )
      this.shuffle = !this.shuffle
    },
    sendRepeat(state) {
      this.repeat = state
      document.dispatchEvent(
        new CustomEvent('PlayThingRepeat', {
          detail: { state }
        })
      )
    }
    /*secondsFromNow(date) {
      const now = new Date()
      const differenceInMilliseconds = now - date
      const differenceInSeconds = differenceInMilliseconds / 1000
      return differenceInSeconds
    }*/
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
  //top: 20;
  left: -3.8%;
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
  stroke: #fff;
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
