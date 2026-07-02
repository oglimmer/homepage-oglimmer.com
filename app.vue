<template>
  <div class="relative min-h-[100dvh] overflow-x-hidden bg-ink-900">
    <!-- Signature generative background: warm "threads" between drifting points -->
    <div class="fixed inset-0 z-0 bg-ink-900" />
    <ClientOnly>
      <ConnectedPointsBackground />
    </ClientOnly>

    <!-- Warm radial vignette to seat the content over the canvas -->
    <div
      class="pointer-events-none fixed inset-0 z-0"
      style="background: radial-gradient(120% 80% at 50% -10%, rgba(230,154,44,0.10), transparent 55%), linear-gradient(to bottom, rgba(18,14,10,0) 0%, rgba(18,14,10,0.55) 60%, rgba(18,14,10,0.9) 100%);"
    />

    <!-- Single grain overlay (fixed, non-interactive) -->
    <div class="grain-layer pointer-events-none fixed inset-0 z-[60]" />

    <!-- Content -->
    <div class="relative z-10 flex min-h-[100dvh] flex-col">
      <AppHeader />
      <main class="mx-auto w-full max-w-6xl flex-1 px-5 pb-24 pt-10 sm:px-8">
        <NuxtPage />
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<script setup>
useHead({
  htmlAttrs: {
    lang: 'en',
  },
})
</script>
