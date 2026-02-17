"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (user: User, token?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = useCallback((userData: User, token?: string) => {
    setUser(userData)
    // Sauvegarder dans sessionStorage (vidé à la fermeture du navigateur)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('user', JSON.stringify(userData))
      if (token) {
        sessionStorage.setItem('token', token)
      }
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    // Supprimer du sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('token')
      console.log('🚪 Déconnexion - Session vidée (sessionStorage)')
    }
  }, [])

  // Charger l'utilisateur au démarrage
  useState(() => {
    if (typeof window !== 'undefined') {
      const savedUser = sessionStorage.getItem('user')
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (e) {
          sessionStorage.removeItem('user')
        }
      }
    }
  })

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}