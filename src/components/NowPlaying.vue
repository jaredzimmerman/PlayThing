<template>
  <div id="app">
    <Playback v-if="showPlayer" />

    <Clock v-if="!showPlayer" />

    <div v-show="showRecentlyPlayed" class="recent-page">
      <RecentScreen v-if="true" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Clock from './Clock.vue'
import Playback from './Playback.vue'
import RecentScreen from './RecentScreen.vue'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

const appStore = useAppStore();

const { showRecentlyPlayed, showPlayer } = storeToRefs(appStore);
//console.log("player nowplaying : ", playbackState.value)

/*export default {
  name: 'NowPlaying',

  props: {
    auth: props.auth,
    endpoints: props.endpoints,
    player: props.player
  },

  components: {
    Clock,
    Playback,
    SplashScreen,
    RecentScreen,
    FirstTimeUsage
  },

  data() {
    return {
      pollPlaying: '',
      playerResponse: {},
      playerData: this.getEmptyPlayer(),
      swatches: [],
      settings: null,
      playbackKey: 0,
      isNowPlaying: false,
      fadeTimeout: null,
      nothingPlayingTimeout: null,
      displaySplashScreen: 1,
      component: 'SplashScreen'
    }
  },
  created() {
    this.settings = getPlayThingSettings()
    document.addEventListener('PlayThingPlay', this.handlePlay)
    document.addEventListener('PlayThingPause', this.handlePause)
    document.addEventListener('PlayThingNext', this.handleNext)
    document.addEventListener('PlayThingBack', this.handleBack)
    document.addEventListener('PlayThingShuffle', this.handleShuffle)
    document.addEventListener('PlayThingRepeat', this.handleRepeat)
    document.addEventListener('PlayThingRecentScreen', this.toggleRecentScreen)
    document.addEventListener('PlayThingPlaySaved', this.handlePlaySaved)
    document.addEventListener('keydown', this.onKeyDown)

    const started = document.documentElement.dataset.started
    if (started != null) this.displaySplashScreen = false
  },
  mounted() {
    this.setDataInterval()
    this.setAppColours()
    this.getNowPlaying()
    const started = document.documentElement.dataset.started

    if (started == null) {
      setTimeout(() => {
        if (this.isFirstTime()) {
          this.component = 'FirstTimeUsage'
          setTimeout(() => {
            if (this.isNowPlaying) this.component = 'Playback'
            else this.component = 'Clock'
          }, 3000)
        } else {
          if (this.isNowPlaying) this.component = 'Playback'
          else this.component = 'Clock'
        }
      }, 2000)
      document.documentElement.dataset.started = '1'
    } else {
      if (this.isNowPlaying) this.component = 'Playback'
      else this.component = 'Clock'
    }
  },

  beforeDestroy() {
    clearInterval(this.pollPlaying)
    document.removeEventListener('PlayThingPlay', this.handlePlay)
    document.removeEventListener('PlayThingPause', this.handlePause)
    document.removeEventListener('PlayThingNext', this.handleNext)
    document.removeEventListener('PlayThingBack', this.handleBack)
    document.removeEventListener('PlayThingShuffle', this.handleShuffle)
    document.removeEventListener('PlayThingRepeat', this.handleRepeat)
    document.removeEventListener(
      'PlayThingRecentScreen',
      this.toggleRecentScreen
    )
    document.removeEventListener('PlayThingPlaySaved', this.handlePlaySaved)
    document.removeEventListener('keydown', this.onKeyDown)
  },
  methods: {
    onKeyDown(event) {
      switch (event.key) {
        case 'ArrowRight':
          if (event.ctrlKey) {
            let backgroundOption = this.settings.backgroundOption
            if (backgroundOption === 'black-oled') backgroundOption = 'match'
            else if (backgroundOption === 'match')
              backgroundOption = 'match-dark'
            else if (backgroundOption === 'match-dark')
              backgroundOption = 'contrast'
            else if (backgroundOption === 'contrast') backgroundOption = 'blur'
            else if (backgroundOption === 'blur') backgroundOption = 'spotlight'
            else backgroundOption = 'black-oled'
            this.settings.backgroundOption = backgroundOption
            this.updateSettings(this.settings)
            this.playbackKey++
          } else {
            this.handleNext()
          }
          break
        case 'ArrowLeft':
          if (event.ctrlKey) {
            let backgroundOption = this.settings.backgroundOption
            if (backgroundOption === 'black-oled')
              backgroundOption = 'spotlight'
            else if (backgroundOption === 'match')
              backgroundOption = 'black-oled'
            else if (backgroundOption === 'match-dark')
              backgroundOption = 'match'
            else if (backgroundOption === 'contrast')
              backgroundOption = 'match-dark'
            else if (backgroundOption === 'blur') backgroundOption = 'contrast'
            else backgroundOption = 'blur'
            this.settings.backgroundOption = backgroundOption
            this.updateSettings(this.settings)
            this.playbackKey++
          } else {
            this.handleBack()
          }
          break
        case 'ArrowUp':
          if (event.ctrlKey) {
            let textOption = this.settings.textOption
            if (textOption === 'none') textOption = 'text-only'
            else if (textOption === 'small') textOption = 'none'
            else if (textOption === 'medium') textOption = 'small'
            else if (textOption === 'large') textOption = 'medium'
            else if (textOption === 'extra-large') textOption = 'large'
            else textOption = 'extra-large'
            this.settings.textOption = textOption
            this.updateSettings(this.settings)
            this.playbackKey++
          } else {
            document.dispatchEvent(new Event('showPlaybackControls'))
          }
          break
        case 'ArrowDown':
          if (event.ctrlKey) {
            let textOption = this.settings.textOption
            if (textOption === 'none') textOption = 'small'
            else if (textOption === 'small') textOption = 'medium'
            else if (textOption === 'medium') textOption = 'large'
            else if (textOption === 'large') textOption = 'extra-large'
            else if (textOption === 'extra-large') textOption = 'text-only'
            else textOption = 'none'
            this.settings.textOption = textOption
            this.updateSettings(this.settings)
            this.playbackKey++
          } else {
            document.dispatchEvent(new Event('PlayThingRecentScreen'))
          }
          break
        case ' ':
          // Play/pause functionality
          //console.log('here space', this.playerData)
          if (this.playerResponse.is_playing) {
            this.handlePause()
          } else {
            this.handlePlay()
          }
          event.preventDefault()
          break
        case 'P':
          {
            let miscellaneousOption = this.settings.miscellaneousOption
            if (miscellaneousOption.includes('show-progress-bar')) {
              miscellaneousOption = miscellaneousOption.filter(
                option => option != 'show-progress-bar'
              )
            } else {
              miscellaneousOption.push('show-progress-bar')
            }
            this.settings.miscellaneousOption = miscellaneousOption
            this.updateSettings(this.settings)
            this.playbackKey++
          }
          break
        case 'A':
          {
            let miscellaneousOption = this.settings.miscellaneousOption
            if (miscellaneousOption.includes('animate-blur-spotlight')) {
              miscellaneousOption = miscellaneousOption.filter(
                option => option != 'animate-blur-spotlight'
              )
            } else {
              miscellaneousOption.push('animate-blur-spotlight')
            }
            this.settings.miscellaneousOption = miscellaneousOption
            this.updateSettings(this.settings)
            this.playbackKey++
          }
          break
        default:
          break
      }
    },

    updateSettings(newSettings) {

      localStorage.setItem('playThingSettings', JSON.stringify(newSettings))
    },
    async handlePlay(event) {
      try {
        let body
        if (event.detail?.uri) {
          body = {
            uris: [event.detail.uri],
            position_ms: 0
          }
        }
        await fetch(`${this.endpoints.base}/${this.endpoints.play}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.auth.accessToken}`
          },
          body: JSON.stringify(body)
        })

        this.getNowPlaying()
      } catch (err) {
        console.log(err)
      }
    },
    async handlePause() {
      try {
        await fetch(`${this.endpoints.base}/${this.endpoints.pause}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.auth.accessToken}`
          }
        })

        this.getNowPlaying()
      } catch (err) {
        console.log(err)
      }
    },
    async handleNext() {
      try {
        await fetch(`${this.endpoints.base}/${this.endpoints.next}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.auth.accessToken}`
          }
        })
        this.getNowPlaying()
      } catch (err) {
        console.log(err)
      }
    },
    async handleBack() {
      try {
        await fetch(`${this.endpoints.base}/${this.endpoints.back}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.auth.accessToken}`
          }
        })
        this.getNowPlaying()
      } catch (err) {
        console.log(err)
      }
    },
    async handleShuffle(event) {
      try {
        await fetch(
          `${this.endpoints.base}/${this.endpoints.shuffle}?state=${event.detail.state}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${this.auth.accessToken}`
            }
          }
        )
      } catch (err) {
        console.log(err)
      }
    },
    async handleRepeat(event) {
      try {
        await fetch(
          `${this.endpoints.base}/${this.endpoints.repeat}?state=${event.detail.state}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${this.auth.accessToken}`
            }
          }
        )
      } catch (err) {
        console.log(err)
      }
    },
    async handlePlaySaved() {
      try {
        const savedTracksResponse = await fetch(
          `${this.endpoints.base}/${this.endpoints.savedTracks}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${this.auth.accessToken}`
            }
          }
        )

        const data = await savedTracksResponse.json()

        console.log('RESPONSE : ', data)

        const uris = data.items.map(item => item.track.uri)
        const body = {
          uris: uris,
          position_ms: 0
        }
        await fetch(`${this.endpoints.base}/${this.endpoints.play}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.auth.accessToken}`
          },
          body: JSON.stringify(body)
        })

        document.dispatchEvent(
          new CustomEvent('PlayThingShuffle', {
            detail: { state: !this.shuffle }
          })
        )

        document.dispatchEvent(
          new CustomEvent('PlayThingRepeat', {
            detail: { state: 'context' }
          })
        )

        this.getNowPlaying()
      } catch (err) {
        console.log(err)
      }
    },

    async getNowPlaying() {
      let data = {}

      try {
        const response = await fetch(
          // `${this.endpoints.base}/${this.endpoints.nowPlaying}`,
          `${this.endpoints.base}/${this.endpoints.playbackState}`,
          {
            headers: {
              Authorization: `Bearer ${this.auth.accessToken}`
            }
          }
        )

        if (!response.ok) {
          throw new Error(`An error has occured: ${response.status}`)
        }


        if (response.status === 204) {
          this.isNowPlaying = false
          data = this.getEmptyPlayer()
          this.playerData = data

          this.$nextTick(() => {
            this.$emit('spotifyTrackUpdated', data)
          })

          return
        }

        //this.isNowPlaying = true
        data = await response.json()
        this.playerResponse = data
      } catch (error) {
        this.handleExpiredToken()

        data = this.getEmptyPlayer()
        this.playerData = data

        this.$nextTick(() => {
          this.$emit('spotifyTrackUpdated', data)
        })
      }
    },
    requestRefreshTokens() {
      this.$emit('requestRefreshToken')
    },

    setDataInterval() {
      clearInterval(this.pollPlaying)
      this.pollPlaying = setInterval(() => {
        this.getNowPlaying()
      }, 3000)
      //}, 2500)
    },

    handleExpiredToken() {
      clearInterval(this.pollPlaying)
      this.$emit('requestRefreshToken')
    },

    getEmptyPlayer() {
      return {
        playing: false,
        trackAlbum: {},
        trackArtists: [],
        trackId: '',
        trackTitle: ''
      }
    },

    handleNowPlaying() {
      if (
        this.playerResponse.error?.status === 401 ||
        this.playerResponse.error?.status === 400
      ) {
        this.handleExpiredToken()

        return
      }

      if (this.playerResponse.is_playing === false) {
        this.playerData.playing = false
        //this.playerData = this.getEmptyPlayer()

        return
      }


      if (this.playerResponse.item?.id === this.playerData.trackId) {
        return
      }

      this.playerData = {
        playing: this.playerResponse.is_playing,
        trackArtists: this.playerResponse.item.artists.map(
          artist => artist.name
        ),
        trackTitle: this.playerResponse.item.name,
        trackId: this.playerResponse.item.id,
        trackAlbum: {
          title: this.playerResponse.item.album.name,
          image: this.playerResponse.item.album.images[0].url
        }
      }
    },

    getAlbumColours() {

      //if (!this.player.trackAlbum?.image) {
      if (!this.playerData.trackAlbum?.image) {
        return
      }

      this.setAppColours()
    },
      function isFirstTime() {
    let firstTime = true
    try {
      firstTime = JSON.parse(localStorage.getItem('firstTime'))
    } catch {
      localStorage.setItem('firstTime', 'false')
    }
    return firstTime
  },
    toggleRecentScreen() {
      if (this.component === 'RecentScreen') {
        if (this.isNowPlaying) this.component = 'Playback'
        else this.component = 'Clock'
      } else {
        this.component = 'RecentScreen'
      }
    }
  },
  watch: {

    auth: function (oldVal, newVal) {
      if (newVal.status === false) {
        clearInterval(this.pollPlaying)
      }
    },


    playerResponse: function (newVal, oldVal) {
      this.handleNowPlaying()
      if (oldVal == null || newVal == null) return
      if (oldVal.is_playing && !newVal.is_playing && this.fadeTimeout == null) {
        clearTimeout(this.nothingPlayingTimeout)
        clearTimeout(this.fadeTimeout)
        this.fadeTimeout = setTimeout(() => {
          document.body.classList.add('fade-effect')
          this.nothingPlayingTimeout = setTimeout(() => {
            this.isNowPlaying = false
            document.body.classList.remove('fade-effect')
          }, 30 * 1000)
        }, 30 * 1000)
      } else if (!oldVal.is_playing && newVal.is_playing) {
        clearTimeout(this.nothingPlayingTimeout)
        clearTimeout(this.fadeTimeout)
        this.nothingPlayingTimeout = null
        this.fadeTimeout = null
        this.isNowPlaying = true
        document.body.classList.remove('fade-effect')
      }
    },

    playerData: function () {
      this.$emit('spotifyTrackUpdated', this.playerData)
      //this.getAlbumColours()
      // console.log("image ", this.playerResponse)
      this.$nextTick(() => {
        this.getAlbumColours()
      })
    },
    playbackKey: function () {
      this.setAppColours()
    },
    isNowPlaying(newVal) {
      if (this.component !== 'SplashScreen') {
        if (newVal) this.component = 'Playback'
        else this.component = 'Clock'
      }
    }
  }
}*/
</script>

<style src="@/styles/components/now-playing.scss" lang="scss" scoped></style>
<style lang="scss" scoped>
.recent-page {
  position: absolute;
  z-index: 2;
  top: 0;
}
</style>
