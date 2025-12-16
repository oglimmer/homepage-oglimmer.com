<template>
  <div class="max-w-4xl mx-auto">
    <article v-if="article" class="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 md:p-12">
      <header class="mb-8">
        <NuxtLink to="/blog" class="inline-flex items-center text-primary-300 hover:text-primary-200 font-medium mb-6 group">
          <svg class="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </NuxtLink>
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          {{ article.title }}
        </h1>
        <time :datetime="article.date" class="text-white/60 font-mono text-sm">
          {{ formatDate(article.date) }}
        </time>
      </header>

      <div
        class="prose prose-invert prose-lg max-w-none
          prose-headings:text-white
          prose-p:text-white/90
          prose-a:text-primary-300 prose-a:no-underline hover:prose-a:text-primary-200
          prose-strong:text-white
          prose-code:text-primary-300 prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
          prose-ul:text-white/90
          prose-ol:text-white/90
          prose-li:text-white/90
          prose-blockquote:border-primary-400 prose-blockquote:text-white/80"
        v-html="htmlContent"
      />

      <footer class="mt-12 pt-8 border-t border-white/20">
        <NuxtLink to="/blog" class="inline-flex items-center text-primary-300 hover:text-primary-200 font-semibold group">
          <svg class="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </NuxtLink>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import { blogPosts } from '~/data/blog-posts'

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug

// Find the article
const article = blogPosts.find(post => post.slug === slug)

if (!article) {
  throw createError({ statusCode: 404, statusMessage: 'Blog post not found' })
}

// Convert markdown to HTML
const htmlContent = marked(article.content)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
