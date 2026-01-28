"use client"

import { User, LogOut, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth"
import { SignInDialog } from "../auth/signin"
import Link from "next/link"

export function AuthButtonMobile() {
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated || !user) {
    return (
      <div className="px-2 pt-2">
        <SignInDialog />
      </div>
    )
  }

  return (
    <div className="border-t border-border mt-2 pt-2">
      <div className="px-4 py-3 flex items-center gap-3">
        <Avatar className="h-12 w-12 border-2 border-[#a306a1]">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-gradient-to-br from-[#a306a1] to-green-600 text-white font-bold">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <div className="space-y-1 px-2">
        <Link
          href="/profile"
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-muted transition-colors"
        >
          <User className="w-4 h-4" />
          Mon profil
        </Link>
        <Link
          href="/profile/settings"
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-muted transition-colors"
        >
          <Settings className="w-4 h-4" />
          Paramètres
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-red-50 dark:hover:bg-red-950 text-red-600 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </div>
  )
}