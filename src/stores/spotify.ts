import { ref, computed, shallowRef, watch } from 'vue'
import { defineStore } from 'pinia'
import { SpotifyApi, type AccessToken, type SavedTrack } from '@spotify/web-api-ts-sdk'
import type { LocationQueryValue } from 'vue-router'
import type { PlayHistory } from 'node_modules/@spotify/web-api-ts-sdk/dist/cjs'

declare global {
  interface Window {
    Spotify: any
    onSpotifyWebPlaybackSDKReady: any
  }
}

const scopes = [
  'user-read-currently-playing',
  'user-modify-playback-state',
  'user-read-playback-state',
  'user-read-recently-played',
  'user-library-read',
  'streaming',
  'user-read-private'
]

export const useSpotifyStore = defineStore(
  'spotify',
  () => {
    const accessToken = ref<AccessToken | null>(null)
    //const player = ref<any>(null)
    const playbackState = shallowRef<any | null>(null)
    const authenticated = ref(false)
    const currentDeviceID = ref('')
    const recentlyPlayedTracks = ref<PlayHistory[]>([])
    const savedTracks = ref<SavedTrack[]>([])

    const progressDuration = ref(1)
    const progressPosition = ref(0)

    //const settingsStore = useSettingsStore()
    const clientId = import.meta.env.VUE_APP_SP_CLIENT_ID
    //const clientSecret = import.meta.env.VUE_APP_SP_CLIENT_SECRET
    const apiClient: SpotifyApi = SpotifyApi.withUserAuthorization(
      clientId,
      window.location.origin,
      scopes
    )

    let player: any = null

    let progressAnimationFrameId: any = null

    const progressPercentage = computed(
      () => (progressPosition.value * 100) / progressDuration.value
    )

    const trackID = computed(() => playbackState.value?.track_window.current_track.id)

    const trackName = computed(() => {
      if (playbackState.value?.track_window == null) return ''
      return playbackState.value.track_window.current_track.name
    })

    const artistName = computed(() => {
      if (playbackState.value?.track_window == null) return ''
      const item = playbackState.value.track_window as any
      return item.current_track.artists.map((artist: any) => artist.name).join(', ')
    })

    const albumArtURL = computed(() => {
      if (playbackState.value == null) return ''
      const item = playbackState.value.track_window as any
      return item.current_track.album.images[0].url
    })

    const shuffleState = computed(() => {
      if (playbackState.value == null) return false
      return playbackState.value.shuffle
    })

    const repeatState = computed(() => {
      const states = ['off', 'context', 'track']
      if (playbackState.value == null) return 'off'
      return states[playbackState.value.repeat_mode]
    })

    const isPlaying = computed(() => {
      if (playbackState.value == null) return false
      return !playbackState.value.paused
    })

    function authenticate(code: any = null) {
      if (code) {
        apiClient.authenticate().then((res) => {
          authenticated.value = res.authenticated
          accessToken.value = res.accessToken
          initPlayer()
        })
      } else {
        // call just to trigger authentication
        apiClient.currentUser.profile().then(() => {
          apiClient.getAccessToken().then((res) => {
            accessToken.value = res
            authenticated.value = true
            initPlayer()
          })
        })
      }
    }

    function resetProgress() {
      if (playbackState.value) {
        progressDuration.value = playbackState.value.duration ?? 1
        progressPosition.value = playbackState.value.position ?? 1
      }
    }

    function startProgress(restarting = false) {
      if (playbackState.value) {
        if (restarting) progressPosition.value = 0
        const startTime = Date.now() - progressPosition.value

        if (progressAnimationFrameId) {
          cancelAnimationFrame(progressAnimationFrameId)
        }

        function updateProgress() {
          if (isPlaying.value) {
            const elapsedTime = Date.now() - startTime
            progressPosition.value = Math.min(elapsedTime, progressDuration.value)
            if (elapsedTime == progressDuration.value) {
              progressPosition.value = 0
            }
            // if (progressPosition.value > progressDuration.value) progressPosition.value = 0
            if (progressPosition.value < progressDuration.value) {
              progressAnimationFrameId = requestAnimationFrame(updateProgress)
            } else {
              // when repeat mode is on track, we restart the whole progress
              if (playbackState.value.repeat_mode === 2) {
                startProgress(true)
              }
            }
          }
        }
        progressAnimationFrameId = requestAnimationFrame(updateProgress)
      }
    }

    function play(tracks: string[] | null = null) {
      if (tracks) {
        apiClient?.player.startResumePlayback(currentDeviceID.value, undefined, tracks)
      } else {
        player?.resume()
      }
    }
    function pause() {
      player?.pause()
    }
    function shuffle(state: boolean) {
      try {
        if (currentDeviceID.value) {
          apiClient?.player.togglePlaybackShuffle(state, currentDeviceID.value)
          // we update in advance
          playbackState.value = {
            ...playbackState.value,
            shuffle: state,
            shuffle_mode: state ? 1 : 0
          }
        }
      } catch (err) {}
    }

    function repeat(repeatMode: 'track' | 'context' | 'off') {
      const modes = { off: 0, context: 1, track: 2 }
      try {
        if (currentDeviceID.value) {
          apiClient?.player.setRepeatMode(repeatMode, currentDeviceID.value)
          // we update in advance
          playbackState.value = {
            ...playbackState.value,
            repeat_mode: modes[repeatMode]
          }
        }
      } catch (err) {}
    }

    function nextTrack() {
      player?.nextTrack()
    }

    function previousTrack() {
      player?.previousTrack()
    }

    function initPlayer() {
      if (!window.Spotify) return
      player = new window.Spotify.Player({
        name: 'PlayThing',
        getOAuthToken: (cb: any) => {
          cb(accessToken.value?.access_token)
        }
      })

      player.addListener('ready', ({ device_id }: any) => {
        currentDeviceID.value = device_id
        loadRecents()
      })

      player.addListener('player_state_changed', (state: any) => {
        // console.log('new state : ', state)
        playbackState.value = state
        loadRecents()
        loadSavedTracks()
      })

      player.on('authentication_error', () => {
        //console.log('AUTHENTICATION ERROR')
        //authoriseWithAccessToken()
      })

      player.on('playback_error', () => {
        //console.log('PLAYBACK ERROR')
        authenticate()
        //authoriseWithAccessToken()
      })

      player.connect().then((success: boolean) => {
        if (success) {
          authenticated.value = true
          // player?.resume()
        }
      })
    }

    watch(currentDeviceID, () => {
      if (currentDeviceID.value) {
        apiClient?.player.transferPlayback([currentDeviceID.value], true)
      }
    })

    watch(isPlaying, (status) => {
      if (status) {
        resetProgress()
        startProgress()
      } else {
        cancelAnimationFrame(progressAnimationFrameId)
      }
    })

    watch(trackID, () => {
      //clearInterval(interval);
      cancelAnimationFrame(progressAnimationFrameId)
      resetProgress()
      startProgress()
    })

    function initPlaybackSDK() {
      window.onSpotifyWebPlaybackSDKReady = () => {
        if (authenticated.value && player == null) {
          initPlayer()
        }
      }
    }

    function loadRecents() {
      apiClient?.player.getRecentlyPlayedTracks().then((response) => {
        recentlyPlayedTracks.value = response.items
      })
    }

    function loadSavedTracks() {
      apiClient?.currentUser.tracks.savedTracks().then((response) => {
        savedTracks.value = response.items
      })
    }

    function logout() {
      // player.disconnect()
      accessToken.value = null
      authenticated.value = false
    }

    return {
      authenticated,
      accessToken,
      //playbackState,
      trackID,
      trackName,
      artistName,
      albumArtURL,
      shuffleState,
      repeatState,
      isPlaying,
      //showPlayer,
      playbackState,
      progressPercentage,
      recentlyPlayedTracks,
      savedTracks,
      initPlaybackSDK,
      initPlayer,
      authenticate,
      play,
      pause,
      shuffle,
      repeat,
      nextTrack,
      previousTrack,
      startProgress,
      resetProgress,
      logout
    }
  },
  {
    persist: {
      paths: ['accessToken']
    }
  }
)
