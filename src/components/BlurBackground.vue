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

<style lang="scss" scoped>
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
  background-color: #000;
  /*transform: rotate(180deg);*/
  /*filter: blur(500px);*/
  //filter: blur(100px);
  transform: scale(120%) rotate(180deg);
}

.scrim::before {
  content: '';
  //filter: blur(100px);
  backdrop-filter: blur(100px);
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
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
