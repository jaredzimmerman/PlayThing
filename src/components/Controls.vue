<template>
  <div class="controls" v-if="true">
    <SimpleSVG src="/controls/Shuffle.svg" />
    <SimpleSVG src="/controls/Back.svg" />
    <SimpleSVG src="/controls/Play.svg" />
    <SimpleSVG src="/controls/Next.svg" />
    <SimpleSVG src="/controls/Shuffle-1.svg" />
  </div>
</template>

<script>
import { SimpleSVG } from 'vue-simple-svg'
export default {
  name: 'Controls',
  components: {
    SimpleSVG
  }
}
</script>

<style lang="scss">
.controls {
  display: flex;
  justify-content: center;
}

.controls svg {
  fill: var(--controls-color);
}

@media only screen and (min-width: 767px) {
  .controls {
    display: flex;
    justify-content: left;
  }
}
</style>
