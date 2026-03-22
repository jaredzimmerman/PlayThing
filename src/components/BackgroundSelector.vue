<template>
  <BlobBackground v-if="backgroundOption === 'spotlight'" />
  <MatchBackground v-else-if="backgroundOption === 'match'" />
  <MatchDarkBackground v-else-if="backgroundOption === 'match-dark'" />
  <MatchContrastBackground v-else-if="backgroundOption === 'contrast'" />
  <BlurBackground v-else-if="backgroundOption === 'blur'" />
  <BlackBackground v-else />
</template>

<script lang="ts" setup>
/**
 * BackgroundSelector — thin routing component that mounts the correct
 * background based on `settings.backgroundOption`.
 *
 * Background modes and their components:
 *   spotlight  → BlobBackground      — animated simplex-noise blob with album-art gradient
 *   match      → MatchBackground     — solid colour matched to album art
 *   match-dark → MatchDarkBackground — darker variant of the match colour
 *   contrast   → MatchContrastBackground — high-contrast palette from album art
 *   blur       → BlurBackground      — album art scaled & blurred
 *   (default)  → BlackBackground     — plain black / OLED
 *
 * Colour data for all modes is populated by setAppColours() (colors.ts) which
 * sets CSS custom properties whenever the track or background option changes.
 */
import BlobBackground from './BlobBackground.vue'
import MatchBackground from './MatchBackground.vue'
import BlackBackground from './BlackBackground.vue'
import MatchContrastBackground from './MatchContrastBackground.vue'
import MatchDarkBackground from './MatchDarkBackground.vue'
import BlurBackground from './BlurBackground.vue'
import { useSettingsStore } from '@/stores/settings';
import { storeToRefs } from 'pinia'

const settingsStore = useSettingsStore();

const { backgroundOption } = storeToRefs(settingsStore);

</script>

<style lang="scss" scoped></style>
