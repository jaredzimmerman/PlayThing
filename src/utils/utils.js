/**
 * Utils: Utilities.
 * - Global functions that can be used across multiple files.
 * -----------------------------------------------------------------------------
 */

/**
 * Config object.
 */
const config = {
  authNamespace: 'nowify_auth_state'
}

/**
 * Get stored authorisation object.
 * @return {Object}
 */
export function getStoredAuth() {
  return JSON.parse(window.localStorage.getItem(config.authNamespace)) || {}
}

/**
 * Set stored authorisation object.
 * @return {Object}
 */
export function setStoredAuth(authState = {}) {
  window.localStorage.setItem(config.authNamespace, JSON.stringify(authState))
}

/**
 * Get PlayThings settings.
 * @return {Object}
 */
export function getPlayThingSettings() {
  const settingsString = localStorage.getItem('playThingSettings')
  let settings = {}
  try {
    settings = JSON.parse(settingsString)
    settings.selectedBackgroundOption = settings?.backgroundOption ?? 'blank'
    settings.selectedTextOption = settings?.textOption ?? 'none'
    settings.selectedNothingPlayingOption =
      settings?.nothingPlayingOption ?? 'black-oled'
    settings.selectedMiscellaneousOption =
      settings?.miscellaneousOption ?? 'show-progress-bar'
  } catch (e) {
    // default values
    settings.selectedBackgroundOption = 'blank'
    settings.selectedTextOption = 'none'
    settings.selectedNothingPlayingOption = 'black-oled'
    settings.selectedMiscellaneousOption = 'show-progress-bar'
  }

  return settings
}
