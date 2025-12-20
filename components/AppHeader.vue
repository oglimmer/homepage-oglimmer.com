<template>
  <header class="sticky top-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg shadow-primary-900/20">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="group flex items-center space-x-2">
          <div class="w-10 h-10 rounded-lg overflow-hidden shadow-lg group-hover:shadow-primary-500/50 transition-all duration-300 group-hover:scale-110">
            <img src="/images/icon.png" alt="oglimmer logo" class="w-full h-full object-cover" >
          </div>
          <span class="text-2xl font-bold text-white hover:text-primary-300 transition-colors">
            oglimmer
          </span>
        </NuxtLink>

        <!-- Hamburger button (mobile only) -->
        <button
          class="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
          aria-label="Toggle menu"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Desktop menu -->
        <ul class="hidden md:flex space-x-1">
          <li>
            <NuxtLink to="/" class="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium backdrop-blur-sm">
              Home
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/projects" class="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium backdrop-blur-sm">
              Projects
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/blog" class="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium backdrop-blur-sm">
              Blog
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/k8s-portal" class="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium backdrop-blur-sm">
              K8S Portal
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/privacy" class="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium backdrop-blur-sm">
              Privacy
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/imprint" class="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium backdrop-blur-sm">
              Imprint
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Mobile menu (dropdown) -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden mt-4 pb-2 border-t border-white/20 pt-4"
      >
        <ul class="flex flex-col space-y-2">
          <li>
            <NuxtLink
              to="/"
              class="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium backdrop-blur-sm"
              @click="mobileMenuOpen = false"
            >
              Home
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/projects"
              class="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium backdrop-blur-sm"
              @click="mobileMenuOpen = false"
            >
              Projects
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/blog"
              class="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium backdrop-blur-sm"
              @click="mobileMenuOpen = false"
            >
              Blog
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/k8s-portal"
              class="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium backdrop-blur-sm"
              @click="mobileMenuOpen = false"
            >
              K8S Portal
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/privacy"
              class="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium backdrop-blur-sm"
              @click="mobileMenuOpen = false"
            >
              Privacy
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/imprint"
              class="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium backdrop-blur-sm"
              @click="mobileMenuOpen = false"
            >
              Imprint
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
const mobileMenuOpen = ref(false)
</script>
