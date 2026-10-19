import { expect, test, type Page } from '@playwright/test'
import { GENERAL_INFO, HERO_STATS, MY_EXPERIENCE, PRINCIPLES, PROJECTS, RESUME_SKILL_GROUPS, SYSTEMS } from '../src/lib/data'
import { STORIES } from '../src/lib/stories'

const SECTION_IDS = ['top', 'systems', 'work', 'log', 'stack', 'contact']
const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]

function watchErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) {
      errors.push(`console: ${message.text()}`)
    }
  })
  page.on('response', (response) => {
    if (response.status() >= 400 && !response.url().includes('/_vercel/')) {
      errors.push(`http ${response.status()}: ${response.url()}`)
    }
  })
  return errors
}

async function gotoReady(page: Page, path = '/') {
  await page.goto((path.startsWith('/projects/') || path.startsWith('/systems/')) && !path.endsWith('/') ? `${path}/` : path)
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === '1')
}

async function settle(page: Page) {
  await page.evaluate(() =>
    Promise.all(document.getAnimations().filter((a) => a.effect?.getTiming().iterations !== Infinity).map((a) => a.finished.catch(() => null))),
  )
}

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.6))
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 60))
    }
    window.scrollTo(0, document.documentElement.scrollHeight)
    await new Promise((resolve) => setTimeout(resolve, 400))
  })
}

function luminance(rgb: number[]): number {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function parseRgb(value: string): number[] {
  const match = value.match(/rgba?\(([^)]+)\)/)
  if (!match) throw new Error(`not an rgb colour: ${value}`)
  return match[1].split(',').slice(0, 3).map((part) => Number.parseFloat(part))
}

