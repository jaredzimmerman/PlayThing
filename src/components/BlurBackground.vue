<template>
  <div
    id="app"
    :class="
      `${
        miscellaneousOptions.includes('animate-blur-spotlight')
          ? 'animate-rotate-circle'
          : 'scale-120-rotate-180'
      }`
    "
  >
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
  //transform: scale(120%) rotate(180deg);
}

.scrim::before {
  content: '';
  backdrop-filter: blur(100px);
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
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

.scale-120-rotate-180 {
  transform: scale(120%) rotate(180deg);
}

@keyframes rotate {
  from {
    transform: scale(2.1) rotate(0deg);
  }

  to {
    transform: scale(2.1) rotate(360deg);
  }
}

.animate-rotate-circle {
  animation: rotate 30s linear infinite;
}
</style>
