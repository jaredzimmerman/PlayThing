<template>
  <SplashScreen v-if="showSplashScreen" />
  <KeyboardShortcuts v-if="showShortcuts" />
  <RouterView v-else />
</template>

<script lang="ts" setup>
import { RouterView, useRouter, useRoute } from 'vue-router'
import { useSpotifyStore } from './stores/spotify'
import SplashScreen from './components/SplashScreen.vue'
import KeyboardShortcuts from './components/KeyboardShortcuts.vue'
import { onMounted, onUnmounted, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const spotifyStore = useSpotifyStore()

const { showSplashScreen, showShortcuts } = storeToRefs(appStore)
const { authenticated } = storeToRefs(spotifyStore)
const { authenticate } = spotifyStore
const { registerKeyboardShortcuts, unregisterKeyboardShortcuts } = appStore

watch(authenticated, (auth) => {
  if (auth && router.currentRoute.value.path === '/authorise') {
    router.replace('/')
  } else if (!auth && router.currentRoute.value.path !== '/authorise') {
    router.replace('/authorise')
  }
})

onMounted(() => {
  router.isReady().then(() => {
    const code = route.query.code
    if (code) {
      // Complete the OAuth flow after Spotify redirects back with a code
      authenticate(code)
    } else if (spotifyStore.accessToken) {
      // Silently restore an existing session without forcing a redirect
      authenticate()
    }
    // Otherwise stay on the /authorise screen and wait for the user to
    // click "Login with Spotify" — don't auto-redirect to Spotify.
  })
  registerKeyboardShortcuts()
})

onUnmounted(() => {
  unregisterKeyboardShortcuts()
})
</script>
