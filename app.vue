<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Connected Points Canvas Background -->
    <div class="fixed inset-0 z-0 bg-[#16213e]" />
    <ClientOnly>
      <ConnectedPointsBackground />
    </ClientOnly>

    <!-- Floating Orbs -->
    <div class="fixed top-20 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"/>
    <div class="fixed top-40 right-10 w-72 h-72 bg-navy-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style="animation-delay: 2s;"/>
    <div class="fixed bottom-20 left-1/2 w-72 h-72 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style="animation-delay: 4s;"/>

    <!-- Content -->
    <div class="relative z-10">
      <AppHeader />
      <main class="container mx-auto px-4 py-12">
        <NuxtPage />
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<script setup>
useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
    }
  ]
})
</script>
