import type {
  PlaybackState,
  Device,
  Context,
  ExternalUrls,
  Actions,
  Album,
  Artist,
  Image,
  ExternalIds,
  TrackItem
} from '@spotify/web-api-ts-sdk'
import { ref, onMounted, onUnmounted } from 'vue'

// SDK uses TrackItem for playback state items; re-export for consumers
export type { TrackItem }

// Re-export SDK types so consumers can import from this module
export type { PlaybackState, Device, Context, ExternalUrls, Actions, Album, Artist, Image, ExternalIds }

// Extended Device type matching what the API actually returns (supports_volume field)
export interface PlaybackDevice extends Device {
  supports_volume?: boolean
}

export function useSpotifyPlaybackState(
  getAccessToken: () => Promise<string>,
  // getApiClient: () => Promise<SpotifyApi>,
  pollingInterval = 5000
) {
  const playbackState = ref<PlaybackState | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  let pollingTimer: ReturnType<typeof setInterval> | null = null

  const fetchPlaybackState = async () => {
    try {
      isLoading.value = true
      error.value = null

      const accessToken = await getAccessToken()
      const response = await fetch('https://api.spotify.com/v1/me/player', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          error.value = 'Unauthorized: Token expired or invalid.'
        } else if (response.status === 204) {
          playbackState.value = null // No playback
        } else {
          error.value = `Error: ${response.status} ${response.statusText}`
        }
        return
      }

      const data = await response.json()
      playbackState.value = data as PlaybackState
    } catch (err) {
      console.error(err)
      error.value = 'Failed to fetch playback state.'
    } finally {
      isLoading.value = false
    }
  }

  const startPolling = () => {
    stopPolling()
    pollingTimer = setInterval(fetchPlaybackState, pollingInterval)
  }

  const stopPolling = () => {
    if (pollingTimer) {
      clearInterval(pollingTimer)
      pollingTimer = null
    }
  }

  onMounted(() => {
    startPolling()
  })

  onUnmounted(() => {
    stopPolling()
  })

  return {
    playbackState,
    isLoading,
    error,
    fetchPlaybackState
  }
}
