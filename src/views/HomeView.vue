<template>
  <div id="app">
    <NowPlaying />
    <div v-show="showSettingButton" class="settings-container fade-slide-up" ref="settingButton" @click="openSettings">
      <img src="@/assets/SettingIcon.svg?url" />
      <span>SETTINGS</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NowPlaying from '@/components/NowPlaying.vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';
const router = useRouter();
const appStore = useAppStore();
const { showSettingButton } = storeToRefs(appStore)

function openSettings() {
  showSettingButton.value = false
  router.push('/settings');
}


</script>
<style lang="scss" scoped>
#app {
  position: relative;
  width: 100vw !important;
  height: 100vh !important;
  overflow-x: hidden !important;
  overflow-y: hidden;
}

.fade-effect {
  filter: brightness(0.5);
  transition: filter 0.5s ease;
}

.settings-container {
  position: absolute;
  // bottom: 10px;
  //bottom: 7.4074074074074066%;
  bottom: 1.8518518518518516vh;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 45%;
  transform: translate(-50%, -50%);
  font-family: Inter;
  //font-size: 1.5rem;
  // font-size: 187.5%;
  //font-size: 2.4vw;
  font-size: 1.5625vw;
  font-weight: 600;
  line-height: 30px;
  letter-spacing: 0.1em;
  text-align: left;
  gap: 10px;

  img {
    width: 1.4432291666666668vw;
    height: 2.8712962962962965vh;
  }

  /*transition: opacity 0.5s ease, transform 0.5s ease;*/

  &.fade-slide-up {
    opacity: 0;
    transform: translateY(20px);
    //transform: translateY(1.8518518518518516vh);
    //transform: translateY(5px);
    animation: fadeSlideUp 0.5s forwards;
    z-index: 11;
    overflow: hidden;
  }

  @keyframes fadeSlideUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