function contrast(a: string, b: string): number {
  const la = luminance(parseRgb(a))
  const lb = luminance(parseRgb(b))
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

test.describe('home page', () => {
  test('renders every section without runtime errors', async ({ page }) => {
    const errors = watchErrors(page)
    await gotoReady(page)
    for (const id of SECTION_IDS) {
      await expect(page.locator(`#${id}`)).toHaveCount(1)
    }
    await expect(page.getByTestId('site-header')).toBeVisible()
    await expect(page.getByTestId('system-card')).toHaveCount(SYSTEMS.length)
    await expect(page.getByTestId('work-row')).toHaveCount(PROJECTS.length)
    await expect(page.getByTestId('log-entry')).toHaveCount(MY_EXPERIENCE.length)
    await scrollThrough(page)
    expect(errors).toEqual([])
  })

  for (const viewport of VIEWPORTS) {
    test(`no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await gotoReady(page)
      await scrollThrough(page)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
    })
  }

  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 375, height: 812 },
  ]) {
    test(`hero lead and primary CTA are in the first viewport at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await gotoReady(page)
      await settle(page)
      const hero = page.getByTestId('hero')
      const cta = hero.locator('a[href="#systems"]').first()
      const lead = hero.getByText(GENERAL_INFO.heroLead)
      await expect(cta).toBeVisible()
      await expect(lead).toBeVisible()
      for (const box of [await cta.boundingBox(), await lead.boundingBox(), await hero.locator('h1').boundingBox()]) {
        expect(box).not.toBeNull()
        expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height)
      }
    })
  }

  test('hero name lockup is fully visible inside its mask', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await gotoReady(page)
    await settle(page)
    const outside = await page.evaluate(() => {
      const hero = document.querySelector('[data-testid="hero"]')!
      return Array.from(hero.querySelectorAll<HTMLElement>('.line-mask')).map((mask) => {
        const inner = mask.firstElementChild as HTMLElement
        const a = mask.getBoundingClientRect()
        const b = inner.getBoundingClientRect()
        return Math.abs(a.top - b.top) > 2
      })
    })
    expect(outside.length).toBe(2)
    expect(outside.every((v) => !v)).toBe(true)
  })

  test('exactly one h1 and external links are safe', async ({ page }) => {
    await gotoReady(page)
    await expect(page.locator('h1')).toHaveCount(1)
    const unsafe = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]'))
        .filter((a) => !/noopener/.test(a.rel) || !/noreferrer/.test(a.rel))
        .map((a) => a.href),
    )
    expect(unsafe).toEqual([])
  })

  test('résumé link is shown only when it resolves', async ({ page, request }) => {
    await gotoReady(page)
    const links = page.locator('#contact a', { hasText: 'Résumé' })
    if (!GENERAL_INFO.resumeUrl) {
      await expect(links).toHaveCount(0)
      return
    }
    await expect(links).toHaveCount(1)
    const res = await request.get(GENERAL_INFO.resumeUrl)
    expect(res.status()).toBe(200)
  })

  test('hero has no system index list', async ({ page }) => {
    await gotoReady(page)
    await expect(page.getByTestId('index-row')).toHaveCount(0)
  })

  test('hero lead copy appears exactly once on the page', async ({ page }) => {
    await gotoReady(page)
    const count = await page.evaluate(
      (lead) => document.body.innerText.split(lead).length - 1,
      GENERAL_INFO.heroLead,
    )
    expect(count).toBe(1)
  })

  test('proof band shows every metric once', async ({ page }) => {
    await gotoReady(page)
    const proof = page.getByTestId('proof')
    await expect(proof).toHaveCount(1)
    await expect(proof.getByTestId('metric')).toHaveCount(HERO_STATS.length)
    await expect(page.getByTestId('metrics')).toHaveCount(0)
  })

  test('stack lists every skill as text without chips', async ({ page }) => {
    await gotoReady(page)
    const stack = page.locator('#stack')
    const text = await stack.innerText()
    for (const group of RESUME_SKILL_GROUPS) {
      for (const item of group.items) expect(text).toContain(item)
    }
    await expect(stack.locator('.rounded-sm.border')).toHaveCount(0)
  })

  test('contact is an orange block with readable ink', async ({ page }) => {
    await gotoReady(page)
    const colours = await page.locator('#contact').evaluate((el) => {
      const style = getComputedStyle(el)
      const heading = el.querySelector('h2') as HTMLElement
      return { bg: style.backgroundColor, ink: getComputedStyle(heading).color }
    })
    expect(colours.bg).toBe('rgb(255, 122, 61)')
    expect(contrast(colours.bg, colours.ink)).toBeGreaterThanOrEqual(7)
  })

  test('copy email button confirms the copy', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await gotoReady(page)
    const button = page.getByTestId('copy-email')
    await button.scrollIntoViewIfNeeded()
    await button.click()
    await expect(button).toHaveText('Copied')
    const copied = await page.evaluate(() => navigator.clipboard.readText())
    expect(copied).toBe(GENERAL_INFO.email)
  })

  test('command palette opens with Ctrl+K and closes with Escape', async ({ page }) => {
    await gotoReady(page)
    await page.keyboard.press('Control+k')
    await expect(page.getByTestId('command-palette')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByTestId('command-palette')).toBeHidden()
  })

  test('visible text has no em dash', async ({ page }) => {
    await gotoReady(page)
    const text = await page.evaluate(() => document.body.innerText)
    expect(text.includes('—')).toBe(false)
  })

  test('footer colophon has no repeated adjacent word', async ({ page }) => {
    await gotoReady(page)
    const footer = await page.locator('footer').innerText()
    expect(footer).not.toMatch(/\b(\w+) \1\b/i)
    expect(footer).toContain('Archivo')
    expect(footer).not.toContain('Instrument Serif')
  })
})

