"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
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
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  FlaskConical,
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
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/api/services/active`)
        if (response.ok) {
          const result = await response.json()
          setServices(result.data || [])
        }
      } catch (error) {
        console.error("Erreur chargement services:", error)
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: "", email: "", phone: "", service: "", message: "" })
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              Nos expertises
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Services de fabrication numerique
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              De la conception a la realisation, nous vous accompagnons dans tous
              vos projets technologiques avec expertise et innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 px-4">
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
                  <Card
                    key={service.id}
                    className="overflow-hidden border hover:shadow-lg transition-all duration-300"
                  >
                    <div className={`lg:flex ${!isEven ? "lg:flex-row-reverse" : ""}`}>
                      {/* Image */}
                      <div className="relative h-56 lg:h-auto lg:w-80 xl:w-96 bg-muted flex-shrink-0">
                        {service.image_url ? (
                          <Image
                            src={service.image_url}
                            alt={service.title}
                            fill
                            className="object-cover"
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
                            <h2 className="text-xl font-semibold mb-1">
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
                        <div className="flex flex-wrap items-center gap-3 pt-2 border-t">
                          <Button size="sm" asChild>
                            <Link href="/projet">
                              Demander un devis
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedId(isExpanded ? null : service.id)
                            }
                          >
                            {isExpanded ? "Reduire" : "En savoir plus"}
                            <ChevronRight
                              className={`w-4 h-4 ml-1 transition-transform ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                            />
                          </Button>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="mt-6 pt-6 border-t bg-muted/30 -mx-6 lg:-mx-8 -mb-6 lg:-mb-8 px-6 lg:px-8 pb-6 lg:pb-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-4 rounded-lg bg-background border">
                                <p className="text-sm font-medium mb-1">
                                  Delai estime
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Variable selon projet
                                </p>
                              </div>
                              <div className="p-4 rounded-lg bg-background border">
                                <p className="text-sm font-medium mb-1">
                                  Accompagnement
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  De A a Z
                                </p>
                              </div>
                              <div className="p-4 rounded-lg bg-background border">
                                <p className="text-sm font-medium mb-1">Support</p>
                                <p className="text-sm text-muted-foreground">
                                  Inclus
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Quote Form */}
      <section id="devis" className="py-16 px-4 bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold mb-3">
              Demandez votre devis personnalise
            </h2>
            <p className="text-muted-foreground">
              Remplissez le formulaire et recevez une reponse sous 48h
            </p>
          </div>

          <Card>
            <CardContent className="p-6 lg:p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Demande envoyee</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Notre equipe vous contactera sous 48h pour discuter de votre
                    projet.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="mb-2 block">
                        Nom complet
                      </Label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="mb-2 block">
                        Email
                      </Label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="jean@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="mb-2 block">
                        Telephone
                      </Label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="+229 00 00 00 00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="service" className="mb-2 block">
                        Service souhaite
                      </Label>
                      <select
                        id="service"
                        name="service"
                        required
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Selectionnez un service</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="mb-2 block">
                      Decrivez votre projet
                    </Label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-2.5 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Decrivez votre projet, vos besoins et objectifs..."
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer ma demande
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Vous avez un projet en tete ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Contactez-nous pour discuter de votre projet. Notre equipe vous
            accompagne de la conception a la realisation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/projet">
                Soumettre un projet
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">En savoir plus sur nous</Link>
            </Button>
          </div>
        </div>
      </section>

      
    </div>
  )
}
