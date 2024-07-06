<template>
  <div id="screen" v-touch:tap="openSettings"></div>
</template>

<script>
export default {
  name: 'TouchScreen',
  methods: {
    openSettings() {
      console.log
      this.$emit('openSettings')
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
}
</style>
