# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal homepage built with Nuxt 3, featuring a projects showcase and blog. The site uses a flat-file architecture where all content (projects and blog posts) is stored as TypeScript data files rather than in a CMS or database.

Motto: "coding is the new knitting"

## Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start development server (default: http://localhost:3000)
npm run build        # Build for production
npm run generate     # Generate static site
npm run preview      # Preview production build
```

### Linting
The project uses ESLint with Nuxt's default configuration. ESLint is configured via `eslint.config.mjs` which imports `.nuxt/eslint.config.mjs`.

## Architecture

### Content Management System
This is a **flat-file CMS** where all content lives in TypeScript files:

- **Projects** (`data/projects.ts`): Array of `Project` objects with:
  - `title`: Project name
  - `text`: Description
  - `linkData`: Array of `[url, label]` tuples for links
  - `techList`: Optional string like `"[Vue, TypeScript, Node.js]"` (parsed by `parseTechList()`)

- **Blog Posts** (`data/blog-posts.ts`): Array of `BlogPost` objects with:
  - `slug`: URL-friendly identifier for routing
  - `title`: Post title
  - `description`: Brief summary (used in lists/previews)
  - `date`: Publication date string
  - `content`: Full markdown content (rendered with `marked` library)

### Routing Structure
- `/` - Homepage (`pages/index.vue`): Shows intro, featured projects, and recent blog posts
- `/projects` - All projects listing (`pages/projects.vue`)
- `/blog` - Blog post list (`pages/blog/index.vue`)
- `/blog/[slug]` - Individual blog post (`pages/blog/[...slug].vue`)
- `/privacy` - Privacy & Cookie Policy
- `/imprint` - Legal imprint (Impressum) for German compliance

### Component Structure
- `app.vue`: Root layout with animated background (gradient, grid pattern, floating orbs)
- `components/Header.vue`: Navigation header
- `components/Footer.vue`: Site footer

### Styling System
- **Tailwind CSS** with custom theme extension (`tailwind.config.js`)
- Custom color palette: `primary` (blues) and `navy` (dark blues)
- Custom animations: `float`, `glow`, `gradient`
- Dark mode support via `class` strategy
- Typography plugin (`@tailwindcss/typography`) for markdown rendering

### Key Dependencies
- **Nuxt 4.2.2**: Vue 3 framework
- **marked**: Markdown parser for blog content
- **@nuxtjs/tailwindcss**: Tailwind integration
- **@nuxt/eslint**: Linting setup

## Important Notes

- Blog posts use `marked` library for markdown rendering, not Nuxt Content
- Tech lists in projects are stored as strings (e.g., `"[Vue, Node]"`) and parsed with `parseTechList()`
- The site has a distinctive animated background with floating orbs and gradient animations
- Links in the navigation use `NuxtLink` for client-side routing
- The symlink `dist -> .output/public` points to the Nuxt build output
