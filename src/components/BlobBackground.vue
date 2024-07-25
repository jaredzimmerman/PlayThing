<template>
  <div id="app">
    <div class="blob" :style="`background-color: ${blobBackgroundColor};`">
      <svg viewBox="0 0 200 200">
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(90)">
            <stop id="gradientStop1" offset="0%" :stop-color="startColor" />
            <stop id="gradientStop2 " offset="100%" :stop-color="stopColor" />
            <!--<stop id="gradientStop1" offset="0%" stop-color="var(--primary-color)" />
            <stop id="gradientStop2 " offset="100%" stop-color="var(--secondary-color)" />-->
          </linearGradient>
        </defs>
        <path :d="path" fill="url('#gradient')"></path>
      </svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import { spline } from '@georgedoescode/spline'
import { createNoise2D } from 'simplex-noise'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useSpotifyStore } from '@/stores/spotify';

const settingsStore = useSettingsStore()
const spotifyStore = useSpotifyStore()

const { miscellaneousOption } = storeToRefs(settingsStore);
const { isPlaying } = storeToRefs(spotifyStore)

const startColor = ref('')
const stopColor = ref('')
const path = ref('')

let blobBackgroundColor = ''
let animate = false
let lastTime = 0
let animationId: any = null

const slowDownFactor = 16
const fps = 120
const noiseStep = 0.005
const points = createPoints()
const noise2D = createNoise2D()
const frameInterval = 1000 / (fps / slowDownFactor);

function run() {
  animationId = requestAnimationFrame(animateBlob)
}

function map(n: number, start1: number, end1: number, start2: number, end2: number) {
  return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2
}

function animateBlob(currentTime: number) {
  //if (!isPlaying.value) return

  if (currentTime - lastTime >= frameInterval) {
    lastTime = currentTime
    path.value = spline(points, 1, true)

    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--start-color')
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--end-color')

    const startHsl = hexToHsl(primaryColor)
    const endHsl = hexToHsl(secondaryColor)

    const startHue = startHsl.h
    const endHue = endHsl.h

    const currentStartHue = interpolateHue(startHue, endHue, 0)
    const currentEndHue = interpolateHue(endHue, startHue, 0)
    const currentStartColor = `hsl(${currentStartHue}, ${startHsl.s}%, ${startHsl.l}%)`
    const currentStopColor = `hsl(${currentEndHue}, ${endHsl.s}%, ${endHsl.l}%)`

    //console.log(currentStartHue, currentEndHue)
    if (startColor.value !== currentStartColor && stopColor.value !== currentStopColor) {
      startColor.value = currentStartColor
      stopColor.value = currentStopColor
    }

    if (animate && isPlaying.value) {
      for (let i = 0; i < points.length; i++) {
        const point = points[i]
        const nX = noise(point.noiseOffsetX, point.noiseOffsetX)
        const nY = noise(point.noiseOffsetY, point.noiseOffsetY)
        const x = map(nX, -1, 1, point.originX - 20, point.originX + 20)
        const y = map(nY, -1, 1, point.originY - 20, point.originY + 20)
        point.x = x
        point.y = y
        point.noiseOffsetX += noiseStep
        point.noiseOffsetY += noiseStep
      }
    }
  }

  animationId = requestAnimationFrame(animateBlob)
}

function interpolateHue(startHue: number, endHue: number, t: number) {
  let hue = startHue + (endHue - startHue) * t
  if (hue > 360) {
    hue -= 360
  } else if (hue < 0) {
    hue += 360
  }
  return hue
}

function noise(x: number, y: number) {
  return noise2D(x, y);
}

function createPoints() {
  const points = []
  // how many points do we need
  const numPoints = 6
  // used to equally space each point around the circle
  const angleStep = (Math.PI * 2) / numPoints
  // the radius of the circle
  const rad = 75

  for (let i = 1; i <= numPoints; i++) {
    // x & y coordinates of the current point
    const theta = i * angleStep

    const x = 100 + Math.cos(theta) * rad
    const y = 100 + Math.sin(theta) * rad

    points.push({
      x: x,
      y: y,
      originX: x,
      originY: y,
      noiseOffsetX: Math.random() * 1000,
      noiseOffsetY: Math.random() * 1000
    })
  }

  return points
}

function hexToHsl(hex: string) {
  let bigint = parseInt(hex.slice(1), 16)
  let r = (bigint >> 16) & 255
  let g = (bigint >> 8) & 255
  let b = bigint & 255

    ; (r /= 255), (g /= 255), (b /= 255)
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s,
    l = (max + min) / 2

  if (max == min) {
    h = s = 0 // achromatic
  } else {
    let d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100
  }
}

onMounted(() => {
  if (miscellaneousOption.value?.includes('animate-blur-spotlight')) {
    animate = true
  }
  run()
});
onUnmounted(() => {
  cancelAnimationFrame(animationId)
})

</script>

<style lang="scss" scoped>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #000;
}

.blob {
  position: absolute;
  width: 50%;
  height: auto;
  z-index: 1;
  aspect-ratio: 1;
  filter: blur(100px);
}

svg {
  /*width: 90vmin;
  height: 90vmin;*/
  width: 100%;
  aspect-ratio: 1;
}
</style>