test.describe('work and project pages', () => {
  test('every work row opens its project page and back returns home', async ({ page }) => {
    for (const project of PROJECTS) {
      await gotoReady(page)
      const row = page.locator(`[data-testid="work-row"][href="/projects/${project.slug}"]`)
      await row.scrollIntoViewIfNeeded()
      await row.click()
      await expect(page).toHaveURL(new RegExp(`/projects/${project.slug}$`))
      await expect(page.getByTestId('project-detail')).toBeVisible()
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.title)
    }
    await page.getByRole('link', { name: /all work/i }).click()
    await expect(page).toHaveURL(/\/(#work)?$/)
  })

  test('work rows get a colour fill on hover for pointer devices', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await gotoReady(page)
    const row = page.getByTestId('work-row').first()
    await row.scrollIntoViewIfNeeded()
    const fill = row.locator('[data-work-fill]')
    await expect(fill).toHaveCount(1)
    const before = await fill.evaluate((el) => getComputedStyle(el).clipPath)
    await row.hover()
    await page.waitForTimeout(700)
    const after = await fill.evaluate((el) => getComputedStyle(el).clipPath)
    expect(after).not.toBe(before)
  })

  test('filled work rows keep every text node readable', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await gotoReady(page)
    const rows = page.getByTestId('work-row')
    const count = await rows.count()
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i)
      await row.scrollIntoViewIfNeeded()
      await row.hover()
      await page.waitForTimeout(600)
      const pairs = await row.evaluate((el) => {
        const fill = el.querySelector('[data-work-fill]') as HTMLElement
        const bg = getComputedStyle(fill).backgroundColor
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
        const out: { text: string; color: string; bg: string }[] = []
        while (walker.nextNode()) {
          const node = walker.currentNode as Text
          const parent = node.parentElement
          if (!node.textContent?.trim() || !parent || parent.closest('[data-work-preview]')) continue
          out.push({ text: node.textContent.trim(), color: getComputedStyle(parent).color, bg })
        }
        return out
      })
      for (const pair of pairs) {
        expect(contrast(pair.color, pair.bg), `${pair.text} on row ${i}`).toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  test('small controls meet the 44px touch target', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await gotoReady(page)
    const targets = [
      page.getByTestId('cmdk-trigger'),
      page.getByRole('button', { name: 'Menu', exact: true }),
      page.getByTestId('copy-email'),
    ]
    for (const target of targets) {
      await target.scrollIntoViewIfNeeded()
      const box = await target.boundingBox()
      expect(box!.height).toBeGreaterThanOrEqual(44)
    }
  })

  test('project page has a colour header and a visual for every project', async ({ page }) => {
    for (const project of PROJECTS) {
      await gotoReady(page, `/projects/${project.slug}`)
      const header = page.getByTestId('project-header')
      await expect(header).toBeVisible()
      const bg = await header.evaluate((el) => getComputedStyle(el).backgroundColor)
      expect(['rgb(255, 122, 61)', 'rgb(255, 255, 255)', 'rgb(201, 213, 255)']).toContain(bg)
      await expect(page.getByTestId('project-visual')).toHaveCount(1)
    }
  })

  test('project pages load without errors or overflow at 375px', async ({ page }) => {
    const errors = watchErrors(page)
    await page.setViewportSize({ width: 375, height: 812 })
    for (const project of PROJECTS) {
      await gotoReady(page, `/projects/${project.slug}`)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow, project.slug).toBeLessThanOrEqual(0)
      if (!project.liveUrl && !project.sourceCode) {
        await expect(page.getByText('Private codebase, not public')).toBeVisible()
      }
    }
    expect(errors).toEqual([])
  })

  test('keyboard focus fills a work row', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await gotoReady(page)
    const row = page.getByTestId('work-row').first()
    await row.scrollIntoViewIfNeeded()
    await row.focus()
    await page.keyboard.press('Shift+Tab')
    await page.keyboard.press('Tab')
    await page.waitForTimeout(600)
    const clip = await row.locator('[data-work-fill]').evaluate((el) => getComputedStyle(el).clipPath)
    expect(clip).toMatch(/^inset\(0(px)?\)$|^none$/)
  })

  test('unknown slug shows the not found view', async ({ page }) => {
    await gotoReady(page, '/projects/does-not-exist')
    await expect(page.getByTestId('not-found')).toBeVisible()
  })
})

