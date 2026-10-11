import { useEffect, useState } from 'react'
import FlowGraph from '@/components/diagram/FlowGraph'
import { ARCHITECTURES } from '@/lib/architectures'
import { SYSTEMS } from '@/lib/data'

function useIsCompact() {
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    const update = () => setIsCompact(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return isCompact
}

export default function SystemArchitecture({ systemId }: { systemId: string }) {
  const compact = useIsCompact()
  const spec = ARCHITECTURES[systemId]
  const system = SYSTEMS.find((item) => item.id === systemId)
  const label = `Architecture of ${system ? system.title : systemId}`

  if (compact) {
    const stages = spec.nodes.filter((node) => node.kind === 'stage')
    const others = spec.nodes
      .filter((node) => node.kind !== 'stage' && node.kind !== 'tag')
      .map((node) => node.name)

    return (
      <div>
        <ol className="ml-1 border-l border-line">
          {stages.map((stage) => (
            <li key={stage.id} className="relative py-2 pl-6 font-mono text-[13px] text-ink">
              <span
                aria-hidden="true"
                className="absolute -left-[4.5px] top-[15px] h-2 w-2 border border-faint bg-bg"
              />
              {stage.name}
              {stage.sub && <span className="text-faint"> · {stage.sub}</span>}
            </li>
          ))}
        </ol>
        <p className="mt-3 font-mono text-xs text-faint">with: {others.join(' · ')}</p>
      </div>
    )
  }

  return <FlowGraph spec={spec} label={label} />
}
