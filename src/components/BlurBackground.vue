<template>
  <div id="app">
    <div class="scrim"></div>
  </div>
</template>

<script>
export default {
  name: 'BlurBackground'
}
</script>

<style scoped>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 120vw;
  height: 100vh;
  overflow: hidden;
  background-image: var(--album-image);
  background-size: cover;
  background-position: center;
  /*transform: rotate(180deg);*/
  /*filter: blur(500px);*/
  filter: blur(100px);
  transform: scale(1.3) rotate(180deg);
}

.scrim {
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4),
    rgba(0, 0, 0, 0.6)
  );
}
</style>
