<template>
  <div id="app">
    <Clock12 v-if="type === 'regular-clock-12'" />
    <Clock24 v-else-if="type === 'regular-clock-24'" />
    <WordClock v-else-if="type === 'word-clock'" />
    <div class="touch-screen">
      <TouchScreen />
    </div>
  </div>
</template>

<script>
import { getPlayThingSettings } from '@/utils/utils'
import Clock12 from './Clock12.vue'
import Clock24 from './Clock24.vue'
import WordClock from './WordClock.vue'
import TouchScreen from './TouchScreen.vue'
export default {
  name: 'Clock',
  components: {
    Clock12,
    Clock24,
    WordClock,
    TouchScreen
  },
  data() {
    return {
      type: ''
    }
  },
  created() {
    const settings = getPlayThingSettings()
    this.type = settings.nothingPlayingOption
  }
}
</script>

<style scoped>
#app {
  font-family: Inter;
  background-color: #000;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
}
</style>
