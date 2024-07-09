<template>
  <div class="controls-container">
    <div class="touch-screen">
      <TouchScreen />
    </div>
    <div class="controls">
      <span @click="shuffle" class="shuffleButton">
        <SimpleSVG src="/controls/Shuffle.svg" />
      </span>
      <span @click="back" ref="backButton" class="backButton">
        <SimpleSVG src="/controls/Back.svg" />
      </span>
      <span @click="pause" v-show="isPlaying">
        <SimpleSVG src="/controls/Pause.svg" />
      </span>
      <span @click="play" v-show="!isPlaying">
        <SimpleSVG src="/controls/Play.svg" />
      </span>
      <span @click="next" ref="nextButton" class="nextButton">
        <SimpleSVG src="/controls/Next.svg" />
      </span>
      <span @click="shuffle1" class="repeatButton">
        <SimpleSVG src="/controls/Shuffle-1.svg" />
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
    }
  },
  data() {
    return {
      playing: false
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
    player(value) {
      console.log('watching :', value)
      this.playing = value.playing
      // if (value.playing != this.playing) {}
    }
  },
  methods: {
    play() {
      document.dispatchEvent(new Event('PlayThingPlay'))
      this.playing = true
      console.log(this.playing)
      // this.playing = !this.playing
    },
    pause() {
      document.dispatchEvent(new Event('PlayThingPause'))
      this.playing = false
      console.log(this.playing)
      // this.playing = !this.playing
    },
    next() {
      document.dispatchEvent(new Event('PlayThingNext'))
      this.$refs.nextButton.style.opacity = 1
      setTimeout(() => {
        this.$refs.nextButton.style.opacity = 0.5
      }, 200)
    },
    back() {
      document.dispatchEvent(new Event('PlayThingBack'))
      this.$refs.backButton.style.opacity = 1
      setTimeout(() => {
        this.$refs.backButton.style.opacity = 0.5
      }, 200)
    },
    shuffle() {
      document.dispatchEvent(new Event('PlayThingShuffle'))
    },
    shuffle1() {
      document.dispatchEvent(new Event('PlayThingRepeat'))
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
  background-color: blue;
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
