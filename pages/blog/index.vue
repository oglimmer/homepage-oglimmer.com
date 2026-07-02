<template>
  <div class="max-w-3xl">
    <header class="py-10">
      <p class="meta-label">field notes</p>
      <h1 class="mt-4 font-display text-5xl font-semibold tracking-tight text-bone md:text-6xl">
        Blog
      </h1>
      <p class="mt-4 leading-relaxed text-bone/70">
        Thoughts, tutorials, and notes on coding, infrastructure, and building things.
      </p>
    </header>

    <ul v-if="articles && articles.length" class="divide-y divide-bone/10 border-y border-bone/10">
      <li v-for="(article, i) in articles" :key="article.slug" v-reveal="{ delay: Math.min(i, 8) * 55 }" class="group transition-colors duration-300 hover:bg-ink-850/60">
        <div class="flex items-start gap-4 py-7">
          <NuxtLink :to="`/blog/${displayPost(article).slug}`" class="min-w-0 flex-1">
            <time :datetime="displayPost(article).date" class="font-mono text-xs text-marigold-500">
              {{ formatBlogDate(displayPost(article).date, activeLang(article)) }}
            </time>
            <h2 class="mt-2 font-display text-2xl font-semibold text-bone transition-colors group-hover:text-marigold-300 md:text-3xl">
              {{ displayPost(article).title }}
            </h2>
            <p class="mt-2 leading-relaxed text-bone/60">
              {{ displayPost(article).description }}
            </p>
          </NuxtLink>
          <div class="flex flex-col items-end gap-3">
            <div v-if="getTranslation(article)" class="inline-flex rounded-full border border-bone/15 p-0.5">
              <button
                v-for="lang in ['en', 'de']"
                :key="lang"
                class="rounded-full px-2.5 py-1 font-mono text-[11px] transition-colors duration-200"
                :class="activeLang(article) === lang
                  ? 'bg-marigold-500/20 text-marigold-300'
                  : 'text-bone/40 hover:text-bone/70'"
                @click.prevent="toggleLang(article)"
              >
                {{ lang.toUpperCase() }}
              </button>
            </div>
            <span aria-hidden="true" class="text-bone/25 transition-all group-hover:translate-x-0.5 group-hover:text-marigold-400">→</span>
          </div>
        </div>
      </li>
    </ul>

    <div v-else class="rounded-2xl border border-bone/10 bg-ink-850 p-12 text-center">
      <p class="font-display text-xl text-bone/80">No posts yet.</p>
      <p class="mt-2 text-sm text-bone/50">Check back soon.</p>
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
