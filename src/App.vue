<template>
  <div id="app">
    <TouchScreen v-if="mode !== 'settings'" @openSettings="openSettings" />
    <Component
      v-if="true"
      :is="getCurrentComponent"
      :auth="auth"
      :endpoints="endpoints"
      :player="player"
      @spotifyTrackUpdated="updateCurrentTrack"
      @requestRefreshToken="requestRefreshTokens"
      @pageChange="onPageChange"
      @closeSettings="closeSettings"
    >
    </Component>
    <RecentScreen v-if="false" />
    <div
      v-if="showSetting && false"
      class="settings-container"
      @click="openSettings"
    >
      <img src="SettingIcon.svg" />
      <span>SETTINGS</span>
    </div>
  </div>
</template>

<script>
import Authorise from '@/components/Authorise'
import NowPlaying from '@/components/NowPlaying'

import { getStoredAuth, setStoredAuth } from '@/utils/utils.js'
import SplashScreen from './components/SplashScreen.vue'
import SettingScreen from './components/SettingScreen.vue'
import Clock from './components/Clock.vue'
import RecentScreen from './components/RecentScreen.vue'
// import BlankScreen from './components/BlankScreen.vue'
import TouchScreen from './components/TouchScreen.vue'

export default {
  name: 'App',

  components: {
    Authorise,
    NowPlaying,
    SplashScreen,
    SettingScreen,
    Clock,
    RecentScreen,
    TouchScreen
  },

  props: {},

  data() {
    return {
      mode: '',
      previousComponent: '',
      storedAuth: '',
      test: 'hello, world',
      displaySplashScreen: true,
      auth: {
        status: false,
        clientId: process.env.VUE_APP_SP_CLIENT_ID,
        clientSecret: process.env.VUE_APP_SP_CLIENT_SECRET,
        authCode: '',
        accessToken: '',
        refreshToken: ''
      },
      endpoints: {
        auth: 'https://accounts.spotify.com/authorize',
        token: 'https://accounts.spotify.com/api/token',
        base: 'https://api.spotify.com/v1',
        nowPlaying: 'me/player/currently-playing',
        startOrResume: 'me/player/play',
        skipToNext: 'me/player/next',
        skipToPrevious: 'me/player/previous'
      },
      player: {
        playing: false,
        trackArtists: [],
        trackTitle: '',
        trackAlbum: []
      },
      storedId: '',
      currentComponent: 'SplashScreen'
    }
  },

  computed: {
    /**
     * Check for the existence of a stored access token and
     * return the correct Component to be displayed.
     * @return {String}
     */
    getCurrentComponent() {
      return this.currentComponent
      // return this.auth.status === false ? 'Authorise' : 'NowPlaying'
    },

    /**
     * Display the settings button on some pages
     * @return {Boolean}
     */
    showSetting() {
      return ['NowPlaying'].includes(this.currentComponent)
      // return this.auth.status === false ? 'Authorise' : 'NowPlaying'
    }
  },

  created() {
    console.log(Authorise, NowPlaying, SplashScreen, SettingScreen, Clock)
    this.auth = {
      ...this.auth,
      ...getStoredAuth()
    }
    // this.onPageChange('SpashScreen');
    setTimeout(() => {
      this.onPageChange('Authorise')
      //this.displaySplashScreen = false
    }, 3000)
  },

  mounted() {},

  methods: {
    /**
     * Store
     */
    storeAccessToken() {
      this.getAccessToken()
    },

    /**
     * Request a refresh token from Spotify.
     */
    requestRefreshTokens() {
      this.auth.status = false
    },

    /**
     * Update the player object.
     * @param {Object} value - Spotify playr object.
     */
    updateCurrentTrack(value) {
      this.player = value
    },
    /**
     * Update the page displayed.
     * @param {String} value - Page component name.
     */
    onPageChange(value) {
      this.previousComponent = this.currentComponent
      if (value === 'Authorise' && this.auth.status) {
        this.currentComponent = 'NowPlaying'
      } else {
        this.currentComponent = value
      }
    },
    /**
     * Open settings page.
     */
    openSettings() {
      this.onPageChange('SettingScreen')
      this.mode = 'settings'
    },
    closeSettings() {
      this.currentComponent = this.previousComponent
      this.mode = ''
    }
  },

  watch: {
    /**
     * Watch the authorisation status.
     */
    'auth.status': function() {
      setStoredAuth(this.auth)
    }
  }
}
</script>
<style>
* {
  user-select: none;
}

.settings-container {
  position: absolute;
  bottom: 10px;
  color: white;
  display: flex;
  justify-content: center;
  justify-items: center;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: Inter;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 30px;
  letter-spacing: 0.1em;
  text-align: left;
  gap: 10px;
  z-index: 10;
}
</style>