test.describe('V3.4 sections', () => {
  test('how I build lists every principle with its explanation', async ({ page }) => {
    await gotoReady(page)
    const items = page.getByTestId('principle')
    await expect(items).toHaveCount(PRINCIPLES.length)
    for (let i = 0; i < PRINCIPLES.length; i++) {
      await expect(items.nth(i)).toContainText(PRINCIPLES[i].title)
      await expect(items.nth(i)).toContainText(PRINCIPLES[i].line)
    }
  })

  test('404 is a periwinkle block with a heading and a way back', async ({ page }) => {
    await gotoReady(page, '/projects/does-not-exist')
    const block = page.getByTestId('not-found')
    const colours = await block.evaluate((el) => ({
      bg: getComputedStyle(el).backgroundColor,
      ink: getComputedStyle(el.querySelector('h1') as HTMLElement).color,
    }))
    expect(colours.bg).toBe('rgb(201, 213, 255)')
    expect(contrast(colours.bg, colours.ink)).toBeGreaterThanOrEqual(7)
    await expect(page.locator('main h1')).toHaveCount(1)
    await expect(block.locator('a[href="/"]')).toHaveCount(1)
    for (const project of PROJECTS) {
      await expect(block.locator(`a[href="/projects/${project.slug}"]`)).toHaveCount(1)
    }
  })

  test('mobile menu links are large and close the menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await gotoReady(page)
    const toggle = page.getByRole('button', { name: 'Menu', exact: true })
    await toggle.click()
    await expect(page.getByRole('button', { name: 'Close', exact: true })).toHaveAttribute('aria-expanded', 'true')
    const links = page.locator('#mobile-menu a')
    await expect(links).toHaveCount(5)
    for (let i = 0; i < 5; i++) {
      const box = await links.nth(i).boundingBox()
      expect(box!.height).toBeGreaterThanOrEqual(44)
    }
    await page.locator('#mobile-menu').getByRole('link', { name: 'work', exact: true }).click()
    await expect(page.locator('#mobile-menu')).toHaveCount(0)
  })

  test('a covered system card dims as the next one arrives', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await gotoReady(page)
    await page.waitForFunction(() => document.documentElement.classList.contains('motion-ready'), null, { timeout: 15_000 })
    const dimOf = (id: string) =>
      page.locator(`#system-${id} [data-stack-dim]`).evaluate((el) => Number.parseFloat(getComputedStyle(el).opacity))
    expect(await dimOf('S-01')).toBe(0)
    await page.locator('#system-S-03').scrollIntoViewIfNeeded()
    await expect.poll(() => dimOf('S-01'), { timeout: 5000 }).toBeGreaterThan(0.25)
    expect(await dimOf(SYSTEMS[SYSTEMS.length - 1].id)).toBe(0)
  })
})

