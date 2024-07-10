<template>
  <div id="setting-screen">
    <div class="closeIconContainer" @click="closeSettings">
      <img src="CloseIcon.svg" />
    </div>
    <div class="container">
      <div class="img-container">
        <img src="text-logo.svg" class="logo" />
      </div>
      <div class="setting-container">
        <h2 class="mainTitle">Settings</h2>
        <section>
          <h3>Nothing playing</h3>
          <ul>
            <li v-for="option in nothingPlayingOptions" :key="option.value"
              @click="onSelectNothingPlaying(option.value)">
              <span v-if="selectedNothingPlayingOption.includes(option.value)"><img src="CaretIcon.svg" /></span>
              <span v-if="option.value != 'regular-clock'" :class="option.value === selectedNothingPlayingOption ? 'active' : ''
      ">
                {{ option.title }}
              </span>
              <span class="colorless-active" v-else-if="selectedNothingPlayingOption === 'regular-clock-12'"><span
                  style="color: #fff">Clock</span>&nbsp;<span style="color: #fff"
                  class="clock">12h</span>&nbsp;/&nbsp;24h</span>
              <span class="colorless-active" v-else-if="selectedNothingPlayingOption === 'regular-clock-24'"><span
                  style="color: #fff">Clock</span>&nbsp;12h&nbsp;/&nbsp;<span style="color: #fff"
                  class="clock">24h</span></span>
              <span v-else>Clock&nbsp;12h&nbsp;/&nbsp;24h</span>
            </li>
          </ul>
        </section>
        <section>
          <h3>Background</h3>
          <ul>
            <li v-for="option in backgroundOptions" :key="option.value" @click="onSelectBackgroundOption(option.value)">
              <span v-if="option.value === selectedBackgroundOption"><img src="CaretIcon.svg" /></span>
              <span :class="option.value === selectedBackgroundOption ? 'active' : ''
      ">{{ option.title }}</span>
            </li>
          </ul>
        </section>
        <section>
          <h3>Text Size & Album Art</h3>
          <ul>
            <li v-for="option in textOptions" :key="option.value" @click="onSelectTextOption(option.value)">
              <span v-if="option.value === selectedTextOption"><img src="CaretIcon.svg" /></span>
              <span :class="option.value === selectedTextOption ? 'active' : ''">{{ option.title }}</span>
            </li>
          </ul>
        </section>
        <section>
          <h3>Miscellaneous</h3>
          <ul>
            <li v-for="option in miscellaneousOptions" :key="option.value"
              @click="onSelectMiscellaneousOption(option.value)">
              <span v-if="selectedMiscellaneousOption.includes(option.value)"><img src="CaretIcon.svg" /></span>
              <span :class="selectedMiscellaneousOption.includes(option.value)
      ? 'active'
      : ''
      ">{{ option.title }}</span>
            </li>
          </ul>
        </section>

        <section>
          <h3>Logout</h3>
        </section>

        <section class="credit-section">
          <h3>Credit</h3>
          <p>
            <strong>PlayThing</strong> is based on <strong>Nowify</strong> by
            <strong>Jon Ashcroft.</strong>
          </p>
          <p>
            PlayThing is Designed and conceptualized by
            <strong>Jared Zimmerman</strong> and built by
            <strong>XXXX XXXX</strong>.
          </p>
          <p>
            PlayThing is not affiliated with Spotify.
          </p>

          <p>More into at:https://jmz.fyi/plaything</p>

          <p>Open Source Libraries in use:</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingScreen',
  props: {},
  data() {
    return {
      nothingPlayingOptions: [
        { title: 'Blank', value: 'blank' },
        { title: 'Clock 12h / 24h', value: 'regular-clock' },
        { title: 'Word Clock', value: 'word-clock' },
        { title: 'Recents', value: 'recents' }
      ],
      backgroundOptions: [
        { title: 'Black (OLED)', value: 'black-oled' },
        { title: 'Match', value: 'match' },
        { title: 'Match Dark', value: 'match-dark' },
        { title: 'Contrast', value: 'contrast' },
        { title: 'Blur', value: 'blur' },
        { title: 'Spotlight', value: 'spotlight' }
      ],
      textOptions: [
        { title: 'None (Album art only)', value: 'none' },
        { title: 'Small', value: 'small' },
        { title: 'Medium', value: 'medium' },
        { title: 'Large', value: 'large' },
        { title: 'Text Only', value: 'text-only' }
      ],
      miscellaneousOptions: [
        { title: 'Show progress bar', value: 'show-progress-bar' },
        {
          title: 'Autohide playback controls',
          value: 'autohide-playback-controls'
        },
        {
          title: 'Animate Blur & Spotlight themes',
          value: 'animate-blur-spotlight'
        }
      ],
      selectedNothingPlayingOption: 'blank',
      selectedTextOption: 'none',
      selectedBackgroundOption: 'black-oled',
      selectedMiscellaneousOption: 'show-progress-bar',
      closeTimeout: null
    }
  },
  created() {
    const settingString = localStorage.getItem('playThingSettings')
    try {
      const setting = JSON.parse(settingString)
      this.selectedBackgroundOption = setting?.backgroundOption ?? 'black-oled'
      this.selectedTextOption = setting?.textOption ?? 'none'
      this.selectedNothingPlayingOption =
        setting?.nothingPlayingOption ?? 'blank'
      this.selectedMiscellaneousOption =
        setting?.miscellaneousOption ?? 'show-progress-bar'
    } catch (e) {
      // default values
      this.selectedBackgroundOption = 'black-oled'
      this.selectedTextOption = 'none'
      this.selectedNothingPlayingOption = 'blank'
      this.selectedMiscellaneousOption = ['show-progress-bar']
    }
  },
  computed: {
    settings() {
      // this watches if any of the 4 settings has changed
      return `${this.selectedNothingPlayingOption}${this.selectedTextOption}${this.selectedBackgroundOption}${this.selectedMiscellaneousOption}`
    }
  },
  watch: {
    settings() {
      const settings = {
        nothingPlayingOption: this.selectedNothingPlayingOption,
        backgroundOption: this.selectedBackgroundOption,
        textOption: this.selectedTextOption,
        miscellaneousOption: this.selectedMiscellaneousOption
      }
      localStorage.setItem('playThingSettings', JSON.stringify(settings))
    }
  },
  methods: {
    onSelectNothingPlaying(value) {
      console.log(value, this.selectedNothingPlayingOption)
      if (value === 'regular-clock') {
        console.log('here')
        if (this.selectedNothingPlayingOption === 'regular-clock-12') {
          console.log('here 2')
          this.selectedNothingPlayingOption = 'regular-clock-24'
        } else {
          console.log('here 1')
          this.selectedNothingPlayingOption = 'regular-clock-12'
        }
      } else {
        this.selectedNothingPlayingOption = value
      }
    },
    onSelectTextOption(value) {
      this.selectedTextOption = value
    },
    onSelectBackgroundOption(value) {
      this.selectedBackgroundOption = value
    },
    onSelectMiscellaneousOption(value) {
      const options = new Set(this.selectedMiscellaneousOption)
      if (this.selectedMiscellaneousOption.includes(value)) {
        options.delete(value)
      } else {
        options.add(value)
      }
      this.selectedMiscellaneousOption = Array.from(options)
    },
    onLogout() {
      // localStorage.removeItem('nowify_auth_state');
    },
    closeSettings() {
      // this.$emit('pageChange', 'Authorise')

      this.$emit('closeSettings')
    }
  }
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

.img-container {
  width: 50%;
  position: relative;
}

.logo {
  position: fixed;
  aspect-ratio: 1;
  width: 100%;
  top: 10%;
  left: 10%;
  width: 30%;
}

.setting-container {
  width: 50%;
  padding: 5px;
}

.mainTitle {
  font-family: Inter;
  /*font-size: 55px;*/
  font-size: 55px;
  font-weight: 600;
  line-height: 82.5px;
  letter-spacing: 0.1em;
  text-align: left;
}

.closeIconContainer {
  display: flex;
  justify-content: right;
  padding: 5px;
  position: fixed;
  top: 10px;
  right: 10px;
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
  font-size: 50px;
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

.colorless-active {
  color: #5c5c5c;
  margin-left: 5px !important;
}

.setting-container li span.active {
  color: #fff;
}
</style>
