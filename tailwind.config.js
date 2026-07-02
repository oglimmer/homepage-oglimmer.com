/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        // Warm near-black "ink" surface scale (page base to raised panels)
        ink: {
          950: '#120e0a',
          900: '#171310',
          850: '#1d1813',
          800: '#241d16',
          700: '#312819',
          600: '#42361f',
        },
        // Warm off-white text scale
        bone: {
          DEFAULT: '#f1e9db',
          100: '#f1e9db',
          300: '#cbc0ac',
          500: '#9b8f79',
          700: '#6d6350',
        },
        // Single locked accent: marigold (wool by lamplight)
        marigold: {
          300: '#f6cd73',
          400: '#efb44c',
          500: '#e69a2c',
          600: '#c97c1b',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        prose: '65ch',
      },
      keyframes: {
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'thread-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'rise-in': 'rise-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'thread-in': 'thread-in 1.2s ease both',
      },
      transitionTimingFunction: {
        craft: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