test.describe('system case studies', () => {
  test('every system card opens its case study with a matching colour header', async ({ page }) => {
    for (const system of SYSTEMS) {
      await gotoReady(page)
      const card = page.locator(`#system-${system.id}`)
      const cardBg = await card.evaluate((el) => getComputedStyle(el).backgroundColor)
      const link = card.getByTestId('case-link')
      await expect(link).toHaveAttribute('href', `/systems/${system.slug}`)
      await link.focus()
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(new RegExp(`/systems/${system.slug}$`))
      await expect(page.getByTestId('system-case')).toBeVisible()
      await expect(page.locator('main h1')).toHaveText(system.title)
      const bg = await page.getByTestId('case-header').evaluate((el) => getComputedStyle(el).backgroundColor)
      expect(bg, system.id).toBe(cardBg)
    }
  })

  test('case pages render every section from the data and only real results', async ({ page }) => {
    for (const system of SYSTEMS) {
      const study = system.caseStudy
      await gotoReady(page, `/systems/${system.slug}`)
      await expect(page.getByTestId('case-problem')).toContainText(study.problem)
      await expect(page.getByTestId('case-built').locator('li')).toHaveCount(study.built.length)
      await expect(page.getByTestId('case-decision')).toHaveCount(study.decisions.length)
      if (study.results.length > 0) {
        const results = page.getByTestId('case-result')
        await expect(results).toHaveCount(study.results.length)
        for (const result of study.results) await expect(page.getByTestId('case-results')).toContainText(result.value)
      } else {
        await expect(page.getByTestId('case-results')).toHaveCount(0)
      }
      await expect(page.getByTestId('case-architecture')).toHaveCount(1)
    }
  })

  test('case pages have no errors or overflow at 375px and chain to the next system', async ({ page }) => {
    const errors = watchErrors(page)
    await page.setViewportSize({ width: 375, height: 812 })
    for (const [index, system] of SYSTEMS.entries()) {
      await gotoReady(page, `/systems/${system.slug}`)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow, system.id).toBeLessThanOrEqual(0)
      const next = SYSTEMS[(index + 1) % SYSTEMS.length]
      await expect(page.getByTestId('case-next')).toHaveAttribute('href', `/systems/${next.slug}`)
    }
    expect(errors).toEqual([])
  })

  test('results rows never leave empty cells', async ({ page }) => {
    for (const viewport of [{ width: 375, height: 812 }, { width: 1440, height: 900 }]) {
      await page.setViewportSize(viewport)
      for (const system of SYSTEMS.filter((s) => s.caseStudy.results.length > 0)) {
        await gotoReady(page, `/systems/${system.slug}`)
        const gap = await page.getByTestId('case-results').evaluate((grid) => {
          const box = grid.getBoundingClientRect()
          const cells = Array.from(grid.children).map((c) => c.getBoundingClientRect())
          const lastRowTop = Math.max(...cells.map((c) => c.top))
          const lastRow = cells.filter((c) => Math.abs(c.top - lastRowTop) < 2)
          const used = lastRow.reduce((sum, c) => sum + c.width, 0)
          return box.width - used - (lastRow.length - 1) * 1
        })
        expect(gap, `${system.id} at ${viewport.width}`).toBeLessThanOrEqual(4)
      }
    }
  })

  test('case footer arrows are separated from their labels', async ({ page }) => {
    await gotoReady(page, `/systems/${SYSTEMS[0].slug}`)
    const text = await page.locator('nav[aria-label="More systems"]').innerText()
    expect(text).not.toMatch(/←\S|\S→/)
  })

  test('unknown system slug shows the not found view', async ({ page }) => {
    await gotoReady(page, '/systems/does-not-exist')
    await expect(page.getByTestId('not-found')).toBeVisible()
  })

  test('command palette opens a case study', async ({ page }) => {
    const system = SYSTEMS[1]
    await gotoReady(page)
    await page.keyboard.press('Control+k')
    const palette = page.getByTestId('command-palette')
    await expect(palette).toBeVisible()
    await palette.locator('input').fill(system.title)
    await palette.getByRole('option', { name: system.title }).first().click()
    await expect(page).toHaveURL(new RegExp(`/systems/${system.slug}$`))
  })
})

test.describe('system case studies without javascript', () => {
  test.use({ javaScriptEnabled: false })

  test('case pages are prerendered', async ({ page }) => {
    for (const system of SYSTEMS) {
      await page.goto(`/systems/${system.slug}/`)
      await expect(page.locator('h1')).toHaveText(system.title)
      await expect(page).toHaveTitle(`${system.title} | Harshal Lade`)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://harshallade.site/systems/${system.slug}`)
    }
  })
})

test.describe('V3.6 readable case studies', () => {
  const studied = [
    ...SYSTEMS.map((s) => ({ path: `/systems/${s.slug}`, study: s.caseStudy, key: `systems-${s.slug}` })),
    ...PROJECTS.filter((p) => p.caseStudy).map((p) => ({ path: `/projects/${p.slug}`, study: p.caseStudy!, key: `projects-${p.slug}` })),
  ]

  test('every case opens with its tl;dr and renders all sections', async ({ page }) => {
    for (const { path, study } of studied) {
      await gotoReady(page, path)
      await expect(page.getByTestId('case-tldr')).toContainText(study.tldr)
      await expect(page.getByTestId('case-problem')).toContainText(study.problem)
      await expect(page.getByTestId('case-built').locator('li')).toHaveCount(study.built.length)
      await expect(page.getByTestId('case-decision')).toHaveCount(study.decisions.length)
      await expect(page.getByTestId('case-result')).toHaveCount(study.results.length)
    }
  })

  test('case text is large enough and lines stay readable', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    for (const { path } of studied) {
      await gotoReady(page, path)
      const m = await page.evaluate(() => {
        const px = (el: Element) => Number.parseFloat(getComputedStyle(el).fontSize)
        const problem = document.querySelector('[data-testid="case-problem"] p') as HTMLElement
        const built = document.querySelector('[data-testid="case-built"] li') as HTMLElement
        const decision = document.querySelector('[data-testid="case-decision"] p') as HTMLElement
        const heading = document.querySelector('[data-testid="case-problem"] h2') as HTMLElement
        return {
          problemSize: px(problem),
          problemMeasure: problem.getBoundingClientRect().width / px(problem),
          builtSize: px(built.querySelector('span:last-child') ?? built),
          decisionSize: px(decision),
          decisionMeasure: decision.getBoundingClientRect().width / px(decision),
          headingSize: px(heading),
        }
      })
      expect(m.problemSize, path).toBeGreaterThanOrEqual(18)
      expect(m.builtSize, path).toBeGreaterThanOrEqual(17)
      expect(m.decisionSize, path).toBeGreaterThanOrEqual(16)
      expect(m.headingSize, path).toBeGreaterThanOrEqual(28)
      expect(m.problemMeasure, path).toBeLessThanOrEqual(36)
      expect(m.decisionMeasure, path).toBeLessThanOrEqual(38)
    }
  })

  test('meeting assistant is listed in work and has no source link', async ({ page }) => {
    await gotoReady(page)
    await expect(page.locator('[data-testid="work-row"][href="/projects/meeting-assistant"]')).toHaveCount(1)
    await gotoReady(page, '/projects/meeting-assistant')
    await expect(page.getByText('Private codebase, not public')).toBeVisible()
    const body = (await page.locator('body').innerText()).toLowerCase()
    expect(body.includes('cluely')).toBe(false)
  })
})

