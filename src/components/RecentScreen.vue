<template>
  <div id="app">
    <div class="touch-screen">
      <TouchScreen />
    </div>
    <div class="tracks-container">
      <div>
        <h1>Favorites</h1>
        <img src="/liked-songs.png" />
        <h2>Liked Songs</h2>
      </div>
      <div>
        <h1>Recents</h1>
        <div class="carousel-container">
          <VueSlickCarousel v-if="recentTracks.length > 0" v-bind="carouselSettings">
            <div v-for="item in recentTracks" :key="item.track.id" class="carousel-item" @click="play(item)">
              <img :src="item.track.album.images[0].url" />
              <h2 class="multiline-ellipsis">{{ item.track.name }}</h2>
              <h3 class="ellipsis">
                {{ item.track.artists.map(artist => artist.name).join(', ') }}
              </h3>
            </div>
            <div></div>
            <div></div>
            <div></div>
          </VueSlickCarousel>
        </div>
      </div>
    </div>
    <div v-if="player?.playing" class="blurred-background">
      <div class="current-track">
        <img :src="player.trackAlbum.image" />
        <div>
          <h2>{{ player.trackTitle }}</h2>
          <h3>
            {{
            player.trackArtists
              .map(artist => artist.name)
              .join(', ')
          }}
          </h3>
        </div>
      </div>
    </div>
    <div v-if="!player.playing" class="logo-container">
      <img src="/text-logo.svg" />
    </div>
  </div>
</template>

<script>
import { getPlayThingSettings } from '@/utils/utils'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import TouchScreen from './TouchScreen.vue'

export default {
  name: 'RecentScreen',
  components: { VueSlickCarousel, TouchScreen },
  emits: ['requestRefreshToken'],
  props: {
    endpoints: {
      type: Object,
      default: null
    },
    auth: {
      type: Object,
      default: null
    },
    player: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      type: '',
      carouselSettings: {
        dots: false,
        arrows: false,
        focusOnSelect: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5.5,
        slidesToScroll: 3,
        touchThreshold: 5
      },
      recentTracks: []
    }
  },
  created() {
    const settings = getPlayThingSettings()
    this.type = settings.backgroundOption

    this.getRecents()
    // console.log("player : ", this.player)
  },
  methods: {
    async getRecents() {
      try {
        const response = await fetch(
          `${this.endpoints.base}/${this.endpoints.recentlyPlayed}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${this.auth.accessToken}`
            }
          }
        )

        //console.log('response type : ', response.status)

        if (response.status === 401) {
          this.$emit('requestRefreshToken')
        }

        const data = await response.json()
        // console.log('data: ', data)
        this.recentTracks = data.items
      } catch (err) {
        console.log(err)
      }
    },
    async play(item) {
      console.log("to play: ", item)
      document.dispatchEvent(new CustomEvent("PlayThingPlay", {
        detail: { uri: item.track.uri }
      }))

      document.dispatchEvent(new Event('PlayThingRecentScreen'))

      //document.removeEventListener('PlayThingPlay', this.handlePlay)
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  color: #fff;
  overflow: hidden;
  background-color: #000;
}

.tracks-container {
  position: absolute;
  display: flex;
  //grid-template-columns: 1fr 3fr;
  height: 50vh;
  width: 100vw;
  left: 0;
  margin-top: 60px;
  padding-left: 60px;
  overflow: hidden;
  gap: 112px;
}

.tracks-container>div {
  z-index: 5;
}

.tracks-container h1 {
  opacity: 0.5;
  margin-left: 5.62px;
  margin-bottom: 13.5px;
}

.carousel-container {
  position: absolute;
  max-width: 100%;
  max-height: 100%;
  height: 100%;
}

.tracks-container img {
  aspect-ratio: 1;
  max-width: 270px;
  border-radius: 5.63px;
}

.tracks-container h2 {
  margin-top: 22.5px;
  font-family: Inter;
  font-size: 33.75px;
  font-weight: 400;
  line-height: 33.75px;
  text-align: left;
  max-width: 270px;
}

.carousel-item h3 {
  margin: 0;
  font-family: Inter;
  font-size: 28.13px;
  font-weight: 400;
  line-height: 33.75px;
  text-align: left;
  //opacity: 0.5;
  color: #808080;
  max-width: 270px;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: end;
  height: 50vh;
  position: absolute;
  bottom: 0;
  width: 100vw;
}

.logo-container img {
  width: 520.43px;
  height: 318.56px;
  margin-bottom: 150.44px;
}


.blurred-background {
  position: absolute;
  bottom: 0;
  width: 100vw;
  height: 720px;
  left: 0;
  z-index: 1;
  padding-left: 220px;
  filter: blur(15px);
}

.blurred-background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  //background: red;
  background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.4) 100%);
  z-index: 2;
  pointer-events: none;
}

.current-track img {
  max-width: 640px;
  aspect-ratio: 1;
}

.current-track {
  position: absolute;
  //transform: translate(215px, -200px);
  //background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.4) 100%);
  //filter: blur(50px);
  display: flex;
  align-items: center;
  gap: 100px;
  z-index: 1;
}

.current-track h2 {
  font-family: Inter;
  font-size: 110px;
  font-weight: 700;
  line-height: 168.41px;
  letter-spacing: 0.07em;
  text-align: left;
  margin: 0;
}

.current-track h3 {
  font-family: Inter;
  font-size: 80px;
  font-weight: 500;
  line-height: 122.48px;
  letter-spacing: 0.07em;
  text-align: left;
  opacity: 0.5;
  margin: 0;
}

.touch-screen {
  //background-color: red;
  position: absolute;
  width: 500%;
  height: 500%;
  z-index: 5;
}


.multiline-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  display: block;
}
</style>
