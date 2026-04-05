import { projects } from '~/data/projects'
import { getDeduplicatedPosts } from '~/data/blog-posts'

const SITE_URL = 'https://oglimmer.com'
const SITE_TITLE = 'oglimmer - coding is the new knitting'
const SITE_DESCRIPTION = 'Latest projects and blog posts from oglimmer'

interface FeedItem {
  title: string
  link: string
  description: string
  guid: string
  pubDate?: string
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildItem(item: FeedItem): string {
  const parts = [
    `<title>${escapeXml(item.title)}</title>`,
    `<link>${escapeXml(item.link)}</link>`,
    `<guid isPermaLink="false">${escapeXml(item.guid)}</guid>`,
    `<description>${escapeXml(item.description)}</description>`,
  ]
  if (item.pubDate) parts.push(`<pubDate>${item.pubDate}</pubDate>`)
  return `<item>${parts.join('')}</item>`
}

export default defineEventHandler((event) => {
  const blogItems: FeedItem[] = getDeduplicatedPosts()
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(post => ({
      title: post.title,
      link: `${SITE_URL}/blog/${post.slug}`,
      description: post.description,
      guid: `blog:${post.slug}`,
      pubDate: new Date(post.date).toUTCString(),
    }))

  const projectItems: FeedItem[] = projects.map((project, index) => ({
    title: `Project: ${project.title}`,
    link: project.linkData[0]?.[0] ?? `${SITE_URL}/projects`,
    description: project.text,
    guid: `project:${index}:${project.title}`,
  }))

  const items = [...blogItems, ...projectItems].slice(0, 30)
  const lastBuildDate = new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXml(SITE_TITLE)}</title>
<link>${SITE_URL}</link>
<description>${escapeXml(SITE_DESCRIPTION)}</description>
<language>en</language>
<lastBuildDate>${lastBuildDate}</lastBuildDate>
<atom:link href="${SITE_URL}/rss" rel="self" type="application/rss+xml" />
${items.map(buildItem).join('\n')}
</channel>
</rss>`

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return xml
})
