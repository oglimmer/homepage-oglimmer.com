<template>
  <article v-if="article" class="mx-auto max-w-3xl py-8">
    <NuxtLink to="/blog" class="link-underline mb-8 text-sm font-medium">
      <span aria-hidden="true">←</span> Back to blog
    </NuxtLink>

    <header class="mt-6 border-b border-bone/10 pb-8">
      <div class="flex items-center gap-3">
        <time :datetime="article.date" class="font-mono text-xs text-marigold-500">
          {{ formatBlogDate(article.date, article.lang) }}
        </time>
        <span v-if="article.lang === 'de'" class="tag">DE</span>
      </div>
      <h1 class="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-bone md:text-5xl">
        {{ article.title }}
      </h1>
      <NuxtLink
        v-if="translation"
        :to="`/blog/${translation.slug}`"
        class="mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-bone/60 transition-colors hover:text-marigold-300"
      >
        {{ article.lang === 'de' ? 'Read in English' : 'Auf Deutsch lesen' }} <span aria-hidden="true">→</span>
      </NuxtLink>
    </header>

    <div
      class="prose prose-invert mt-10 max-w-none
        prose-headings:font-display prose-headings:font-semibold prose-headings:text-bone
        prose-p:text-bone/80 prose-p:leading-relaxed
        prose-a:text-marigold-300 prose-a:no-underline hover:prose-a:text-marigold-400
        prose-strong:text-bone
        prose-code:text-marigold-300 prose-code:bg-bone/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-ink-950/70 prose-pre:border prose-pre:border-bone/10
        prose-ul:text-bone/80 prose-ol:text-bone/80 prose-li:text-bone/80
        prose-blockquote:border-marigold-400 prose-blockquote:text-bone/70
        prose-img:rounded-xl prose-img:border prose-img:border-bone/10"
      v-html="htmlContent"
    />

    <footer class="mt-14 border-t border-bone/10 pt-8">
      <NuxtLink to="/blog" class="link-underline text-sm font-semibold">
        <span aria-hidden="true">←</span> Back to blog
      </NuxtLink>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import { blogPosts, getTranslation, formatBlogDate } from '~/data/blog-posts'

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug

const article = blogPosts.find(post => post.slug === slug)

if (!article) {
  throw createError({ statusCode: 404, statusMessage: 'Blog post not found' })
}

const translation = getTranslation(article)
const htmlContent = marked(article.content)
</script>
