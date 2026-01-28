"use client"

import { usePageReady } from "@/hooks/use-page-ready"
import type { ReactNode } from "react"

export function PageWrapper({ children }: { children: ReactNode }) {
  usePageReady()
  return <>{children}</>
}