<template>
  <footer class="backdrop-blur-md bg-white/5 border-t border-white/10 mt-16">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0">
          <p class="text-white/60 text-sm mb-1">
            &copy; {{ new Date().getFullYear() }} oglimmer. All rights reserved.
          </p>
          <p class="text-white/40 text-xs italic">
            "coding is the new knitting"
          </p>
        </div>
        <div class="flex space-x-6">
          <NuxtLink to="/privacy" class="text-white/60 hover:text-white text-sm transition-colors duration-300">
            Privacy Policy
          </NuxtLink>
          <NuxtLink to="/imprint" class="text-white/60 hover:text-white text-sm transition-colors duration-300">
            Imprint
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
