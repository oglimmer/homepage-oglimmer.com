<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-12">
      <div class="flex items-center mb-4">
        <div class="w-1 h-16 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full mr-4"/>
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
        <div v-if="getTranslation(article)" class="flex justify-end mb-3">
          <div class="inline-flex rounded-full bg-white/5 border border-white/20 p-0.5">
            <button
              v-for="lang in ['en', 'de']"
              :key="lang"
              class="px-3 py-1 text-xs font-mono rounded-full transition-all duration-200"
              :class="activeLang(article) === lang
                ? 'bg-primary-500/30 text-primary-200 border border-primary-400/40'
                : 'text-white/50 hover:text-white/80 border border-transparent'"
              @click.prevent="toggleLang(article)"
            >
              {{ lang.toUpperCase() }}
            </button>
          </div>
        </div>
        <NuxtLink :to="`/blog/${displayPost(article).slug}`" class="block">
          <div class="flex items-start justify-between mb-4">
            <h2 class="text-3xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors flex-1">
              {{ displayPost(article).title }}
            </h2>
            <div class="text-primary-300 transform group-hover:translate-x-2 transition-transform ml-4">→</div>
          </div>
          <p class="text-white/70 mb-4 text-lg leading-relaxed">
            {{ displayPost(article).description }}
          </p>
          <div class="flex items-center justify-between text-sm">
            <time :datetime="displayPost(article).date" class="text-white/50 font-mono">
              {{ formatBlogDate(displayPost(article).date, activeLang(article)) }}
            </time>
            <span class="text-primary-300 font-semibold group-hover:text-primary-200">
              {{ activeLang(article) === 'de' ? 'Weiterlesen' : 'Read more' }}
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
import { type BlogPost, getDeduplicatedPosts, getTranslation, formatBlogDate } from '~/data/blog-posts'

const articles = computed(() => {
  return [...getDeduplicatedPosts()].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const langOverrides = ref<Record<string, string>>({})

function activeLang(article: BlogPost): string {
  return langOverrides.value[article.slug] || article.lang || 'en'
}

function toggleLang(article: BlogPost) {
  const current = activeLang(article)
  langOverrides.value[article.slug] = current === 'en' ? 'de' : 'en'
}

function displayPost(article: BlogPost): BlogPost {
  const lang = activeLang(article)
  const articleLang = article.lang || 'en'
  if (lang !== articleLang) {
    const translation = getTranslation(article)
    if (translation) return translation
  }
  return article
}
</script>
