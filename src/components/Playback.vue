<template>
  <div id="app">
    <div class="background">
      <Background />
    </div>
    <div class="player">
      <Player
        :player="player"
        :playerResponse="playerResponse"
        :playerData="playerData"
      />
    </div>
  </div>
</template>

<script>
import Background from './Background.vue'
import { getPlayThingSettings } from '@/utils/utils'
import Player from './Player.vue'

// import * as Vibrant from 'node-vibrant'

export default {
  name: 'Playback',
  components: {
    Background,
    Player
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
    this.settings = getPlayThingSettings()
  },
  computed: {},

  methods: {
    /**
     * Return a formatted empty object for an idle player.
     * @return {Object}
     */
    getEmptyPlayer() {
      return {
        playing: false,
        trackAlbum: {},
        trackArtists: [],
        trackId: '',
        trackTitle: ''
      }
    }
  }
}
</script>

<style scoped>
.player {
  position: absolute;
  height: 100vh;
  width: 100%;
  z-index: 2;
}

.background {
  background-color: #000;
  position: absolute;
  height: 100vh;
  width: 100%;
  z-index: 1;
}
</style>
