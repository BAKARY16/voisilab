"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import PageBreadcrumb from "@/components/PageBreadCrumb"
import {
  Calendar, Clock, MapPin, Users, GraduationCap, Wrench, Zap,
  ArrowLeft, CheckCircle2, AlertCircle, User, Euro, BookOpen,
  Share2, Heart, Sparkles
} from 'lucide-react'

interface Workshop {
  id: number
  title: string
  description: string
  category: string
  type: 'formation' | 'atelier' | 'evenement'
  date: string
  end_date: string | null
  max_participants: number
  current_participants: number
  level: string
  price: number
  image: string
  image_url: string
  instructor: string
  location: string
  prerequisites: string[] | string
  what_you_learn: string[] | string
  status: 'upcoming' | 'full' | 'cancelled' | 'completed'
}

// Fonction pour parser les JSON strings en arrays
const parseJsonArray = (value: string[] | string | null | undefined): string[] => {
  if (!value) return []
  if (Array.isArray(value)) return value
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return value ? [value] : []
  }
}

// Extraire l'heure depuis un datetime
const formatTime = (dateStr: string) => {
  if (!dateStr) return null
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return null
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  } catch { return null }
}

// Calculer la durée entre deux dates
const formatDuration = (startStr: string, endStr: string | null) => {
  if (!endStr) return null
  try {
    const start = new Date(startStr)
    const end = new Date(endStr)
    const diffMs = end.getTime() - start.getTime()
    if (diffMs <= 0) return null
    const hours = Math.floor(diffMs / 3600000)
    const minutes = Math.floor((diffMs % 3600000) / 60000)
    if (hours > 0 && minutes > 0) return `${hours}h${minutes.toString().padStart(2, '0')}`
    if (hours > 0) return `${hours}h`
    return `${minutes}min`
  } catch { return null }
}
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return '-'
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return '-'
  }
}

// Fonction pour obtenir la couleur du niveau
const getLevelColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'débutant': return 'bg-green-500/10 text-green-600 border-green-500/20'
    case 'intermédiaire': return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
    case 'avancé': return 'bg-red-500/10 text-red-600 border-red-500/20'
    default: return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
  }
}

