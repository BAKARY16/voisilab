"use client"

import { useEffect } from "react"
import { useLoading } from "@/contexts/loading-context"

export function usePageReady() {
  const { pageReady } = useLoading()

  useEffect(() => {
    // Attendre que le composant soit monté
    const timer = setTimeout(() => {
      pageReady()
    }, 100)

    return () => clearTimeout(timer)
  }, [pageReady])
}