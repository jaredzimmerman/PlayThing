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

<script>
import { spline } from '@georgedoescode/spline'
import SimplexNoise from 'simplex-noise'
import { getPlayThingSettings } from '@/utils/utils'

export default {
  name: 'BlobBackground',
  data() {
    return {
      animationRunning: false,
      startColor: '',
      stopColor: '',
      blobBackgroundColor: '',
      settings: '',
      animate: false,
      path: '',
      slowDownFactor: 16,
      fps: 120,
      lastTime: 0,
      noiseStep: 0.005,
      points: this.createPoints(),
      simplex: new SimplexNoise()
    }
  },
  created() {
    const settings = getPlayThingSettings()
    // const backgroundSettings = settings.miscellaneousOption;
    if (settings.miscellaneousOption.includes('animate-blur-spotlight')) {
      this.animate = true
    }
  },
  mounted() {
    this.run()
    document.addEventListener('BlobBackgroundColorChanged', this.run)
  },
  beforeDestroy() {
    this.animationRunning = false
    document.removeEventListener('BlobBackgroundColorChanged', this.run)
  },
  computed: {
    frameInterval() {
      return 1000 / (this.fps / this.slowDownFactor)
    }
  },
  methods: {
    run() {
      this.animationRunning = true
      this.animateBlob()
    },
    map(n, start1, end1, start2, end2) {
      return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2
    },
    animateBlob(currentTime) {
      if (!this.animationRunning) return

      if (currentTime - this.lastTime >= this.frameInterval) {
        this.lastTime = currentTime
        this.path = spline(this.points, 1, true)

        const primaryColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue('--start-color')
        const secondaryColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue('--end-color')

        const startHsl = this.hexToHsl(primaryColor)
        const endHsl = this.hexToHsl(secondaryColor)

        const startHue = startHsl.h
        const endHue = endHsl.h

        const currentStartHue = this.interpolateHue(startHue, endHue, 0)
        const currentEndHue = this.interpolateHue(endHue, startHue, 0)
        const startColor = `hsl(${currentStartHue}, ${startHsl.s}%, ${startHsl.l}%)`
        const stopColor = `hsl(${currentEndHue}, ${endHsl.s}%, ${endHsl.l}%)`

        if (startColor !== this.startColor && stopColor !== this.stopColor) {
          this.startColor = startColor
          this.stopColor = stopColor
        }

        if (this.animate) {
          for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i]
            const nX = this.noise(point.noiseOffsetX, point.noiseOffsetX)
            const nY = this.noise(point.noiseOffsetY, point.noiseOffsetY)
            const x = this.map(
              nX,
              -1,
              1,
              point.originX - 20,
              point.originX + 20
            )
            const y = this.map(
              nY,
              -1,
              1,
              point.originY - 20,
              point.originY + 20
            )
            point.x = x
            point.y = y
            point.noiseOffsetX += this.noiseStep
            point.noiseOffsetY += this.noiseStep
          }
        }
      }

      requestAnimationFrame(this.animateBlob)
    },
    interpolateHue(startHue, endHue, t) {
      let hue = startHue + (endHue - startHue) * t
      if (hue > 360) {
        hue -= 360
      } else if (hue < 0) {
        hue += 360
      }
      return hue
    },
    noise(x, y) {
      return this.simplex.noise2D(x, y)
    },
    createPoints() {
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
    },
    hexToHsl(hex) {
      let bigint = parseInt(hex.slice(1), 16)
      let r = (bigint >> 16) & 255
      let g = (bigint >> 8) & 255
      let b = bigint & 255

      ;(r /= 255), (g /= 255), (b /= 255)
      let max = Math.max(r, g, b),
        min = Math.min(r, g, b)
      let h,
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
  }
}
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
