<template>
  <div class="progress-container">
    <div class="progress-fill" :style="`width: ${progressPercentage}%;`"></div>
  </div>
</template>

<script>
export default {
  name: 'Progress',
  props: {
    player: {
      type: Object,
      default: null
    },
    playerResponse: {
      type: Object,
      default: null
    },
    playerData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      duration: 1,
      progress: 1,
      interval: null
    }
  },
  created() {
    this.initialise()
  },
  watch: {
    playerResponse() {
      if (this.interval) clearInterval(this.interval)
      this.initialise()
    }
  },
  computed: {
    progressPercentage() {
      const percentage = (this.progress * 100) / this.duration
      return Math.min(percentage, 100)
    }
  },
  methods: {
    initialise() {
      const item = this.playerResponse?.item
      this.duration = item?.duration_ms ?? 1
      this.progress = this.playerResponse?.progress_ms ?? 1
      this.simulateProgress()
    },
    simulateProgress() {
      this.interval = setInterval(() => {
        if (this.player.playing) this.progress += 1000
      }, 1000)
    }
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }
}
</script>

<style lang="scss" progress>
.progress-container {
  position: relative;
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
  //height: 5px;
  //max-width: 640px;
  height: 0.4629629629629629vh;
  margin-left: auto;
  margin-right: auto;
}

.progress-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // background: var(--color-text-primary);
  background: var(--controls-color);
  opacity: 0.5;
  z-index: 1;
  width: 100%;
}

.progress-fill {
  position: relative;
  height: 100%;
  // background: var(--color-text-primary);
  background: var(--controls-color);
  transition: width 0.3s ease;
  text-align: center;
  line-height: 20px;
  z-index: 2;
  width: var(--player-progress);
}
</style>
