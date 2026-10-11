import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'vite'

const root = process.cwd()
const distDir = path.join(root, 'dist')
const distServerDir = path.join(root, 'dist-server')
const templatePath = path.join(distDir, 'index.html')

await build({
  configFile: path.join(root, 'vite.config.ts'),
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: 'dist-server',
    emptyOutDir: true,
  },
  plugins: [
    {
      name: 'prerender:strip-client-chunks',
      config(config) {
        delete config.build?.rollupOptions?.output?.manualChunks
      },
    },
  ],
})

const template = fs.readFileSync(templatePath, 'utf8')

const { render, ROUTES, routeMeta } = await import(
  pathToFileURL(path.join(distServerDir, 'entry-server.js')).href
)

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function replaceTag(html, pattern, value, label, route) {
  if (!pattern.test(html)) throw new Error(`${route}: no ${label} tag found in dist/index.html`)
  return html.replace(pattern, (_match, prefix, suffix) => `${prefix}${value}${suffix}`)
}

function buildPage(route, html) {
  const meta = routeMeta(route)
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)
  const canonical = escapeHtml(meta.canonical)

  const rootMarker = '<div id="root"></div>'
  if (!template.includes(rootMarker)) {
    throw new Error('dist/index.html is missing the empty <div id="root"></div>')
  }

  const noscriptPattern = /\s*<noscript>[\s\S]*?<\/noscript>/
  if (!noscriptPattern.test(template)) {
    throw new Error('dist/index.html is missing the <noscript> block')
  }

  let out = template.replace(rootMarker, () => `<div id="root">${html}</div>`)
  out = out.replace(noscriptPattern, '')

  if (!out.includes('<title>')) throw new Error(`${route}: no <title> tag found in dist/index.html`)
  out = out.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${title}</title>`)
  out = replaceTag(
    out,
    /(<meta name="description" content=")[^"]*(")/,
    description,
    'meta description',
    route,
  )
  out = replaceTag(
    out,
    /(<link rel="canonical" href=")[^"]*(")/,
    canonical,
    'canonical link',
    route,
  )
  out = replaceTag(out, /(<meta property="og:title" content=")[^"]*(")/, title, 'og:title', route)
  out = replaceTag(
    out,
    /(<meta property="og:description" content=")[^"]*(")/,
    description,
    'og:description',
    route,
  )
  out = replaceTag(
    out,
    /(<meta property="og:url" content=")[^"]*(")/,
    canonical,
    'og:url',
    route,
  )
  out = replaceTag(
    out,
    /(<meta name="twitter:title" content=")[^"]*(")/,
    title,
    'twitter:title',
    route,
  )
  out = replaceTag(
    out,
    /(<meta name="twitter:description" content=")[^"]*(")/,
    description,
    'twitter:description',
    route,
  )

  return out
}

function outputPath(route) {
  if (route === '/') return templatePath
  return path.join(distDir, route.replace(/^\//, ''), 'index.html')
}

for (const route of ROUTES) {
  const html = await render(route)

  if (!html.trim()) throw new Error(`${route}: prerendered output is empty`)
  if (!/<h1[\s>]/.test(html)) throw new Error(`${route}: prerendered output has no <h1>`)

  const file = outputPath(route)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, buildPage(route, html))
  console.log(`wrote ${file}`)
}

fs.rmSync(distServerDir, { recursive: true, force: true })
