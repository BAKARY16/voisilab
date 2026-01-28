"use client"

import { useState } from "react"
import { User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth"
import { SignInDialog } from "../auth/signin"
import Link from "next/link"

export function AuthButton() {
  const { user, isAuthenticated, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!isAuthenticated || !user) {
    return <SignInDialog />
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Button variant="ghost" className="cursor-pointer bg-white relative h-8 w-8 rounded-full group">
            <User className="h-8 w-8 text-black group-hover:text-white" />
          </Button>
          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="cursor-pointer flex items-center hover:text-white hover:fill-white"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Mon profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/profile/settings"
            className="cursor-pointer flex items-center hover:text-white hover:fill-white"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer hover:text-white text-red-600 focus:text-red-600"
          onClick={() => {
            logout()
            setIsOpen(false)
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}