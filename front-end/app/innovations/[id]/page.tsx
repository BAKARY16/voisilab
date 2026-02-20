"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import PageBreadcrumb from "@/components/PageBreadCrumb"
import {
  ArrowLeft,
  Heart,
  Eye,
  ExternalLink,
  Calendar,
  Tag,
  User,
  Share2,
  Lightbulb,
  Loader2,
  Award,
  ArrowRight,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

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
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch { return '' }
}

export default function InnovationDetailPage() {
  const params = useParams()
  const id = params?.id as string

  const [innovation, setInnovation] = useState<Innovation | null>(null)
  const [related, setRelated] = useState<Innovation[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/innovations/${id}`)
        if (!res.ok) { setNotFound(true); setLoading(false); return }
        const data = await res.json()
        const item: Innovation = data.data || data
        setInnovation(item)

        // Charger les projets liés (même catégorie)
        if (item.category) {
          const relRes = await fetch(`${API_URL}/api/innovations/published?limit=20`)
          if (relRes.ok) {
            const relData = await relRes.json()
            const all: Innovation[] = relData.data || relData
            setRelated(
              all.filter(i => i.id !== item.id && i.category === item.category).slice(0, 3)
            )
          }
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleLike = async () => {
    if (liked || !innovation) return
    try {
      await fetch(`${API_URL}/api/innovations/${id}/like`, { method: 'POST' })
      setLiked(true)
      setInnovation(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : prev)
    } catch { }
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      if (navigator.share) navigator.share({ title: innovation?.title, url })
    }
  }

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Chargement du projet…</p>
        </div>
      </div>
    )
  }

  // ── 404 ──────────────────────────────────────────────────
  if (notFound || !innovation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-border flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Projet introuvable</h1>
          <p className="text-muted-foreground mb-8">Ce projet n&apos;existe pas ou n&apos;est plus disponible.</p>
          <Button asChild>
            <Link href="/innovations" className="gap-2">
              <ArrowLeft size={16} /> Retour aux innovations
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const tags = parseTags(innovation.tags)

  // ── Page principale ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero image ────────────────────────────────────── */}
      <section className="relative h-[50vh] lg:h-[60vh] overflow-hidden bg-muted">
        {innovation.image_url ? (
          <Image
            src={innovation.image_url}
            alt={innovation.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Lightbulb className="w-20 h-20 text-muted-foreground/20" />
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        {/* Breadcrumb */}
        <div className="absolute top-16 left-0 right-0 z-10">
          <div className="container mx-auto mt-4 px-4 lg:px-8 max-w-5xl flex justify-center">
            <div className="text-white">
              <PageBreadcrumb pageTitle={innovation.title} />
            </div>
          </div>
        </div>

        {/* Titre en bas du hero */}
        <div className="absolute bottom-0 left-0 right-0 pb-8 pt-12 bg-gradient-to-t from-black/90 to-transparent">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {innovation.is_featured && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold">
                  <Award size={11} /> Mis en avant
                </span>
              )}
              {innovation.category && (
                <span className="px-2.5 py-1 rounded-md bg-white/15 backdrop-blur-sm text-white text-xs font-medium border border-white/20">
                  {innovation.category}
                </span>
              )}
            </div>
            <h1 className="text-2xl lg:text-4xl font-black text-white leading-tight max-w-3xl">
              {innovation.title}
            </h1>
          </div>
        </div>
      </section>

      {/* ── Contenu principal ─────────────────────────────── */}
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">

          {/* ─ Colonne principale ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Navigation retour */}
            <Link
              href="/innovations"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} /> Retour aux innovations
            </Link>

            {/* Description */}
            <div>
              <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                À propos du projet
              </h2>
              <p className="text-base text-foreground leading-relaxed whitespace-pre-line">
                {innovation.description}
              </p>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3 flex items-center gap-2">
                  <Tag size={13} /> Mots-clés
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-sm bg-muted text-foreground border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Engagement */}
            <div className="flex items-center gap-6 pt-4 border-t border-border">
              <button
                onClick={handleLike}
                disabled={liked}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium cursor-pointer ${
                  liked
                    ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400'
                    : 'border-border hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-800 dark:hover:bg-red-950/40 dark:hover:text-red-400 text-muted-foreground'
                }`}
              >
                <Heart size={16} className={liked ? 'fill-current' : ''} />
                {liked ? 'Aimé !' : 'J\'aime ce projet'}
                <span className="ml-1 font-bold">{innovation.likes || 0}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-foreground/30 hover:bg-muted transition-all text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Share2 size={16} />}
                {copied ? 'Lien copié !' : 'Partager'}
              </button>

              <span className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                <Eye size={15} />
                {innovation.views || 0} vue{(innovation.views || 0) > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* ─ Sidebar ────────────────────────────────────── */}
          <aside className="space-y-6">

            {/* Fiche du porteur */}
            <div className="rounded-xl border border-border p-5 bg-card space-y-4">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                Porteur du projet
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-black text-primary shrink-0">
                  {(innovation.creator_name || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm leading-tight">
                    {innovation.creator_name || 'Anonyme'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Membre Voisilab</p>
                </div>
              </div>
              {innovation.creator_email && (
                <a
                  href={`mailto:${innovation.creator_email}`}
                  className="flex items-center gap-2 text-xs text-primary hover:underline"
                >
                  <ExternalLink size={12} />
                  Contacter le porteur
                </a>
              )}
            </div>

            {/* Informations */}
            <div className="rounded-xl border border-border p-5 bg-card space-y-4">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                Informations
              </h3>
              <div className="space-y-3">
                {innovation.category && (
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <Tag size={13} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Catégorie</p>
                      <p className="text-sm font-medium text-foreground">{innovation.category}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar size={13} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Publié le</p>
                    <p className="text-sm font-medium text-foreground">{formatDate(innovation.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <Eye size={13} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Vues</p>
                    <p className="text-sm font-medium text-foreground">{innovation.views || 0}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <Heart size={13} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Soutiens</p>
                    <p className="text-sm font-medium text-foreground">{innovation.likes || 0} personne{(innovation.likes || 0) > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA soumettre */}
            <div className="rounded-xl border border-dashed border-border p-5 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Vous avez un projet ?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Rejoignez la communauté et partagez votre innovation.
              </p>
              <Button size="sm" className="w-full gap-2" asChild>
                <Link href="/projet">
                  Soumettre mon projet <ArrowRight size={14} />
                </Link>
              </Button>
            </div>
          </aside>
        </div>

        {/* ── Projets similaires ─────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-border">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">
                  {innovation.category}
                </p>
                <h2 className="text-xl font-bold text-foreground">Projets similaires</h2>
              </div>
              <Link
                href="/innovations"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Voir tout <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((item) => {
                const itemTags = parseTags(item.tags)
                return (
                  <Link key={item.id} href={`/innovations/${item.id}`} className="block group">
                    <article className="overflow-hidden rounded-xl border border-border hover:border-foreground/20 transition-all duration-300 hover:shadow-md bg-card h-full flex flex-col">
                      <div className="relative h-40 overflow-hidden bg-muted shrink-0">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Lightbulb className="w-8 h-8 text-muted-foreground/25" />
                          </div>
                        )}
                        {item.category && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-0.5 rounded-md bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold border border-border">
                              {item.category}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col gap-2 flex-1">
                        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h3>
                        {item.creator_name && (
                          <p className="text-xs text-muted-foreground">Par {item.creator_name}</p>
                        )}
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                          {item.description}
                        </p>
                        {itemTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {itemTags.slice(0, 2).map((tag, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground">{tag}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-3 pt-2 border-t border-border mt-auto text-muted-foreground">
                          <span className="flex items-center gap-1 text-xs">
                            <Heart size={11} /> {item.likes || 0}
                          </span>
                          <span className="flex items-center gap-1 text-xs">
                            <Eye size={11} /> {item.views || 0}
                          </span>
                          <span className="text-xs font-medium text-primary ml-auto flex items-center gap-1">
                            Voir <ArrowRight size={11} />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
