<template>
  <div class="now-playing" :class="getNowPlayingClass()">
    <div class="top-details">
      <h1 class="now-playing__track" v-text="player.trackTitle"></h1>
      <h2 class="now-playing__artists" v-text="getTrackArtists"></h2>
    </div>

    <div class="bottom-controls">
      <Controls />
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
    padding: var(--spacing-m);
    text-align: center;
    width: 100%;
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

  @media only screen and (min-width: 767px) {
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
  }
}

.top-details {
  position: absolute;
  top: 5%;
  left: 5%;
}

.bottom-controls {
  position: absolute;
  bottom: 15%;
  right: 1%;
  width: 20%;
}

.bottom-progress {
  position: absolute;
  bottom: 1%;
  width: 100%;
  padding: 1rem;
}
</style>
