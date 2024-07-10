<template>
  <div id="app">
    <div class="container">
      <span class="time-text grid-item">{{ hours }}</span>
      <span class="colon grid-item">:</span>
      <span class="time-text grid-item">{{ minutes }}</span>
      <span class="meridian grid-item">{{ meridian }}</span>

      <!--<span class="time-text grid-item">99</span>
      <span class="colon grid-item">:</span>
      <span class="time-text grid-item">99</span>
      <span class="meridian grid-item">AM</span>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Clock12',
  data() {
    return {
      hours: '',
      minutes: '',
      meridian: '',
      interval: null
    }
  },
  created() {
    this.interval = setInterval(this.getNow, 1000)
  },
  beforeDestroy() {
    if (this.interval != null) {
      clearInterval(this.interval)
    }
  },
  methods: {
    getNow() {
      const now = new Date()
      let hours = now.getHours()
      const minutes = now.getMinutes()
      this.meridian = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12
      hours = hours ? hours : 12
      this.hours = hours
      this.minutes = minutes < 10 ? '0' + minutes : minutes
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Inter;
  background-color: #000;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.time-text {
  font-size: 14vw;
  font-weight: 100;
  line-height: 338.86px;
  letter-spacing: 0.15em;
  text-align: start;
}

.container span:first-child {
  text-align: end !important;
}

.colon {
  font-size: 14vw;
  font-weight: 100;
  line-height: 338.86px;
  letter-spacing: 0.15em;
  text-align: center;
  color: #666666;
}

.meridian {
  font-size: 7vw;
  font-weight: 100;
  line-height: 169.43px;
  letter-spacing: 0.15em;
  text-align: left;
  color: #666666;
}

.container {
  display: grid;
  grid-template-columns: 4fr 1fr 2fr 2fr;
  align-items: baseline;
}

.grid-item {
  overflow: hidden;
  word-wrap: break-word;
}
</style>
