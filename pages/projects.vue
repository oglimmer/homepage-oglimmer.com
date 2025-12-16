<template>
  <div class="max-w-6xl mx-auto">
    <div class="mb-12">
      <div class="flex items-center mb-4">
        <div class="w-1 h-16 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full mr-4"></div>
        <div>
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-2">
            All Projects
          </h1>
          <p class="text-lg text-white/70">
            A complete collection of my applications, games, and open source contributions
          </p>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="project in projects" :key="project.title" class="group backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/20">
        <div class="p-6 relative">
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full filter blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <div class="relative">
            <h3 class="text-xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors">
              {{ project.title }}
            </h3>
            <p class="text-white/70 mb-4 text-sm min-h-[3rem]">
              {{ project.text }}
            </p>
            <div v-if="project.techList" class="flex flex-wrap gap-2 mb-4">
              <span v-for="tech in parseTechList(project.techList)" :key="tech" class="text-xs bg-primary-500/20 border border-primary-400/30 text-primary-200 px-2 py-1 rounded-full backdrop-blur-sm">
                {{ tech }}
              </span>
            </div>
            <div class="flex flex-wrap gap-2 mt-4">
              <a v-for="[url, label] in project.linkData" :key="url" :href="url" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-primary-300 hover:text-primary-200 font-semibold text-xs group/link">
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
  </div>
</template>

<script setup lang="ts">
import { projects, parseTechList } from '~/data/projects'
</script>
