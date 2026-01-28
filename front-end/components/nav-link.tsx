"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLoading } from "./page-transition"

interface NavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function NavLink({ href, children, className, onClick }: NavLinkProps) {
  const router = useRouter()
  const { setIsLoading } = useLoading()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    // Déclencher le loading
    setIsLoading(true)
    
    // Appeler onClick si fourni (pour fermer le menu mobile)
    onClick?.()
    
    // Naviguer vers la page
    router.push(href)
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}