// Fonction pour obtenir l'icône et couleur du type
const getTypeInfo = (type: string) => {
  switch (type) {
    case 'formation':
      return { icon: GraduationCap, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', label: 'Formation' }
    case 'atelier':
      return { icon: Wrench, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', label: 'Atelier' }
    case 'evenement':
      return { icon: Zap, color: 'bg-orange-500/10 text-orange-600 border-orange-500/20', label: 'Événement' }
    default:
      return { icon: BookOpen, color: 'bg-gray-500/10 text-gray-600 border-gray-500/20', label: 'Activité' }
  }
}

export default function WorkshopDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [related, setRelated] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkshop = async () => {
      if (!params.id) return

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500'
        const response = await fetch(`${API_URL}/api/workshops/${params.id}/public`)

        if (!response.ok) {
          throw new Error('Atelier non trouvé')
        }

        const data = await response.json()
        const ws = data.data || data
        setWorkshop(ws)

        // Charger d'autres ateliers pour la section "Autres ateliers"
        try {
          const relRes = await fetch(`${API_URL}/api/workshops/published`)
          if (relRes.ok) {
            const relData = await relRes.json()
            const all: Workshop[] = relData.data || []
            setRelated(
              all
                .filter(w => w.id !== ws.id)
                .slice(0, 3)
            )
          }
        } catch { /* silencieux */ }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkshop()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error || !workshop) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-destructive" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Atelier non trouvé</h1>
          <p className="text-muted-foreground mb-6">{error || "Cet atelier n'existe pas ou a été supprimé."}</p>
          <Button onClick={() => router.push('/ateliers')}>
            <ArrowLeft className="mr-2" size={16} />
            Retour aux ateliers
          </Button>
        </div>
      </div>
    )
  }

  const typeInfo = getTypeInfo(workshop.type)
  const TypeIcon = typeInfo.icon
  const spotsRemaining = workshop.max_participants - (workshop.current_participants || 0)
  const isFull = spotsRemaining <= 0
  const prerequisites = parseJsonArray(workshop.prerequisites)
  const whatYouLearn = parseJsonArray(workshop.what_you_learn)
  const workshopTime = formatTime(workshop.date)
  const workshopDuration = formatDuration(workshop.date, workshop.end_date)
  const workshopImageUrl = workshop.image || workshop.image_url

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
        {/* Background : image de l'atelier ou vidéo fallback */}
        <div className="absolute inset-0">
          {workshopImageUrl ? (
            <Image
              src={workshopImageUrl}
              alt={workshop.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <video
              src="/video.mp4"
              autoPlay
              loop
              muted
              className="object-cover w-full h-full"
              onEnded={(e) => {
                const video = e.target as HTMLVideoElement
                video.currentTime = 0
                video.play()
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/85"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center mb-8">
            <PageBreadcrumb pageTitle={workshop.title} />
          </div>

          <div className="max-w-4xl mx-auto text-center">
            {/* Type Badge */}
            {/* <Badge className={`mb-6 px-4 py-2 ${typeInfo.color} backdrop-blur-sm border-2`}>
              <TypeIcon className="w-4 h-4 mr-2" />
              {typeInfo.label}
            </Badge> */}

            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-black text-white leading-tight mb-6">
              {workshop.title}
            </h1>

            <p className="text-lg lg:text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl mx-auto">
              {/* {workshop.description} */}
            </p>

            {/* Quick Info */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge variant="outline" className="px-4 py-2 bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(workshop.date)}
              </Badge>
              <Badge variant="outline" className="px-4 py-2 bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <Clock className="w-4 h-4 mr-2" />
                {workshopTime
                  ? workshopDuration
                    ? `${workshopTime} — ${workshopDuration}`
                    : workshopTime
                  : 'Horaire à confirmer'}
              </Badge>
              {workshop.location && (
                <Badge variant="outline" className="px-4 py-2 bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <MapPin className="w-4 h-4 mr-2" />
                  {workshop.location}
                </Badge>
              )}
              {/* <Badge className={`px-4 py-2 ${getLevelColor(workshop.level)} backdrop-blur-sm border-2`}>
                {workshop.level || 'Tous niveaux'}
              </Badge> */}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isFull && workshop.status !== 'completed' ? (
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300"
                  asChild
                >
                  <Link href={`/inscription-atelier?id=${workshop.id}`}>
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      S'inscrire maintenant
                    </span>
                  </Link>
                </Button>
              ) : workshop.status === 'completed' ? (
                <Badge variant="outline" className="px-6 py-3 text-sm border-white/30 text-white bg-white/10">
                  ✓ Événement terminé
                </Badge>
              ) : (
                <Button size="lg" disabled className="bg-muted text-muted-foreground">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Complet
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="text-black cursor-pointer border-white/30 hover:bg-white/10 backdrop-blur-sm"
                onClick={() => router.push('/ateliers')}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voir tous les ateliers
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Ce que vous apprendrez */}
              {whatYouLearn.length > 0 && (
                <Card className="border-2 border-border">
                  <CardContent className="p-6 lg:p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="text-primary" size={20} />
                      </div>
                      Ce que vous apprendrez
                    </h2>
                    <ul className="space-y-3">
                      {whatYouLearn.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={18} />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Prérequis */}
              {prerequisites.length > 0 && (
                <Card className="border-2 border-border">
                  <CardContent className="p-6 lg:p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                        <AlertCircle className="text-orange-500" size={20} />
                      </div>
                      Prérequis
                    </h2>
                    <ul className="space-y-3">
                      {prerequisites.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Description détaillée */}
              <Card className="border-2 border-border">
                <CardContent className="p-6 lg:p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="text-blue-500" size={20} />
                    </div>
                    Description
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {workshop.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Info Card */}
              <Card className="border-2 border-primary/30 sticky top-24">
                <CardContent className="p-6">
                  {/* Prix */}
                  <div className="text-center mb-6">
                    <span className="text-4xl font-black text-primary">
                      {workshop.price === 0 ? 'Gratuit' : `${workshop.price?.toLocaleString()} FCFA`}
                    </span>
                  </div>

                  <Separator className="my-6" />

                  {/* Détails */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Calendar className="text-primary" size={18} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium text-foreground">{formatDate(workshop.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Clock className="text-primary" size={18} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Horaire</p>
                        <p className="font-medium text-foreground">
                          {workshopTime
                            ? workshopDuration
                              ? `${workshopTime}`
                              : workshopTime
                            : 'À confirmer'}
                        </p>
                      </div>
                    </div>

                    {workshop.location && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <MapPin className="text-primary" size={18} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Lieu</p>
                          <p className="font-medium text-foreground">{workshop.location}</p>
                        </div>
                      </div>
                    )}

                    {workshop.instructor && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <User className="text-primary" size={18} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Animateur</p>
                          <p className="font-medium text-foreground">{workshop.instructor}</p>
                        </div>
                      </div>
                    )}

                    {/* <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Users className="text-primary" size={18} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Places</p>
                        <p className="font-medium text-foreground">
                          {workshop.current_participants || 0}/{workshop.max_participants} inscrits
                          {spotsRemaining > 0 && spotsRemaining <= 5 && (
                            <span className="text-destructive ml-2">
                              (Plus que {spotsRemaining} place{spotsRemaining > 1 ? 's' : ''} !)
                            </span>
                          )}
                        </p>
                      </div>
                    </div> */}
                  </div>

                  <Separator className="my-6" />

                  {/* CTA */}
                  {workshop.status === 'completed' ? (
                    <Button className="w-full" size="lg" variant="outline" disabled>
                      <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                      Événement terminé
                    </Button>
                  ) : !isFull ? (
                    <Button className="w-full" size="lg" asChild>
                      <Link href={`/inscription-atelier?id=${workshop.id}`}>
                        <Sparkles className="w-5 h-5 mr-2" />
                        S'inscrire
                      </Link>
                    </Button>
                  ) : (
                    <Button className="w-full" size="lg" disabled>
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Complet
                    </Button>
                  )}

                  {/* Partager */}
                  <Button
                    variant="outline"
                    className="w-full mt-3"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: workshop.title,
                          text: workshop.description,
                          url: window.location.href,
                        })
                      } else {
                        navigator.clipboard.writeText(window.location.href)
                        alert('Lien copié !')
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* Autres ateliers */}
      {related.length > 0 && (
        <section className="py-12 lg:py-16 border-t border-border bg-muted/20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl font-bold text-foreground mb-6">Autres activités</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {related.map(w => {
                  const ti = getTypeInfo(w.type)
                  const TIcon = ti.icon
                    const img = w.image_url
                  return (
                    <Link key={w.id} href={`/ateliers/${w.id}`}>
                      <Card className="overflow-hidden border border-border hover:border-primary/40 hover:shadow-md transition-all duration-300 group h-full">
                        <div className="relative h-36 overflow-hidden">
                          <Image
                            src={w.image || img || '/logolab.png'}
                            alt={w.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-background/85 text-foreground border-border text-xs">
                              <TIcon size={11} className="mr-1" />
                              {ti.label}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Calendar size={11} />
                            {formatDate(w.date)}
                          </p>
                          <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {w.title}
                          </h3>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
