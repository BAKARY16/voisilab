"use client"

import { SectionHeader } from "@/components/section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import PageBreadcrumb from "@/components/PageBreadCrumb"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useState, type ChangeEvent, type FormEvent } from "react"
import {
  Lightbulb,
  Users,
  Target,
  Award,
  Calendar,
  MapPin,
  Clock,
  Mail,
  Phone,
  CheckCircle2,
  Zap,
  Heart,
  Rocket,
  ArrowRight,
  Star,
  TrendingUp,
  Send,
  MessageSquare,
  AlertCircle
} from "lucide-react"

export function AboutContact() {
  useScrollAnimation()
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    email: "",
    phone: "",
    projectType: "",
    description: "",
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500'
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
          subject: formData.projectType,
          message: formData.description
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de l\'envoi du message')
      }

      const result = await response.json()
      console.log('Message envoyé:', result)
      setSubmitted(true)

      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          lastname: "",
          firstname: "",
          email: "",
          phone: "",
          projectType: "",
          description: "",
        })
      }, 5000)
    } catch (error) {
      console.error('Erreur:', error)
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'envoi du message. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const stats = [
    {
      icon: Users,
      value: "500+",
      label: "Membres actifs",
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Rocket,
      value: "150+",
      label: "Projets réalisés",
      gradient: "from-purple-500/10 to-pink-500/10",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
      icon: Calendar,
      value: "5+",
      label: "Années d'expérience",
      gradient: "from-green-500/10 to-emerald-500/10",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      icon: Award,
      value: "20+",
      label: "Ateliers organisés",
      gradient: "from-orange-500/10 to-red-500/10",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600 dark:text-orange-400"
    },
  ]

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Nous encourageons la créativité et l'expérimentation pour repousser les limites de la fabrication numérique.",
      gradient: "from-yellow-500/10 to-orange-500/10",
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-600 dark:text-yellow-400"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Un espace ouvert où makers, artistes et entrepreneurs partagent leurs connaissances et compétences.",
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Target,
      title: "Accessibilité",
      description: "Démocratiser l'accès aux technologies de fabrication pour tous, du débutant à l'expert.",
      gradient: "from-green-500/10 to-emerald-500/10",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      icon: Heart,
      title: "Communauté",
      description: "Créer un écosystème bienveillant où chacun peut apprendre, créer et grandir ensemble.",
      gradient: "from-pink-500/10 to-rose-500/10",
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-600 dark:text-pink-400"
    },
  ]

  const services = [
    { name: "Accès aux équipements de fabrication numérique", featured: true },
    { name: "Formations et ateliers pratiques", featured: true },
    { name: "Accompagnement de projets", featured: false },
    { name: "Espace de coworking créatif", featured: false },
    { name: "Événements et networking", featured: false },
    { name: "Prototypage rapide", featured: true },
    { name: "Impression 3D et découpe laser", featured: true },
    { name: "Conseil en innovation", featured: false },
  ]

  const milestones = [
    { year: "2019", title: "Création", description: "Lancement officiel de Voisilab" },
    { year: "2020", title: "Expansion", description: "Acquisition de nouveaux équipements" },
    { year: "2022", title: "Reconnaissance", description: "Prix de l'innovation locale" },
    { year: "2024", title: "Croissance", description: "500+ membres actifs" },
  ]

  
  const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    description: "Écrivez-nous à",
    contact: "fablab@uvci.edu.ci",
    // CHANGE LE HREF POUR UTILISER GMAIL WEB :
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=fablab@uvci.edu.ci",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Phone,
    title: "Téléphone",
    description: "Appelez-nous au",
    contact: "+225 07 59 13 69 05",
    href: "tel:+2250759136905",
    gradient: "from-green-500/10 to-emerald-500/10",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    icon: MapPin,
    title: "Adresse",
    description: "Visitez-nous à",
    contact: "Abidjan Cocody Deux-Plateaux, rue K4",
    // CHANGE NULL PAR UN LIEN GOOGLE MAPS :
    href: "https://maps.google.com/maps?q=Abidjan+Cocody+Deux-Plateaux+rue+K4",
    gradient: "from-purple-500/10 to-pink-500/10",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
]
  const benefits = [
    "Réponse garantie sous 48h ouvrable",
    "Équipe dédiée à votre écoute",
    "Accompagnement personnalisé",
    "Support technique disponible",
    "Consultation gratuite",
    "Devis détaillé offert",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0">
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"></div>
        </div>

        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <div className="relative z-10">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-center mb-8 fade-in-up">
              <PageBreadcrumb pageTitle="À propos & Contact" />
            </div>

            <div className="max-w-4xl mx-auto text-center fade-in-up">
              {/* <Badge className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" variant="outline">
                <Zap className="w-4 h-4 mr-2" />
                Depuis 2019
              </Badge> */}

              <h1 className="text-4xl uppercase lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
                <span className="block">Découvrez</span>
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Voisilab
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto">
                Un lieu de rencontre, d'apprentissage et de création où la technologie
                rencontre l'imagination pour donner vie à vos idées les plus audacieuses.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300"
                  asChild
                >
                  <Link href="/projet">
                    <span className="relative z-10 flex items-center gap-2">
                      Soumettre un projet
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white text-black cursor-pointer border-white/30 hover:bg-white/10 backdrop-blur-sm"
                  onClick={() => {
                    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Nous contacter
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 lg:py-16 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <Card className={`relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 group h-full bg-gradient-to-br`}>
                    <CardContent className="p-6 lg:p-8 text-center">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>
                      <div className={`w-16 h-16 ${stat.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <Icon className={`${stat.iconColor}`} size={32} />
                      </div>
                      <div className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            title="Notre Histoire"
            subtitle="Découvrez comment Voisilab est devenu un hub d'innovation incontournable"
          />

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="fade-in-up">
                <Card className="border-2 border-primary/20 h-full shadow-xl">
                  <CardContent className="p-8 lg:p-10">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        Fondé en <strong className="text-foreground">2019</strong>, Voisilab est né de la vision
                        de créer un espace où la technologie et la créativité se rencontrent. Notre mission était
                        claire : démocratiser l'accès aux outils de fabrication numérique et créer une communauté
                        de makers, d'innovateurs et de créateurs.
                      </p>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        Au fil des années, nous avons accueilli des centaines de projets, des plus simples prototypes
                        aux innovations les plus complexes. Notre fablab est devenu un lieu de rencontre privilégié
                        pour les étudiants, entrepreneurs, artistes et passionnés de technologie.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Aujourd'hui, Voisilab continue d'évoluer, toujours guidé par les mêmes valeurs :
                        <strong className="text-foreground"> innovation, collaboration, accessibilité et communauté</strong>.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="fade-in-up space-y-6">
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <TrendingUp className="text-primary" size={28} />
                  Nos Étapes Clés
                </h3>
                {milestones.map((milestone, index) => (
                  <Card key={index} className="border-2 border-border hover:border-primary/50 transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                          <span className="text-xl font-bold text-primary group-hover:text-primary-foreground transition-colors">
                            {milestone.year}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-foreground mb-1">{milestone.title}</h4>
                          <p className="text-sm text-muted-foreground">{milestone.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 lg:py-32 bg-muted/30 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            title="Nos Valeurs"
            subtitle="Les principes qui guident notre action au quotidien"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <Card className={`relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 group h-full bg-gray-100`}>
                    <CardContent className="p-8 lg:p-10">
                      {/* <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div> */}
                      <div className={`w-16 h-16 ${value.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <Icon className={`${value.iconColor}`} size={28} />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-4">{value.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Nos Services */}
      <section className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            title="Nos Services"
            subtitle="Tout ce dont vous avez besoin pour concrétiser vos projets"
          />

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 fade-in-up">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className={`border-2 transition-all duration-300 group ${
                    service.featured
                      ? 'border-primary/30 hover:border-primary bg-gradient-to-br from-primary/5 to-accent/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {service.featured ? (
                          <Star className="text-primary fill-primary" size={20} />
                        ) : (
                          <CheckCircle2 className="text-primary" size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                          {service.name}
                        </span>
                        {service.featured && (
                          <Badge variant="outline" className="ml-2 text-xs border-primary text-primary">
                            Populaire
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages Section */}
      <section className="py-20 lg:py-32 bg-muted/30 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            title="Ce que disent nos membres"
            subtitle="Découvrez les témoignages de ceux qui ont fait confiance à Voisilab"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Kouamé Yao",
                role: "Entrepreneur",
                quote: "Voisilab m'a permis de concrétiser mon prototype en un temps record. L'accompagnement technique est exceptionnel !",
                avatar: "/avatar1.jpg",
                rating: 5
              },
              {
                name: "Aminata Diallo",
                role: "Designer Produit",
                quote: "Un espace incroyable où la créativité n'a pas de limites. Les équipements sont de qualité professionnelle.",
                avatar: "/avatar2.jpg",
                rating: 5
              },
              {
                name: "Jean-Pierre N'Goran",
                role: "Étudiant Ingénieur",
                quote: "Les formations proposées sont très complètes. J'ai appris à utiliser l'impression 3D et la découpe laser en quelques jours.",
                avatar: "/avatar3.jpg",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 h-full">
                  <CardContent className="p-8">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <p className="text-muted-foreground italic mb-6 leading-relaxed">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visite Virtuelle Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            title="Visite Virtuelle"
            subtitle="Découvrez nos locaux et équipements en vidéo"
          />

          <div className="max-w-5xl mx-auto">
            <Card className="border-2 border-border overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/oCZJ-RQFRi8"
                  title="Visite Virtuelle Voisilab"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <CardContent className="p-6 bg-muted/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Venez nous rendre visite</h3>
                    <p className="text-sm text-muted-foreground">
                      Abidjan Cocody Deux-Plateaux, rue K4 - Du lundi au samedi
                    </p>
                  </div>
                  <Button asChild>
                    <Link href="https://maps.google.com/maps?q=Abidjan+Cocody+Deux-Plateaux+rue+K4" target="_blank">
                      <MapPin className="mr-2" size={18} />
                      Voir sur la carte
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-20 lg:py-32 bg-muted/30 relative scroll-mt-20">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            title="Contactez-nous"
            subtitle="Nous sommes là pour répondre à vos questions et vous accompagner"
          />

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <div key={index} className="fade-in-up group" style={{ animationDelay: `${index * 100}ms` }}>
                  <Card className={`relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 h-full bg-gradient-to-br`}>
                    <CardContent className="p-8">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>
                      <div className={`w-16 h-16 ${method.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <Icon className={`${method.iconColor}`} size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{method.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                      {method.href ? (
                        <a
                          href={method.href}
                          // AJOUTE CES DEUX LIGNES CI-DESSOUS :
                          target={method.title === "Email" || method.title === "Adresse" ? "_blank" : "_self"}
                          rel={method.title === "Email" || method.title === "Adresse" ? "noopener noreferrer" : ""}
                          className="text-foreground font-semibold hover:text-primary transition-colors flex items-center gap-2 group/link"
                        >
                          <span className="truncate">{method.contact}</span>
                          <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover/link:translate-x-1 transition-transform" />
                        </a>
                      ) : (
                        <p className="text-foreground font-semibold">{method.contact}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
          

          {/* Form + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-3 fade-in-up">
              <Card className="border shadow- overflow-hidden">
                <div className="border-b border-border p-8 lg:p-10">
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                    Envoyez-nous un message
                  </h2>
                  <p className="text-muted-foreground">
                    Notre équipe vous répondra dans les meilleurs délais
                  </p>
                </div>

                <CardContent className="p-8 lg:p-10">
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 size={40} className="text-primary" />
                      </div>
                      <h3 className="text-3xl font-bold text-foreground mb-3">Message envoyé avec succès !</h3>
                      <p className="text-muted-foreground text-lg max-w-md">
                        Merci pour votre message. Notre équipe vous contactera très bientôt.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Afficher les erreurs */}
                      {error && (
                        <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 rounded">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="text-red-500" size={20} />
                            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                          </div>
                        </div>
                      )}

                      {/* Section informations personnelles */}
                      <div className="space-y-6">
                        <div className="border-l-4 border-primary pl-4">
                          <h3 className="text-lg font-semibold text-foreground">Vos coordonnées</h3>
                          <p className="text-sm text-muted-foreground">Comment souhaitez-vous être contacté ?</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="lastname" className="text-sm font-medium mb-2 block">
                              Nom <span className="text-red-500">*</span>
                            </Label>
                            <input
                              id="lastname"
                              name="lastname"
                              type="text"
                              required
                              value={formData.lastname}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all"
                              placeholder="Kouassi"
                            />
                          </div>
                          <div>
                            <Label htmlFor="firstname" className="text-sm font-medium mb-2 block">
                              Prénom <span className="text-red-500">*</span>
                            </Label>
                            <input
                              id="firstname"
                              name="firstname"
                              type="text"
                              required
                              value={formData.firstname}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all"
                              placeholder="Jean"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                              Adresse email <span className="text-red-500">*</span>
                            </Label>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all"
                              placeholder="jean.kouassi@example.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone" className="text-sm font-medium mb-2 block">
                              Numéro de téléphone <span className="text-red-500">*</span>
                            </Label>
                            <input
                              id="phone"
                              name="phone"
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all"
                              placeholder="+225 07 XX XX XX XX"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Séparateur */}
                      <div className="border-t border-border"></div>

                      {/* Section message */}
                      <div className="space-y-6">
                        <div className="border-l-4 border-primary pl-4">
                          <h3 className="text-lg font-semibold text-foreground">Votre message</h3>
                          <p className="text-sm text-muted-foreground">En quoi pouvons-nous vous aider ?</p>
                        </div>

                        <div>
                          <Label htmlFor="projectType" className="text-sm font-medium mb-2 block">
                            Sujet <span className="text-red-500">*</span>
                          </Label>
                          <input
                            id="projectType"
                            name="projectType"
                            type="text"
                            required
                            value={formData.projectType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all"
                            placeholder="Ex: Demande d'information, Collaboration, Adhésion..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                            Votre message <span className="text-red-500">*</span>
                          </Label>
                          <textarea
                            id="description"
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            rows={6}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground resize-none transition-all"
                            placeholder="Décrivez votre demande en détail..."
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            Plus votre message est détaillé, mieux nous pourrons vous répondre
                          </p>
                        </div>
                      </div>

                      {/* Bouton de soumission */}
                      <div className="pt-4">
                        <Button
                          type="submit"
                          size="lg"
                          disabled={isSubmitting}
                          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 text-base shadow-lg hover:shadow-xl transition-all"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                              Envoi en cours...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2" size={20} />
                              Envoyer le message
                            </>
                          )}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-3">
                          En soumettant ce formulaire, vous acceptez d&apos;être contacté par notre équipe
                        </p>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="fade-in-up">
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-6">
                      Pourquoi nous contacter ?
                    </h3>
                    <div className="space-y-3">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <CheckCircle2 className="text-primary flex-shrink-0" size={18} />
                          <span className="text-sm font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="fade-in-up">
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Clock className="text-primary" size={24} />
                      </div>
                      <h3 className="text-xl font-bold">Horaires</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Lun - Ven</span>
                        <span className="text-sm font-bold">9h - 17h</span>
                      </div>
                      <div className="flex justify-between p-3 bg-destructive/10 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Samedi</span>
                        <span className="text-sm font-bold text-destructive">Fermé</span>
                      </div>
                      <div className="flex justify-between p-3 bg-destructive/10 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Dimanche</span>
                        <span className="text-sm font-bold text-destructive">Fermé</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto fade-in-up">
            <Card className="shadow-l overflow-hidden ">
              <CardContent className="p-10 lg:p-16 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Rocket className="text-primary" size={40} />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  Prêt à rejoindre notre communauté ?
                </h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Que vous soyez débutant ou expert, Voisilab vous accueille pour concrétiser vos idées.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="group bg-gradient-to-r from-primary to-accent" asChild>
                    <Link href="/projet">
                      Soumettre un projet
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </Link>
                  </Button>
                  <Button size="lg" className="cursor-pointer" variant="outline" onClick={() => {
                    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })
                  }}>
                    <MessageSquare className="mr-2" size={20} />
                    Discutons ensemble
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
