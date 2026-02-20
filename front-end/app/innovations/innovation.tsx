"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import PageBreadcrumb from "@/components/PageBreadCrumb"
import {
  ExternalLink,
  Heart,
  Lightbulb,
  ArrowRight,
  Eye,
  Loader2,
  FlaskConical,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Filter,
  Calendar
} from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500'

interface Innovation {
  id: number
  title: string
  description: string
  category: string
  creator_name: string
  creator_email: string
  image_url: string
  tags: string[] | string
  status: string
  is_published: boolean
  is_featured: boolean
  likes: number
  views: number
  created_at: string
}

const parseTags = (tags: string[] | string | undefined): string[] => {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  try { return JSON.parse(tags) } catch { return [] }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  } catch { return '' }
}

export function InnovationsSection() {
  useScrollAnimation()

  const [innovations, setInnovations] = useState<Innovation[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([])
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [likedProjects, setLikedProjects] = useState<{ [key: number]: boolean }>({})
  const refreshRef = useRef<NodeJS.Timeout | null>(null)

  const silentRefresh = useCallback(async () => {
    try {
      const [iRes, cRes] = await Promise.all([
        fetch(`${API_URL}/api/innovations/published`),
        fetch(`${API_URL}/api/innovations/categories`)
      ])
      if (iRes.ok) {
        const d = await iRes.json()
        setInnovations(Array.isArray(d.data || d) ? (d.data || d) : [])
      }
      if (cRes.ok) {
        const d = await cRes.json()
        const cats = d.data || d
        if (Array.isArray(cats) && cats.length > 0) {
          const total = cats.reduce((s: number, c: any) => s + (c.count || 0), 0)
          setCategories([
            { name: 'Tous', count: total },
            ...cats.map((c: any) => ({ name: c.category || c.name, count: c.count || 0 }))
          ])
        }
      }
    } catch { }
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const [iRes, cRes] = await Promise.all([
          fetch(`${API_URL}/api/innovations/published`),
          fetch(`${API_URL}/api/innovations/categories`)
        ])
        if (iRes.ok) {
          const d = await iRes.json()
          setInnovations(Array.isArray(d.data || d) ? (d.data || d) : [])
        }
        if (cRes.ok) {
          const d = await cRes.json()
          const cats = d.data || d
          if (Array.isArray(cats) && cats.length > 0) {
            const total = cats.reduce((s: number, c: any) => s + (c.count || 0), 0)
            setCategories([
              { name: 'Tous', count: total },
              ...cats.map((c: any) => ({ name: c.category || c.name, count: c.count || 0 }))
            ])
          }
        }
      } catch { } finally {
        setLoading(false)
      }
    }
    init()
    refreshRef.current = setInterval(silentRefresh, 20000)
    return () => { if (refreshRef.current) clearInterval(refreshRef.current) }
  }, [silentRefresh])

  const handleLike = async (id: number) => {
    if (likedProjects[id]) return
    try {
      await fetch(`${API_URL}/api/innovations/${id}/like`, { method: 'POST' })
      setLikedProjects(prev => ({ ...prev, [id]: true }))
      setInnovations(prev => prev.map(i => i.id === id ? { ...i, likes: (i.likes || 0) + 1 } : i))
    } catch { }
  }

  const filteredInnovations = selectedCategory === 'Tous'
    ? innovations
    : innovations.filter(i => i.category === selectedCategory)

  const featuredInnovations = filteredInnovations.filter(i => i.is_featured)
  const regularInnovations = filteredInnovations.filter(i => !i.is_featured)

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-0 lg:pt-28 overflow-hidden">
        <div className="absolute inset-0">
          <video src="/video.mp4" autoPlay loop muted className="object-cover w-full h-full"
            onEnded={(e) => { const v = e.target as HTMLVideoElement; v.currentTime = 0; v.play() }} />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="relative z-10 container mx-auto px-4 lg:px-8">
          <div className="flex justify-center mb-10 fade-in-up">
            <PageBreadcrumb pageTitle="Innovations" />
          </div>

          <div className="max-w-3xl mx-auto text-center pb-20 fade-in-up">
            <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
              Les innovations de notre communauté
            </h1>
            <p className="text-base lg:text-lg text-gray-300 leading-relaxed mb-10 max-w-2xl mx-auto">
              Grâce a l'expertise et la créativité de nos membres,
              des projets concrets voient le jour chaque jour. Découvrez les réalisations de nos membres.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/projet">
                  Soumettre un projet <ArrowRight size={18} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-black hover:bg-white/10 backdrop-blur-sm" asChild>
                <Link href="#projets">Parcourir les projets</Link>
              </Button>
            </div>
          </div>
        </div>

        
      </section>

      {/* ── Contenu principal ────────────────────────────────── */}
      <section id="projets" className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

          {/* En-tête + filtres */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 fade-in-up">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">Projets</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Réalisations de la communauté
              </h2>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Des projets nés dans le Fablab, portés par des étudiants et professionnels innovants.
              </p>
            </div>

            {categories.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Filter size={15} className="text-muted-foreground shrink-0" />
                {categories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all border cursor-pointer ${
                      selectedCategory === cat.name
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-transparent text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground'
                    }`}
                  >
                    {cat.name}
                    <span className={`ml-1.5 text-xs ${selectedCategory === cat.name ? 'opacity-60' : 'opacity-40'}`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
              <p className="text-sm">Chargement des projets…</p>
            </div>
          )}

          {/* Projets featured */}
          {!loading && featuredInnovations.length > 0 && (
            <div className="mb-14">
              <div className="flex items-center gap-2 mb-6">
                <Award size={16} className="text-primary" />
                <span className="text-sm font-semibold text-foreground uppercase tracking-wider">Projets mis en avant</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredInnovations.map((innovation) => (
                  <FeaturedCard
                    key={innovation.id}
                    innovation={innovation}
                    liked={!!likedProjects[innovation.id]}
                    onLike={handleLike}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tous les projets */}
          {!loading && regularInnovations.length > 0 && (
            <>
              {featuredInnovations.length > 0 && (
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen size={16} className="text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tous les projets</span>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {regularInnovations.map((innovation) => (
                  <RegularCard
                    key={innovation.id}
                    innovation={innovation}
                    liked={!!likedProjects[innovation.id]}
                    onLike={handleLike}
                  />
                ))}
              </div>
            </>
          )}

          {/* État vide */}
          {!loading && filteredInnovations.length === 0 && (
            <div className="text-center py-32">
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-border flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Aucun projet trouvé</h3>
              <p className="text-sm text-muted-foreground">
                {selectedCategory === 'Tous'
                  ? "Aucune innovation publiée pour le moment."
                  : `Aucun projet dans la catégorie « ${selectedCategory} ».`}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <TrendingUp className="w-10 h-10 text-primary mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
            Vous avez un projet à partager ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            Le Voisilab encourage chaque membre de l&apos;écosystème UVCI à documenter et partager ses créations.
            Votre projet peut inspirer d&apos;autres innovateurs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild className="gap-2">
              <Link href="/projet">
                Soumettre mon projet <ArrowRight size={18} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">En savoir plus sur le Fablab</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ── Carte mise en avant ──────────────────────────────────── */
function FeaturedCard({
  innovation,
  liked,
  onLike
}: {
  innovation: Innovation
  liked: boolean
  onLike: (id: number) => void
}) {
  const tags = parseTags(innovation.tags)
  return (
    <Link href={`/innovations/${innovation.id}`} className="block group">
      <article className="relative overflow-hidden rounded-xl border border-border hover:border-foreground/20 transition-all duration-300 hover:shadow-lg bg-card h-full flex flex-col">
        <div className="relative h-56 overflow-hidden bg-muted shrink-0">
          {innovation.image_url ? (
            <Image src={innovation.image_url} alt={innovation.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Lightbulb className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-medium border border-white/10">
              <Award size={11} /> Mis en avant
            </span>
          </div>
          {innovation.category && (
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold">
                {innovation.category}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col gap-3 flex-1">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
            {innovation.title}
          </h3>

          {innovation.creator_name && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {innovation.creator_name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-muted-foreground">{innovation.creator_name}</span>
              {innovation.created_at && (
                <span className="text-xs text-muted-foreground/60 ml-auto flex items-center gap-1">
                  <Calendar size={11} /> {formatDate(innovation.created_at)}
                </span>
              )}
            </div>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {innovation.description}
          </p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.slice(0, 4).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground border border-border">{tag}</span>
              ))}
              {tags.length > 4 && (
                <span className="px-2 py-0.5 rounded text-xs text-muted-foreground border border-dashed border-border">+{tags.length - 4}</span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
            <div className="flex items-center gap-4 text-muted-foreground">
              <button onClick={(e) => { e.preventDefault(); onLike(innovation.id) }}
                className={`flex items-center gap-1.5 text-sm transition-colors hover:text-red-500 cursor-pointer ${liked ? 'text-red-500' : ''}`}>
                <Heart size={15} className={liked ? 'fill-current' : ''} /> {innovation.likes || 0}
              </button>
              <span className="flex items-center gap-1.5 text-sm">
                <Eye size={15} /> {innovation.views || 0}
              </span>
            </div>
            <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              Voir le projet <ExternalLink size={13} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

/* ── Carte standard ───────────────────────────────────────── */
function RegularCard({
  innovation,
  liked,
  onLike
}: {
  innovation: Innovation
  liked: boolean
  onLike: (id: number) => void
}) {
  const tags = parseTags(innovation.tags)
  return (
    <Link href={`/innovations/${innovation.id}`} className="block group">
      <article className="overflow-hidden rounded-xl border border-border hover:border-foreground/20 transition-all duration-300 hover:shadow-md bg-card h-full flex flex-col">
        <div className="relative h-44 overflow-hidden bg-muted shrink-0">
          {innovation.image_url ? (
            <Image src={innovation.image_url} alt={innovation.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Lightbulb className="w-10 h-10 text-muted-foreground/25" />
            </div>
          )}
          {innovation.category && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-md bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold border border-border">
                {innovation.category}
              </span>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col gap-2.5 flex-1">
          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
            {innovation.title}
          </h3>

          {innovation.creator_name && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                {innovation.creator_name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-muted-foreground truncate">{innovation.creator_name}</span>
              {innovation.created_at && (
                <span className="text-xs text-muted-foreground/50 ml-auto shrink-0">{formatDate(innovation.created_at)}</span>
              )}
            </div>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
            {innovation.description}
          </p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">{tag}</span>
              ))}
              {tags.length > 3 && (
                <span className="px-2 py-0.5 rounded text-xs text-muted-foreground/60">+{tags.length - 3}</span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2.5 border-t border-border mt-auto">
            <div className="flex items-center gap-3 text-muted-foreground">
              <button onClick={(e) => { e.preventDefault(); onLike(innovation.id) }}
                className={`flex items-center gap-1 text-xs transition-colors hover:text-red-500 cursor-pointer ${liked ? 'text-red-500' : ''}`}>
                <Heart size={13} className={liked ? 'fill-current' : ''} /> {innovation.likes || 0}
              </button>
              <span className="flex items-center gap-1 text-xs">
                <Eye size={13} /> {innovation.views || 0}
              </span>
            </div>
            <span className="text-xs font-medium text-primary flex items-center gap-1">
              Voir <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
