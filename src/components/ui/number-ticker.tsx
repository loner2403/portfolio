import { useEffect, useRef, type ComponentPropsWithoutRef } from "react"
import { animate, useInView } from "motion/react"

import { cn } from "@/lib/utils"

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number
  startValue?: number
  direction?: "up" | "down"
  delay?: number
  decimalPlaces?: number
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px" })

  useEffect(() => {
    if (!isInView || !ref.current) return

    const from = direction === "down" ? value : startValue
    const to = direction === "down" ? startValue : value

    const format = (latest: number) =>
      Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(Number(latest.toFixed(decimalPlaces)))

    const controls = animate(from, to, {
      duration: 1.2,
      ease: "easeOut",
      delay,
      onUpdate: (latest) => {
        if (ref.current) ref.current.textContent = format(latest)
      },
      onComplete: () => {
        if (ref.current) ref.current.textContent = format(to)
      },
    })

    return () => controls.stop()
  }, [isInView, direction, value, startValue, delay, decimalPlaces])

  return (
    <span
      ref={ref}
      className={cn("inline-block tracking-wider tabular-nums", className)}
      {...props}
    >
      {startValue}
    </span>
  )
}
