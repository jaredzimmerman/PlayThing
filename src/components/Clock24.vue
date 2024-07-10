<template>
  <div id="app">
    <div class="timestamp">
      <span class="time-text">{{ hours }}</span>
      <span class="colon" v-show="hours != ''">:</span>
      <span class="time-text">{{ minutes }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Clock24',
  data() {
    return {
      hours: '',
      minutes: '',
      interval: null
    }
  },
  created() {
    this.getNow()
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
      const hours = now.getHours()
      const minutes = now.getMinutes()
      this.hours = hours < 10 ? '0' + hours : hours
      this.minutes = minutes < 10 ? '0' + minutes : minutes
    }
  }
}
</script>

<style scoped>
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

.container {}

.time-text {
  /*font-size: 280px;*/
  font-size: 20vw;
  font-weight: 100;
  line-height: 338.86px;
  letter-spacing: 0.15em;
  text-align: center;
}

.colon {
  /*font-size: 280px;*/
  font-size: 20vw;
  font-weight: 100;
  line-height: 338.86px;
  letter-spacing: 0.15em;
  text-align: center;
  color: #666666;
}

.meridian {
  /*font-size: 140px;*/
  font-size: 10vw;
  font-weight: 100;
  line-height: 169.43px;
  letter-spacing: 0.15em;
  text-align: center;
  color: #666666;
}
</style>
