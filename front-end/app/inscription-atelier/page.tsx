"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  ArrowRight, Calendar, Clock, MapPin, Users, CheckCircle2,
  Send, GraduationCap, Award, ChevronLeft, Wrench, Zap,
  BookOpen, Trophy, Loader2, AlertCircle, Euro, Search, X,
  SlidersHorizontal,
} from "lucide-react"
import Link from "next/link"
import { NavLink } from "@/components/nav-link"
import Image from "next/image"
import PageBreadcrumb from "@/components/PageBreadCrumb"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.fablab.voisilab.online"

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Workshop {
  id: number
  title: string
  description: string
  type: string | null
  date: string
  end_date: string | null
  max_participants: number
  current_participants: number
  capacity: number
  registered: number
  price: number
  image: string | null
  image_url: string | null
  instructor: string | null
  location: string | null
  status: string
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const TYPES = [
  { key: "tous",       label: "Tous",       icon: SlidersHorizontal },
  { key: "formation",  label: "Formations", icon: GraduationCap },
  { key: "atelier",    label: "Ateliers",   icon: Wrench },
  { key: "evenement",  label: "Événements", icon: Zap },
  { key: "ceremonie",  label: "Cérémonies", icon: Trophy },
  { key: "autre",      label: "Autres",     icon: BookOpen },
]

const getTypeInfo = (type: string | null) => {
  switch (type) {
    case "formation": return { icon: GraduationCap, label: "Formation" }
    case "atelier":   return { icon: Wrench,        label: "Atelier" }
    case "evenement": return { icon: Zap,           label: "Événement" }
    case "ceremonie": return { icon: Trophy,        label: "Cérémonie" }
    default:          return { icon: BookOpen,      label: "Activité" }
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })
}

const formatDateShort = (dateStr: string) => {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
  })
}

const formatTime = (dateStr: string) => {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
}

const spotsLeft = (w: Workshop) =>
  (w.capacity ?? w.max_participants ?? 0) - (w.current_participants ?? w.registered ?? 0)

const formatPrice = (price: number) =>
  price === 0 ? "Gratuit" : `${price.toLocaleString("fr-FR")} FCFA`

