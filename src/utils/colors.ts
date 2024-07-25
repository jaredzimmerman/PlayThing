import ColorThief, { type RGBColor } from 'colorthief'

export function getMatchColors(imageBlobUrl: string) {
  const colorThief = new ColorThief()
  const img = new Image()
  img.src = imageBlobUrl

  const handleImageLoad = function () {
    const colors = colorThief.getPalette(img, 10)
    if (colors == null) return
    const suitableColor = getSuitableColor(colors)
    document.documentElement.style.setProperty('--controls-color', `#fff`)
    document.documentElement.style.setProperty('--color-text-primary', '#fff')
    if (suitableColor) {
      document.documentElement.style.setProperty(
        '--primary-color',
        `rgb(${suitableColor.join(',')})`
      )
    } else {
      document.documentElement.style.setProperty('--primary-color', `#000`)
    }
  }

  function getSuitableColor(colors: RGBColor[]) {
    return colors.find((color) => !isNearBlackOrWhite(color))
  }

  function isNearBlackOrWhite(color: RGBColor) {
    const [r, g, b] = color
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness < 30 || brightness > 220
  }

  img.onload = function () {
    handleImageLoad()
  }

  if (img.complete) {
    handleImageLoad()
  }
}

function getMatchContrastColors(imageBlob: string) {
  const colorThief = new ColorThief()
  const img = new Image()
  img.src = imageBlob

  const handleImageLoad = function () {
    const colors = colorThief.getPalette(img, 10)
    if (colors == null) return
    const backgroundColor = getComplementaryOrThirdColor(colors)
    document.documentElement.style.setProperty('--controls-color', `#fff`)
    document.documentElement.style.setProperty('--color-text-primary', '#fff')
    if (backgroundColor) {
      document.documentElement.style.setProperty(
        '--primary-color',
        `rgb(${backgroundColor.join(',')})`
      )
    } else {
      document.documentElement.style.setProperty('--primary-color', `#000`)
    }
  }

  function getComplementaryOrThirdColor(colors: RGBColor[]) {
    const prominentColor = colors[0]
    const complementaryColor = getComplementaryColor(prominentColor)

    if (
      complementaryColor &&
      !isNearBlackOrWhite(complementaryColor) &&
      isColorInPalette(colors, complementaryColor)
    ) {
      return complementaryColor
    } else {
      const thirdColor = colors[2]
      if (thirdColor && !isNearBlackOrWhite(thirdColor)) {
        return thirdColor
      }
    }
    return null
  }

  function getComplementaryColor([r, g, b]: RGBColor) {
    // Calculate complementary color
    const compColor: RGBColor = [255 - r, 255 - g, 255 - b]
    return compColor
  }

  function isColorInPalette(colors: RGBColor[], color: RGBColor) {
    return colors.some((c) => color[0] === c[0] && color[1] === c[1] && color[2] === c[2])
  }

  function isNearBlackOrWhite(color: RGBColor) {
    const [r, g, b] = color
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness < 30 || brightness > 220
  }

  img.onload = function () {
    handleImageLoad()
  }
  // Trigger image load if it is cached
  if (img.complete) {
    handleImageLoad()
  }
}

function getSpotlightColors(imageBlobUrl: string) {
  const colorThief = new ColorThief()
  const img = new Image()
  img.src = imageBlobUrl

  const handleImageLoad = function () {
    const colors = colorThief.getPalette(img, 10)
    if (colors == null) return
    const backgroundColors = getDominantColors(colors)
    document.documentElement.style.setProperty('--controls-color', `#fff`)
    document.documentElement.style.setProperty('--color-text-primary', '#fff')
    if (backgroundColors) {
      const startColor = rgbToHex(backgroundColors[0])
      const stopColor = rgbToHex(backgroundColors[1])
      document.documentElement.style.setProperty('--start-color', startColor)
      document.documentElement.style.setProperty('--end-color', stopColor)
      document.dispatchEvent(new CustomEvent('BlobBackgroundColorChanged'))
    }
  }

  function getDominantColors(colors: RGBColor[]) {
    const filteredColors = colors.filter((color) => !isNearBlackOrWhite(color))
    if (filteredColors.length >= 2) {
      return [filteredColors[0], filteredColors[1]]
    }
    return null
  }

  function isNearBlackOrWhite(color: RGBColor) {
    const [r, g, b] = color
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness < 30 || brightness > 220
  }

  function rgbToHex([r, g, b]: RGBColor) {
    const toHex = (value: number) => value.toString(16).padStart(2, '0')
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }
  img.onload = function () {
    handleImageLoad()
  }
  // Trigger image load if it is cached
  if (img.complete) {
    handleImageLoad()
  }
}

function getBlackOledColors(imageBlobUrl: string) {
  //const img = document.getElementById('albumCover');
  const colorThief = new ColorThief()
  const img = new Image()
  img.src = imageBlobUrl

  const handleImageLoad = function () {
    const colors = colorThief.getPalette(img, 10)
    if (colors == null) return
    const suitableColor = getSuitableColor(colors)
    document.documentElement.style.setProperty('--color-text-primary', '#fff')
    if (suitableColor) {
      document.documentElement.style.setProperty(
        '--controls-color',
        `rgb(${adjustColorIfTooDark(suitableColor).join(',')})`
      )
    } else {
      document.documentElement.style.setProperty('--primary-color', `#ff`)
    }
  }

  function getSuitableColor(colors: RGBColor[]) {
    return colors.find((color) => !isNearBlackOrWhite(color))
  }

  function isNearBlackOrWhite(color: RGBColor) {
    const [r, g, b] = color
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness < 30 || brightness > 220
  }

  function adjustColorIfTooDark(rgb: RGBColor) {
    function rgbToLuminance(r: number, g: number, b: number) {
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    function brightenColor(r: number, g: number, b: number, percentage: number): RGBColor {
      r = Math.min(255, r + (r * percentage) / 100)
      g = Math.min(255, g + (g * percentage) / 100)
      b = Math.min(255, b + (b * percentage) / 100)
      return [r, g, b]
    }

    const [r, g, b] = rgb

    const luminance = rgbToLuminance(r, g, b)

    const threshold = 50 // Adjust as needed

    if (luminance < threshold) {
      const brightenPercentage = (luminance / threshold) * 50 + 25
      return brightenColor(r, g, b, brightenPercentage)
    }

    return [r, g, b]
  }
  img.onload = function () {
    handleImageLoad()
  }
  if (img.complete) {
    handleImageLoad()
  }
}

export async function setAppColours(settings: any, imageUrl: string) {
  const response = await fetch(imageUrl)
  const blob = await response.blob()

  const blobUrl = URL.createObjectURL(blob)
  document.documentElement.style.setProperty('--album-image', `url(${imageUrl})`)
  document.documentElement.style.setProperty('--controls-color', `#fff`)
  document.documentElement.style.setProperty('--color-text-primary', '#fff')
  document.documentElement.style.setProperty('--primary-color', `#fff`)

  if (['match', 'match-dark'].includes(settings?.backgroundOption)) getMatchColors(blobUrl)
  else if (['contrast'].includes(settings?.backgroundOption)) getMatchContrastColors(blobUrl)
  else if (['spotlight'].includes(settings?.backgroundOption)) {
    getSpotlightColors(blobUrl)
  } else if (['black-oled'].includes(settings?.backgroundOption)) {
    getBlackOledColors(blobUrl)
  }
}
