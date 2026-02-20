"use client"

import { SectionHeader } from "../../components/section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import PageBreadcrumb from "@/components/PageBreadCrumb"
import {
  Calendar,
  Clock,
  Users,
  GraduationCap,
  Zap,
  Wrench,
  ArrowRight,
  Sparkles,
  Trophy,
  HelpCircle,
  ChevronDown,
  MapPin,
  Star,
  BookOpen,
  CalendarDays
} from "lucide-react"
import { useState, useEffect } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface Workshop {
  id: number
  title: string
  description: string
  category: string
  type: 'formation' | 'atelier' | 'evenement' | null
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
  prerequisites: string[]
  what_you_learn: string[]
  status: 'upcoming' | 'full' | 'cancelled' | 'completed'
}

const formatTime = (dateStr: string) => {
  if (!dateStr) return null
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return null
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  } catch { return null }
}

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
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  } catch { return '-' }
}

export function WorkshopsSection() {
  useScrollAnimation()

  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.fablab.voisilab.online'
    fetch(`${API_URL}/api/workshops/published`)
      .then(res => res.json())
      .then(data => { setWorkshops(data.data || []); setLoading(false) })
      .catch(() => setLoading(false))
    const interval = setInterval(() => {
      fetch(`${API_URL}/api/workshops/published`)
        .then(res => res.ok ? res.json() : null)
        .then(data => data && setWorkshops(data.data || []))
        .catch(() => {})
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const resolveType = (w: Workshop): 'formation' | 'atelier' | 'evenement' => {
    if (w.type) return w.type
    const cat = (w.category || '').toLowerCase()
    if (cat.includes('formation') || cat.includes('machine')) return 'formation'
    if (cat.includes('événement') || cat.includes('evenement') || cat.includes('hackathon')) return 'evenement'
    return 'atelier'
  }
  const getLevelColor = (level: string) => {
    switch ((level || '').toLowerCase()) {
      case 'débutant': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'intermédiaire': return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
      case 'avancé': return 'bg-red-500/10 text-red-600 border-red-500/20'
      default: return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    }
  }
  const getTypeIcon = (type: string | null) => {
    switch (type) {
      case 'formation': return GraduationCap
      case 'atelier': return Wrench
      case 'evenement': return Zap
      default: return BookOpen
    }
  }
  const getTypeLabel = (w: Workshop) => {
    const t = resolveType(w)
    if (t === 'formation') return 'Formation'
    if (t === 'evenement') return 'Événement'
    return 'Atelier'
  }
  const getSpotsRemaining = (w: Workshop) => w.max_participants - w.current_participants

  const stats = [
    { icon: GraduationCap, value: workshops.filter(w => resolveType(w) === 'formation').length + "+", label: "Formations proposées" },
    { icon: Users,         value: "50+",   label: "Participants formés" },
    { icon: CalendarDays,  value: "12+",   label: "Événements par an" },
    { icon: Star,          value: "4.9/5", label: "Satisfaction moyenne" },
  ]

  const workshopTypes = [
    { icon: GraduationCap, title: "Formations machines",  description: "Formations obligatoires pour utiliser nos équipements en autonomie.",            color: "bg-blue-500/10   text-blue-600   border-blue-500/20"   },
    { icon: Wrench,        title: "Ateliers créatifs",    description: "Ateliers pour réaliser un projet concret. Repartez avec votre création !",       color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
    { icon: Zap,           title: "Événements",           description: "Hackathons, portes ouvertes, conférences... Rencontrez la communauté Fablab !",  color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  ]

  const faqItems = [
    { question: "Comment m'inscrire à une formation ?",  answer: "Cliquez sur le bouton 'S'inscrire' de la formation souhaitée. Vous recevrez une confirmation par email avec tous les détails pratiques." },
    { question: "Les formations sont-elles obligatoires ?", answer: "Oui, pour utiliser une machine en autonomie, vous devez avoir suivi la formation correspondante. C'est une question de sécurité et de bon usage des équipements." },
    { question: "Puis-je annuler mon inscription ?",     answer: "Oui, vous pouvez annuler avant la fin des inscriptions. Nous vous demandons de prévenir pour libérer votre place." },
    { question: "Faut-il apporter son ordinateur ?",     answer: "Pour les formations logicielles (modélisation 3D, découpe laser), il est recommandé d'apporter son ordinateur portable." },
    { question: "Y a-t-il un âge minimum ?",             answer: "La plupart des formations sont accessibles dès 16 ans. Les mineurs doivent être accompagnés d'un parent pour certains équipements." },
  ]

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative pt-16 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <video src="/video.mp4" autoPlay loop muted className="object-cover w-full h-full"
            onEnded={(e) => { const v = e.target as HTMLVideoElement; v.currentTime = 0; v.play() }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10 container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center mb-8 fade-in-up">
            <PageBreadcrumb pageTitle="Ateliers & Évènements" />
          </div>
          <div className="max-w-4xl mx-auto text-center fade-in-up">
            <Badge className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" variant="outline">
              <Sparkles className="w-4 h-4 mr-2" />Apprenez, créez, partagez
            </Badge>
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
              <span className="block">Ateliers &</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Évènements</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto">
              Participez à nos formations, ateliers créatifs et événements communautaires.
              Développez vos compétences et rencontrez des passionnés de fabrication numérique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300" asChild>
                <Link href="#ateliers">
                  <span className="relative z-10 flex items-center gap-2">Découvrir les ateliers<ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} /></span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-black border-white/30 hover:bg-white/10 backdrop-blur-sm" asChild>
                <Link href="/about">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-b border-border bg-muted/40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="flex items-center gap-4 px-6 py-5">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="text-primary" size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground leading-none">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Types d'ateliers ── */}
      <section className="py-16 lg:py-20 bg-muted/20 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 fade-in-up">
              <Badge className="mb-4 px-4 py-2" variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />Nos formats
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Trois types d&apos;activités pour tous les besoins</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Que vous souhaitiez vous former, créer un projet ou rencontrer la communauté</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workshopTypes.map((type, i) => {
                const Icon = type.icon
                return (
                  <div key={i} className="" style={{ animationDelay: `${i * 100}ms` }}>
                    <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 h-full">
                      <CardContent className="p-8 text-center">
                        <div className={`w-16 h-16 ${type.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                          <Icon size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">{type.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{type.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Activités par section ── */}
      <section id="ateliers" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader title="Nos activités" subtitle="Formations, ateliers créatifs et événements organisés par le FabLab UVCI" />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm">Chargement des activités...</p>
            </div>
          ) : workshops.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-16 h-16 bg-muted rounded-2xl border-2 border-dashed border-border flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-muted-foreground" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Aucune activité disponible</h3>
              <p className="text-sm text-muted-foreground">De nouvelles activités seront bientôt publiées.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
              {workshops.map((item, i) => (
                <WorkshopCard key={item.id} item={item} index={i}
                  resolveType={resolveType} getTypeIcon={getTypeIcon} getTypeLabel={getTypeLabel}
                  getLevelColor={getLevelColor} getSpotsRemaining={getSpotsRemaining} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 lg:py-24 bg-muted/20 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 fade-in-up">
              <Badge className="mb-4 px-4 py-2" variant="outline">
                <HelpCircle className="w-4 h-4 mr-2" />Questions fréquentes
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Tout savoir sur nos activités</h2>
              <p className="text-lg text-muted-foreground">Retrouvez les réponses aux questions les plus courantes</p>
            </div>
            <div className="space-y-4 fade-in-up">
              {faqItems.map((faq, i) => (
                <Card
                  key={i}
                  className={`border-2 transition-all duration-300 cursor-pointer ${openFaq === i ? 'border-primary/50 shadow-lg' : 'border-border hover:border-primary/30'}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground pr-4">{faq.question}</h3>
                      <ChevronDown className={`text-primary flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} size={24} />
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 mt-4' : 'max-h-0'}`}>
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

/* ── Carte active ─────────────────────────────────────────── */
function WorkshopCard({ item, index, resolveType, getTypeIcon, getTypeLabel, getLevelColor, getSpotsRemaining }: {
  item: Workshop; index: number
  resolveType: (w: Workshop) => 'formation' | 'atelier' | 'evenement'
  getTypeIcon: (t: string | null) => React.ElementType
  getTypeLabel: (w: Workshop) => string
  getLevelColor: (l: string) => string
  getSpotsRemaining: (w: Workshop) => number
}) {
  const TypeIcon = getTypeIcon(resolveType(item))
  const spots = getSpotsRemaining(item)
  return (
    <div className="" style={{ animationDelay: `${Math.min(index * 80, 400)}ms` }}>
      <Link href={`/ateliers/${item.id}`} className="block h-full">
        <Card className="overflow-hidden border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 group h-full cursor-pointer flex flex-col">
          <div className="relative h-52 overflow-hidden flex-shrink-0">
            <Image src={item.image || item.image_url || "/logolab.png"} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
              <Badge className="bg-background/85 text-foreground border border-border/60 text-xs backdrop-blur-sm font-medium">
                <TypeIcon size={12} className="mr-1" />{getTypeLabel(item)}
              </Badge>
              {item.level && (
                <Badge className={`${getLevelColor(item.level)} text-xs border backdrop-blur-sm font-medium`}>{item.level}</Badge>
              )}
            </div>
            <div className="absolute top-3 right-3">
              <Badge className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1">
                {item.price === 0 ? 'Gratuit' : `${item.price?.toLocaleString()} FCFA`}
              </Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-white/90 text-xs font-medium">
                <Calendar size={12} />{formatDate(item.date)}
              </div>
              {spots <= 0 ? (
                <Badge className="bg-destructive text-destructive-foreground text-xs font-semibold">Complet</Badge>
              ) : spots <= 5 ? (
                <Badge variant="outline" className="bg-background/80 border-destructive text-destructive text-xs font-semibold backdrop-blur-sm animate-pulse">
                  {spots} place{spots > 1 ? 's' : ''} restante{spots > 1 ? 's' : ''}
                </Badge>
              ) : null}
            </div>
          </div>
          <CardContent className="p-5 flex flex-col flex-1">
            <h3 className="text-base font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors line-clamp-2 leading-snug">{item.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2 flex-1">{item.description}</p>
            <div className="space-y-1.5 mb-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-primary flex-shrink-0" />
                <span>{(() => { const t = formatTime(item.date); const d = formatDuration(item.date, null); if (!t) return 'Horaire à confirmer'; return d ? `${t} · ${d}` : t })()}</span>
              </div>
              {item.location && (
                <div className="flex items-center gap-2"><MapPin size={13} className="text-primary flex-shrink-0" /><span className="line-clamp-1">{item.location}</span></div>
              )}
              {item.instructor && (
                <div className="flex items-center gap-2"><GraduationCap size={13} className="text-primary flex-shrink-0" /><span className="line-clamp-1">Par {item.instructor}</span></div>
              )}
            </div>
            <Button size="sm" className="w-full cursor-pointer" onClick={(e) => e.stopPropagation()}>
              Voir les détails <ArrowRight className="ml-1.5" size={14} />
            </Button>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}

/* ── Carte passée ─────────────────────────────────────────── */
function PastCard({ item, index, resolveType, getTypeIcon, getTypeLabel }: {
  item: Workshop; index: number
  resolveType: (w: Workshop) => 'formation' | 'atelier' | 'evenement'
  getTypeIcon: (t: string | null) => React.ElementType
  getTypeLabel: (w: Workshop) => string
}) {
  const TypeIcon = getTypeIcon(resolveType(item))
  return (
    <div className="" style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}>
      <Link href={`/ateliers/${item.id}`} className="block h-full">
        <Card className="overflow-hidden border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 group h-full cursor-pointer flex flex-col opacity-80 hover:opacity-100">
          <div className="relative h-40 overflow-hidden flex-shrink-0">
            <Image src={item.image || item.image_url || '/logolab.png'} alt={item.title} fill className="object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute top-2 left-2 flex gap-1.5">
              <Badge className="bg-background/85 text-foreground border-border/60 text-xs backdrop-blur-sm">
                <TypeIcon size={11} className="mr-1" />{getTypeLabel(item)}
              </Badge>
              <Badge className="bg-muted/80 text-muted-foreground text-xs backdrop-blur-sm border-0">Terminé</Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2">
              <div className="flex items-center gap-1.5 text-white/80 text-xs"><Calendar size={11} />{formatDate(item.date)}</div>
            </div>
          </div>
          <CardContent className="p-4 flex flex-col flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors leading-snug">{item.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{item.description}</p>
            {item.location && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><MapPin size={10} className="text-primary" />{item.location}</p>
            )}
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
