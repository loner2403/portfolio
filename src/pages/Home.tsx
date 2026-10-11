import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_DESCRIPTION, SITE_TITLE, useDocumentMeta } from '@/lib/seo'
import { scrollToTarget } from '@/motion/bus'
import Hero from '@/components/home/Hero'
import Metrics from '@/components/home/Metrics'
import Systems from '@/components/home/Systems'
import Work from '@/components/home/Work'
import Log from '@/components/home/Log'
import Stack from '@/components/home/Stack'
import Contact from '@/components/home/Contact'

export default function Home() {
  useDocumentMeta({ title: SITE_TITLE, description: SITE_DESCRIPTION, path: '/' })

  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const target = document.getElementById(hash.slice(1))
    if (target) scrollToTarget(target, true)
  }, [hash])

  return (
    <>
      <Hero />
      <Metrics />

      <Systems />

      <Work />

      <Log />

      <Stack />

      <Contact />
    </>
  )
}
