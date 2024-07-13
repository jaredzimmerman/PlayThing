<template>
  <div class="now-playing" :class="getNowPlayingClass()">
    <div class="container">
      <div class="now-playing__cover">
        <img :src="player.trackAlbum.image" :alt="player.trackTitle" :class="`now-playing__image ${miscellaneousOptions.includes('animate-blur-spotlight')
    ? 'animate-rotate-circle'
    : ''}`" :style="`margin-bottom: ${miscellaneousOptions.includes('show-progress-bar')
    ? '15px'
    : '0px'
    }`
    " />
        <Progress v-if="miscellaneousOptions.includes('show-progress-bar')" :player="player"
          :playerResponse="playerResponse" :playerData="playerData" />
      </div>
      <div class="now-playing__details" :style="`justify-content: ${hideControls ? 'center' : 'space-between'}`">
        <div>
          <h1 class="now-playing__track multiline-ellipsis" :style="`-webkit-line-clamp: ${lineNumber}`"
            v-html="player.trackTitle">
          </h1>
          <h2 class="now-playing__artists ellipsis" v-text="getTrackArtists"></h2>
        </div>
        <div class="now-playing__controls" v-show="!hideControls">
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
  name: 'RegularPlayer',
  components: {
    Controls,
    Progress,
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
      settings: null,
      title: "Elderly Woman Behind the Counter in a Small Town",
      lineNumber: 10
    }
  },
  created() {
    this.updateTextStyle()
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
    },
    updateTextStyle() {
      const settings = getPlayThingSettings()
      this.settings = settings
      const value = settings.textOption

      let displayText = ''
      let displayAlbumArt = ''
      let textSize = ''
      let titleSize = ''
      let artistSize = ''


      if (value === 'none') {
        displayText = 'none'
        displayAlbumArt = 'inherit'
        textSize = '1rem'
        titleSize = ''
        artistSize = ''
      } else if (value === 'small') {
        displayText = 'inherit'
        displayAlbumArt = 'inherit'
        textSize = '1rem'
        titleSize = '60px'
        artistSize = '50px'
        this.lineNumber = 4
      } else if (value === 'medium') {
        displayText = 'inherit'
        displayAlbumArt = 'inherit'
        textSize = '2rem'
        titleSize = '80px'
        artistSize = '50px'
        if (this.hideControls) this.lineNumber = 4
        else this.lineNumber = 3
      } else if (value === 'large') {
        displayText = 'inherit'
        displayAlbumArt = 'inherit'
        textSize = '3rem'
        titleSize = '110px'
        artistSize = '50px'
        if (this.hideControls) this.lineNumber = 4
        else this.lineNumber = 2
      } else if (value === 'extra-large') {
        displayText = 'inherit'
        displayAlbumArt = 'inherit'
        textSize = '3rem'
        titleSize = '130px'
        artistSize = '50px'
        if (this.hideControls) this.lineNumber = 3
        else this.lineNumber = 2
      } else if (value === 'text-only') {
        displayText = 'inherit'
        displayAlbumArt = 'none'
        titleSize = ''
        artistSize = ''
      }

      document.documentElement.style.setProperty('--display-text', displayText)
      document.documentElement.style.setProperty(
        '--display-album-art',
        displayAlbumArt
      )
      document.documentElement.style.setProperty('--text-size', textSize)
      document.documentElement.style.setProperty('--track-text-size', titleSize)
      document.documentElement.style.setProperty('--artist-text-size', artistSize)
    }
  },
  watch: {
    hideControls: function () {
      this.updateTextStyle();
    }
  }
}
</script>

<style lang="scss" scoped>
.now-playing {
  //font-size: var(--text-size);
  /*background-color: var(--colour-background-now-playing);*/
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  // flex-flow: column nowrap;
  height: 100vh;
  // padding: var(--spacing-l);
  width: 100%;
  overflow: hidden;

  &__cover,
  &__details {
    // padding: var(--spacing-m);
    text-align: center;
    width: 100%;
  }

  &__cover {
    // max-width: 400px;
  }

  &__image {
    //box-shadow: 1px 1px 16px -2px rgba(0, 0, 0, 0.3);
    aspect-ratio: 1;
    max-width: 640px;
    width: 100%;
    border-radius: 10px;
  }

  &__details {
    // text-align: center;
    text-align: left;
    // display: var(--display-text);

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: 640px;
  }

  /*&__details div:first-child {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }*/

  &__controls {
    margin-bottom: 15%;
    width: 80%;
    position: relative;
    transition: all 1s ease-out;
  }

  &__cover {
    display: var(--display-album-art);
  }

  &__track {
    // font-weight: var(--font-weight-heading);
    font-size: var(--track-text-size);
    //  max-height: 195px;
  }

  &__artists {
    opacity: 0.8;
    font-size: var(--artist-text-size);

    // white-space: nowrap;
    max-width: 100%;
    margin-top: 30px;
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
      // width: 50%;
      max-width: 495px;
    }

    &__details {
      text-align: left;
    }

    &__controls {
      // margin-top: 15%;
      width: 70%;
    }
  }*/
}

.container {
  display: grid;
  gap: 110px;
  //height: 50vh;
  grid-template-columns: repeat(2, 1fr);
  //max-width: 1280px;
  position: absolute;
  top: 220px;
  left: 220px;
}

.multiline-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  //-webkit-line-clamp: 3; /* Number of lines to display */
  overflow: hidden;
  text-overflow: ellipsis;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  display: block;
}
</style>
