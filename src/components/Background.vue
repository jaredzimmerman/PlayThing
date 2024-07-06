<template>
  <div id="app">
    <BlobBackground v-if="type === 'spotlight'" />
    <MatchBackground v-else-if="type === 'match'" />
    <MatchDarkBackground v-else-if="type === 'match-dark'" />
    <MatchContrastBackground v-else-if="type === 'contrast'" />
    <BlurBackground v-else-if="type === 'blur'" />
    <BlackBackground v-else />
  </div>
</template>

<script>
import { getPlayThingSettings } from '@/utils/utils'
import BlobBackground from './BlobBackground.vue'
import MatchBackground from './MatchBackground.vue'
import BlackBackground from './BlackBackground.vue'
import MatchContrastBackground from './MatchContrastBackground.vue'
import MatchDarkBackground from './MatchDarkBackground.vue'
import BlurBackground from './BlurBackground.vue'

export default {
  name: 'Background',
  components: {
    BlobBackground,
    MatchBackground,
    BlackBackground,
    MatchContrastBackground,
    MatchDarkBackground,
    BlurBackground
  },
  data() {
    return {
      type: ''
    }
  },
  created() {
    const settings = getPlayThingSettings()
    this.type = settings.backgroundOption
  }
}
</script>

<style scoped>
#app {
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}
</style>
