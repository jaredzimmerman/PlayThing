import type { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { ref, onMounted, onUnmounted } from 'vue'

export interface PlaybackState {
  device: Device
  shuffle_state: boolean
  smart_shuffle: boolean
  repeat_state: string
  timestamp: number
  context: Context
  progress_ms: number
  item: Item
  currently_playing_type: string
  actions: Actions
  is_playing: boolean
}

export interface Device {
  id: string
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  name: string
  supports_volume: boolean
  type: string
  volume_percent: number
}

export interface Context {
  external_urls: ExternalUrls
  href: string
  type: string
  uri: string
}

export interface ExternalUrls {
  spotify: string
}

export interface Item {
  album: Album
  artists: Artist2[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: ExternalIds
  external_urls: ExternalUrls5
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
}

export interface Album {
  album_type: string
  artists: Artist[]
  available_markets: string[]
  external_urls: ExternalUrls3
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: string
  total_tracks: number
  type: string
  uri: string
}

export interface Artist {
  external_urls: ExternalUrls2
  href: string
  id: string
  name: string
  type: string
  uri: string
}

export interface ExternalUrls2 {
  spotify: string
}

export interface ExternalUrls3 {
  spotify: string
}

export interface Image {
  height: number
  url: string
  width: number
}

export interface Artist2 {
  external_urls: ExternalUrls4
  href: string
  id: string
  name: string
  type: string
  uri: string
}

export interface ExternalUrls4 {
  spotify: string
}

export interface ExternalIds {
  isrc: string
}

export interface ExternalUrls5 {
  spotify: string
}

export interface Actions {
  disallows: Disallows
}

export interface Disallows {
  pausing: boolean
}

export function useSpotifyPlaybackState(
  getAccessToken: () => Promise<string>,
  // getApiClient: () => Promise<SpotifyApi>,
  pollingInterval = 5000
) {
  const playbackState = ref<PlaybackState | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  let pollingTimer: NodeJS.Timeout | null = null

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

      //const client = await getApiClient()

      //const data = await client.player.getPlaybackState()
      // console.log('response : ', response)

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
      //console.log(data)
      playbackState.value = data
      /*playbackState.value = {
        isPlaying: data.is_playing,
        track: data.item?.name || 'Unknown track',
        artist:
          data.item?.artists?.map((artist: any) => artist.name).join(', ') || 'Unknown artist',
        album: data.item?.album?.name || 'Unknown album',
        progress: data.progress_ms || 0,
        duration: data.item?.duration_ms || 0
      }*/
    } catch (err) {
      console.error(err)
      error.value = 'Failed to fetch playback state.'
    } finally {
      isLoading.value = false
    }
  }

  const startPolling = () => {
    stopPolling() // Ensure no duplicate timers
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
    fetchPlaybackState // Allow manual fetching
  }
}
