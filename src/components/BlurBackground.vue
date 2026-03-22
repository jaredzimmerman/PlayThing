<template>
  <div id="app">
    <!--
      CSS class switches reactively between two modes:
        animate-rotate-circle  — slow 120s rotation (CSS animation) used when
                                 animate-blur-spotlight is enabled; play state
                                 is controlled by the isPlaying watcher below.
        scale-120-rotate-180   — static scaled & rotated position, no animation.

      CSS custom properties consumed:
        --album-image   url() of the current track's artwork (set by spotify store)
        --primary-color fallback background colour
    -->
    <div :class="`album-art ${miscellaneousOption.includes('animate-blur-spotlight')
      ? 'animate-rotate-circle'
      : 'scale-120-rotate-180'
      }`
      " ref="albumArtRef" />
    <div class="scrim"></div>
  </div>
</template>

<script lang="ts" setup>
/**
 * BlurBackground — the "blur" background mode.
 *
 * Displays the current track's album art scaled up and heavily blurred via a
 * CSS `backdrop-filter` scrim, creating a frosted-glass effect.
 *
 * When the `animate-blur-spotlight` miscellaneous option is active the artwork
 * slowly rotates (120 s per revolution).  Playback state pauses/resumes the
 * CSS animation so the background is visually static when nothing is playing.
 */
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import { useSpotifyStore } from '@/stores/spotify';
import { ref, watch } from 'vue';

const albumArtRef = ref<HTMLDivElement | null>(null)

const settingsStore = useSettingsStore()
const spotifyStore = useSpotifyStore()

const { miscellaneousOption } = storeToRefs(settingsStore);
const { isPlaying } = storeToRefs(spotifyStore)

/**
 * Pause/resume the CSS rotation animation whenever playback state changes.
 * The check for `animate-blur-spotlight` is performed inside the callback
 * rather than wrapping the `watch` call so that toggling the setting after
 * mount is correctly reflected without needing a full component remount.
 */
watch(isPlaying, (playing) => {
  if (albumArtRef.value && miscellaneousOption.value.includes('animate-blur-spotlight')) {
    albumArtRef.value.style.animationPlayState = playing ? 'running' : 'paused'
  }
})

</script>

<style lang="scss" scoped>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: var(--primary-color);
  transition: background-color 3s ease;
  //transform: scale(120%) rotate(180deg);
}

.album-art {
  background-image: var(--album-image);
  background-size: cover;
  background-position: center;
  width: 100vw;
  height: 100vh;
  transition: background-image 3s ease-in-out, opacity 3s ease-in-out;
}

.scrim::before {
  content: '';
  backdrop-filter: blur(100px);
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  //background: linear-gradient(10deg, #ff6ec4, #7873f5);
}

.scrim {
  position: absolute;
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom,
      rgba(0, 0, 0, 0.4),
      rgba(0, 0, 0, 0.6));
}

.scale-120-rotate-180 {
  transform: scale(120%) rotate(180deg);
}

@keyframes rotate {
  from {
    transform: scale(2.04) rotate(0deg);
  }

  to {
    transform: scale(2.04) rotate(360deg);
  }
}

.animate-rotate-circle {
  animation: rotate 120s linear infinite;
}
</style>
