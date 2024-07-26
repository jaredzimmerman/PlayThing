<template>
  <div id="app">
    <div class="touch-screen">
      <TouchScreen />
    </div>
    <div class="tracks-container">
      <div>
        <h1>Favorites</h1>
        <img src="@/assets/liked-songs.png" @click="playSaved" />
        <h2>Liked Songs</h2>
      </div>
      <div>
        <h1>Recents</h1>
        <div class="carousel-container">
          <Splide :options="options" aria-label="My Favorite Images">
            <SplideSlide v-for="item in recentlyPlayedTracksNoDuplicates" :key="item.track.id">
              <div class="carousel-item" @click="playRecent(item)">
                <img :src="item.track.album.images[0].url" />
                <h2 class="ellipsis">{{ item.track.name }}</h2>
                <h3 class="ellipsis">
                  {{ item.track.artists.map(artist => artist.name).join(', ') }}
                </h3>
              </div>
            </SplideSlide>
            <SplideSlide v-for="i in [1, 2]">
            </SplideSlide>
          </Splide>
        </div>
      </div>
    </div>
    <div v-if="!showPlayer" class="logo-container">
      <Logo />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TouchScreen from './TouchScreen.vue'
// @ts-ignore
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';
import { useSpotifyStore } from '@/stores/spotify';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import Logo from "@/assets/text-logo.svg?component"

const spotifyStore = useSpotifyStore();
const appStore = useAppStore();
const options = ref({ rewind: false, autoWidth: false, arrows: false, pagination: false, perPage: 5, perMove: 1, padding: { right: 200 } })

const { recentlyPlayedTracks, savedTracks } = storeToRefs(spotifyStore);
const { play } = spotifyStore
const { showPlayer, showRecentlyPlayed } = storeToRefs(appStore);

const recentlyPlayedTracksNoDuplicates = computed(() => {
  const seen = new Set();
  return recentlyPlayedTracks.value.filter((item) => {
    const duplicate = seen.has(item.track.id);
    seen.add(item.track.id);
    return !duplicate;
  });
})

function playRecent(track: typeof recentlyPlayedTracks.value[number]) {
  play([track.track.uri])
  showRecentlyPlayed.value = false
}

function playSaved() {
  play(savedTracks.value.map((item) => item.track.uri))
  showRecentlyPlayed.value = false
}

</script>

<style lang="scss" scoped>
#app {
  color: #fff;
  overflow: hidden;
  //background-color: #000;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%);
}

.tracks-container {
  position: absolute;
  display: flex;
  //grid-template-columns: 1fr 3fr;
  height: 50vh;
  width: 100vw;
  left: 0;
  padding-top: 60px;
  padding-left: 60px;
  overflow: hidden;
  gap: 112px;
  //background-color: #000;
}

.tracks-container>div {
  z-index: 5;
}

.tracks-container h1 {
  opacity: 0.5;
  margin-left: 0.2927083333333333vw;
  margin-bottom: 13.5px;
}

.carousel-container {
  position: absolute;
  width: 100%;
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

.carousel-item {
  min-width: 270px;
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

.tracks-container h2,
.tracks-container h3 {
  margin-left: 0.2927083333333333vw;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 50vh;
  position: absolute;
  bottom: 0;
  width: 100vw;
  background-color: #000000;
}

.logo-container svg {
  //width: 520.43px;
  //height: 318.56px;
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
  width: 100vh;
  left: 0;
  //width: 80vw;
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
  position: fixed;
  width: 100vw;
  height: 100vh;
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
