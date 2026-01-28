"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface LoadingContextType {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
  pageReady: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)

  const startLoading = useCallback(() => {
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  const pageReady = useCallback(() => {
    // Petit délai pour une transition fluide
    setTimeout(() => {
      setIsLoading(false)
    }, 300)
  }, [])

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading, pageReady }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider")
  }
  return context
}