<template>
  <footer class="relative z-10 border-t border-bone/10 bg-ink-950">
    <div class="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
      <div>
        <p class="font-display text-lg text-bone">
          coding is the new knitting
        </p>
        <p class="mt-1 font-mono text-xs text-bone/40">
          &copy; {{ year }} Oliver Zimpasser
        </p>
      </div>

      <nav class="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-bone/50">
        <a href="https://github.com/oglimmer" target="_blank" rel="noopener noreferrer" class="transition-colors hover:text-marigold-300">GitHub</a>
        <a href="https://www.linkedin.com/in/oliver-zimpasser" target="_blank" rel="noopener noreferrer" class="transition-colors hover:text-marigold-300">LinkedIn</a>
        <a href="/rss" class="transition-colors hover:text-marigold-300">RSS</a>
        <NuxtLink to="/privacy" class="transition-colors hover:text-marigold-300">Privacy</NuxtLink>
        <NuxtLink to="/imprint" class="transition-colors hover:text-marigold-300">Imprint</NuxtLink>
      </nav>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>