test.describe('share previews without javascript', () => {
  test.use({ javaScriptEnabled: false })

  test('each route points to its own share image', async ({ page }) => {
    const routes = [
      { path: '/', key: 'home' },
      ...SYSTEMS.map((s) => ({ path: `/systems/${s.slug}/`, key: `systems-${s.slug}` })),
      ...PROJECTS.map((p) => ({ path: `/projects/${p.slug}/`, key: `projects-${p.slug}` })),
    ]
    for (const { path, key } of routes) {
      await page.goto(path)
      const url = `https://harshallade.site/og/${key}.png`
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', url)
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', url)
    }
  })
})

test.describe('V3.7 first impression', () => {
  test('hero name uses Archivo Expanded in caps', async ({ page }) => {
    await gotoReady(page)
    await page.evaluate(() => document.fonts.ready)
    const style = await page.locator('[data-testid="hero"] p.font-display').evaluate((el) => {
      const cs = getComputedStyle(el)
      return { family: cs.fontFamily, transform: cs.textTransform, loaded: document.fonts.check('800 64px "Archivo Expanded"') }
    })
    expect(style.family).toContain('Archivo Expanded')
    expect(style.transform).toBe('uppercase')
    expect(style.loaded).toBe(true)
  })

  test('hero actions start animating within 400ms', async ({ page }) => {
    await gotoReady(page)
    const delays = await page.locator('[data-testid="hero"] .fade-up, [data-testid="hero"] .rise').evaluateAll((els) =>
      els.map((el) => Number.parseFloat(getComputedStyle(el).animationDelay) * 1000),
    )
    expect(delays.length).toBeGreaterThan(0)
    for (const d of delays) expect(d).toBeLessThanOrEqual(400)
  })

  test('the hero lead and actions are visible from the first frame', async ({ page }) => {
    await page.goto('/')
    const opacities = await page.locator('[data-testid="hero"] .rise').evaluateAll((els) =>
      els.map((el) => getComputedStyle(el).opacity),
    )
    expect(opacities.length).toBeGreaterThanOrEqual(2)
    for (const o of opacities) expect(o).toBe('1')
  })

  test('mobile layout shift stays under 0.05 on a slow 4G phone', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    const cdp = await page.context().newCDPSession(page)
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 })
    await page.addInitScript(() => {
      ;(window as unknown as { __cls: number }).__cls = 0
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
          if (!entry.hadRecentInput) (window as unknown as { __cls: number }).__cls += entry.value
        }
      }).observe({ type: 'layout-shift', buffered: true })
    })
    await page.goto('/')
    await page.waitForTimeout(5000)
    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls)
    expect(cls).toBeLessThan(0.05)
  })
})

