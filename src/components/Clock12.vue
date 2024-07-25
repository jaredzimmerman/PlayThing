<template>
  <div id="app">
    <div class="container">
      <span class="time-text grid-item">{{ hours }}</span>
      <span class="colon grid-item" v-show="hours != ''">:</span>
      <span class="time-text grid-item">{{ minutes }}</span>
      <span class="meridian grid-item">{{ meridian }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';


const hours = ref<string | null>(null)
const minutes = ref<string | null>(null)
const meridian = ref<string>('')
let interval: any = null

function getNow() {
  const now = new Date()
  let currentHours = now.getHours()
  const currentMinutes = now.getMinutes()
  meridian.value = currentHours >= 12 ? 'PM' : 'AM'
  currentHours = currentHours % 12
  currentHours = currentHours ? currentHours : 12
  hours.value = currentHours.toString()
  minutes.value = currentMinutes < 10 ? '0' + currentMinutes : currentMinutes.toString()
}

onMounted(() => {
  interval = setInterval(getNow, 1000);
})

onUnmounted(() => {
  clearInterval(interval)
})

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
