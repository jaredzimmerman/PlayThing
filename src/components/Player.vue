<template>
  <div id="player">
    <TextOnlyPlayer
      v-if="textOption === 'text-only'"
      :player="player"
      :playerResponse="playerResponse"
      :playerData="playerData"
      :hide-controls="hideControls"
    />
    <NoTextPlayer
      v-else-if="textOption === 'none'"
      :player="player"
      :playerResponse="playerResponse"
      :playerData="playerData"
      :hide-controls="hideControls"
    />
    <RegularPlayer
      v-else
      :player="player"
      :playerResponse="playerResponse"
      :playerData="playerData"
      :hide-controls="hideControls"
    />

    <div class="touch-screen" v-if="hideControls">
      <TouchScreen />
    </div>
  </div>
</template>

<script>
import { getPlayThingSettings } from '@/utils/utils'
import TextOnlyPlayer from './TextOnlyPlayer.vue'
import NoTextPlayer from './NoTextPlayer.vue'
import RegularPlayer from './RegularPlayer.vue'
import TouchScreen from './TouchScreen.vue'

export default {
  name: 'Player',
  components: {
    TextOnlyPlayer,
    NoTextPlayer,
    RegularPlayer,
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
    },
    playerData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      textOption: '',
      hideControls: false,
      hideControlsTimeout: null,
      settings: null
    }
  },
  created() {
    const settings = getPlayThingSettings()
    this.settings = settings
    const value = settings.textOption
    this.textOption = value

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
  mounted() {
    // console.log('options', this.settings.miscellaneousOption)
    if (
      this.settings.miscellaneousOption.includes('autohide-playback-controls')
    ) {
      console.log('hide controls')
      document.addEventListener('showPlaybackControls', this.hideOrShowControls)
      this.hideOrShowControls()
    }
  },
  beforeDestroy() {
    document.removeEventListener(
      'showPlaybackControls',
      this.hideOrShowControls
    )
  },
  methods: {
    hideOrShowControls() {
      console.log('hide or show')
      if (this.hideControls) {
        this.hideControls = false
      }
      clearTimeout(this.hideControlsTimeout)
      this.hideControlsTimeout = setTimeout(() => {
        this.hideControls = true
      }, 15 * 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
#player {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
