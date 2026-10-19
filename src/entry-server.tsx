import { prerenderToNodeStream } from 'react-dom/static'
import { StaticRouter } from 'react-router'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import App from './App'
import { PROJECTS, SYSTEMS } from '@/lib/data'
import { SITE_DESCRIPTION, SITE_TITLE, truncate } from '@/lib/seo'

const SITE_URL = 'https://harshallade.site'

function readStream(stream: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = ''
    stream.setEncoding('utf8')
    stream.on('data', (chunk: string) => {
      html += chunk
    })
    stream.on('end', () => resolve(html))
    stream.on('error', reject)
  })
}

export async function render(url: string): Promise<string> {
  const { prelude } = await prerenderToNodeStream(
    <StaticRouter location={url}>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation}>
          <App />
        </LazyMotion>
      </MotionConfig>
    </StaticRouter>,
  )

  return readStream(prelude)
}

export const ROUTES: string[] = [
  '/',
  ...PROJECTS.map((project) => `/projects/${project.slug}`),
  ...SYSTEMS.map((system) => `/systems/${system.slug}`),
]

function toPlainText(text: string): string {
  return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function routeMeta(url: string): { title: string; description: string; canonical: string } {
  const path = url.split(/[?#]/)[0].replace(/\/+$/, '') || '/'

  if (path === '/') {
    return {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      canonical: `${SITE_URL}/`,
    }
  }

  const system = SYSTEMS.find((item) => `/systems/${item.slug}` === path)
  if (system) {
    return {
      title: `${system.title} | Harshal Lade`,
      description: truncate(system.summary, 155),
      canonical: `${SITE_URL}/systems/${system.slug}`,
    }
  }

  const project = PROJECTS.find((item) => `/projects/${item.slug}` === path)

  if (!project) {
    return {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      canonical: `${SITE_URL}/`,
    }
  }

  return {
    title: `${project.title} | Harshal Lade`,
    description: truncate(toPlainText(project.description), 155),
    canonical: `${SITE_URL}/projects/${project.slug}`,
  }
}
