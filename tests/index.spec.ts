import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

describe('Landing page', () => {
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  const indexPath = resolve(__dirname, '../pages/index.vue')
  const content = readFileSync(indexPath, 'utf-8')

  it('contains the pun tagline', () => {
    expect(content).toContain('This page intentionally left punny')
  })
})
