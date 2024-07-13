<template>
  <div id="app">
    <Playback v-if="component === 'Playback'" :player="player" :playerResponse="playerResponse" :playerData="playerData"
      :key="playbackKey" />

    <Clock v-if="component === 'Clock'" />

    <RecentScreen v-if="component === 'RecentScreen'" :endpoints="endpoints" :auth="auth"
      @requestRefreshToken="requestRefreshTokens" :player="player" />

    <SplashScreen v-if="component === 'SplashScreen'" />
    <FirstTimeUsage v-if="component === 'FirstTimeUsage'" />
  </div>
</template>

<script>
import props from '@/utils/props.js'
import Clock from './Clock.vue'
import Playback from './Playback.vue'
import * as ColorThief from 'color-thief-browser'
import { getPlayThingSettings } from '@/utils/utils'
import SplashScreen from './SplashScreen.vue'
import RecentScreen from './RecentScreen.vue'
import FirstTimeUsage from './FirstTimeUsage.vue'

export default {
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
      //colourPalette: '',
      colourPalette: {},
      swatches: [],
      settings: null,
      playbackKey: 0,
      isNowPlaying: false,
      fadeTimeout: null,
      nothingPlayingTimeout: null,
      displaySplashScreen: 1,
      component: 'SplashScreen',
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
            if (this.isNowPlaying) this.component = 'Playback';
            else this.component = 'Clock'
          }, 3000)
        } else {
          if (this.isNowPlaying) this.component = 'Playback';
          else this.component = 'Clock'
        }
      }, 2000)
      document.documentElement.dataset.started = '1'
    } else {
      if (this.isNowPlaying) this.component = 'Playback';
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
    document.removeEventListener('PlayThingRecentScreen', this.toggleRecentScreen)
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
            else textOption = 'large'
            console.log('herex ', textOption)
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
            else if (textOption === 'large') textOption = 'text-only'
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
      /*const settings = {
        nothingPlayingOption: this.selectedNothingPlayingOption,
        backgroundOption: this.selectedBackgroundOption,
        textOption: this.selectedTextOption,
        miscellaneousOption: this.selectedMiscellaneousOption
      }*/
      localStorage.setItem('playThingSettings', JSON.stringify(newSettings))
    },
    async handlePlay() {
      try {
        await fetch(`${this.endpoints.base}/${this.endpoints.play}`, {
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
    /**
     * Make the network request to Spotify to
     * get the current played track.
     */
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

        /**
         * Fetch error.
         */
        if (!response.ok) {
          throw new Error(`An error has occured: ${response.status}`)
        }

        /**
         * Spotify returns a 204 when no current device session is found.
         * The connection was successful but there's no content to return.
         */
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

    /**
     * Poll Spotify for data.
     */
    setDataInterval() {
      clearInterval(this.pollPlaying)
      this.pollPlaying = setInterval(() => {
        this.getNowPlaying()
      }, 3000)
      //}, 2500)
    },

    /**
     * Handle an expired access token from Spotify.
     */
    handleExpiredToken() {
      clearInterval(this.pollPlaying)
      this.$emit('requestRefreshToken')
    },

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
    },

    /**
     * Handle newly updated Spotify Tracks.
     */
    handleNowPlaying() {
      if (
        this.playerResponse.error?.status === 401 ||
        this.playerResponse.error?.status === 400
      ) {
        this.handleExpiredToken()

        return
      }

      /**
       * Player is active, but user has paused.
       */
      if (this.playerResponse.is_playing === false) {
        this.playerData.playing = false
        //this.playerData = this.getEmptyPlayer()

        return
      }

      /**
       * The newly fetched track is the same as our stored
       * one, we don't want to update the DOM yet.
       */
      if (this.playerResponse.item?.id === this.playerData.trackId) {
        return
      }

      /**
       * Store the current active track.
       */
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
    /**
     * Get the colour palette from the album cover.
     */
    getAlbumColours() {
      /**
       * No image (rare).
       */
      //if (!this.player.trackAlbum?.image) {
      if (!this.playerData.trackAlbum?.image) {
        return
      }

      this.setAppColours()

      /*const isColorTooCloseToBlack = (rgb, tolerance) => {
        const [r, g, b] = rgb
        const blackDistance = Math.sqrt(r * r + g * g + b * b)
        return blackDistance < tolerance
      }

      // Function to determine if a color is too close to white
      const isColorTooCloseToWhite = (rgb, tolerance) => {
        const [r, g, b] = rgb
        const whiteDistance = Math.sqrt(
          (255 - r) * (255 - r) + (255 - g) * (255 - g) + (255 - b) * (255 - b)
        )
        return whiteDistance < tolerance
      }

      Vibrant.from(this.player.trackAlbum.image)
        .quality(1)
        .clearFilters()
        .getPalette()
        .then(palette => {
          //this.handleAlbumPalette(palette)

          const filteredPalette = {}

          const tolerance = 50
          if (this.settings?.backgroundOption === 'black-oled') {
            for (let swatch in palette) {
              if (
                palette[swatch] &&
                !isColorTooCloseToBlack(palette[swatch].getRgb(), tolerance)
              ) {
                filteredPalette[swatch] = palette[swatch]
              }
            }

            // If the filtered palette is empty, add white as a fallback
            if (Object.keys(filteredPalette).length === 0) {
              filteredPalette['Fallback'] = {
                getHex: () => '#FFFFFF',
                getRgb: () => [255, 255, 255],
                getPopulation: () => 1,
                getHsl: () => [0, 0, 1]
              }
            }
          } else {
            //filteredPalette = palette
            for (let swatch in palette) {
              if (
                palette[swatch] &&
                !isColorTooCloseToWhite(palette[swatch].getRgb(), tolerance)
              ) {
                filteredPalette[swatch] = palette[swatch]
              }
            }

            // If the filtered palette is empty, add black as a fallback
            if (Object.keys(filteredPalette).length === 0) {
              filteredPalette['Fallback'] = {
                getHex: () => '#000000',
                getRgb: () => [0, 0, 0],
                getPopulation: () => 1,
                getHsl: () => [0, 0, 0]
              }
            }
          }

          this.handleAlbumPalette(filteredPalette)
        })*/
    },
    /**
     * Handle newly stored colour palette:
     * - Map data to readable format
     * - Get and store random colour combination.
     */
    /*handleAlbumPalette(palette) {
      let albumColours = Object.keys(palette)
        .filter(item => {
          return item === null ? null : item
        })
        .map(colour => {
          return {
            text: palette[colour].getTitleTextColor(),
            background: palette[colour].getHex()
          }
        })

      this.swatches = albumColours
      //const variant = 'Vibrant';
      const variant = 'DarkVibrant'

      this.colourPalette = {
        text: palette[variant].getTitleTextColor(),
        background: palette[variant].getHex()
      }
      this.colourPalette =
        albumColours[Math.floor(Math.random() * albumColours.length)]

      this.$nextTick(() => {
        this.setAppColours()
      })
    },*/
    /**
     * Set the stylings of the app based on received colours.
     */
    getMatchColors(imageBlob) {
      //const img = document.getElementById('albumCover');
      const colorThief = new ColorThief()
      const img = new Image()
      img.src = imageBlob

      img.onload = function () {
        const colors = colorThief.getPalette(img, 10)
        const suitableColor = getSuitableColor(colors)
        document.documentElement.style.setProperty('--controls-color', `#fff`)
        document.documentElement.style.setProperty(
          '--color-text-primary',
          '#fff'
        )
        if (suitableColor) {
          document.documentElement.style.setProperty(
            '--primary-color',
            `rgb(${suitableColor.join(',')})`
          )
        } else {
          document.documentElement.style.setProperty('--primary-color', `#000`)
        }
      }

      function getSuitableColor(colors) {
        return colors.find(color => !isNearBlackOrWhite(color))
      }

      function isNearBlackOrWhite(color) {
        const [r, g, b] = color
        const brightness = (r * 299 + g * 587 + b * 114) / 1000
        return brightness < 30 || brightness > 220
      }

      if (img.complete) {
        img.onload()
      }
    },
    getMatchContrastColors(imageBlob) {
      const colorThief = new ColorThief()
      const img = new Image()
      img.src = imageBlob

      img.onload = function () {
        const colors = colorThief.getPalette(img, 10)
        const backgroundColor = getComplementaryOrThirdColor(colors)
        console.log('background is ', backgroundColor)
        document.documentElement.style.setProperty('--controls-color', `#fff`)
        document.documentElement.style.setProperty(
          '--color-text-primary',
          '#fff'
        )
        if (backgroundColor) {
          document.documentElement.style.setProperty(
            '--primary-color',
            `rgb(${backgroundColor.join(',')})`
          )
        } else {
          document.documentElement.style.setProperty('--primary-color', `#000`)
        }
      }

      function getComplementaryOrThirdColor(colors) {
        const prominentColor = colors[0]
        const complementaryColor = getComplementaryColor(prominentColor)

        if (
          complementaryColor &&
          !isNearBlackOrWhite(complementaryColor) &&
          isColorInPalette(colors, complementaryColor)
        ) {
          return complementaryColor
        } else {
          const thirdColor = colors[2]
          if (thirdColor && !isNearBlackOrWhite(thirdColor)) {
            return thirdColor
          }
        }
        return null
      }

      function getComplementaryColor([r, g, b]) {
        // Calculate complementary color
        const compColor = [255 - r, 255 - g, 255 - b]
        return compColor
      }

      function isColorInPalette(colors, color) {
        return colors.some(
          c => color[0] === c[0] && color[1] === c[1] && color[2] === c[2]
        )
      }

      function isNearBlackOrWhite(color) {
        const [r, g, b] = color
        const brightness = (r * 299 + g * 587 + b * 114) / 1000
        return brightness < 30 || brightness > 220
      }

      // Trigger image load if it is cached
      if (img.complete) {
        img.onload()
      }
    },
    getSpotlightColors(imageBlob) {
      const colorThief = new ColorThief()
      const img = new Image()
      img.src = imageBlob

      img.onload = function () {
        const colors = colorThief.getPalette(img, 10)
        const backgroundColors = getDominantColors(colors)
        document.documentElement.style.setProperty('--controls-color', `#fff`)
        document.documentElement.style.setProperty(
          '--color-text-primary',
          '#fff'
        )
        if (backgroundColors) {
          const startColor = rgbToHex(backgroundColors[0])
          const stopColor = rgbToHex(backgroundColors[1])
          document.documentElement.style.setProperty(
            '--start-color',
            startColor
          )
          document.documentElement.style.setProperty('--end-color', stopColor)
          document.dispatchEvent(new CustomEvent('BlobBackgroundColorChanged'))
        }
      }

      function getDominantColors(colors) {
        const filteredColors = colors.filter(
          color => !isNearBlackOrWhite(color)
        )
        if (filteredColors.length >= 2) {
          return [filteredColors[0], filteredColors[1]]
        }
        return null
      }

      function isNearBlackOrWhite(color) {
        const [r, g, b] = color
        const brightness = (r * 299 + g * 587 + b * 114) / 1000
        return brightness < 30 || brightness > 220
      }

      function rgbToHex([r, g, b]) {
        const toHex = value => value.toString(16).padStart(2, '0')
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`
      }

      // Trigger image load if it is cached
      if (img.complete) {
        img.onload()
      }
    },
    getBlackOledColors(imageBlob) {
      //const img = document.getElementById('albumCover');
      const colorThief = new ColorThief()
      const img = new Image()
      img.src = imageBlob

      img.onload = function () {
        const colors = colorThief.getPalette(img, 10)
        const suitableColor = getSuitableColor(colors)
        document.documentElement.style.setProperty(
          '--color-text-primary',
          '#fff'
        )
        if (suitableColor) {
          document.documentElement.style.setProperty(
            '--controls-color',
            `rgb(${suitableColor.join(',')})`
          )
        } else {
          document.documentElement.style.setProperty('--primary-color', `#ff`)
        }
      }

      function getSuitableColor(colors) {
        return colors.find(color => !isNearBlackOrWhite(color))
      }

      function isNearBlackOrWhite(color) {
        const [r, g, b] = color
        const brightness = (r * 299 + g * 587 + b * 114) / 1000
        return brightness < 30 || brightness > 220
      }

      if (img.complete) {
        img.onload()
      }
    },
    async setAppColours() {
      //const textColor = '#fff'
      // let backgroundColor = this.colourPalette.background
      const response = await fetch(this.playerData.trackAlbum.image)
      const blob = await response.blob()

      const blobUrl = URL.createObjectURL(blob)
      document.documentElement.style.setProperty(
        '--album-image',
        `url(${this.player.trackAlbum.image})`
      )
      document.documentElement.style.setProperty('--controls-color', `#fff`)
      document.documentElement.style.setProperty('--color-text-primary', '#fff')
      document.documentElement.style.setProperty('--primary-color', `#fff`)

      const settings = getPlayThingSettings()
      console.log(settings?.backgroundOption)
      if (['match', 'match-dark'].includes(settings?.backgroundOption))
        this.getMatchColors(blobUrl)
      else if (['contrast'].includes(settings?.backgroundOption))
        this.getMatchContrastColors(blobUrl)
      else if (['spotlight'].includes(settings?.backgroundOption)) {
        this.getSpotlightColors(blobUrl)
      } else if (['black-oled'].includes(settings?.backgroundOption)) {
        this.getBlackOledColors(blobUrl)
      }

      /*img.onload = () => {
        const colorThief = new ColorThief()
        const dominantColor = colorThief.getColor(img)
        URL.revokeObjectURL(blobUrl)
        console.log("looking for dominant color ", dominantColor)

        if (
          this.settings?.backgroundOption !== 'black-oled'
        ) {

          document.documentElement.style.setProperty(
            '--controls-color',
            `#fff`
          )

          document.documentElement.style.setProperty(
            '--color-text-primary',
            '#fff'
          )
          document.documentElement.style.setProperty(
            '--primary-color',
            `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`
          )
        } else {
          //console.log("dominent color is ", dominantColor)
          document.documentElement.style.setProperty(
            '--controls-color',
            `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`
          )

          document.documentElement.style.setProperty(
            '--color-text-primary',
            '#fff'
          )

          document.documentElement.style.setProperty(
            '--colour-background-now-playing',
            `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`
            //backgroundColor
          )
        }
      }



      document.documentElement.style.setProperty(
        '--album-image',
        `url(${this.player.trackAlbum.image})`
      )

      document.documentElement.style.setProperty('--secondary-color', textColor)*/
    },
    isFirstTime() {
      let firstTime = true
      try {
        firstTime = JSON.parse(localStorage.getItem('firstTime'))
      } catch {
        localStorage.setItem('firstTime', 'false')
      }
      console.log(firstTime)
      return true
    },
    toggleRecentScreen() {
      if (this.component === 'RecentScreen') {
        if (this.isNowPlaying) this.component = 'Playback';
        else this.component = 'Clock'
      } else {
        this.component = 'RecentScreen'
      }
    }
  },
  watch: {
    /**
     * Watch the auth object returned from Spotify.
     */
    auth: function (oldVal, newVal) {
      if (newVal.status === false) {
        clearInterval(this.pollPlaying)
      }
    },

    /**
     * Watch the returned track object.
     */
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
    /**
     * Watch our locally stored track data.
     */
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
      if (newVal) this.component = 'Playback';
      else this.component = 'Clock';
    }
  }
}
</script>

<style src="@/styles/components/now-playing.scss" lang="scss" scoped></style>
