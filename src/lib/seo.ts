import { useEffect } from 'react'

const SITE_URL = 'https://harshallade.site'

export const SITE_TITLE = 'Harshal Lade | Software Engineer, AI & Data Platforms'

export const SITE_DESCRIPTION =
  'Harshal Lade builds LLM agent workflows, RAG systems and data pipelines. Software Engineer, AI & Data Platforms, Mumbai.'

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  const slice = text.slice(0, max)
  const boundary = slice.lastIndexOf(' ')
  const base = boundary > 0 ? slice.slice(0, boundary) : slice
  return `${base.trimEnd()}…`
}

function applyMeta(
  attribute: 'name' | 'property',
  key: string,
  content: string,
  restores: Array<() => void>,
): void {
  const existing = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  const meta = existing ?? document.createElement('meta')
  if (!existing) {
    meta.setAttribute(attribute, key)
    document.head.appendChild(meta)
  }
  const previous = existing?.getAttribute('content') ?? null
  meta.setAttribute('content', content)
  restores.push(() => {
    if (!existing) {
      meta.remove()
      return
    }
    if (previous === null) meta.removeAttribute('content')
    else meta.setAttribute('content', previous)
  })
}

function applyCanonical(href: string, restores: Array<() => void>): void {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  const link = existing ?? document.createElement('link')
  if (!existing) {
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  const previous = existing?.getAttribute('href') ?? null
  link.setAttribute('href', href)
  restores.push(() => {
    if (!existing) {
      link.remove()
      return
    }
    if (previous === null) link.removeAttribute('href')
    else link.setAttribute('href', previous)
  })
}

type DocumentMeta = {
  title: string
  description: string
  path: string
  noindex?: boolean
}

export function useDocumentMeta({ title, description, path, noindex }: DocumentMeta): void {
  useEffect(() => {
    const url = `${SITE_URL}${path}`
    const robots = noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'
    const restores: Array<() => void> = []

    const previousTitle = document.title
    document.title = title
    restores.push(() => {
      document.title = previousTitle
    })

    applyMeta('name', 'description', description, restores)
    applyCanonical(url, restores)
    applyMeta('property', 'og:title', title, restores)
    applyMeta('property', 'og:description', description, restores)
    applyMeta('property', 'og:url', url, restores)
    applyMeta('name', 'twitter:title', title, restores)
    applyMeta('name', 'twitter:description', description, restores)
    applyMeta('name', 'robots', robots, restores)

    return () => {
      restores.forEach((restore) => restore())
    }
  }, [title, description, path, noindex])
}
