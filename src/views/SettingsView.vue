<template>
  <div id="setting-screen">
    <div class="closeIconContainer">
      <img src="@/assets/CloseIcon.svg?url" @click="router.back()" alt="Close" />
    </div>
    <div class="container">
      <div class="img-container">
        <div>
          <img src="@/assets/text-logo.svg?url" class="logo" alt="PlayThing Logo" />
          <div class="seperator"></div>
        </div>
      </div>
      <div class="setting-container">
        <h2 class="mainTitle">SETTINGS</h2>
        <section>
          <h3>Nothing playing</h3>
          <ul>
            <li
              v-for="option in nothingPlayingOptions"
              :key="option.value"
              @click="setNothingPlaying(option.value)"
            >
              <span v-if="nothingPlayingOption.includes(option.value)"
                ><img src="@/assets/CaretIcon.svg?url" alt="Selected" /></span>
              <span
                v-if="option.value != 'regular-clock'"
                :class="option.value === nothingPlayingOption ? 'active' : ''"
              >
                {{ option.title }}
              </span>
              <span class="colorless-active" v-else-if="nothingPlayingOption === 'regular-clock-12'"
                ><span style="color: #fff">Clock</span>&nbsp;<span style="color: #fff" class="clock"
                  >12h</span
                >&nbsp;/&nbsp;24h</span
              >
              <span class="colorless-active" v-else-if="nothingPlayingOption === 'regular-clock-24'"
                ><span style="color: #fff">Clock</span>&nbsp;12h&nbsp;/&nbsp;<span
                  style="color: #fff"
                  class="clock"
                  >24h</span
                ></span
              >
              <span v-else>Clock&nbsp;12h&nbsp;/&nbsp;24h</span>
            </li>
          </ul>
        </section>
        <section>
          <h3>Background</h3>
          <ul>
            <li
              v-for="option in backgroundOptions"
              :key="option.value"
              @click="setBackgroundOption(option.value)"
            >
              <span v-if="option.value === backgroundOption"
                ><img src="@/assets/CaretIcon.svg?url" alt="Selected" /></span>
              <span :class="option.value === backgroundOption ? 'active' : ''">{{
                option.title
              }}</span>
            </li>
          </ul>
        </section>
        <section>
          <h3>Text Size & Album Art</h3>
          <ul>
            <li
              v-for="option in textOptions"
              :key="option.value"
              @click="setTextOption(option.value)"
            >
              <span v-if="option.value === textOption"
                ><img src="@/assets/CaretIcon.svg?url" alt="Selected" /></span>
              <span :class="option.value === textOption ? 'active' : ''">{{ option.title }}</span>
            </li>
          </ul>
        </section>
        <section>
          <h3>Miscellaneous</h3>
          <ul>
            <li
              v-for="option in miscellaneousOptions"
              :key="option.value"
              @click="setMiscellaneousOption(option.value)"
            >
              <span v-if="miscellaneousOption.includes(option.value)"
                ><img src="@/assets/CaretIcon.svg?url" alt="Selected" /></span>
              <span :class="miscellaneousOption.includes(option.value) ? 'active' : ''">{{
                option.title
              }}</span>
            </li>
          </ul>
        </section>

        <section>
          <h3 @click="logout">Logout</h3>
        </section>

        <section class="credit-section">
          <h3>Credits</h3>
          <p>
            <strong>PlayThing</strong> is based on <strong>Nowify</strong> by
            <strong>Jon Ashcroft.</strong>
          </p>
          <p>
            PlayThing is Designed and conceptualized by
            <strong>Jared Zimmerman</strong> and built by <strong>Cedric Agoliki</strong>.
          </p>
          <p>PlayThing is not affiliated with Spotify.</p>

          <p>More info at: <br /><span @click="openInfo()">https://jmz.fyi/plaything</span></p>

          <p>
            Open Source Libraries in use: @georgedoescode/spline, @spotify/web-api-ts-sdk,
            colorthief, pinia, pinia-plugin-persistedstate, simplex-noise, vue-router, vue-splide,
            vue3-text-clamp, vue3-touch-events, vueJS.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  useSettingsStore,
  nothingPlayingOptions,
  textOptions,
  backgroundOptions,
  miscellaneousOptions
} from '@/stores/settings'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useSpotifyStore } from '@/stores/spotify'

const router = useRouter()

const settingsStore = useSettingsStore()
const spotifyStore = useSpotifyStore()

const { nothingPlayingOption, textOption, backgroundOption, miscellaneousOption } =
  storeToRefs(settingsStore)

const { setNothingPlaying, setTextOption, setBackgroundOption, setMiscellaneousOption } =
  settingsStore

const { logout } = spotifyStore

function openInfo() {
  window?.open('https://jmz.fyi/plaything', '_blank')?.focus()
}
</script>

<style scoped lang="scss">
#setting-screen {
  background-color: #000;
  color: #fff;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow-x: hidden;
  height: 100vh;
  width: 100vw;
}

.container {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
  .img-container,
  .setting-container {
    width: 100%;
  }
  .img-container > div {
    position: static;
    width: 100%;
    height: auto;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  .seperator {
    display: none;
  }
  .mainTitle {
    position: static;
    text-align: center;
  }
  .closeIconContainer {
    top: 10px;
    right: 10px;
  }
}

.img-container {
  width: 50%;
  position: relative;
}

.logo {
  //position: fixed;
  aspect-ratio: 1;
  width: 100%;
  max-width: 603px;
  max-height: 362.45px;
  top: 10%;
  left: 10%;
  //width: 30%;
}

.seperator {
  height: 715px;
  width: 1px;
  background-color: #fff;
  margin-left: 140px;
}

.img-container > div {
  position: fixed;
  //background-color: red;
  width: 50%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.setting-container {
  width: 50%;
  padding: 5px;
  position: relative;
  margin-top: 228px;
}

.mainTitle {
  font-family: Inter;
  /*font-size: 55px;*/
  font-size: 55px;
  font-weight: 600;
  line-height: 82.5px;
  letter-spacing: 0.1em;
  text-align: left;
  position: fixed;
  width: 100%;
  height: 228px;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  background-color: #000;
}

.closeIconContainer {
  display: flex;
  justify-content: right;
  padding: 5px;
  position: fixed;
  top: 50px;
  right: 50px;
  width: 42px;
  aspect-ratio: 1;
  z-index: 3;
}

.setting-container ul {
  list-style-type: none;
  list-style-position: inside;
  padding: 0;
}

.setting-container li {
  display: flex;
  align-items: center;
  gap: 5px;
}

.setting-container li img {
  width: 15px;
  height: 30.5px;
}

.setting-container li span,
h3,
section.credit-section {
  color: #5c5c5c;
  font-family: Inter;
  font-size: 45px;
  /*font-size: 55px;*/
  /*font-size: 5vw;*/
  /*font-weight: 600;*/
  line-height: 82.5px;
  letter-spacing: 0.1em;
  text-align: left;
}

h3 {
  color: #fff;
}

.setting-container {
  li {
    span:last-child {
      margin-left: 25px;

      &.active {
        margin-left: 5px;
      }

      &.clock {
        margin: 0;
      }
    }
  }
}

.setting-container li span.colorless-active {
  color: #5c5c5c;
  margin-left: 5px;
}

.setting-container li span.active {
  color: #fff;
}
</style>
