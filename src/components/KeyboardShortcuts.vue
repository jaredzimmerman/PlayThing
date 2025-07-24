<template>
  <div class="shortcuts-overlay" @click.self="close">
    <div class="overlay-content">
      <h2>Keyboard Shortcuts</h2>
      <ul>
        <li><kbd>ArrowRight</kbd> Next track (Ctrl/Alt+ArrowRight change background)</li>
        <li><kbd>ArrowLeft</kbd> Previous track (Ctrl/Alt+ArrowLeft change background)</li>
        <li><kbd>ArrowUp</kbd> Toggle controls (Ctrl/Alt+ArrowUp decrease text size)</li>
        <li><kbd>ArrowDown</kbd> Toggle recents (Ctrl/Alt+ArrowDown increase text size)</li>
        <li><kbd>Space</kbd> Play/Pause</li>
        <li><kbd>P</kbd> Toggle progress bar</li>
        <li><kbd>A</kbd> Toggle background animation</li>
        <li><kbd>?</kbd> Show this help</li>
        <li><kbd>Esc</kbd> Close help</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
function close() {
  appStore.showShortcuts = false
}
</script>

<style scoped>
.shortcuts-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  z-index: 10000;
}
.overlay-content {
  background: #000;
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 90vw;
}
.overlay-content ul {
  list-style: none;
  padding: 0;
}
.overlay-content li {
  margin-bottom: 0.5rem;
}
.overlay-content kbd {
  background: #333;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  margin-right: 0.5rem;
}
</style>
