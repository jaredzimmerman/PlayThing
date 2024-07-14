<template>
  <div id="app">
    <div
      v-if="miscellaneousOptions.includes('animate-blur-spotlight')"
      :class="
        `background ${
          miscellaneousOptions.includes('animate-blur-spotlight')
            ? 'animate-rotate-circle'
            : ''
        }`
      "
    />
    <div class="scrim"></div>
  </div>
</template>

<script>
import { getPlayThingSettings } from '@/utils/utils'

export default {
  name: 'BlurBackground',
  data() {
    return {
      miscellaneousOptions: []
    }
  },
  created() {
    const settings = getPlayThingSettings()
    this.miscellaneousOptions = settings.miscellaneousOption
    console.log('options : ', this.miscellaneousOption)
  }
}
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
  background-image: var(--album-image);
  background-size: cover;
  background-position: center;
  background-color: #000;
  transform: scale(120%) rotate(180deg);
}

.background {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200vw;
  height: 200vh;
  background-image: var(--album-image);
  background-size: cover;
  background-position: center;
  //transform: translate(-50%, -50%);
  animation: rotateBackground 60s linear infinite;
}

.scrim::before {
  content: '';
  //filter: blur(100px);
  backdrop-filter: blur(100px);
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
}

.scrim {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4),
    rgba(0, 0, 0, 0.6)
  );
}

@keyframes rotateBackground {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
