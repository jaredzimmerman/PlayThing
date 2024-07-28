<template>
  <BlobBackground v-if="backgroundOption === 'spotlight'" />
  <MatchBackground v-else-if="backgroundOption === 'match'" />
  <MatchDarkBackground v-else-if="backgroundOption === 'match-dark'" />
  <MatchContrastBackground v-else-if="backgroundOption === 'contrast'" />
  <BlurBackground v-else-if="backgroundOption === 'blur'" />
  <BlackBackground v-else />
</template>

<script lang="ts" setup>
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
