<template>
  <div id="app">
    <Playback
      v-if="player.playing || true"
      :player="player"
      :playerResponse="playerResponse"
      :playerData="playerData"
    />
    <!--<div v-else>
      <Clock format="12" />
    </div>-->
  </div>
</template>

<script>
import props from '@/utils/props.js'
// import Clock from './Clock.vue'
import Playback from './Playback.vue'
import * as Vibrant from 'node-vibrant'
import * as ColorThief from 'color-thief-browser'
import { getPlayThingSettings } from '@/utils/utils'

export default {
  name: 'NowPlaying',

  props: {
    auth: props.auth,
    endpoints: props.endpoints,
    player: props.player
  },

  components: {
    // Clock,
    Playback
  },

  data() {
    return {
      pollPlaying: '',
      playerResponse: {},
      playerData: this.getEmptyPlayer(),
      //colourPalette: '',
      colourPalette: {},
      swatches: [],
      settings: null
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
  },
  mounted() {
    this.setDataInterval()
    this.setAppColours()
    this.getNowPlaying()
    console.log(this.player)
  },

  beforeDestroy() {
    clearInterval(this.pollPlaying)
    document.removeEventListener('PlayThingPlay', this.handlePlay)
    document.removeEventListener('PlayThingPause', this.handlePause)
    document.removeEventListener('PlayThingNext', this.handleNext)
    document.removeEventListener('PlayThingBack', this.handleBack)
    document.removeEventListener('PlayThingShuffle', this.handleShuffle)
    document.removeEventListener('PlayThingRepeat', this.handleRepeat)
  },

  methods: {
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
    async handleShuffle() {
      try {
        await fetch(`${this.endpoints.base}/${this.endpoints.shuffle}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.auth.accessToken}`
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    async handleRepeat() {},
    /**
     * Make the network request to Spotify to
     * get the current played track.
     */
    async getNowPlaying() {
      let data = {}

      try {
        const response = await fetch(
          `${this.endpoints.base}/${this.endpoints.nowPlaying}`,
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
          data = this.getEmptyPlayer()
          this.playerData = data

          this.$nextTick(() => {
            this.$emit('spotifyTrackUpdated', data)
          })

          return
        }

        data = await response.json()
        console.log('response : ', data)
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
      /*if (this.playerResponse.is_playing === false) {
        this.playerData = this.getEmptyPlayer()

        return
      }*/

      /**
       * The newly fetched track is the same as our stored
       * one, we don't want to update the DOM yet.
       */
      /*if (this.playerResponse.item?.id === this.playerData.trackId) {
        return
      }*/

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
      if (!this.player.trackAlbum?.image) {
        return
      }

      const isColorTooCloseToBlack = (rgb, tolerance) => {
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

      /**
       * Run node-vibrant to get colours.
       */
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
        })
    },
    /**
     * Handle newly stored colour palette:
     * - Map data to readable format
     * - Get and store random colour combination.
     */
    handleAlbumPalette(palette) {
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
    },
    /**
     * Set the stylings of the app based on received colours.
     */
    async setAppColours() {
      const textColor = '#fff'
      // let backgroundColor = this.colourPalette.background

      const response = await fetch(this.player.trackAlbum.image)
      const blob = await response.blob()

      const img = new Image()
      const blobUrl = URL.createObjectURL(blob)

      img.src = blobUrl

      img.onload = () => {
        const colorThief = new ColorThief()
        const dominantColor = colorThief.getColor(img)

        URL.revokeObjectURL(blobUrl)
        document.documentElement.style.setProperty(
          '--primary-color',
          `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`
        )

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

      if (
        this.settings?.backgroundOption === 'black-oled' &&
        this.settings?.textOption !== 'text-only'
      ) {
        // controlsColor = this.colourPalette.background
      }

      document.documentElement.style.setProperty(
        '--album-image',
        `url(${this.player.trackAlbum.image})`
      )

      document.documentElement.style.setProperty('--secondary-color', textColor)
    }
  },
  watch: {
    /**
     * Watch the auth object returned from Spotify.
     */
    auth: function(oldVal, newVal) {
      if (newVal.status === false) {
        clearInterval(this.pollPlaying)
      }
    },

    /**
     * Watch the returned track object.
     */
    playerResponse: function() {
      this.handleNowPlaying()
    },
    /**
     * Watch our locally stored track data.
     */
    playerData: function() {
      this.$emit('spotifyTrackUpdated', this.playerData)

      this.$nextTick(() => {
        this.getAlbumColours()
      })
    }
  }
}
</script>

<style src="@/styles/components/now-playing.scss" lang="scss" scoped></style>