test.describe('V3.7 prerendered head and mobile diagram', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } })

  test('fonts are preloaded and the compact hero diagram is chosen by css', async ({ page }) => {
    await page.goto('/')
    const preloads = await page.locator('link[rel="preload"][as="font"]').evaluateAll((links) =>
      links.map((l) => ({ href: l.getAttribute('href') ?? '', type: l.getAttribute('type'), cross: l.hasAttribute('crossorigin') })),
    )
    expect(preloads.some((p) => p.href.includes('archivo-expanded') && p.type === 'font/woff2' && p.cross)).toBe(true)
    expect(preloads.some((p) => p.href.includes('space-grotesk-latin') && p.type === 'font/woff2' && p.cross)).toBe(true)
    await expect(page.locator('[data-hero-variant="compact"]')).toBeVisible()
    await expect(page.locator('[data-hero-variant="wide"]')).toBeHidden()
  })
})

test.describe('V3.8 paper, stories and mobile', () => {
  test('the page is warm paper', async ({ page }) => {
    await gotoReady(page)
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(243, 241, 236)')
  })

  for (const viewport of [{ width: 1440, height: 900, layout: 'wide' }, { width: 375, height: 812, layout: 'tall' }]) {
    test(`every system card shows its ${viewport.layout} story`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await gotoReady(page)
      for (const system of SYSTEMS) {
        const story = page.locator(`#system-${system.id} [data-story="${system.id}"][data-layout="${viewport.layout}"]`)
        await expect(story).toHaveCount(1)
        await expect(story).toBeVisible()
      }
    })
  }

  test('stories play when scrolled into view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await gotoReady(page)
    const svg = page.locator('#system-S-02 [data-story="S-02"][data-layout="tall"]')
    await svg.scrollIntoViewIfNeeded()
    await expect(svg).toHaveAttribute('data-playing', 'true', { timeout: 8000 })
  })

  test('a story ends its loop with the whole drawing visible', async ({ page }) => {
    test.setTimeout(120_000)
    await page.setViewportSize({ width: 1440, height: 900 })
    await gotoReady(page)
    for (const id of SYSTEMS.map((s) => s.id)) {
      const svg = page.locator(`#system-${id} [data-story="${id}"][data-layout="wide"]`)
      await page.evaluate((sid) => {
        const el = document.getElementById(`system-${sid}`)!
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'instant' as ScrollBehavior })
      }, id)
      await expect(svg).toHaveAttribute('data-playing', 'true', { timeout: 10_000 })
      const lastEnd = Math.max(...STORIES[id].steps.map((st) => st.at + (st.dur ?? 0.6)))
      await page.waitForTimeout(Math.round((0.25 + lastEnd + 0.6) * 1000))
      const hiddenFinal = STORIES[id].wide.els.filter((el) => 'final' in el && el.final === false).map((el) => el.id)
      const invisible = await svg.evaluate((root, skip) => {
        const out: string[] = []
        for (const g of Array.from(root.querySelectorAll('[data-sid]'))) {
          const sid = g.getAttribute('data-sid') ?? ''
          if (skip.includes(sid) || g.getAttribute('data-kind') === 'token') continue
          const parts = [g, ...Array.from(g.querySelectorAll('[data-row], [data-bar], [data-fill]'))]
          if (parts.some((n) => Number.parseFloat(getComputedStyle(n).opacity) < 0.5)) out.push(sid)
        }
        return out
      }, hiddenFinal)
      expect(invisible, id).toEqual([])
    }
  })

  test('reduced motion shows the finished drawing and never plays', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await gotoReady(page)
    const svg = page.locator('#system-S-03 [data-story="S-03"][data-layout="wide"]')
    await svg.scrollIntoViewIfNeeded()
    await page.waitForTimeout(1200)
    await expect(svg).not.toHaveAttribute('data-playing', 'true')
    const finalHidden = [...STORIES['S-03'].wide.els].filter((el) => 'final' in el && el.final === false).map((el) => el.id)
    const hidden = await svg.evaluate((el, skip) =>
      Array.from(el.querySelectorAll('*'))
        .filter((n) => !n.matches('.st-flash, .st-token') && !skip.includes(n.closest('[data-sid]')?.getAttribute('data-sid') ?? ''))
        .filter((n) => getComputedStyle(n).opacity === '0').length,
    finalHidden)
    expect(hidden).toBe(0)
  })

  test('system cards stack on phones', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await gotoReady(page)
    for (const system of SYSTEMS) {
      const position = await page.locator(`#system-${system.id}`).evaluate((el) => getComputedStyle(el).position)
      expect(position, system.id).toBe('sticky')
    }
  })

  test('stacked phone cards fit on a small phone screen', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await gotoReady(page)
    for (const system of SYSTEMS) {
      const h = await page.locator(`#system-${system.id}`).evaluate((el) => el.getBoundingClientRect().height)
      expect(h, system.id).toBeLessThanOrEqual(667 - 72)
    }
  })

  test('the hidden dock is inert and the visible dock is not', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await gotoReady(page)
    const dock = page.getByTestId('mobile-dock')
    await expect(dock).toHaveAttribute('inert', '')
    await page.waitForFunction(() => document.documentElement.classList.contains('motion-ready'), null, { timeout: 15_000 })
    await page.evaluate(() => window.scrollTo({ top: document.getElementById('systems')!.offsetTop, behavior: 'instant' as ScrollBehavior }))
    await expect(dock).toHaveAttribute('data-visible', 'true')
    await expect(dock).not.toHaveAttribute('inert', '')
  })

  test('phone dock appears after the hero and its links work', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await gotoReady(page)
    const dock = page.getByTestId('mobile-dock')
    await expect(dock).toHaveAttribute('data-visible', 'false')
    await page.waitForFunction(() => document.documentElement.classList.contains('motion-ready'), null, { timeout: 15_000 })
    await page.evaluate(() => window.scrollTo({ top: document.getElementById('systems')!.offsetTop, behavior: 'instant' as ScrollBehavior }))
    await expect(dock).toHaveAttribute('data-visible', 'true')
    const links = dock.locator('a, button')
    await expect(links).toHaveCount(4)
    for (let i = 0; i < 4; i++) expect((await links.nth(i).boundingBox())!.height).toBeGreaterThanOrEqual(44)
    await dock.getByRole('link', { name: 'Work' }).click()
    await expect(page).toHaveURL(/#work$/)
  })

  test('no phone dock on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await gotoReady(page)
    await expect(page.getByTestId('mobile-dock')).toBeHidden()
  })

  test('case pages include a how-it-works story', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    for (const system of SYSTEMS) {
      await gotoReady(page, `/systems/${system.slug}`)
      await expect(page.getByTestId('case-story').locator(`[data-story="${system.id}"][data-layout="wide"]`)).toBeVisible()
    }
  })
})

