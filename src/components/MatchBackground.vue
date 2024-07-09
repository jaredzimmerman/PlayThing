<template>
  <div id="app" class="scrim"></div>
</template>

<script>
export default {
  name: 'MatchBackground'
}
</script>

<style scoped>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: var(--primary-color);
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.scrim {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.2) 100%
  );
}
</style>
