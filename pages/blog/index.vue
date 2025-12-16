<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-12">
      <div class="flex items-center mb-4">
        <div class="w-1 h-16 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full mr-4"></div>
        <div>
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-2">
            Blog
          </h1>
          <p class="text-lg text-white/70">
            Thoughts, tutorials, and insights on coding and technology
          </p>
        </div>
      </div>
    </div>

    <div v-if="articles && articles.length > 0" class="space-y-6">
      <article v-for="article in articles" :key="article.slug" class="group backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-500/20">
        <NuxtLink :to="`/blog/${article.slug}`" class="block">
          <div class="flex items-start justify-between mb-4">
            <h2 class="text-3xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors flex-1">
              {{ article.title }}
            </h2>
            <div class="text-primary-300 transform group-hover:translate-x-2 transition-transform ml-4">→</div>
          </div>
          <p class="text-white/70 mb-4 text-lg leading-relaxed">
            {{ article.description }}
          </p>
          <div class="flex items-center justify-between text-sm">
            <time :datetime="article.date" class="text-white/50 font-mono">
              {{ formatDate(article.date) }}
            </time>
            <span class="text-primary-300 font-semibold group-hover:text-primary-200">
              Read more
            </span>
          </div>
        </NuxtLink>
      </article>
    </div>

    <div v-else class="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
      <div class="text-6xl mb-4">📝</div>
      <p class="text-white/70 text-lg">
        No blog posts yet. Check back soon!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { blogPosts } from '~/data/blog-posts'

// Sort by date descending
const articles = computed(() => {
  return [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
