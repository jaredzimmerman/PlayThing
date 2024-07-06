<template>
  <div class="now-playing" :class="getNowPlayingClass()">
    <div class="container">
      <div class="now-playing__cover">
        <img
          :src="player.trackAlbum.image"
          :alt="player.trackTitle"
          class="now-playing__image"
        />
        <Progress
          v-if="miscellaneousOptions.includes('show-progress-bar')"
          :player="player"
          :playerResponse="playerResponse"
          :playerData="playerData"
        />
      </div>
      <div class="now-playing__details">
        <div>
          <h1 class="now-playing__track" v-text="player.trackTitle"></h1>
          <h2 class="now-playing__artists" v-text="getTrackArtists"></h2>
        </div>
        <div class="now-playing__controls">
          <Controls />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPlayThingSettings } from '@/utils/utils'
import Controls from './Controls.vue'
import Progress from './Progress.vue'

export default {
  name: 'RegularPlayer',
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
  align-items: center;
  justify-content: center;
  // flex-flow: column nowrap;
  height: 100vh;
  padding: var(--spacing-l);
  width: 100%;
  overflow: hidden;

  &__cover,
  &__details {
    padding: var(--spacing-m);
    text-align: center;
    width: 100%;
  }

  &__cover {
    max-width: 400px;
  }

  &__image {
    box-shadow: 1px 1px 16px -2px rgba(0, 0, 0, 0.3);
    height: auto;
    max-width: 60vw;
    width: 100%;
  }

  &__details {
    text-align: center;
    // display: var(--display-text);

    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  /*&__details div:first-child {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }*/

  &__controls {
    margin-top: 10%;
    width: 100%;
  }

  &__cover {
    display: var(--display-album-art);
  }

  &__track {
    font-weight: var(--font-weight-heading);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 195px;
    max-width: 100%;
  }

  &__artists {
    opacity: 0.8;

    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
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

    &__controls {
      // margin-top: 15%;
      width: 70%;
    }
  }
}

.container {
  display: flex;
  height: 50vh;
}
</style>
