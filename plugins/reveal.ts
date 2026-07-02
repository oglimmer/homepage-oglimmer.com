/**
 * Motion directives, registered universally so SSR can resolve them.
 * All DOM work happens in `mounted` (client-only). Both honor
 * prefers-reduced-motion and degrade to the already-visible default.
 *
 *   v-reveal            fade + rise a list/grid item as it enters view
 *   v-reveal="{ delay: 120 }"
 *   v-count="{ to: 48, suffix: ' GB' }"   count a number up on first view
 */
export default defineNuxtPlugin((nuxtApp) => {
  const prefersReduced = () =>
    typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let revealObserver: IntersectionObserver | null = null
  function getRevealObserver() {
    if (typeof IntersectionObserver === 'undefined') return null
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries, obs) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal-in')
              obs.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
      )
    }
    return revealObserver
  }

  nuxtApp.vueApp.directive('reveal', {
    getSSRProps() {
      return {}
    },
    mounted(el: HTMLElement, binding) {
      const io = getRevealObserver()
      // Leave content untouched when motion is unwelcome or unsupported.
      if (prefersReduced() || !io) return

      const delay = binding.value?.delay ?? 0
      if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`)
      el.classList.add('reveal-init')
      io.observe(el)
    },
    unmounted(el: HTMLElement) {
      revealObserver?.unobserve(el)
    },
  })

  // -- count-up ------------------------------------------------------
  function animateCount(el: HTMLElement, to: number, suffix: string, prefix: string) {
    const duration = 900
    const start = performance.now()
    const startVal = 0

    function frame(now: number) {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3) // out-cubic
      const value = Math.round(startVal + (to - startVal) * eased)
      el.textContent = `${prefix}${value}${suffix}`
      if (t < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }

  const counted = new WeakSet<Element>()
  let countObserver: IntersectionObserver | null = null
  function getCountObserver() {
    if (typeof IntersectionObserver === 'undefined') return null
    if (!countObserver) {
      countObserver = new IntersectionObserver(
        (entries, obs) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !counted.has(entry.target)) {
              counted.add(entry.target)
              const el = entry.target as HTMLElement
              const to = Number(el.dataset.to)
              animateCount(el, to, el.dataset.suffix ?? '', el.dataset.prefix ?? '')
              obs.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.6 },
      )
    }
    return countObserver
  }

  nuxtApp.vueApp.directive('count', {
    getSSRProps() {
      return {}
    },
    mounted(el: HTMLElement, binding) {
      const io = getCountObserver()
      // Leave the final rendered value in place if motion is off/unsupported.
      if (prefersReduced() || !io) return

      const to = binding.value?.to
      if (typeof to !== 'number') return
      el.dataset.to = String(to)
      el.dataset.suffix = binding.value?.suffix ?? ''
      el.dataset.prefix = binding.value?.prefix ?? ''
      // Reset to the start value before it scrolls into view.
      el.textContent = `${el.dataset.prefix}0${el.dataset.suffix}`
      io.observe(el)
    },
    unmounted(el: HTMLElement) {
      countObserver?.unobserve(el)
    },
  })
})
