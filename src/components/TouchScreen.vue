<template>
  <div id="screen" v-touch:tap="showSettingButton"></div>
</template>

<script>
export default {
  name: 'TouchScreen',
  emits: ['show-setting-button'],
  methods: {
    showSettingButton() {
      // console.log('open')
      // this.$emit('show-setting-button')
      document.dispatchEvent(new Event('showSettingButton'))
      document.dispatchEvent(new Event('showPlaybackControls'))
    }
  }
}
</script>

<style scoped>
#screen {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: transparent;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: all;
}
</style>
