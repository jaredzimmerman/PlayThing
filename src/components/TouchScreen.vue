<template>
  <div id="screen" v-touch:tap="showSettingButton"></div>
</template>

<script>
export default {
  name: 'TouchScreen',
  methods: {
    showSettingButton() {
      console.log('open')
      this.$emit('showSettingButton')
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
  height: 100vh;
  overflow: hidden;
  z-index: 10;
  pointer-events: all;
}
</style>
