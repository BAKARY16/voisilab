"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import PageBreadcrumb from "@/components/PageBreadCrumb"
import {
  Linkedin, Mail, ArrowRight, Users, Lightbulb, Handshake,
  Rocket, Shield, Award, CheckCircle2, Quote, Zap, Star
} from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useState, useEffect } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.fablab.voisilab.online'

const getImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return '/placeholder.svg'
  if (imagePath.startsWith('https://api.fablab.voisilab.online')) return imagePath
  if (imagePath.includes('localhost')) {
    const match = imagePath.match(/(\/uploads\/.+)/)
    return match ? `${API_URL}${match[1]}` : '/placeholder.svg'
  }
  if (imagePath.startsWith('http')) return imagePath
  if (imagePath.startsWith('/uploads/')) return `${API_URL}${imagePath}`
  return imagePath
}

// Pas de données hardcodées — tout vient de l'API

const TRUST_POINTS = [
  {
    icon: Shield,
    title: "Une équipe expérimentée",
    description: "Chaque membre de l'équipe est sélectionné pour son expertise et sa passion. Ensemble, nous couvrons toutes les disciplines du fablab : code, design 3D, gestion de projet et pédagogie.",
  },
  {
    icon: Award,
    title: "Des résultats concrets",
    description: "Plus de 100 projets accompagnés depuis 2019. Nos clients et apprenants repartent avec des compétences réelles et des prototypes fonctionnels, pas des promesses.",
  },
  {
    icon: CheckCircle2,
    title: "Un accompagnement",
    description: "Ici, vous n'êtes pas un numéro. Chaque projet est suivi personnellement par un membre de l'équipe dédié, de l'idée à la réalisation finale.",
  },
]

const ENGAGEMENTS = [
  { icon: Zap, text: "Réactivité : une réponse sous 48h ouvrable" },
  { icon: Star, text: "Qualité : livrables testés et validés" },
  { icon: Handshake, text: "Transparence : communication claire à chaque étape" },
  { icon: Lightbulb, text: "Innovation : toujours à la pointe des nouvelles pratiques" },
  { icon: Users, text: "Communauté : votre projet bénéficie de toute notre expertise collective" },
  { icon: Rocket, text: "Ambition : nous croyons en chaque projet, aussi unique soit-il" },
]

