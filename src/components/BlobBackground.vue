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
        <path d="" fill="url('#gradient')"></path>
      </svg>
    </div>
  </div>
</template>

<script>
import { spline } from '@georgedoescode/spline'
import SimplexNoise from 'simplex-noise'

export default {
  name: 'BlobBackground',
  props: {
    swatches: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      animationRunning: false,
      startColor: '',
      stopColor: '',
      blobBackgroundColor: ''
    }
  },
  beforeDestroy() {
    this.animationRunning = false
  },
  mounted() {
    console.log('show spotlight')
    this.run()
  },
  methods: {
    run() {
      this.animationRunning = true
      // our <path> element
      const path = document.querySelector('path')
      // used to set our custom property values
      // const root = document.documentElement

      let hueNoiseOffset = 0
      let noiseStep = 0.005

      const simplex = new SimplexNoise()

      const points = createPoints()

      const animate = () => {
        if (!this.animationRunning) return
        path.setAttribute('d', spline(points, 1, true))

        // Define your primary and secondary colors in hex
        const primaryColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue('--primary-color')
        const secondaryColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue('--secondary-color')

        // Convert hex colors to HSL
        const startHsl = hexToHsl(primaryColor)
        const endHsl = hexToHsl(secondaryColor)

        // Interpolate hues between the primary and secondary colors based on hueNoiseOffset
        const hueOffset = (Math.sin(hueNoiseOffset) + 1) / 2 // oscillates between 0 and 1
        const startHue = startHsl.h
        const endHue = endHsl.h

        const currentHue = interpolateHue(startHue, endHue, hueOffset)
        const startColor = `hsl(${currentHue}, ${startHsl.s}%, ${startHsl.l}%)`
        const stopColor = `hsl(${currentHue + 60}, ${startHsl.s}%, ${
          startHsl.l
        }%)`

        this.startColor = startColor
        this.stopColor = stopColor
        this.blobBackgroundColor = `hsl(${currentHue + 60}, 75%, 5%)`

        /*root.style.setProperty('--startColor', startColor)
        root.style.setProperty('--stopColor', stopColor)
        root.style.setProperty(
          '--blobBackgroundColor',
          `hsl(${currentHue + 60}, 75%, 5%)`
        )*/

        hueNoiseOffset += noiseStep / 6

        // Update points for animation
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

        requestAnimationFrame(animate)
      }
      animate()

      // Helper function to convert hex color to HSL
      function hexToHsl(hex) {
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

      // Helper function to interpolate between two hues
      function interpolateHue(startHue, endHue, t) {
        let hue = startHue + (endHue - startHue) * t
        if (hue > 360) {
          hue -= 360
        } else if (hue < 0) {
          hue += 360
        }
        return hue
      }
      function map(n, start1, end1, start2, end2) {
        return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2
      }

      function noise(x, y) {
        return simplex.noise2D(x, y)
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

          // store the point's position
          points.push({
            x: x,
            y: y,
            // we need to keep a reference to the point's original point for when we modulate the values later
            originX: x,
            originY: y,
            // more on this in a moment!
            noiseOffsetX: Math.random() * 1000,
            noiseOffsetY: Math.random() * 1000
          })
        }

        return points
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
  width: 60%;
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
