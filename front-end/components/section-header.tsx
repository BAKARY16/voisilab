import type { ReactNode } from "react"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  accent?: ReactNode
  className?: string
}

export function SectionHeader({ title, subtitle, accent, className = "" }: SectionHeaderProps) {
  return (
    <div className={`text-center max-w-3xl mx-auto mb-12 lg:mb-16 ${className}`}>
      {accent && <div className="mb-4 flex justify-center">{accent}</div>}
      <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 text-balance">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground text-pretty">{subtitle}</p>}
    </div>
  )
}
