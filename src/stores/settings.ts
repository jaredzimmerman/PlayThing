import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const nothingPlayingOptions = [
  { title: 'Blank', value: 'blank' },
  { title: 'Clock 12h / 24h', value: 'regular-clock' },
  { title: 'Word Clock', value: 'word-clock' },
  { title: 'Recents', value: 'recents' }
]

export const backgroundOptions = [
  { title: 'Black (OLED)', value: 'black-oled' },
  { title: 'Match', value: 'match' },
  { title: 'Match Dark', value: 'match-dark' },
  { title: 'Contrast', value: 'contrast' },
  { title: 'Blur', value: 'blur' },
  { title: 'Spotlight', value: 'spotlight' }
]

export const textOptions = [
  { title: 'None (Album art only)', value: 'none' },
  { title: 'Small', value: 'small' },
  { title: 'Medium', value: 'medium' },
  { title: 'Large', value: 'large' },
  { title: 'Extra large', value: 'extra-large' },
  { title: 'Text Only', value: 'text-only' }
]

export const miscellaneousOptions = [
  { title: 'Show progress bar', value: 'show-progress-bar' },
  {
    title: 'Autohide playback controls',
    value: 'autohide-playback-controls'
  },
  {
    title: 'Animate Blur & Spotlight themes',
    value: 'animate-blur-spotlight'
  }
]

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const nothingPlayingOption = ref('blank')
    const textOption = ref('none')
    const backgroundOption = ref('black-oled')
    const miscellaneousOption = ref(['show-progress-bar'])

    function setNothingPlaying(value: string) {
      if (value === 'regular-clock') {
        if (nothingPlayingOption.value === 'regular-clock-12') {
          nothingPlayingOption.value = 'regular-clock-24'
        } else {
          nothingPlayingOption.value = 'regular-clock-12'
        }
      } else {
        nothingPlayingOption.value = value
      }
    }

    function setTextOption(value: string) {
      textOption.value = value
    }

    function setBackgroundOption(value: string) {
      backgroundOption.value = value
    }

    function setMiscellaneousOption(value: string) {
      const options = new Set(miscellaneousOption.value)
      if (miscellaneousOption.value.includes(value)) {
        options.delete(value)
      } else {
        options.add(value)
      }
      miscellaneousOption.value = Array.from(options)
    }

    return {
      nothingPlayingOption,
      textOption,
      backgroundOption,
      miscellaneousOption,
      setNothingPlaying,
      setTextOption,
      setBackgroundOption,
      setMiscellaneousOption
    }
  },
  {
    persist: true
  }
)