export function TeamSection() {
  useScrollAnimation()
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/api/team/active`)
      .then(res => {
        if (!res.ok) throw new Error('API error')
        return res.json()
      })
      .then(result => {
        if (result?.data && result.data.length > 0) {
          setTeamMembers(result.data.map((m: any) => ({
            name: m.name || m.full_name,
            role: m.role,
            bio: m.bio,
            image: m.image || m.avatar_url || m.photo_url,
            email: m.email,
            linkedin: m.linkedin || m.linkedin_url,
            skills: m.skills
              ? (typeof m.skills === 'string'
                ? m.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
                : Array.isArray(m.skills) ? m.skills : [])
              : [],
            isFounder: m.is_founder || false,
            quote: m.quote || null,
          })))
        }
        // Si l'API renvoie 0 membres, on reste sur tableau vide — pas de fallback hardcodé
      })
      .catch(() => setApiError(true))
      .finally(() => setLoading(false))
  }, [])

  const displayTeam = teamMembers
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Rotation automatique toutes les 4 secondes
  useEffect(() => {
    if (isPaused || displayTeam.length <= 1) return
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % displayTeam.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isPaused, displayTeam.length])

  return (
    <div className="min-h-screen bg-background">

      {/*  Hero  */}
      <section className="relative pt-16 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <video src="/video.mp4" autoPlay loop muted playsInline className="object-cover w-full h-full"
            onEnded={(e) => { const v = e.target as HTMLVideoElement; v.currentTime = 0; v.play() }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-center mb-8 fade-in-up">
              <PageBreadcrumb pageTitle="Notre équipe" />
            </div>
            <div className="max-w-4xl mx-auto text-center fade-in-up">
              <Badge className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                L&apos;équipe qui fait la différence
              </Badge>
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
                <span className="block">Des experts derrière</span>
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">chaque projet Voisilab</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto">
                Jeunes passionnés, créatifs et engagés  notre équipe met son savoir-faire à votre service pour transformer vos idées en réalité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300" asChild>
                  <Link href="#equipe">
                    <span className="relative z-10 flex items-center gap-2">
                      Rencontrer l&apos;équipe
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-black border-white/30 hover:bg-white/10 backdrop-blur-sm" asChild>
                  <Link href="/about#contact-section">Travailler avec nous</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </section>

      {/*  Stats dynamiques  */}
      <section className="py-12 border-b border-border bg-muted/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border max-w-4xl mx-auto">
            {[
              { value: loading ? "…" : `${displayTeam.length}`, label: "Experts passionnés" },
              { value: "100+", label: "Projets livrés" },
              { value: "20+", label: "Ateliers animés" },
              { value: "2019", label: "Fondé à Abidjan" },
            ].map((stat, i) => (
              <div key={i} className="text-center py-8 px-6 fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="text-3xl lg:text-4xl font-black text-foreground">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  Pourquoi nous faire confiance  */}
      <section className="py-20 lg:py-28 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14 fade-in-up">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-xs font-semibold uppercase tracking-widest">Confiance &amp; Expertise</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Pourquoi nous faire confiance ?</h2>
            <p className="text-muted-foreground leading-relaxed">Voisilab n&apos;est pas qu&apos;un fablab. C&apos;est une équipe, compétente et engagée qui fait de votre réussite sa priorité.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TRUST_POINTS.map((point, i) => {
              const Icon = point.icon
              return (
                <div key={i} className="fade-in-up text-center" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Icon size={28} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{point.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/*  Spotlight équipe — carrousel auto toutes les 4s  */}
      {!loading && displayTeam.length > 0 && (
        <section
          className="py-20 lg:py-28 bg-muted/20 border-b border-border overflow-hidden"

        >
          <div className="container mx-auto px-4 lg:px-8"
          >

            {/* En-tête */}
            <div className="max-w-2xl mx-auto text-center mb-14 fade-in-up"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <Badge variant="outline" className="mb-4 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
                L&apos;équipe en détail
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Chaque membre mérite d&apos;être connu
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Découvrez les visages et les expertises qui font vivre Voisilab au quotidien.
              </p>
            </div>

            {/* Carte principale */}
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">

                {/* ── Photo ── */}
                <div key={`photo-${activeIndex}`} className="relative order-2 lg:order-1">
                  <div className="relative aspect-[4/5] max-w-sm mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={getImageUrl(displayTeam[activeIndex].image)}
                      alt={displayTeam[activeIndex].name}
                      fill
                      className="object-cover transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                    {/* Badge numéro */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                        <span className="text-primary">{activeIndex + 1}</span>
                        <span className="opacity-50">/</span>
                        <span>{displayTeam.length}</span>
                      </span>
                    </div>

                    {/* Pause indicator */}
                    {isPaused && (
                      <div className="absolute top-4 right-4">
                      </div>
                    )}

                    {/* Skills en overlay bas */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex flex-wrap gap-2">
                        {(displayTeam[activeIndex].skills || []).slice(0, 4).map((skill: string, si: number) => (
                          <span key={si} className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-md font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl" />
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
                </div>

                {/* ── Informations structurées ── */}
                <div key={`info-${activeIndex}`} className="order-1 lg:order-2 flex flex-col justify-center">

                  {/* Identité */}
                  <div className="mb-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {displayTeam[activeIndex].isFounder && (
                        <Badge className="text-xs px-2 py-0.5 bg-primary/10 text-primary border border-primary/20">
                          <Star size={10} className="mr-1" /> Fondatrice
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        {displayTeam[activeIndex].role}
                      </Badge>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                      {displayTeam[activeIndex].name}
                    </h3>
                  </div>

                  {/* Biographie */}
                  <div className="mb-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">À propos</p>
                    <p className="text-muted-foreground leading-relaxed text-base border-l-2 border-primary/30 pl-4">
                      {displayTeam[activeIndex].bio}
                    </p>
                  </div>

                  {/* Citation */}
                  {displayTeam[activeIndex].quote && (
                    <blockquote className="mb-6 bg-muted/50 rounded-xl p-5 border border-border">
                      <Quote size={18} className="text-primary/50 mb-2" />
                      <p className="text-foreground font-medium italic leading-relaxed text-sm">
                        &ldquo;{displayTeam[activeIndex].quote}&rdquo;
                      </p>
                    </blockquote>
                  )}

                  {/* Compétences */}
                  {(displayTeam[activeIndex].skills || []).length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Compétences clés</p>
                      <div className="flex flex-wrap gap-2">
                        {(displayTeam[activeIndex].skills as string[]).map((skill, si) => (
                          <span key={si} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium border border-primary/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Liens */}
                  <div className="flex items-center gap-3 pt-5 border-t border-border">
                    {displayTeam[activeIndex].email && (
                      <a href={`mailto:${displayTeam[activeIndex].email}`}
                        className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Mail size={14} /> Contacter
                      </a>
                    )}
                    {displayTeam[activeIndex].linkedin && displayTeam[activeIndex].linkedin !== '#' && (
                      <a href={displayTeam[activeIndex].linkedin} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm font-medium text-foreground hover:bg-[#0A66C2] hover:text-white transition-colors">
                        <Linkedin size={14} /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Navigation ── */}
              <div className="mt-12 flex flex-col items-center gap-5">

                {/* Barre de progression */}
                <div className="w-full max-w-xs h-1 bg-border rounded-full overflow-hidden">
                  <div
                    key={`bar-${activeIndex}-${isPaused}`}
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: isPaused ? `${((activeIndex + 1) / displayTeam.length) * 100}%` : '100%',
                      transition: isPaused ? 'none' : 'width 4s linear',
                      transformOrigin: 'left',
                      animation: isPaused ? 'none' : undefined,
                    }}
                  />
                </div>

                {/* Points de navigation */}
                <div className="flex items-center gap-2">
                  {displayTeam.map((m, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Voir ${m.name}`}
                      title={m.name}
                      className={`rounded-full transition-all duration-300 ${i === activeIndex
                        ? 'w-8 h-2.5 bg-primary'
                        : 'w-2.5 h-2.5 bg-border hover:bg-muted-foreground'
                        }`}
                    />
                  ))}
                </div>

                {/* Flèches précédent / suivant */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveIndex(prev => (prev - 1 + displayTeam.length) % displayTeam.length)}
                    className="px-5 py-2 bg-muted rounded-lg text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors border border-border"
                  >
                    ← Précédent
                  </button>
                  <button
                    onClick={() => setActiveIndex(prev => (prev + 1) % displayTeam.length)}
                    className="px-5 py-2 bg-muted rounded-lg text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors border border-border"
                  >
                    Suivant →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/*  Grille équipe  */}
      <section id="equipe" className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14 ">
            {/* <Badge variant="outline" className="mb-4 px-3 py-1 text-xs font-semibold uppercase tracking-widest">L&apos;équipe complète</Badge> */}
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Les membres de l&apos;équipe</h2>
            <p className="text-muted-foreground leading-relaxed">Chaque talent de Voisilab apporte une expertise complémentaire pour répondre à tous les aspects de votre projet.</p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : apiError ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <Users size={24} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm max-w-xs">
                Impossible de charger les membres depuis l&apos;API pour le moment. Veuillez réessayer plus tard.
              </p>
              <button
                onClick={() => { setApiError(false); setLoading(true); fetch(`${API_URL}/api/team/active`).then(r => r.json()).then(result => { if (result?.data?.length > 0) setTeamMembers(result.data.map((m: any) => ({ name: m.name || m.full_name, role: m.role, bio: m.bio, image: m.image || m.avatar_url, email: m.email, linkedin: m.linkedin || m.linkedin_url, skills: m.skills ? (typeof m.skills === 'string' ? m.skills.split(',').map((s: string) => s.trim()) : m.skills) : [], isFounder: m.is_founder || false, quote: m.quote || null }))); }).catch(() => setApiError(true)).finally(() => setLoading(false)) }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Réessayer
              </button>
            </div>
          ) : displayTeam.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
              <p className="text-muted-foreground text-sm">Aucun membre d&apos;équipe trouvé pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {displayTeam.map((member, index) => (
                <div key={member.name + index} className="group" style={{ animationDelay: `${index * 70}ms` }}>
                  <Card className="overflow-hidden border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    {/* Photo */}
                    <div className="relative h-72 overflow-hidden bg-muted flex-shrink-0">
                      <Image src={getImageUrl(member.image)} alt={member.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white font-bold text-lg leading-tight">{member.name}</p>
                        <p className="text-white/80 text-sm mt-0.5">{member.role}</p>
                      </div>
                    </div>
                    {/* Contenu */}
                    <CardContent className="p-6 flex flex-col flex-1 gap-4">
                      {member.bio && (
                        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{member.bio}</p>
                      )}
                      {/* Skills */}
                      {member.skills && member.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {(member.skills as string[]).slice(0, 4).map((skill, si) => (
                            <span key={si} className="px-2 py-1 bg-primary/8 text-primary text-xs rounded-md font-medium border border-primary/15">{skill}</span>
                          ))}
                        </div>
                      )}
                      {/* Social */}
                      <div className="flex gap-2 pt-2 border-t border-border">
                        {member.email && (
                          <a href={`mailto:${member.email}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-md text-xs font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                            aria-label={`Email ${member.name}`}>
                            <Mail size={13} />
                            Email
                          </a>
                        )}
                        {member.linkedin && member.linkedin !== '#' && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-md text-xs font-medium text-muted-foreground hover:bg-[#0A66C2] hover:text-white transition-colors"
                            aria-label={`LinkedIn ${member.name}`}>
                            <Linkedin size={13} />
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/*  Nos engagements  */}
      <section className="py-20 lg:py-28 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="fade-in-up">
                {/* <Badge variant="outline" className="mb-4 px-3 py-1 text-xs font-semibold uppercase tracking-widest">Notre promesse</Badge> */}
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-5">Ce que nous vous promettons</h2>
                <p className="text-muted-foreground leading-relaxed text-base mb-8">
                  Confier votre projet à Voisilab, c&apos;est choisir une équipe qui s&apos;engage pleinement. Pas de demi-mesures. Nous mettons tout notre savoir-faire au service de votre réussite.
                </p>
                <Button size="lg" asChild>
                  <Link href="/projet">Démarrer un projet <ArrowRight className="ml-2" size={18} /></Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {ENGAGEMENTS.map((eng, i) => {
                  const Icon = eng.icon
                  return (
                    <div key={i} className="flex items-center gap-4 p-4 bg-background rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all" style={{ animationDelay: `${i * 60}ms` }}>
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{eng.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*  CTA Final  */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-8">
              <Handshake size={28} className="text-primary" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-5">
              Prêt à travailler avec une équipe qui croit en votre projet ?
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed text-lg">
              Que vous ayez une idée à prototyper, une compétence à acquérir ou un projet à concrétiser, l&apos;équipe Voisilab est là pour vous accompagner de A à Z.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-xl transition-all duration-300" asChild>
                <Link href="/about#contact-section">
                  Nous contacter
                  <ArrowRight className="ml-2" size={18} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projet">Soumettre un projet</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
