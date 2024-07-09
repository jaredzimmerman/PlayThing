<template>
  <div
    id="app"
    :style="
      `position: relative;
  width: 100vw !important;
  height: 100vh !important;
  overflow-x: hidden !important;
  overflow-y: ${showTouchScreen ? 'hidden !important' : 'auto'};
  `
    "
  >
    <TouchScreen
      v-if="showTouchScreen && false"
      @showSettingButton="displaySettingButton"
    />
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
      v-on:showSettingButton="displaySettingButton"
    >
    </Component>
    <RecentScreen v-if="false" />
    <div
      v-if="showTouchScreen && showSettingButton"
      @click.stop="openSettings"
      class="settings-container fade-slide-up"
      ref="settingButton"
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
      previousComponent: '',
      storedAuth: '',
      test: 'hello, world',
      displaySplashScreen: true,
      showSettingButton: false,
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
        playbackState: 'me/player',
        play: 'me/player/play',
        pause: 'me/player/pause',
        next: 'me/player/next',
        back: 'me/player/previous',
        previous: 'me/player/previous',
        shuffle: 'me/player/shuffle',
        repeat: 'me/player/repeat'
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

    showTouchScreen() {
      return !['Authorise', 'SettingScreen'].includes(this.currentComponent)
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

  mounted() {
    document.addEventListener('showSettingButton', this.displaySettingButton)
  },

  beforeDestroy() {
    document.removeEventListener('showSettingButton', this.displaySettingButton)
  },

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
      this.showSettingButton = false
      this.onPageChange('SettingScreen')
    },
    closeSettings() {
      this.currentComponent = this.previousComponent
    },
    displaySettingButton() {
      // const settingButton = this.$refs.settingButton
      if (!this.showSettingButton) {
        this.showSettingButton = true
        clearTimeout(this.showSettingButtonInterval)
        this.showSettingButtonInterval = setTimeout(() => {
          this.showSettingButton = false
        }, 15 * 1000)
      } else {
        this.showSettingButton = false
        clearTimeout(this.showSettingButtonInterval)
      }
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
<style lang="scss">
* {
  user-select: none;
}

#app {
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

  /*transition: opacity 0.5s ease, transform 0.5s ease;*/

  &.fade-slide-up {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeSlideUp 0.5s forwards;
    z-index: 11;
    overflow: hidden;
  }

  @keyframes fadeSlideUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
