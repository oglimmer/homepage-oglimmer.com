/**
 * Motion directive registration for Nuxt.
 *
 * The directive definitions live in utils/directives.ts so tests can
 * import and exercise the real production code without going through
 * Nuxt's plugin system.
 */
import { vReveal, vCount } from '../utils/directives'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', vReveal)
  nuxtApp.vueApp.directive('count', vCount)
})