const stripHtml = (html: string) =>
  (html || "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
const WorkshopSkeleton = () => (
  <div className="space-y-2">
    {[1, 2, 3].map(i => (
      <div key={i} className="p-3 rounded-lg border border-border animate-pulse">
        <div className="flex gap-3">
          <div className="w-11 h-11 rounded-md bg-muted flex-shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-3.5 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
      </div>
    ))}
  </div>
)

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function InscriptionAtelierPage() {
  const [workshops, setWorkshops]     = useState<Workshop[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)
  const [selectedId, setSelectedId]   = useState<number | null>(null)
  const [submitting, setSubmitting]   = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [search, setSearch]           = useState("")
  const [filterType, setFilterType]   = useState("tous")
  const [formData, setFormData]       = useState({ name: "", email: "", phone: "", message: "" })

  useEffect(() => {
    fetch(`${API_URL}/api/workshops/published`)
      .then(r => r.json())
      .then(data => { setWorkshops(data.data || []); setLoading(false) })
      .catch(() => { setError("Impossible de charger les ateliers."); setLoading(false) })
  }, [])

  const filteredWorkshops = useMemo(() => {
    return workshops
      .filter(w => {
        const matchType = filterType === "tous" || w.type === filterType ||
          (filterType === "autre" && !["formation", "atelier", "evenement", "ceremonie"].includes(w.type ?? ""))
        const q = search.toLowerCase()
        const matchSearch = !q ||
          w.title.toLowerCase().includes(q) ||
          (w.instructor ?? "").toLowerCase().includes(q) ||
          (w.location ?? "").toLowerCase().includes(q)
        return matchType && matchSearch
      })
      .sort((a, b) => b.id - a.id)
  }, [workshops, filterType, search])

  const countByType = useMemo(() => {
    const counts: Record<string, number> = { tous: workshops.length }
    workshops.forEach(w => {
      const k = ["formation", "atelier", "evenement", "ceremonie"].includes(w.type ?? "") ? w.type! : "autre"
      counts[k] = (counts[k] || 0) + 1
    })
    return counts
  }, [workshops])

  const current   = workshops.find(w => w.id === selectedId) ?? null
  const remaining = current ? spotsLeft(current) : 0
  const isFull    = remaining <= 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSelect = (id: number) => {
    setSelectedId(id)
    setSubmitted(false)
    setSubmitError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!current) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch(`${API_URL}/api/workshops/${current.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:    formData.name.trim(),
          email:   formData.email.trim(),
          phone:   formData.phone.trim(),
          message: formData.message.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'inscription")

      const nameParts = formData.name.trim().split(" ")
      fetch(`${API_URL}/api/contacts/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: nameParts[0] ?? "",
          lastname:  nameParts.slice(1).join(" ") || "—",
          email:     formData.email.trim(),
          phone:     formData.phone.trim(),
          subject:   `Inscription atelier — ${current.title}`,
          message:   `Inscription à l'atelier : ${current.title}\nDate : ${formatDate(current.date)}${current.location ? `\nLieu : ${current.location}` : ""}\nPrix : ${formatPrice(current.price)}${formData.message.trim() ? `\n\nMessage : ${formData.message.trim()}` : ""}`,
        }),
      }).catch(() => {})

      setSubmitted(true)
      setFormData({ name: "", email: "", phone: "", message: "" })
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setSubmitting(false)
    }
  }

  const handleBack = () => { setSubmitted(false); setSelectedId(null) }

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative pt-16 pb-0 lg:pt-28 overflow-hidden">
        <div className="absolute inset-0">
          <video src="/video.mp4" autoPlay loop muted playsInline
            className="absolute inset-0 object-cover w-full h-full" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 lg:px-8">
          <div className="flex justify-center mb-8 ">
            <PageBreadcrumb pageTitle="Inscription" />
          </div>
          <div className="max-w-2xl mx-auto text-center pb-20 ">
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
              S&apos;inscrire à un événement
            </h1>
            <p className="text-base text-white/70 leading-relaxed max-w-xl mx-auto">
              Formations, ateliers, événements — trouvez et rejoignez l&apos;activité qui correspond à vos besoins.
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">

            {/* Sidebar */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-24 space-y-4">

                {/* Recherche */}
                <div className="relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher un atelier, formateur…"
                    className="w-full pl-9 pr-9 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Filtres */}
                {!loading && workshops.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {TYPES.filter(t => t.key === "tous" || (countByType[t.key] ?? 0) > 0).map(t => {
                      const Icon  = t.icon
                      const count = countByType[t.key] ?? 0
                      const active = filterType === t.key
                      return (
                        <button
                          key={t.key}
                          onClick={() => setFilterType(t.key)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all cursor-pointer ${
                            active
                              ? "bg-foreground text-background border-foreground"
                              : "bg-background text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
                          }`}
                        >
                          <Icon size={12} />
                          {t.label}
                          {t.key !== "tous" && count > 0 && (
                            <span className={`${active ? "opacity-60" : "opacity-40"}`}>{count}</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Liste */}
                <Card className="border border-border shadow-none">
                  <CardContent className="p-4">
                    {!loading && !error && (
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-muted-foreground">
                          {filteredWorkshops.length} résultat{filteredWorkshops.length !== 1 ? "s" : ""}
                        </p>
                        {(search || filterType !== "tous") && (
                          <button
                            onClick={() => { setSearch(""); setFilterType("tous") }}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                          >
                            <X size={11} /> Réinitialiser
                          </button>
                        )}
                      </div>
                    )}

                    {loading && <WorkshopSkeleton />}

                    {error && (
                      <div className="flex items-center gap-2 text-sm text-destructive p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                        <AlertCircle size={14} />{error}
                      </div>
                    )}

                    {!loading && !error && filteredWorkshops.length === 0 && (
                      <div className="text-center py-10">
                        <p className="text-sm text-muted-foreground">Aucun résultat.</p>
                        {(search || filterType !== "tous") && (
                          <button onClick={() => { setSearch(""); setFilterType("tous") }} className="text-xs text-primary mt-1 hover:underline">
                            Effacer les filtres
                          </button>
                        )}
                      </div>
                    )}

                    {!loading && !error && filteredWorkshops.length > 0 && (
                      <div className="space-y-1.5 max-h-[58vh] overflow-y-auto pr-0.5">
                        {filteredWorkshops.map(w => {
                          const { icon: TypeIcon, label: typeLabel } = getTypeInfo(w.type)
                          const spots      = spotsLeft(w)
                          const full       = spots <= 0
                          const imageUrl   = w.image || w.image_url
                          const isSelected = selectedId === w.id

                          return (
                            <button
                              key={w.id}
                              onClick={() => !full && handleSelect(w.id)}
                              className={`w-full p-3 rounded-lg border text-left transition-all duration-150 ${
                                isSelected
                                  ? "border-foreground bg-muted"
                                  : full
                                  ? "border-border opacity-50 cursor-not-allowed"
                                  : "border-border hover:border-foreground/40 hover:bg-muted/50 cursor-pointer"
                              }`}
                            >
                              <div className="flex gap-3 items-start">
                                <div className="w-11 h-11 rounded-md overflow-hidden flex-shrink-0 bg-muted relative border border-border">
                                  {imageUrl ? (
                                    <Image src={imageUrl} alt={w.title} fill className="object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <TypeIcon size={16} className="text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground text-sm line-clamp-1 leading-snug mb-1">{w.title}</p>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                                    <Calendar size={10} className="flex-shrink-0" />
                                    <span className="truncate">{formatDateShort(w.date)}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5">
                                      <TypeIcon size={9} />{typeLabel}
                                    </span>
                                    {full ? (
                                      <span className="text-xs text-destructive font-medium">Complet</span>
                                    ) : spots <= 3 ? (
                                      <span className="text-xs text-orange-500 font-medium">{spots} pl.</span>
                                    ) : null}
                                    <span className="ml-auto text-xs font-semibold text-foreground">{formatPrice(w.price)}</span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Zone droite */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-5">

              {!current && (
                <div className="border-2 border-dashed border-border rounded-xl p-16 text-center">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 border border-border">
                    <SlidersHorizontal size={18} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">Sélectionnez un événement</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Utilisez les filtres ou la recherche pour trouver l&apos;activité qui vous correspond.
                  </p>
                </div>
              )}

              {current && (
                <>
                  {/* Détails */}
                  <Card className="border border-border overflow-hidden">
                    {(current.image || current.image_url) && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={current.image || current.image_url || ""}
                          alt={current.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-3 left-4 flex items-center gap-2">
                          {(() => {
                            const { icon: TypeIcon, label } = getTypeInfo(current.type)
                            return (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-xs border border-white/10">
                                <TypeIcon size={11} />{label}
                              </span>
                            )
                          })()}
                          {isFull ? (
                            <span className="px-2.5 py-1 rounded bg-destructive/80 text-white text-xs">Complet</span>
                          ) : remaining <= 5 ? (
                            <span className="px-2.5 py-1 rounded bg-orange-500/80 text-white text-xs">
                              {remaining} place{remaining > 1 ? "s" : ""} restante{remaining > 1 ? "s" : ""}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    )}

                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl font-bold text-foreground mb-1.5">{current.title}</h2>
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {stripHtml(current.description)}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xl font-bold text-foreground">{formatPrice(current.price)}</p>
                          {!isFull && remaining <= 5 && (
                            <p className="text-xs text-orange-500 mt-0.5">{remaining} place{remaining > 1 ? "s" : ""} !</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          { icon: Calendar, label: "Date",   value: formatDateShort(current.date) },
                          { icon: Clock,    label: "Heure",  value: formatTime(current.date) || "—" },
                          { icon: MapPin,   label: "Lieu",   value: current.location || "À définir" },
                          { icon: Users,    label: "Places", value: `${current.current_participants ?? current.registered ?? 0} / ${current.max_participants ?? current.capacity ?? "?"}` },
                        ].map(({ icon: Icon, label, value }) => (
                          <div key={label} className="p-3 bg-muted/50 rounded-lg text-center border border-border">
                            <Icon size={14} className="text-muted-foreground mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground leading-none mb-1">{label}</p>
                            <p className="text-xs font-semibold text-foreground truncate">{value}</p>
                          </div>
                        ))}
                      </div>

                      {current.instructor && (
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 border border-border">
                            <GraduationCap size={14} className="text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Formateur</p>
                            <p className="text-sm font-medium text-foreground">{current.instructor}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Formulaire */}
                  <Card className="border border-border">
                    <CardContent className="p-6">
                      {submitted ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-4 border border-border">
                            <CheckCircle2 size={24} className="text-foreground" />
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">Inscription enregistrée</h3>
                          <p className="text-sm text-muted-foreground max-w-sm mb-1.5">
                            Votre inscription à <strong>{current.title}</strong> a bien été prise en compte.
                          </p>
                          <p className="text-xs text-muted-foreground mb-8">Une confirmation sera envoyée par email.</p>
                          <Button variant="outline" size="sm" onClick={handleBack}>
                            <ChevronLeft size={14} className="mr-1.5" />
                            Retour aux événements
                          </Button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2 pb-4 border-b border-border">
                            <Award size={15} className="text-muted-foreground" />
                            Formulaire d&apos;inscription
                          </h3>

                          {isFull && (
                            <div className="flex items-center gap-2 p-3 mb-5 bg-muted text-muted-foreground rounded-lg border border-border text-sm">
                              <AlertCircle size={14} className="flex-shrink-0" />
                              Cet événement est complet. Les inscriptions sont fermées.
                            </div>
                          )}

                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="name" className="text-sm font-medium text-foreground mb-1.5 block">Nom complet *</Label>
                                <input
                                  id="name" name="name" type="text" required disabled={isFull}
                                  value={formData.name} onChange={handleChange}
                                  placeholder="Jean Dupont"
                                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-sm transition-all disabled:opacity-40"
                                />
                              </div>
                              <div>
                                <Label htmlFor="email" className="text-sm font-medium text-foreground mb-1.5 block">Adresse email *</Label>
                                <input
                                  id="email" name="email" type="email" required disabled={isFull}
                                  value={formData.email} onChange={handleChange}
                                  placeholder="jean@email.com"
                                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-sm transition-all disabled:opacity-40"
                                />
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="phone" className="text-sm font-medium text-foreground mb-1.5 block">Téléphone *</Label>
                              <input
                                id="phone" name="phone" type="tel" required disabled={isFull}
                                value={formData.phone} onChange={handleChange}
                                placeholder="+225 00 00 00 00 00"
                                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-sm transition-all disabled:opacity-40"
                              />
                            </div>

                            <div>
                              <Label htmlFor="message" className="text-sm font-medium text-foreground mb-1.5 block">
                                Message <span className="text-muted-foreground font-normal text-xs">(optionnel)</span>
                              </Label>
                              <textarea
                                id="message" name="message" disabled={isFull}
                                value={formData.message} onChange={handleChange}
                                rows={3}
                                placeholder="Une question ou précision particulière ?"
                                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-sm resize-none transition-all disabled:opacity-40"
                              />
                            </div>

                            {/* Récap */}
                            <div className="p-4 bg-muted/50 rounded-lg border border-border text-sm space-y-2">
                              <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-2">Récapitulatif</p>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Événement</span>
                                <span className="font-medium text-foreground text-right max-w-[55%]">{current.title}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Date</span>
                                <span className="font-medium text-foreground">{formatDateShort(current.date)}</span>
                              </div>
                              {current.location && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Lieu</span>
                                  <span className="font-medium text-foreground">{current.location}</span>
                                </div>
                              )}
                              <div className="flex justify-between pt-2 border-t border-border items-center">
                                <span className="text-muted-foreground flex items-center gap-1"><Euro size={12} />Tarif</span>
                                <span className="font-bold text-foreground">{formatPrice(current.price)}</span>
                              </div>
                            </div>

                            {submitError && (
                              <div className="flex items-center gap-2 p-3 bg-destructive/5 text-destructive rounded-lg border border-destructive/20 text-sm">
                                <AlertCircle size={13} className="flex-shrink-0" />
                                {submitError}
                              </div>
                            )}

                            <Button type="submit" size="lg" disabled={isFull || submitting} className="w-full">
                              {submitting
                                ? <><Loader2 size={16} className="mr-2 animate-spin" />Envoi en cours…</>
                                : <><Send size={16} className="mr-2" />Confirmer l&apos;inscription</>
                              }
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                              En vous inscrivant, vous acceptez nos{" "}
                              <Link href="/conditions" className="underline underline-offset-2 hover:text-foreground transition-colors">
                                conditions générales
                              </Link>
                            </p>
                          </form>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Une question sur nos ateliers ?</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Notre équipe est disponible pour vous renseigner et vous aider à choisir la formation adaptée.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <NavLink href="/contact">Nous contacter <ArrowRight className="ml-2" size={16} /></NavLink>
            </Button>
            <Button variant="outline" asChild>
              <NavLink href="/ateliers">Voir tous les ateliers</NavLink>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
