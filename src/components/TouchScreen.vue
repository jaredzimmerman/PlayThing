<template>
  <div id="screen" v-touch:tap="tap" v-touch:swipe.up="swipeUp" v-touch:swipe.down="swipeDown"
    v-touch:swipe.left="swipeLeft" v-touch:swipe.right="swipeRight"></div>
</template>

<script>
export default {
  name: 'TouchScreen',
  emits: ['show-setting-button'],
  methods: {
    tap() {
      document.dispatchEvent(new Event('showSettingButton'))
    },
    swipeUp() {
      document.dispatchEvent(new Event('showPlaybackControls'))
    },
    swipeDown() {
      document.dispatchEvent(new Event('PlayThingRecentScreen'))
    },
    swipeLeft() {
      document.dispatchEvent(new Event('PlayThingBack'))
    },
    swipeRight() {
      document.dispatchEvent(new Event('PlayThingNext'))
    },
  }
}
</script>

<style lang="scss" scoped>
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
