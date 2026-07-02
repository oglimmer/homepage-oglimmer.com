<template>
  <header class="sticky top-0 z-50 border-b border-bone/10 bg-ink-900/95 backdrop-blur-md">
    <nav class="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
      <NuxtLink to="/" class="group flex items-center gap-2.5">
        <div class="h-9 w-9 overflow-hidden rounded-lg ring-1 ring-bone/15 transition-all duration-300 group-hover:ring-marigold-400/50">
          <img src="/images/icon.png" alt="oglimmer logo" class="h-full w-full object-cover">
        </div>
        <span class="font-mono text-lg font-medium tracking-tight text-bone transition-colors group-hover:text-marigold-300">
          oglimmer
        </span>
      </NuxtLink>

      <!-- Hamburger (mobile only) -->
      <button
        class="rounded-lg p-2 text-bone transition-colors hover:bg-bone/5 md:hidden"
        aria-label="Toggle menu"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <svg v-if="!mobileMenuOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Desktop menu -->
      <ul class="hidden items-center gap-1 md:flex">
        <li v-for="item in navItems" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="rounded-lg px-3.5 py-2 text-sm font-medium text-bone/70 transition-colors duration-300 hover:text-bone"
            active-class="!text-marigold-300"
          >
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="border-t border-bone/10 px-5 py-3 md:hidden">
      <ul class="flex flex-col gap-1">
        <li v-for="item in navItems" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="block rounded-lg px-3 py-2.5 text-base font-medium text-bone/80 transition-colors hover:bg-bone/5 hover:text-bone"
            active-class="!text-marigold-300"
            @click="mobileMenuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
const mobileMenuOpen = ref(false)

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
  { to: '/k8s-portal', label: 'Cluster' },
]
</script>
