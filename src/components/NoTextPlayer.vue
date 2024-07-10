<template>
  <div class="now-playing">
    <div>
      <div class="now-playing__cover">
        <img :src="player.trackAlbum.image" class="now-playing__image" />
        <Progress v-if="miscellaneousOptions.includes('show-progress-bar')" :player="player"
          :playerResponse="playerResponse" :playerData="playerData" />
        <div class="controls" v-show="!hideControls">
          <Controls :player="player" :playerResponse="playerResponse" />
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
  name: 'NoTextPlayer',
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
    padding: var(--spacing-m);
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
</style>
