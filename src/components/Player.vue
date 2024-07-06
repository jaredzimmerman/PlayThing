<template>
  <div>
    <TextOnlyPlayer
      v-if="textOption === 'text-only'"
      :player="player"
      :playerResponse="playerResponse"
      :playerData="playerData"
    />
    <NoTextPlayer
      v-else-if="textOption === 'none'"
      :player="player"
      :playerResponse="playerResponse"
      :playerData="playerData"
    />
    <RegularPlayer
      v-else
      :player="player"
      :playerResponse="playerResponse"
      :playerData="playerData"
    />
  </div>
</template>

<script>
import { getPlayThingSettings } from '@/utils/utils'
import TextOnlyPlayer from './TextOnlyPlayer.vue'
import NoTextPlayer from './NoTextPlayer.vue'
import RegularPlayer from './RegularPlayer.vue'

export default {
  name: 'Player',
  components: {
    TextOnlyPlayer,
    NoTextPlayer,
    RegularPlayer
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
      textOption: ''
    }
  },
  created() {
    const settings = getPlayThingSettings()
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
  }
}
</script>

<style lang="scss" scoped></style>
