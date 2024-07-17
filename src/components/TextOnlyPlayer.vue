<template>
  <div class="now-playing" :class="getNowPlayingClass()">
    <div class="top-details">
      <h1
        class="now-playing__track multiline-ellipsis"
        v-text="player.trackTitle"
      ></h1>
      <h2
        class="now-playing__artists multiline-ellipsis"
        v-text="getTrackArtists"
      ></h2>
    </div>

    <div class="bottom-controls" v-show="!hideControls">
      <Controls :player="player" :playerResponse="playerResponse" />
    </div>

    <div
      class="bottom-progress"
      v-if="miscellaneousOptions.includes('show-progress-bar')"
    >
      <Progress
        :player="player"
        :playerResponse="playerResponse"
        :playerData="playerData"
      />
    </div>
  </div>
</template>

<script>
import { getPlayThingSettings } from '@/utils/utils'
import Controls from './Controls.vue'
import Progress from './Progress.vue'

export default {
  name: 'TextOnlyPlayer',
  components: {
    Controls,
    Progress
  },
  props: {
    player: {
      type: Object,
      default: null
    },
    playerResponse: {
      type: Object,
      default: null
    },
    playerData: {
      type: Object,
      default: null
    },
    hideControls: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      settings: null
    }
  },
  created() {
    const settings = getPlayThingSettings()
    this.settings = settings
    const value = settings.textOption

    let displayText = ''
    let displayAlbumArt = ''
    let textSize = ''

    if (value === 'none') {
      displayText = 'none'
      displayAlbumArt = 'inherit'
      textSize = '1rem'
    } else if (value === 'small') {
      displayText = 'inherit'
      displayAlbumArt = 'inherit'
      textSize = '1rem'
    } else if (value === 'medium') {
      displayText = 'inherit'
      displayAlbumArt = 'inherit'
      textSize = '2rem'
    } else if (value === 'large') {
      displayText = 'inherit'
      displayAlbumArt = 'inherit'
      textSize = '3rem'
    } else if (value === 'text-only') {
      displayText = 'inherit'
      displayAlbumArt = 'none'
    }

    document.documentElement.style.setProperty('--display-text', displayText)
    document.documentElement.style.setProperty(
      '--display-album-art',
      displayAlbumArt
    )
    document.documentElement.style.setProperty('--text-size', textSize)
  },
  computed: {
    /**
     * Return a comma-separated list of track artists.
     * @return {String}
     */
    getTrackArtists() {
      return this.player.trackArtists.join(', ')
    },
    miscellaneousOptions() {
      return this.settings?.miscellaneousOption ?? []
    }
  },
  methods: {
    /**
     * Get the Now Playing element class.
     * @return {String}
     */
    getNowPlayingClass() {
      const playerClass = this.player.playing ? 'active' : 'idle'
      return `now-playing--${playerClass}`
    }
  }
}
</script>

<style lang="scss" scoped>
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
  }

  &__artists {
    opacity: 0.8;
    font-family: Inter;
    font-size: 5.208333333333334vw;
    font-weight: 500;
    line-height: 13.88888888888889vh;
    letter-spacing: 0.07em;
    text-align: left;
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
  width: 47.083333333333336vw;
  //height: 23.98148148148148%;
  top: 9.25925925925926vh;
  left: 5.20833333333333vw;
  gap: 0px;
  opacity: 0px;
}

.bottom-controls {
  position: absolute;
  width: 26vw;
  height: 11.148148vh;
  top: 77.5vh;
  left: 70vw;

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
  opacity: 0px;
}

.multiline-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
