<template>
  <div id="app">
    <div>
      <h1>Favorites</h1>
      <h1>Recents</h1>
    </div>
  </div>
</template>

<script>
import { getPlayThingSettings } from '@/utils/utils'

export default {
  name: 'RecentScreen',
  components: {},
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
  background-color: black;
}
</style>
