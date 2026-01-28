"use client"

import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import Image from "next/image"

const heroSlides = [
  {
    image: "/banner1.jpg",
    alt: "Fablab workspace",
  },
  {
    image: "/banner2.jpg",
    alt: "3D printing in action",
  },
  {
    image: "/banner1.jpg",
    alt: "Fablab workspace",
  },
  {
    image: "/banner2.jpg",
    alt: "3D printing in action",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Image Carousel Background */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
            />
            {/* Double overlay pour plus de profondeur */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
        aria-label="Diapositive précédente"
      >
        <ChevronLeft className="text-white group-hover:scale-110 transition-transform" size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
        aria-label="Diapositive suivante"
      >
        <ChevronRight className="text-white group-hover:scale-110 transition-transform" size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "w-8 bg-primary" : "w-2 bg-white/50 hover:bg-white/70"
              }`}
            aria-label={`Aller à la diapositive ${index + 1}`}
          />
        ))}
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 z-10" />

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-5xl uppercase md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 leading-snug tracking-tight fade-in-up" style={{ animationDelay: '100ms' }}>
            <span className="block">Votre espace de </span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            fabrication numérique
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed fade-in-up" style={{ animationDelay: '200ms' }}>
            Voisilab démocratise la fabrication numérique pour tous. Accédez à des machines de pointe, participez à des
            ateliers inspirants et donnez vie à vos projets créatifs dans un environnement collaboratif.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 fade-in-up" style={{ animationDelay: '300ms' }}>
            <Button
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300 text-base"
              asChild
            >
              <a href="#projet">
                <span className="relative z-10 flex items-center gap-2">
                  Démarrer un projet
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 shadow-xl"
              asChild
            >
              <a href="#equipements">Découvrir nos équipements</a>
            </Button>
          </div>

        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/30 rounded-full blur-3xl animate-pulse z-0" style={{ animationDelay: '1s' }} />
    </section>
  )
}
