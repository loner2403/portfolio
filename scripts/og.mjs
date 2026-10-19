import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public', 'og')
const { SYSTEMS, PROJECTS } = await import(pathToFileURL(path.join(root, 'src/lib/data.ts')).href)

const fontDir = path.join(root, 'node_modules/@fontsource/instrument-serif/files')
let fontFile = path.join(fontDir, 'instrument-serif-latin-400-normal.woff2')
if (!fs.existsSync(fontFile)) {
  const match = fs.readdirSync(fontDir).find((name) => name.endsWith('latin-400-normal.woff2'))
  if (!match) throw new Error(`no latin-400-normal.woff2 in ${fontDir}`)
  fontFile = path.join(fontDir, match)
}
const fontBase64 = fs.readFileSync(fontFile).toString('base64')

const CARDS = ['#FF7036', '#EDE8DD', '#A8BDFF']

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function truncateLine(text, max = 160) {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 3)
  const space = cut.lastIndexOf(' ')
  return `${cut.slice(0, space > 0 ? space : cut.length).trimEnd()}...`
}

const entries = [
  {
    key: 'home',
    kicker: 'HARSHAL LADE · SOFTWARE ENGINEER',
    title: 'Harshal Lade',
    line: 'I build the agent and data systems behind AI products.',
    accent: '#FF7036',
  },
  ...SYSTEMS.map((system, i) => ({
    key: `systems-${system.slug}`,
    kicker: `HARSHAL LADE · CASE STUDY · ${system.id}`,
    title: system.title,
    line: system.caseStudy.tldr,
    accent: CARDS[i % 3],
  })),
  ...PROJECTS.map((project, i) => ({
    key: `projects-${project.slug}`,
    kicker: `HARSHAL LADE · PROJECT · ${project.year}`,
    title: project.title,
    line: truncateLine(project.caseStudy?.tldr ?? project.description.split('\n\n')[0]),
    accent: CARDS[i % 3],
  })),
]

function template(entry) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
@font-face { font-family: 'IS'; src: url(data:font/woff2;base64,${fontBase64}) format('woff2'); }
html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
body { background: #0B0B0B; padding: 72px; box-sizing: border-box; display: flex; flex-direction: column; }
.bar { width: 160px; height: 24px; background: ${entry.accent}; }
.kicker { margin-top: 40px; font-family: monospace; font-size: 22px; letter-spacing: 0.12em; color: #A6A6A6; }
.title { margin: 28px 0 0; font-family: 'IS', serif; font-weight: 400; font-size: 108px; line-height: 0.95; color: #F2F0EB; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
.line { margin: 28px 0 0; max-width: 980px; font-family: system-ui, sans-serif; font-size: 30px; line-height: 1.35; color: #F2F0EB; opacity: 0.85; }
</style>
</head>
<body>
<div class="bar"></div>
<div class="kicker">${escapeHtml(entry.kicker)}</div>
<h1 class="title">${escapeHtml(entry.title)}</h1>
<p class="line">${escapeHtml(entry.line)}</p>
</body>
</html>`
}

fs.mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' })
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  for (const entry of entries) {
    await page.setContent(template(entry), { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    const file = path.join(outDir, `${entry.key}.png`)
    await page.screenshot({ path: file, type: 'png' })
    console.log(`wrote ${path.relative(root, file)}`)
  }
} finally {
  await browser.close()
}
