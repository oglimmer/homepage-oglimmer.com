# Personal Homepage v4

A modern personal homepage built with Nuxt 3, featuring projects, blog, and more.

## Motto
"coding is the new knitting"

## Features

- Modern, responsive design with Tailwind CSS
- Homepage with personal bio
- Projects showcase
- Blog with Nuxt Content
- Privacy & Cookie Policy
- Imprint (Impressum) for German legal compliance
- Dark mode support

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Content Management

### Adding/Editing Projects

Projects are managed in `data/projects.ts`. Each project has:
- `title`: Project name
- `text`: Description
- `linkData`: Array of [url, label] pairs for links
- `techList`: Optional string with technologies (e.g., "[Vue, TypeScript, Node.js]")

### Adding Blog Posts

Blog posts are managed in `data/blog-posts.ts`. Each post includes:
- `slug`: URL-friendly identifier
- `title`: Post title
- `description`: Brief summary
- `date`: Publication date
- `content`: Markdown content (rendered with marked library)

### Personal Information

Update the imprint page at `pages/imprint.vue` with your actual contact information.

## Structure

```
├── app.vue                 # Main app wrapper
├── components/
│   ├── Header.vue         # Navigation header
│   └── Footer.vue         # Site footer
├── pages/
│   ├── index.vue          # Homepage with intro, projects, and blog teasers
│   ├── projects.vue       # All projects page
│   ├── blog/
│   │   ├── index.vue      # Blog list
│   │   └── [...slug].vue  # Individual blog posts
│   ├── privacy.vue        # Privacy & Cookie Policy
│   └── imprint.vue        # Imprint (Impressum)
└── data/
    ├── projects.ts        # All project data
    └── blog-posts.ts      # All blog posts with markdown content
```

## TODO

- [ ] Add more blog posts to `data/blog-posts.ts`
- [ ] Consider adding social media links
- [ ] Add analytics if needed

## Technologies

- Nuxt 3
- Vue 3
- Tailwind CSS
- @tailwindcss/typography
- marked (Markdown parser)

Check out the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.
