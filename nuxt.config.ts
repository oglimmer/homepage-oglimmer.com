// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: [      
      "@fortawesome/vue-fontawesome" // this fixed https://github.com/FortAwesome/vue-fontawesome/issues/394
    ]
  },
  css: ['~/assets/main.scss', '@fortawesome/fontawesome-svg-core/styles.css'],
  typescript: {
    shim: false
  },
  modules: ['@nuxtjs/color-mode']
})
