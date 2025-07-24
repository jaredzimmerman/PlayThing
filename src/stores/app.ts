import { ref, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useSettingsStore } from './settings'
import { setAppColours } from '@/utils/colors'
import { useSpotifyStore } from './spotify'

export const useAppStore = defineStore(
  'app',
  () => {
    const settingsStore = useSettingsStore()
    const spotifyStore = useSpotifyStore()
    const { textOption, miscellaneousOption, backgroundOption } = storeToRefs(settingsStore)
    const { albumArtURL, isPlaying } = storeToRefs(spotifyStore)
    const { nextTrack, previousTrack, play, pause } = spotifyStore

    const showSettingButton = ref(false)
    const showSplashScreen = ref(true)
    const showRecentlyPlayed = ref(false)
    const showPlayer = ref(false)
    const fadePlayer = ref(false)
    const isFirstTimeUsage = ref(true)
    const showShortcuts = ref(false)

    const lineNumber = ref(10)
    const lineNumberArtist = ref(10)

    const hideControls = ref(false)

    let settingButtonTimeout: any = null
    let showPlayerTimeout: any = null
    let hideControlsTimeout: any = null
    let fadePlayerTimeout: any = null

    setAppColours(settingsStore, albumArtURL.value)

    updateTextStyle()
    fadeAndShowClockifNotPlaying()
    if (miscellaneousOption.value.includes('autohide-playback-controls')) {
      autoHideControls()
    }

    function updateTextStyle() {
      const value = textOption.value

      let displayText = ''
      let displayAlbumArt = ''
      let textSize = ''
      let titleSize = ''
      let artistSize = ''
      let albumArtSize = ''

      if (value === 'none') {
        displayText = 'none'
        displayAlbumArt = 'inherit'
        textSize = '1rem'
        titleSize = ''
        artistSize = ''
        albumArtSize = 'clamp(200px, 45vmin, 640px)'
      } else if (value === 'small') {
        displayText = 'inherit'
        displayAlbumArt = 'inherit'
        textSize = '1rem'
        titleSize = '60px'
        artistSize = '50px'
        lineNumber.value = 4
        lineNumberArtist.value = 3
        albumArtSize = 'clamp(150px, 40vmin, 640px)'
      } else if (value === 'medium') {
        displayText = 'inherit'
        displayAlbumArt = 'inherit'
        textSize = '2rem'
        titleSize = '80px'
        artistSize = '50px'
        if (hideControls.value) {
          lineNumber.value = 4
        } else {
          lineNumber.value = 3
        }
        lineNumberArtist.value = 3
        albumArtSize = 'clamp(150px, 38vmin, 640px)'
      } else if (value === 'large') {
        displayText = 'inherit'
        displayAlbumArt = 'inherit'
        textSize = '3rem'
        titleSize = '110px'
        artistSize = '50px'
        lineNumberArtist.value = 2
        albumArtSize = 'clamp(150px, 35vmin, 640px)'
        if (hideControls.value) {
          lineNumber.value = 4
        } else {
          lineNumber.value = 2
        }
      } else if (value === 'extra-large') {
        displayText = 'inherit'
        displayAlbumArt = 'inherit'
        textSize = '3rem'
        titleSize = '130px'
        artistSize = '50px'
        lineNumberArtist.value = 1
        albumArtSize = 'clamp(150px, 32vmin, 640px)'
        if (hideControls.value) {
          lineNumber.value = 3
        } else {
          lineNumber.value = 2
          //lineNumberArtist.value = 2
        }
      } else if (value === 'text-only') {
        displayText = 'inherit'
        displayAlbumArt = 'none'
        titleSize = ''
        artistSize = ''
        albumArtSize = 'clamp(150px, 40vmin, 640px)'
      }

      document.documentElement.style.setProperty('--display-text', displayText)
      document.documentElement.style.setProperty('--display-album-art', displayAlbumArt)
      document.documentElement.style.setProperty('--text-size', textSize)
      document.documentElement.style.setProperty('--track-text-size', titleSize)
      document.documentElement.style.setProperty('--artist-text-size', artistSize)
      document.documentElement.style.setProperty('--album-art-size', albumArtSize)
    }

    function onKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case 'ArrowRight':
          if (event.ctrlKey || event.altKey) {
            if (backgroundOption.value === 'black-oled') backgroundOption.value = 'match'
            else if (backgroundOption.value === 'match') backgroundOption.value = 'match-dark'
            else if (backgroundOption.value === 'match-dark') backgroundOption.value = 'contrast'
            else if (backgroundOption.value === 'contrast') backgroundOption.value = 'blur'
            else if (backgroundOption.value === 'blur') backgroundOption.value = 'spotlight'
            else backgroundOption.value = 'black-oled'
          } else {
            nextTrack()
          }
          break
        case 'ArrowLeft':
          if (event.ctrlKey || event.altKey) {
            if (backgroundOption.value === 'black-oled') backgroundOption.value = 'spotlight'
            else if (backgroundOption.value === 'match') backgroundOption.value = 'black-oled'
            else if (backgroundOption.value === 'match-dark') backgroundOption.value = 'match'
            else if (backgroundOption.value === 'contrast') backgroundOption.value = 'match-dark'
            else if (backgroundOption.value === 'blur') backgroundOption.value = 'contrast'
            else backgroundOption.value = 'blur'
          } else {
            previousTrack()
          }
          break
        case 'ArrowUp':
          if (event.ctrlKey || event.altKey) {
            if (textOption.value === 'none') textOption.value = 'text-only'
            else if (textOption.value === 'small') textOption.value = 'none'
            else if (textOption.value === 'medium') textOption.value = 'small'
            else if (textOption.value === 'large') textOption.value = 'medium'
            else if (textOption.value === 'extra-large') textOption.value = 'large'
            else textOption.value = 'extra-large'
          } else {
            hideControls.value = !hideControls.value
          }
          break
        case 'ArrowDown':
          if (event.ctrlKey || event.altKey) {
            if (textOption.value === 'none') textOption.value = 'small'
            else if (textOption.value === 'small') textOption.value = 'medium'
            else if (textOption.value === 'medium') textOption.value = 'large'
            else if (textOption.value === 'large') textOption.value = 'extra-large'
            else if (textOption.value === 'extra-large') textOption.value = 'text-only'
            else textOption.value = 'none'
          } else {
            showRecentlyPlayed.value = !showRecentlyPlayed.value
          }
          break
        case ' ':
          // Play/pause functionality
          if (isPlaying.value) {
            pause()
          } else {
            play()
          }
          break
        case 'P':
          {
            if (miscellaneousOption.value.includes('show-progress-bar')) {
              miscellaneousOption.value = miscellaneousOption.value.filter(
                (option) => option != 'show-progress-bar'
              )
            } else {
              miscellaneousOption.value.push('show-progress-bar')
            }
          }
          break
        case 'A':
          {
            if (miscellaneousOption.value.includes('animate-blur-spotlight')) {
              miscellaneousOption.value = miscellaneousOption.value.filter(
                (option) => option != 'animate-blur-spotlight'
              )
            } else {
              miscellaneousOption.value.push('animate-blur-spotlight')
            }
          }
          break
        case '?':
          showShortcuts.value = !showShortcuts.value
          break
        case 'Escape':
          showShortcuts.value = false
          break
        default:
          break
      }
    }

    function registerKeyboardShortcuts() {
      document.addEventListener('keydown', onKeyDown)
    }

    function unregisterKeyboardShortcuts() {
      document.removeEventListener('keydown', onKeyDown)
    }

    function autoHideControls() {
      hideControlsTimeout = setTimeout(() => {
        hideControls.value = true
      }, 15 * 1000)
    }

    function fadeAndShowClockifNotPlaying() {
      if (!isPlaying.value) {
        clearTimeout(fadePlayerTimeout)
        fadePlayerTimeout = setTimeout(() => {
          fadePlayer.value = true
          clearTimeout(showPlayerTimeout)
          showPlayerTimeout = setTimeout(() => {
            showPlayer.value = false
            fadePlayer.value = false
          }, 30 * 1000)
        }, 30 * 1000)
      } else {
        if (showPlayerTimeout) clearTimeout(showPlayerTimeout)
        if (fadePlayerTimeout) clearTimeout(fadePlayerTimeout)
        showPlayer.value = true
        fadePlayer.value = false
      }
    }

    watch(textOption, () => {
      updateTextStyle()
    })

    watch(albumArtURL, () => {
      setAppColours(settingsStore, albumArtURL.value)
    })

    // show/hide show settings button
    watch(showSettingButton, (show) => {
      if (settingButtonTimeout) clearTimeout(settingButtonTimeout)
      if (show) {
        settingButtonTimeout = setInterval(() => {
          showSettingButton.value = false
        }, 15 * 1000)
      }
    })

    // if player is on pause, fade player after 30 sec
    // and display clock after another 30 sec
    watch(isPlaying, () => {
      fadeAndShowClockifNotPlaying()
    })

    // autohide controls
    watch(hideControls, (hide) => {
      if (!hide) {
        if (miscellaneousOption.value.includes('autohide-playback-controls')) {
          if (hideControlsTimeout != null) {
            clearTimeout(hideControlsTimeout)
          }
          autoHideControls()
        } else {
          if (hideControlsTimeout != null) {
            clearTimeout(hideControlsTimeout)
          }
        }
      }
    })

    // if settins have changed, we clear a possible timeout going on
    watch(miscellaneousOption, (option) => {
      if (!option.includes('autohide-playback-controls')) {
        if (hideControlsTimeout != null) {
          clearTimeout(hideControlsTimeout)
        }
      } else {
        autoHideControls()
      }
    })

    watch(backgroundOption, () => {
      setAppColours(settingsStore, albumArtURL.value)
    })

    return {
      lineNumber,
      lineNumberArtist,
      hideControls,
      showSettingButton,
      showSplashScreen,
      showPlayer,
      fadePlayer,
      isFirstTimeUsage,
      showRecentlyPlayed,
      showShortcuts,
      registerKeyboardShortcuts,
      unregisterKeyboardShortcuts
    }
  },
  {
    persist: {
      paths: ['isFirstTimeUsage']
    }
  }
)
