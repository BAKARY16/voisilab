"use client"

import React, { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { SectionHeader } from "@/components/section-header"
import PageBreadcrumb from "@/components/PageBreadCrumb"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import {
  ArrowRight,
  Printer,
  Code,
  Bot,
  Palette,
  Zap,
  Package,
  CheckCircle,
  Send,
  ChevronRight,
  FlaskConical,
  AlertCircle,
  Loader2,
  Rocket,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500"

const iconMap: Record<string, React.ElementType> = {
  PrinterOutlined: Printer,
  CodeOutlined: Code,
  RobotOutlined: Bot,
  BulbOutlined: Palette,
  ThunderboltOutlined: Zap,
  ExperimentOutlined: FlaskConical,
  TeamOutlined: Package,
}

interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[] | string
  price_info: string
  image_url: string | null
  order_index: number
  active: boolean
}

function ServiceSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="md:flex">
        <Skeleton className="h-52 md:h-auto md:w-80" />
        <div className="flex-1 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2 flex-wrap pt-2">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function ServicePage() {
  useScrollAnimation()
  
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('🔍 Fetching services from:', `${API_URL}/api/services/active`)
        const response = await fetch(`${API_URL}/api/services/active`)
        console.log('📡 Response status:', response.status)
        if (response.ok) {
          const result = await response.json()
          console.log('✅ Services loaded:', result.data?.length || 0, 'services')
          setServices(result.data || [])
        } else {
          console.error('❌ Response not OK:', response.statusText)
        }
      } catch (error) {
        console.error("❌ Erreur chargement services:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const parseFeatures = (features: string[] | string): string[] => {
    if (Array.isArray(features)) return features
    if (typeof features === "string") {
      try {
        return JSON.parse(features)
      } catch {
        return []
      }
    }
    return []
  }

  const getIcon = (iconName: string) => iconMap[iconName] || Zap

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/contacts/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lastname: formData.lastname,
          firstname: formData.firstname,
          email: formData.email,
          phone: formData.phone,
          subject: `Demande de devis - ${formData.service}`,
          message: formData.message
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de l\'envoi du message')
      }

      const result = await response.json()
      console.log('Demande envoyée:', result)
      setSubmitted(true)

      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          lastname: "",
          firstname: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        })
      }, 5000)
    } catch (error) {
      console.error('Erreur:', error)
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'envoi. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Hero Section avec vidéo */}
      <section className="relative pt-16 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <video
            src="/video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full"
            onEnded={(e) => {
              const video = e.target as HTMLVideoElement
              video.currentTime = 0
              video.play()
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"></div>
        </div>

        <div className="relative z-10">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-center mb-8 fade-in-up">
              <PageBreadcrumb pageTitle="Nos Services" />
            </div>

            <div className="max-w-4xl mx-auto text-center fade-in-up">
              <Badge className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" variant="outline">
                <Zap className="w-4 h-4 mr-2" />
                Nos expertises
              </Badge>

              <h1 className="text-4xl uppercase lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
                <span className="block">Services de</span>
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Fabrication Numérique
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto">
                De la conception à la réalisation, nous vous accompagnons dans tous
                vos projets technologiques avec expertise et innovation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300"
                  onClick={() => document.getElementById('devis')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Demander un devis
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm"
                  asChild
                >
                  <Link href="/projet">Soumettre un projet</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Services List */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            title="Nos Services"
            subtitle="Découvrez notre gamme complète de services de fabrication numérique"
          />

          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <ServiceSkeleton key={i} />
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Aucun service disponible.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {services.map((service, index) => {
                  const IconComponent = getIcon(service.icon)
                  const features = parseFeatures(service.features)
                  const isEven = index % 2 === 0
                  const isExpanded = expandedId === service.id

                return (
                  <div key={service.id} className="" style={{ animationDelay: `${index * 100}ms` }}>
                    <Card className="overflow-hidden border-2 border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                      <div className={`lg:flex ${!isEven ? "lg:flex-row-reverse" : ""}`}>
                        {/* Image */}
                        <div className="relative h-56 lg:h-auto lg:w-80 xl:w-96 bg-muted flex-shrink-0 overflow-hidden">
                          {service.image_url ? (
                            <Image
                              src={service.image_url}
                              alt={service.title}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-500"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                              <IconComponent className="w-20 h-20 text-primary/20" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 lg:p-8">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-primary/10">
                              <IconComponent className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h2 className="text-xl font-bold mb-1">
                                {service.title}
                              </h2>
                              {service.price_info && (
                                <Badge variant="secondary" className="font-normal">
                                  {service.price_info}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-6 leading-relaxed">
                            {service.description}
                          </p>

                        {/* Features */}
                        {features.length > 0 && (
                          <div className="mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {features.map((feature, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
                          <Button size="sm" asChild>
                            <Link href="/projet">
                              Demander un devis
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedId(isExpanded ? null : service.id)}
                          >
                            {isExpanded ? "Réduire" : "En savoir plus"}
                            <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                          </Button>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="mt-6 pt-6 border-t bg-muted/30 -mx-6 lg:-mx-8 -mb-6 lg:-mb-8 px-6 lg:px-8 pb-6 lg:pb-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-4 rounded-lg bg-background border">
                                <p className="text-sm font-medium mb-1">Délai estimé</p>
                                <p className="text-sm text-muted-foreground">Variable selon projet</p>
                              </div>
                              <div className="p-4 rounded-lg bg-background border">
                                <p className="text-sm font-medium mb-1">Accompagnement</p>
                                <p className="text-sm text-muted-foreground">De A à Z</p>
                              </div>
                              <div className="p-4 rounded-lg bg-background border">
                                <p className="text-sm font-medium mb-1">Support</p>
                                <p className="text-sm text-muted-foreground">Inclus</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })}
            </div>
          )}
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section id="devis" className="py-20 lg:py-28 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            title="Demandez votre devis"
            subtitle="Remplissez le formulaire et recevez une réponse sous 48h"
          />

          <div className="max-w-2xl mx-auto fade-in-up">
            <Card className="border-2 border-border shadow-lg">
              <CardContent className="p-6 lg:p-8">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Demande envoyée !</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Notre équipe vous contactera sous 48h pour discuter de votre projet.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 rounded">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="text-red-500" size={20} />
                          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="lastname" className="mb-2 block">
                          Nom <span className="text-red-500">*</span>
                        </Label>
                        <input
                          id="lastname"
                          name="lastname"
                          type="text"
                          required
                          value={formData.lastname}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                          placeholder="Kouassi"
                        />
                      </div>
                      <div>
                        <Label htmlFor="firstname" className="mb-2 block">
                          Prénom <span className="text-red-500">*</span>
                        </Label>
                        <input
                          id="firstname"
                          name="firstname"
                          type="text"
                          required
                          value={formData.firstname}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                          placeholder="Jean"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="mb-2 block">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                          placeholder="jean@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="mb-2 block">
                          Téléphone <span className="text-red-500">*</span>
                        </Label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                          placeholder="+225 07 XX XX XX XX"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="service" className="mb-2 block">
                        Service souhaité <span className="text-red-500">*</span>
                      </Label>
                      <input
                        id="service"
                        name="service"
                        type="text"
                        required
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="Ex: Impression 3D, Développement web, Prototypage..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="mb-2 block">
                        Décrivez votre projet <span className="text-red-500">*</span>
                      </Label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none transition-all"
                        placeholder="Décrivez votre projet, vos besoins et objectifs..."
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Envoyer ma demande
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      En soumettant ce formulaire, vous acceptez d&apos;être contacté par notre équipe
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto fade-in-up">
            <Card className="border-2 border-primary/30 shadow-lg overflow-hidden">
              <CardContent className="p-10 lg:p-16 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Rocket className="text-primary" size={40} />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Vous avez un projet en tête ?
                </h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Contactez-nous pour discuter de votre projet. Notre équipe vous
                  accompagne de la conception à la réalisation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="group bg-gradient-to-r from-primary to-accent" asChild>
                    <Link href="/projet">
                      Soumettre un projet
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/about">En savoir plus sur nous</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
