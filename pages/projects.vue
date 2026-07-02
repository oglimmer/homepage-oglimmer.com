<template>
  <div>
    <header class="max-w-2xl py-10">
      <p class="meta-label">the workbench</p>
      <h1 class="mt-4 font-display text-5xl font-semibold tracking-tight text-bone md:text-6xl">
        All projects
      </h1>
      <p class="mt-4 leading-relaxed text-bone/70">
        Applications, web games, and open source experiments. Some are polished,
        some are prototypes I built to learn something fast.
      </p>
    </header>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="(project, i) in projects"
        :key="project.title"
        v-reveal="{ delay: (i % 3) * 70 }"
        class="group flex flex-col surface-interactive p-6"
      >
        <h2 class="font-display text-xl font-semibold text-bone transition-colors group-hover:text-marigold-300">
          {{ project.title }}
        </h2>
        <p class="mt-2.5 flex-1 text-sm leading-relaxed text-bone/65">
          {{ project.text }}
        </p>
        <div v-if="project.techList" class="mt-4 flex flex-wrap gap-1.5">
          <span v-for="tech in parseTechList(project.techList)" :key="tech" class="tag">{{ tech }}</span>
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

    <section class="mt-24">
      <header class="max-w-2xl">
        <h2 class="font-display text-3xl font-semibold tracking-tight text-bone/50 md:text-4xl">
          Legacy projects
        </h2>
        <p class="mt-3 leading-relaxed text-bone/40">
          Archived experiments and older projects, kept around as historical artifacts.
        </p>
      </header>

      <div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(project, i) in legacyProjects"
          :key="project.title"
          v-reveal="{ delay: (i % 3) * 70 }"
          class="group flex flex-col rounded-2xl border border-bone/10 bg-ink-900 p-6 transition-colors duration-300 hover:border-bone/25"
        >
          <h3 class="font-display text-lg font-semibold text-bone/90">
            {{ project.title }}
          </h3>
          <p class="mt-2.5 flex-1 text-sm leading-relaxed text-bone/55">
            {{ project.text }}
          </p>
          <div v-if="project.techList" class="mt-4 flex flex-wrap gap-1.5">
            <span v-for="tech in parseTechList(project.techList)" :key="tech" class="tag">{{ tech }}</span>
          </div>
          <div class="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-bone/10 pt-4">
            <a
              v-for="[url, label] in project.linkData"
              :key="url"
              :href="url"
              target="_blank"
              rel="noopener noreferrer"
              class="font-mono text-xs text-bone/55 transition-colors hover:text-marigold-300"
            >{{ label }} <span aria-hidden="true">↗</span></a>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { projects, legacyProjects, parseTechList } from '~/data/projects'
</script>