test.describe('touch devices', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })

  test('work rows do not fill on tap', async ({ page }) => {
    await gotoReady(page)
    const row = page.getByTestId('work-row').first()
    await row.scrollIntoViewIfNeeded()
    const clip = await row.locator('[data-work-fill]').evaluate((el) => getComputedStyle(el).clipPath)
    expect(clip).toMatch(/^inset\(100%/)
  })
})

test.describe('without javascript', () => {
  test.use({ javaScriptEnabled: false })

  test('prerendered html shows the hero and every section', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    for (const id of SECTION_IDS) await expect(page.locator(`#${id}`)).toHaveCount(1)
    await expect(page.getByTestId('work-row')).toHaveCount(PROJECTS.length)
  })
})

test.describe('reduced motion', () => {
  test('nothing is left hidden and no wipe runs', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await gotoReady(page)
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)
    await scrollThrough(page)
    const hidden = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll<HTMLElement>('[data-reveal], [data-testid="hero"] *'),
      )
        .filter((el) => {
          const style = getComputedStyle(el)
          const rect = el.getBoundingClientRect()
          if (rect.width === 0 || rect.height === 0) return false
          const clipped = style.clipPath !== 'none' && !/^inset\(0(px)?( 0(px)?)*\)$/.test(style.clipPath)
          return style.opacity === '0' || clipped
        })
        .map((el) => el.outerHTML.slice(0, 120)),
    )
    expect(hidden).toEqual([])
    await page.getByTestId('work-row').first().click()
    await expect(page.getByTestId('project-detail')).toBeVisible()
    const wipe = await page.evaluate(() => document.querySelectorAll('div.fixed.inset-0[aria-hidden="true"]').length)
    expect(wipe).toBe(0)
  })
})
