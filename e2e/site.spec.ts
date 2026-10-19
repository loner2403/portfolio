import { expect, test, type Page } from '@playwright/test'
import { GENERAL_INFO, HERO_STATS, MY_EXPERIENCE, PRINCIPLES, PROJECTS, RESUME_SKILL_GROUPS, SYSTEMS } from '../src/lib/data'

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

  test('résumé link resolves', async ({ page, request }) => {
    await gotoReady(page)
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

  test('contact is a signal colour block with readable ink', async ({ page }) => {
    await gotoReady(page)
    const colours = await page.locator('#contact').evaluate((el) => {
      const style = getComputedStyle(el)
      const heading = el.querySelector('h2') as HTMLElement
      return { bg: style.backgroundColor, ink: getComputedStyle(heading).color }
    })
    expect(colours.bg).toBe('rgb(255, 232, 153)')
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
    expect(footer).toContain('Instrument Serif')
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
      expect(['rgb(255, 232, 153)', 'rgb(255, 206, 148)', 'rgb(255, 138, 101)']).toContain(bg)
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

  test('404 is a coral block with a heading and a way back', async ({ page }) => {
    await gotoReady(page, '/projects/does-not-exist')
    const block = page.getByTestId('not-found')
    const colours = await block.evaluate((el) => ({
      bg: getComputedStyle(el).backgroundColor,
      ink: getComputedStyle(el.querySelector('h1') as HTMLElement).color,
    }))
    expect(colours.bg).toBe('rgb(255, 138, 101)')
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
    const wipe = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('div.fixed.inset-0')).filter(
        (el) => getComputedStyle(el).backgroundColor === 'rgb(255, 232, 153)',
      ).length,
    )
    expect(wipe).toBe(0)
  })
})
