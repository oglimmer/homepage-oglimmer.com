<template>
  <div class="max-w-6xl mx-auto relative">
    <!-- Snowflakes -->
    <div v-if="showSnowflakes" class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        v-for="flake in snowflakes"
        :key="flake.id"
        class="absolute text-white opacity-70 animate-snowfall"
        :style="{
          left: flake.left + '%',
          fontSize: flake.size + 'px',
          animationDuration: flake.duration + 's',
          animationDelay: flake.delay + 's',
        }"
      >
        ❄
      </div>
    </div>
    <!-- Hero Section -->
    <section class="text-center py-20 relative">
      <div class="absolute inset-0 flex items-center justify-center opacity-10">
        <div class="text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] 2xl:text-[20rem] font-bold text-white select-none">oglimmer</div>
      </div>
      <div class="relative z-10">
        <div class="inline-block mb-6">
          <div class="text-primary-300 text-sm font-mono mb-2 tracking-widest">WELCOME TO MY DIGITAL HOME</div>
        </div>
        <h1 class="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
          Hi, I'm <span class="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Oli</span>
        </h1>
        <p class="text-3xl md:text-4xl text-primary-200 italic font-light mb-8 tracking-wide">
          coding is the new knitting
        </p>
        <div class="flex flex-wrap justify-center gap-4 mt-8">
          <a href="#about" class="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary-500/50">
            Learn More
          </a>
          <a href="#projects" class="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20">
            View Projects
          </a>
          <a href="#blog" class="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20">
            View Blog Posts
          </a>
          <a href="#k8s-portal" class="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20">
            View K8S Portal
          </a>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 md:p-12 mb-16 hover:bg-white/15 transition-all duration-300">
      <div class="flex items-center mb-6">
        <div class="w-1 h-12 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full mr-4"></div>
        <h2 class="text-4xl font-bold text-white">About Me</h2>
      </div>
      <div class="space-y-8">
        <div class="prose prose-invert prose-lg max-w-none">
          <p class="text-lg text-white/90 leading-relaxed">
            I was born in the seventies and grew up in Germany at a time when home computers started to shape how people think and create. From the C64 and Amiga to PCs and Macs, technology was always part of my daily life. I naturally moved early into smartphones and smart devices, driven by curiosity and a strong interest in how things work.
          </p>
          <p class="text-lg text-white/90 leading-relaxed">
            I am a tech enthusiast and a nerd at heart. I enjoy building useful applications and small experimental web games, often as prototypes to explore ideas fast and learn from them. For me, software is both a craft and a playground.
          </p>
          <p class="text-lg text-white/90 leading-relaxed">
            Professionally, I work as a software engineering team lead. My main focus is to build high throughput teams by creating an environment that supports autonomy, trust, and individual growth. I have experience across startups, mid size companies, and corporate environments, which helps me adapt my leadership style to different contexts.
          </p>
          <p class="text-lg text-white/90 leading-relaxed">
            At my core, I believe in people. In their curiosity, their good intentions, and their ability to grow when given trust. I believe in people first, in trust over control and curiosity over certainty. I try to move through my work and everyday life with humility, kindness, and an open mind, because meaningful things are built where people feel respected, trusted, and seen.
          </p>
        </div>
        <div class="flex flex-wrap gap-4 mt-6">
          <a href="https://github.com/oglimmer" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 group">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
            <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/oliver-zimpasser" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 group">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
            <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <a href="https://hub.docker.com/u/oglimmer" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 group">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338 0-.676.03-1.01.09-.156-1.615-1.463-2.52-1.54-2.565l-.32-.193-.213.291c-.295.434-.474.918-.53 1.415-.088.751.123 1.48.588 2.048-.543.262-1.46.51-2.714.51h-14.753c-.483 0-.887.384-.904.866-.035.975.064 2.01.334 3.022.307 1.158.908 2.163 1.785 2.988 1.058.99 2.76 1.493 5.06 1.493 1.076 0 2.136-.126 3.153-.376 1.238-.305 2.413-.769 3.492-1.38 1.01-.571 1.88-1.283 2.59-2.116.936-1.097 1.62-2.308 2.037-3.602h.174c1.063 0 1.955-.387 2.65-1.151.333-.366.604-.79.81-1.263l.11-.25-.302-.195z"/>
            </svg>
            Docker Hub
            <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="mb-16">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center">
          <div class="w-1 h-12 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full mr-4"></div>
          <h2 class="text-4xl font-bold text-white">Projects</h2>
        </div>
        <NuxtLink to="/projects" class="text-primary-300 hover:text-primary-200 font-semibold flex items-center gap-2">
          View All
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="project in projects" :key="project.title" class="group backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/20">
          <div class="p-6 relative">
            <div class="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full filter blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div class="relative">
              <h3 class="text-2xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors">
                {{ project.title }}
              </h3>
              <p class="text-white/70 mb-4 min-h-[3rem]">
                {{ project.text }}
              </p>
              <div v-if="project.techList" class="flex flex-wrap gap-2 mb-6">
                <span v-for="tech in parseTechList(project.techList)" :key="tech" class="text-xs bg-primary-500/20 border border-primary-400/30 text-primary-200 px-3 py-1 rounded-full backdrop-blur-sm">
                  {{ tech }}
                </span>
              </div>
              <div class="flex flex-wrap gap-3 mt-4">
                <a v-for="[url, label] in project.linkData" :key="url" :href="url" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-primary-300 hover:text-primary-200 font-semibold text-sm group/link">
                  {{ label }}
                  <svg class="w-3 h-3 ml-1 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog Section -->
    <section id="blog" class="mb-16">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center">
          <div class="w-1 h-12 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full mr-4"></div>
          <h2 class="text-4xl font-bold text-white">Latest Blog Posts</h2>
        </div>
        <NuxtLink to="/blog" class="text-primary-300 hover:text-primary-200 font-semibold flex items-center gap-2">
          View All
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article v-for="article in latestPosts" :key="article.slug" class="group backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/20">
          <NuxtLink :to="`/blog/${article.slug}`" class="block">
            <h3 class="text-xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors line-clamp-2">
              {{ article.title }}
            </h3>
            <p class="text-white/70 mb-4 text-sm line-clamp-3">
              {{ article.description }}
            </p>
            <div class="flex items-center justify-between text-xs">
              <time :datetime="article.date" class="text-white/50 font-mono">
                {{ formatDate(article.date) }}
              </time>
              <span class="text-primary-300 font-semibold group-hover:text-primary-200">
                Read →
              </span>
            </div>
          </NuxtLink>
        </article>
      </div>
    </section>

    <!-- K8S Portal Section -->
    <section id="k8s-portal" class="mb-16">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center">
          <div class="w-1 h-12 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full mr-4"></div>
          <h2 class="text-4xl font-bold text-white">K8S Portal</h2>
        </div>
        <NuxtLink to="/k8s-portal" class="text-primary-300 hover:text-primary-200 font-semibold flex items-center gap-2">
          View All
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="item in k8sPortalItemsPreview" :key="item.title" class="group backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/20">
          <div class="p-6 relative">
            <div class="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full filter blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div class="relative">
              <h3 class="text-2xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors">
                {{ item.title }}
              </h3>
              <p class="text-white/70 mb-4 min-h-[3rem]">
                {{ item.text }}
              </p>
              <div v-if="item.techList" class="flex flex-wrap gap-2 mb-6">
                <span v-for="tech in parseK8sTechList(item.techList)" :key="tech" class="text-xs bg-primary-500/20 border border-primary-400/30 text-primary-200 px-3 py-1 rounded-full backdrop-blur-sm">
                  {{ tech }}
                </span>
              </div>
              <div class="flex flex-wrap gap-3 mt-4">
                <a v-for="[url, label] in item.linkData" :key="url" :href="url" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-primary-300 hover:text-primary-200 font-semibold text-sm group/link">
                  {{ label }}
                  <svg class="w-3 h-3 ml-1 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { blogPosts } from '~/data/blog-posts'
import { projects as allProjects, parseTechList } from '~/data/projects'
import { k8sPortalItems as allK8sPortalItems, parseTechList as parseK8sTechList } from '~/data/k8s-portal'

// Get first 6 projects for homepage
const projects = computed(() => allProjects.slice(0, 6))

// Get first 3 K8S portal items for homepage
const k8sPortalItemsPreview = computed(() => allK8sPortalItems.slice(0, 3))

// Get latest 3 blog posts
const latestPosts = computed(() => {
  return [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Snowflakes logic
const showSnowflakes = ref(false)

// Generate snowflakes with random properties
const snowflakes = computed(() => {
  const flakes = []
  const count = 50 // Number of snowflakes

  for (let i = 0; i < count; i++) {
    flakes.push({
      id: i,
      left: Math.random() * 100, // Random horizontal position (0-100%)
      size: Math.random() * 10 + 10, // Random size (10-20px)
      duration: Math.random() * 5 + 10, // Random fall duration (10-15s)
      delay: Math.random() * 5, // Random start delay (0-5s)
    })
  }

  return flakes
})

// Start snowfall after 15 seconds
onMounted(() => {
  setTimeout(() => {
    showSnowflakes.value = true
  }, 15000) // 15 seconds
})
</script>
