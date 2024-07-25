<template>
  <div id="app">
    <div class="timestamp">
      <span class="time-text">{{ hours }}</span>
      <span class="colon" v-show="hours != ''">:</span>
      <span class="time-text">{{ minutes }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

const hours = ref<string | null>(null)
const minutes = ref<string | null>(null)
let interval: any = null

function getNow() {
  const now = new Date()
  const currentHours = now.getHours()
  const currentMinutes = now.getMinutes()
  hours.value = currentHours < 10 ? '0' + currentHours : currentHours.toString()
  minutes.value = currentMinutes < 10 ? '0' + currentMinutes : currentMinutes.toString()
}

onMounted(() => {
  interval = setInterval(getNow, 1000);
})

onUnmounted(() => {
  clearInterval(interval)
})

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
