<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Animated Background -->
    <div class="fixed inset-0 bg-gradient-to-br from-navy-900 via-primary-900 to-navy-800 animate-gradient bg-[length:400%_400%]"/>
    <div class="fixed inset-0 bg-grid-pattern opacity-20"/>

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
