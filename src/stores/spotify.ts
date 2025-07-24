import { ref, computed, shallowRef, watch } from 'vue'
import { defineStore } from 'pinia'
import { SpotifyApi, type AccessToken, type SavedTrack } from '@spotify/web-api-ts-sdk'
import type { PlayHistory } from 'node_modules/@spotify/web-api-ts-sdk/dist/cjs'
import { useSpotifyPlaybackState } from '@/composables/useSpotifyPlaybackState'

const scopes = [
  'user-read-currently-playing',
  'user-modify-playback-state',
  'user-read-playback-state',
  'user-read-recently-played',
  'user-library-read',
  'streaming',
  'user-read-private',
  'user-read-birthdate',
  'user-read-email',
  'web-playback'
]

export const useSpotifyStore = defineStore(
  'spotify',
  () => {
    const pollingInterval = import.meta.env.VUE_APP_POLLING_INTERVAL_MILLISECONDS ?? 1000
    const accessToken = ref<AccessToken | null>(null)
    //const player = ref<any>(null)
    //const playbackState = shallowRef<any | null>(null)
    const authenticated = ref(false)
    const currentDeviceID = ref('')
    const recentlyPlayedTracks = ref<PlayHistory[]>([])
    const savedTracks = ref<SavedTrack[]>([])
    const { playbackState } = useSpotifyPlaybackState(
      async () => {
        const accessToken = await apiClient.getAccessToken()
        return accessToken?.access_token ?? ''
      },
      //async () => apiClient,
      pollingInterval
    )

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

    let progressAnimationFrameId: any = null

    const progressPercentage = computed(
      () => (progressPosition.value * 100) / progressDuration.value
    )

    const trackID = computed(() => playbackState.value?.item.id)

    const trackName = computed(() => {
      if (playbackState.value?.item == null) return ''
      return playbackState.value.item.name
    })

    const artistName = computed(() => {
      if (playbackState.value?.item == null) return ''
      const item = playbackState.value.item as any
      return item.artists.map((artist: any) => artist.name).join(', ')
    })

    const albumArtURL = computed(() => {
      if (playbackState.value == null) return ''
      const item = playbackState.value.item as any
      return item.album.images[0].url
    })

    const shuffleState = computed(() => {
      if (playbackState.value == null) return false
      return playbackState.value.shuffle_state
    })

    const repeatState = computed(() => {
      //const states = ['off', 'context', 'track']
      if (playbackState.value == null) return 'off'
      return playbackState.value.repeat_state
      //return states[playbackState.value.repeat_mode]
    })

    const isPlaying = computed(() => {
      if (playbackState.value == null) return false
      return playbackState.value.is_playing
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

    /*function resetProgress() {
      if (playbackState.value) {
        progressDuration.value = playbackState.value.duration ?? 1
        progressPosition.value = playbackState.value.position ?? 1
      }
    }*/

    function resetProgress() {
      if (!playbackState.value?.item) {
        return
      }

      progressDuration.value = playbackState.value.item?.duration_ms ?? 1
      progressPosition.value = playbackState.value.progress_ms ?? 1
    }

    function updateProgress(startTime: number) {
      if (isPlaying.value) {
        const elapsedTime = Date.now() - startTime
        progressPosition.value = Math.min(elapsedTime, progressDuration.value)
        if (elapsedTime == progressDuration.value) {
          progressPosition.value = 0
        }
        // if (progressPosition.value > progressDuration.value) progressPosition.value = 0
        if (progressPosition.value < progressDuration.value) {
          progressAnimationFrameId = requestAnimationFrame(() => updateProgress(startTime))
        } else {
          // when repeat mode is on track, we restart the whole progress
          if (playbackState.value?.repeat_state === 'track') {
            startProgress(true)
          }
        }
      }
    }

    function startProgress(restarting = false) {
      if (playbackState.value) {
        if (restarting) progressPosition.value = 0
        const startTime = Date.now() - progressPosition.value

        if (progressAnimationFrameId) {
          cancelAnimationFrame(progressAnimationFrameId)
        }
        progressAnimationFrameId = requestAnimationFrame(() => updateProgress(startTime))
      }
    }

    function play(tracks: string[] | null = null) {
      if (tracks) {
        apiClient?.player
          .startResumePlayback(currentDeviceID.value, undefined, tracks)
          .catch(() => {})
      } else {
        apiClient?.player.startResumePlayback(currentDeviceID.value).catch(() => {})
      }
      /*if (tracks) {
        apiClient?.player.startResumePlayback(currentDeviceID.value, undefined, tracks)
      } else {
        //apiClient?.player?.
        //player?.resume()
      }*/
    }
    function pause() {
      apiClient?.player?.pausePlayback(currentDeviceID.value).catch(() => {})
      //player?.pause()
    }
    function shuffle(state: boolean) {
      try {
        if (currentDeviceID.value) {
          apiClient?.player.togglePlaybackShuffle(state, currentDeviceID.value).catch(() => {})
          // we update in advance
          /*if (playbackState.value) {
            playbackState.value.shuffle_state = state
          }*/
          /*playbackState.value = {
            ...playbackState.value,
            //shuffle: state,
            shuffle_state: state,
            //shuffle_mode: state ? 1 : 0
          }*/
        }
      } catch (err) {
        console.error(err)
      }
    }

    function repeat(repeatMode: 'track' | 'context' | 'off') {
      // const modes = { off: 0, context: 1, track: 2 }
      try {
        if (currentDeviceID.value) {
          apiClient?.player.setRepeatMode(repeatMode, currentDeviceID.value).catch(() => {})
          // we update in advance
          //if (playbackState.value) playbackState.value.repeat_state = repeatMode
          /*playbackState.value = {
            ...playbackState.value,
            repeat_mode: modes[repeatMode]
          }*/
        }
      } catch (err) {
        console.error(err)
      }
    }

    function nextTrack() {
      apiClient.player.skipToNext(currentDeviceID.value).catch(() => {})
      //player?.nextTrack()
    }

    function previousTrack() {
      apiClient.player.skipToPrevious(currentDeviceID.value).catch(() => {})
      //player?.previousTrack()
    }

    function initPlayer() {
      loadRecents()
      loadSavedTracks()
    }

    watch(playbackState, () => {
      if (playbackState.value?.device.id) {
        currentDeviceID.value = playbackState.value.device.id
        resetProgress()
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
