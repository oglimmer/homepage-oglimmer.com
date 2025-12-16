<template>
  <header class="sticky top-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg shadow-primary-900/20">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="group flex items-center space-x-2">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg group-hover:shadow-primary-500/50 transition-all duration-300 group-hover:scale-110">
            <span class="text-white font-bold text-xl">O</span>
          </div>
          <span class="text-2xl font-bold text-white hover:text-primary-300 transition-colors">
            oglimmer
          </span>
        </NuxtLink>

        <ul class="flex space-x-1">
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
    </nav>
  </header>
</template>
