// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['pages/blog/\\[...slug\\].vue'],
  rules: {
    // Content is from trusted flat-file CMS, not user input
    'vue/no-v-html': 'off',
  },
})
