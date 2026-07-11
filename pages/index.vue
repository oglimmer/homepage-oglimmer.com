<template>
  <div>
    <!-- ============ HERO ============ -->
    <section class="flex min-h-[calc(100dvh-9rem)] flex-col justify-center py-16">
      <div class="max-w-3xl">
        <p class="meta-label animate-thread-in">coding is the new knitting</p>
        <h1 class="mt-5 font-display text-6xl font-semibold leading-[0.95] tracking-tight text-bone sm:text-7xl md:text-8xl animate-rise-in">
          Hi, I'm <span class="hero-accent text-marigold-400">Oli</span>.
        </h1>
        <p class="mt-7 max-w-xl text-lg leading-relaxed text-bone/70 animate-rise-in" style="animation-delay: 120ms;">
          I lead software engineering teams, and I build useful apps plus small
          web experiments for the pure joy of making things.
        </p>
        <div class="mt-9 flex flex-wrap items-center gap-4 animate-rise-in" style="animation-delay: 220ms;">
          <a href="#work" class="btn-primary">See the work <span aria-hidden="true">↓</span></a>
          <NuxtLink to="/blog" class="btn-ghost">Read the blog <span aria-hidden="true">→</span></NuxtLink>
        </div>
      </div>
    </section>

    <!-- ============ ABOUT ============ -->
    <section id="about" class="scroll-mt-24 border-t border-bone/10 py-20">
      <h2 class="font-display text-3xl font-semibold tracking-tight text-bone md:text-4xl">
        A little about me
      </h2>
      <div class="mt-10 grid gap-10 md:grid-cols-12">
        <!-- Facts + links rail -->
        <aside class="md:col-span-4 lg:col-span-3">
          <div class="surface p-6">
            <dl class="space-y-4">
              <div v-for="fact in facts" :key="fact.k">
                <dt class="font-mono text-[11px] uppercase tracking-[0.18em] text-bone/40">{{ fact.k }}</dt>
                <dd class="mt-1 text-sm text-bone/85">{{ fact.v }}</dd>
              </div>
            </dl>
            <div class="mt-6 flex flex-col gap-2 border-t border-bone/10 pt-6">
              <a
                v-for="s in socials"
                :key="s.label"
                :href="s.href"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center gap-2.5 text-sm text-bone/70 transition-colors hover:text-marigold-300"
              >
                <!-- eslint-disable-next-line vue/no-v-html -- s.icon is a static, hardcoded inline SVG (see socials below), not user input -->
                <span class="text-bone/40 transition-colors group-hover:text-marigold-400" v-html="s.icon" />
                {{ s.label }}
                <span aria-hidden="true" class="ml-auto text-bone/20 transition-transform group-hover:translate-x-0.5 group-hover:text-marigold-400">↗</span>
              </a>
            </div>
          </div>
        </aside>

        <!-- Prose -->
        <div class="space-y-5 text-[1.05rem] leading-relaxed text-bone/80 md:col-span-8 lg:col-span-9 md:max-w-prose">
          <p>
            I was born in the seventies and grew up in Germany at a time when home
            computers started to shape how people think and create. From the C64 and
            Amiga to PCs and Macs, technology was always part of my daily life. I moved
            early into smartphones and smart devices, driven by curiosity and a strong
            interest in how things work.
          </p>
          <p>
            I am a tech enthusiast and a nerd at heart. I enjoy building useful
            applications and small experimental web games, often as prototypes to explore
            ideas fast and learn from them. For me, software is both a craft and a
            playground.
          </p>
          <p>
            Professionally, I work as a software engineering team lead. My main focus is
            to build high throughput teams by creating an environment that supports
            autonomy, trust, and individual growth. I have experience across startups,
            mid size companies, and corporate environments, which helps me adapt my
            leadership style to different contexts.
          </p>
          <p>
            At my core, I believe in people. In their curiosity, their good intentions,
            and their ability to grow when given trust. I believe in people first, in
            trust over control and curiosity over certainty. I try to move through my work
            and everyday life with humility, kindness, and an open mind, because
            meaningful things are built where people feel respected, trusted, and seen.
          </p>
        </div>
      </div>
    </section>

    <!-- ============ WORK ============ -->
    <section id="work" class="scroll-mt-24 border-t border-bone/10 py-20">
      <div class="flex items-end justify-between gap-6">
        <h2 class="font-display text-3xl font-semibold tracking-tight text-bone md:text-4xl">
          Things I've built
        </h2>
        <NuxtLink to="/projects" class="link-underline shrink-0 text-sm font-medium">
          All projects <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>

      <!-- Featured project -->
      <NuxtLink
        v-if="featured"
        :to="featured.linkData[0]?.[0] ?? '/projects'"
        target="_blank"
        rel="noopener noreferrer"
        class="group mt-10 block surface-interactive p-7 md:p-9"
      >
        <div class="flex items-center gap-3">
          <span class="meta-label">Latest build</span>
          <span class="h-px flex-1 bg-bone/10" />
        </div>
        <h3 class="mt-4 font-display text-2xl font-semibold text-bone transition-colors group-hover:text-marigold-300 md:text-3xl">
          {{ featured.title }}
        </h3>
        <p class="mt-3 max-w-2xl leading-relaxed text-bone/70">
          {{ featured.text }}
        </p>
        <div v-if="featured.techList" class="mt-5 flex flex-wrap gap-2">
          <span v-for="tech in parseTechList(featured.techList)" :key="tech" class="tag">{{ tech }}</span>
        </div>
        <div class="mt-6 flex flex-wrap gap-x-5 gap-y-2">
          <span
            v-for="[url, label] in featured.linkData"
            :key="url"
            class="font-mono text-xs text-marigold-400"
          >{{ label }} <span aria-hidden="true">↗</span></span>
        </div>
      </NuxtLink>

      <!-- Rest of the grid -->
      <div class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(project, i) in rest"
          :key="project.title"
          v-reveal="{ delay: i * 70 }"
          class="group flex flex-col surface-interactive p-6"
        >
          <h3 class="font-display text-xl font-semibold text-bone transition-colors group-hover:text-marigold-300">
            {{ project.title }}
          </h3>
          <p class="mt-2.5 flex-1 text-sm leading-relaxed text-bone/65">
            {{ project.text }}
          </p>
          <div v-if="project.techList" class="mt-4 flex flex-wrap gap-1.5">
            <span v-for="tech in parseTechList(project.techList).slice(0, 5)" :key="tech" class="tag">{{ tech }}</span>
          </div>
          <div class="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-bone/10 pt-4">
            <a
              v-for="[url, label] in project.linkData"
              :key="url"
              :href="url"
              target="_blank"
              rel="noopener noreferrer"
              class="font-mono text-xs text-bone/60 transition-colors hover:text-marigold-300"
            >{{ label }} <span aria-hidden="true">↗</span></a>
          </div>
        </article>
      </div>
    </section>

    <!-- ============ WRITING ============ -->
    <section id="writing" class="scroll-mt-24 border-t border-bone/10 py-20">
      <div class="flex items-end justify-between gap-6">
        <h2 class="font-display text-3xl font-semibold tracking-tight text-bone md:text-4xl">
          From the blog
        </h2>
        <NuxtLink to="/blog" class="link-underline shrink-0 text-sm font-medium">
          All writing <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>

      <ul class="mt-8 divide-y divide-bone/10 border-y border-bone/10">
        <li v-for="(article, i) in latestPosts" :key="article.slug" v-reveal="{ delay: i * 80 }" class="group transition-colors duration-300 hover:bg-ink-850/60">
          <div class="flex items-start gap-4 py-6">
            <NuxtLink :to="`/blog/${displayPost(article).slug}`" class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                <time :datetime="displayPost(article).date" class="font-mono text-xs text-marigold-500">
                  {{ formatBlogDate(displayPost(article).date, activeLang(article)) }}
                </time>
              </div>
              <h3 class="mt-2 font-display text-xl font-semibold text-bone transition-colors group-hover:text-marigold-300 md:text-2xl">
                {{ displayPost(article).title }}
              </h3>
              <p class="mt-1.5 line-clamp-2 text-sm leading-relaxed text-bone/60">
                {{ displayPost(article).description }}
              </p>
            </NuxtLink>
            <div class="flex flex-col items-end gap-3">
              <div v-if="getTranslation(article)" class="inline-flex rounded-full border border-bone/15 p-0.5">
                <button
                  v-for="lang in ['en', 'de']"
                  :key="lang"
                  class="rounded-full px-2 py-0.5 font-mono text-[11px] transition-colors duration-200"
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
    </section>

    <!-- ============ CLUSTER ============ -->
    <section id="cluster" class="scroll-mt-24 border-t border-bone/10 py-20">
      <div class="rounded-2xl border border-bone/10 bg-gradient-to-br from-ink-800 to-ink-850 p-7 md:p-10">
        <div class="grid gap-10 lg:grid-cols-12">
          <div class="lg:col-span-7">
            <h2 class="font-display text-3xl font-semibold tracking-tight text-bone md:text-4xl">
              A cluster of Raspberry Pis
            </h2>
            <p class="mt-4 max-w-prose leading-relaxed text-bone/70">
              I run a bare-metal Kubernetes cluster on six Raspberry Pi nodes. It hosts
              my personal projects and doubles as a playground for cloud-native tooling.
            </p>
            <dl class="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
              <div v-for="stat in clusterStats" :key="stat.label">
                <dd v-count="{ to: stat.to, suffix: stat.suffix }" class="font-display text-3xl font-semibold tabular-nums text-marigold-400">{{ stat.to }}{{ stat.suffix }}</dd>
                <dt class="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-bone/45">{{ stat.label }}</dt>
              </div>
            </dl>
            <NuxtLink to="/k8s-portal" class="btn-ghost mt-9">
              Explore the cluster <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>

          <div class="lg:col-span-5">
            <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-bone/40">Running services</p>
            <ul class="mt-4 divide-y divide-bone/10 border-t border-bone/10">
              <li v-for="item in k8sPortalItemsPreview" :key="item.title" class="py-3.5">
                <p class="font-display font-semibold text-bone">{{ item.title }}</p>
                <p class="mt-0.5 line-clamp-1 text-sm text-bone/55">{{ item.text }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { type BlogPost, getDeduplicatedPosts, getTranslation, formatBlogDate } from '~/data/blog-posts'
import { projects as allProjects, parseTechList } from '~/data/projects'
import { k8sPortalItems as allK8sPortalItems } from '~/data/k8s-portal'

const featured = computed(() => allProjects[0])
const rest = computed(() => allProjects.slice(1, 6))

const k8sPortalItemsPreview = computed(() => allK8sPortalItems.slice(0, 3))

const latestPosts = computed(() => {
  return [...getDeduplicatedPosts()]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
})

const facts = [
  { k: 'Role', v: 'Software engineering team lead' },
  { k: 'Focus', v: 'High-trust, high-throughput teams' },
  { k: 'Building since', v: 'The C64 & Amiga days' },
]

const clusterStats = [
  { to: 6, suffix: '', label: 'Pi nodes' },
  { to: 48, suffix: ' GB', label: 'total RAM' },
  { to: 2, suffix: '', label: 'control plane' },
  { to: 4, suffix: '', label: 'workers' },
]

// Real brand marks (Simple Icons style) kept as-is; UI arrows are text glyphs.
const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/oglimmer',
    icon: '<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/oliver-zimpasser',
    icon: '<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  },
  {
    label: 'Docker Hub',
    href: 'https://hub.docker.com/u/oglimmer',
    icon: '<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338 0-.676.03-1.01.09-.156-1.615-1.463-2.52-1.54-2.565l-.32-.193-.213.291c-.295.434-.474.918-.53 1.415-.088.751.123 1.48.588 2.048-.543.262-1.46.51-2.714.51h-14.753c-.483 0-.887.384-.904.866-.035.975.064 2.01.334 3.022.307 1.158.908 2.163 1.785 2.988 1.058.99 2.76 1.493 5.06 1.493 1.076 0 2.136-.126 3.153-.376 1.238-.305 2.413-.769 3.492-1.38 1.01-.571 1.88-1.283 2.59-2.116.936-1.097 1.62-2.308 2.037-3.602h.174c1.063 0 1.955-.387 2.65-1.151.333-.366.604-.79.81-1.263l.11-.25-.302-.195z"/></svg>',
  },
]

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
