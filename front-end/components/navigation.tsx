"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, type MouseEvent } from "react"
import { Menu, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { AuthButton } from "./auth-button"
// import { AuthButtonMobile } from "./auth-button-mobile"
import Image from "next/image"
import Logo from "@/public/logolab.png"
import { useLoading } from "@/contexts/loading-context"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { startLoading } = useLoading()

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/materiels", label: "Équipements" },
    { href: "/ateliers", label: "Ateliers & Événements" },
    { href: "/innovations", label: "Innovations" },
    { href: "/service", label: "Services" },
    { href: "/ppn", label: "PPN" },
    { href: "/about", label: "A propos" },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const handleNavigation = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href) {
      e.preventDefault()
      return
    }

    e.preventDefault()
    startLoading()
    setIsOpen(false)
    
    setTimeout(() => {
      router.push(href)
    }, 100)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center border border-transparent  rounded-lg px-3 py-2 shadow-sm">
            <Link 
              href="/" 
              className="flex items-center gap-2 group"
              onClick={(e) => handleNavigation(e, "/")}
            >
              <Image 
                src={Logo} 
                alt="Voisilab Logo" 
                width={80} 
                height={80} 
                className="transition-transform group-hover:scale-105 rounded-sm" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center backdrop-blur-lg bg-white gap-2 lg:gap-3 border-transparent border border-border rounded-lg px-4 py-2 shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavigation(e, link.href)}
                className={`transition-all text-sm font-medium px-3 py-2 rounded-md ${
                  isActive(link.href)
                    ? "bg-green-600 text-white"
                    : "text-muted-foreground hover:text-white hover:bg-green-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex border-transparent border border-border items-center gap-3 rounded-lg px-3 py-2 shadow-sm">
            <ThemeToggle />
            {/* <div className="w-px h-6 bg-border"></div> */}
            {/* <AuthButton /> */}
            <div className="w-px h-6 bg-border"></div>
            <Button 
              className="bg-[#a306a1] hover:bg-[#800091] transition-colors" 
              size="sm"
              asChild
            >
              <Link 
                href="/projet"
                onClick={(e) => handleNavigation(e, "/projet")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Soumettre un projet
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex backdrop-blur-lg items-center gap-2 border border-transparent border-border rounded-lg px-3 py-2 shadow-sm">
            <ThemeToggle />
            <div className="w-px h-6 bg-border"></div>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-foreground p-1" 
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden backdrop-blur-lg py-4 mt-2 space-y-2 border-transparent border border-border rounded-lg shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavigation(e, link.href)}
                className={`block transition-all py-3 px-4 rounded-md mx-2 ${
                  isActive(link.href)
                    ? "bg-green-600 text-white"
                    : "text-muted-foreground hover:text-white hover:bg-green-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Bouton Soumettre un projet - Mobile */}
            <div className="px-2 pt-2">
              <Button 
                className="w-full bg-[#a306a1] hover:bg-[#800091] transition-colors" 
                asChild
              >
                <Link 
                  href="/projet"
                  onClick={(e) => handleNavigation(e, "/projet")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Soumettre un projet
                </Link>
              </Button>
            </div>

            {/* AuthButton - Mobile */}
            {/* <AuthButtonMobile /> */}
          </div>
        )}
      </div>
    </nav>
  )
}
