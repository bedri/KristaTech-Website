import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const rootDir = resolve(import.meta.dirname, '..')
const appVue = readFileSync(resolve(rootDir, 'app/app.vue'), 'utf8')
const indexVue = readFileSync(resolve(rootDir, 'app/pages/index.vue'), 'utf8')
const mainCss = readFileSync(resolve(rootDir, 'app/assets/css/main.css'), 'utf8')

describe('Template Security, Accessibility & Brand Compliance (app/app.vue & app/pages/index.vue)', () => {
  it('contains zero dangerous DOM sinks (v-html, innerHTML, outerHTML, document.write, eval)', () => {
    const dangerousPatterns = [
      /\bv-html\b/,
      /\.innerHTML\b/,
      /\.outerHTML\b/,
      /\bdocument\.write\s*\(/,
      /\beval\s*\(/,
      /\bsetHTMLUnsafe\s*\(/
    ]
    for (const pattern of dangerousPatterns) {
      assert.doesNotMatch(appVue, pattern, `app/app.vue must not match ${pattern}`)
      assert.doesNotMatch(indexVue, pattern, `app/pages/index.vue must not match ${pattern}`)
    }
  })

  it('enforces rel="noopener noreferrer" on every external target="_blank" link', () => {
    for (const [name, content] of [
      ['app/app.vue', appVue],
      ['app/pages/index.vue', indexVue]
    ] as const) {
      const anchorTags = content.match(/<a\b[^>]*target="_blank"[^>]*>/g) || []
      assert.ok(anchorTags.length > 0, `Expected external links in ${name}`)
      for (const tag of anchorTags) {
        assert.match(
          tag,
          /rel="noopener noreferrer"/,
          `External link in ${name} is missing rel="noopener noreferrer": ${tag}`
        )
      }
    }
  })

  it('marks all decorative inline SVGs with aria-hidden="true"', () => {
    for (const [name, content] of [
      ['app/app.vue', appVue],
      ['app/pages/index.vue', indexVue]
    ] as const) {
      const svgTags = content.match(/<svg\b[^>]*>/g) || []
      assert.ok(svgTags.length > 0, `Expected inline SVGs in ${name}`)
      for (const tag of svgTags) {
        assert.match(tag, /aria-hidden="true"/, `SVG in ${name} is missing aria-hidden="true": ${tag}`)
      }
    }
  })

  it('includes accessible skip link, focusable main landmark, and color-scheme metadata', () => {
    assert.match(appVue, /href="#main-content"/)
    assert.match(appVue, /<main[\s\S]*?id="main-content"[\s\S]*?tabindex="-1"/)
    assert.match(appVue, /name:\s*'color-scheme'/)
    assert.match(appVue, /content:\s*'light dark'/)
  })

  it('preserves logo brand hex colors (#7695CD and #F5897C) and reduced-motion fallbacks in CSS', () => {
    assert.match(mainCss, /#7695cd/i)
    assert.match(mainCss, /#f5897c/i)
    assert.match(mainCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)/)
    assert.match(mainCss, /@supports\s+not\s*\(scrollbar-color:\s*auto\)/)
  })
})
