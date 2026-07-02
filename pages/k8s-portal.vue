<template>
  <div>
    <header class="py-10">
      <p class="meta-label">home lab</p>
      <h1 class="mt-4 font-display text-5xl font-semibold tracking-tight text-bone md:text-6xl">
        The cluster
      </h1>
      <p class="mt-4 max-w-2xl leading-relaxed text-bone/70">
        A bare-metal Kubernetes cluster on six Raspberry Pi nodes: two control plane
        nodes, four workers, 48 GB of RAM in total. It hosts my personal projects and
        is where I explore cloud-native tooling. Below are the services I use to run and
        monitor it.
      </p>

      <dl class="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 sm:max-w-2xl">
        <div v-for="stat in clusterStats" :key="stat.label">
          <dd v-count="{ to: stat.to, suffix: stat.suffix }" class="font-display text-3xl font-semibold tabular-nums text-marigold-400">{{ stat.to }}{{ stat.suffix }}</dd>
          <dt class="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-bone/45">{{ stat.label }}</dt>
        </div>
      </dl>
    </header>

    <div class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="(item, i) in k8sPortalItems"
        :key="item.title"
        v-reveal="{ delay: (i % 3) * 70 }"
        class="group flex flex-col surface-interactive p-6"
      >
        <h2 class="font-display text-xl font-semibold text-bone transition-colors group-hover:text-marigold-300">
          {{ item.title }}
        </h2>
        <p class="mt-2.5 flex-1 text-sm leading-relaxed text-bone/65">
          {{ item.text }}
        </p>
        <div v-if="item.techList" class="mt-4 flex flex-wrap gap-1.5">
          <span v-for="tech in parseTechList(item.techList)" :key="tech" class="tag">{{ tech }}</span>
        </div>
        <div class="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-bone/10 pt-4">
          <a
            v-for="[url, label] in item.linkData"
            :key="url"
            :href="url"
            target="_blank"
            rel="noopener noreferrer"
            class="font-mono text-xs text-bone/60 transition-colors hover:text-marigold-300"
          >{{ label }} <span aria-hidden="true">↗</span></a>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { k8sPortalItems, parseTechList } from '~/data/k8s-portal'

const clusterStats = [
  { to: 6, suffix: '', label: 'Pi nodes' },
  { to: 48, suffix: ' GB', label: 'total RAM' },
  { to: 2, suffix: '', label: 'control plane' },
  { to: 4, suffix: '', label: 'workers' },
]
</script>
