"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useLoading } from "@/contexts/loading-context"

interface NavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function NavLink({ href, children, className, onClick }: NavLinkProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { startLoading } = useLoading()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Ancres (#section) ou même page → comportement natif sans loading
    if (href.startsWith('#') || pathname === href) return

    e.preventDefault()
    startLoading()
    onClick?.()

    setTimeout(() => {
      router.push(href)
    }, 100)
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}