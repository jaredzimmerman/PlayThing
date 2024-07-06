<template>
  <div id="app">
    <img src="text-logo.svg" class="logo" />
  </div>
</template>

<script>
export default {
  name: 'SplashScreen',
  props: {
    displayTitle: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
#app {
  background-color: #000;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 100vh;
  width: 100%;
}

.logo {
  width: 50%;
  aspect-ratio: 1;
}
</style>
