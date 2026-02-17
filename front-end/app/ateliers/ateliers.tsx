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
  CheckCircle2,
  Mail,
  Bell,
  Sparkles,
  Trophy,
  TrendingUp,
  Target,
  Printer,
  Scissors,
  Cpu,
  HelpCircle,
  ChevronDown,
  MapPin,
  Star,
  BookOpen,
  Award,
  Lightbulb,
  CalendarDays
} from "lucide-react"
import { useState, useEffect } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface Workshop {
  id: number
  title: string
  description: string
  category: string
  type: 'formation' | 'atelier' | 'evenement'
  date: string
  time: string
  duration: string
  max_participants: number
  current_participants: number
  level: string
  price: number
  image_url: string
  instructor: string
  location: string
  prerequisites: string[]
  what_you_learn: string[]
  status: 'upcoming' | 'full' | 'cancelled' | 'completed'
}

// Formater une date pour affichage
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

export function WorkshopsSection() {
  useScrollAnimation()

  const [activeTab, setActiveTab] = useState<"all" | "formation" | "atelier" | "evenement">("all")
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workshops/published`)
      .then(res => res.json())
      .then(data => {
        setWorkshops(data.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading workshops:', err)
        setLoading(false)
      })
  }, [])

  // Filtrer les workshops selon l'onglet actif
  const filteredWorkshops = activeTab === "all" 
    ? workshops 
    : workshops.filter(w => w.type === activeTab)

  // Stats calculées dynamiquement
  const stats = [
    { icon: GraduationCap, value: workshops.filter(w => w.type === 'formation').length + "+", label: "Formations proposées", description: "Impression 3D, laser, électronique..." },
    { icon: Users, value: workshops.reduce((acc, w) => acc + w.current_participants, 0) + "+", label: "Participants formés", description: "Une communauté qui grandit" },
    { icon: CalendarDays, value: workshops.filter(w => w.type === 'evenement').length + "+", label: "Événements par an", description: "Hackathons, portes ouvertes..." },
    { icon: Star, value: "4.9/5", label: "Satisfaction moyenne", description: "Avis de nos participants" },
  ]

  // Types d'ateliers avec descriptions
  const workshopTypes = [
    {
      type: "formation",
      icon: GraduationCap,
      title: "Formations machines",
      description: "Formations obligatoires pour utiliser nos équipements en autonomie. Durée 2h à 4h selon la machine.",
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20"
    },
    {
      type: "atelier",
      icon: Wrench,
      title: "Ateliers créatifs",
      description: "Ateliers thématiques pour réaliser un projet concret. Repartez avec votre création !",
      color: "bg-purple-500/10 text-purple-600 border-purple-500/20"
    },
    {
      type: "evenement",
      icon: Zap,
      title: "Événements",
      description: "Hackathons, portes ouvertes, conférences... Rencontrez la communauté makers !",
      color: "bg-orange-500/10 text-orange-600 border-orange-500/20"
    }
  ]

  // FAQ
  const faqItems = [
    {
      question: "Comment m'inscrire à une formation ?",
      answer: "Cliquez sur le bouton 'S'inscrire' de la formation souhaitée. Vous serez redirigé vers un formulaire d'inscription. Vous recevrez une confirmation par email avec tous les détails pratiques."
    },
    {
      question: "Les formations sont-elles obligatoires ?",
      answer: "Oui, pour utiliser une machine en autonomie, vous devez avoir suivi la formation correspondante. C'est une question de sécurité et de bon usage des équipements."
    },
    {
      question: "Puis-je annuler mon inscription ?",
      answer: "Oui, vous pouvez annuler jusqu'à 48h avant le début de l'atelier. Au-delà, nous vous demandons de prévenir pour libérer votre place à une autre personne."
    },
    {
      question: "Faut-il apporter son ordinateur ?",
      answer: "Pour les formations logicielles (modélisation 3D, découpe laser), il est recommandé d'apporter son ordinateur portable. Des postes sont disponibles si besoin."
    },
    {
      question: "Y a-t-il un âge minimum ?",
      answer: "La plupart des formations sont accessibles dès 16 ans. Les mineurs doivent être accompagnés d'un parent pour certains équipements (laser, CNC)."
    }
  ]

  // Fonction pour obtenir la couleur du niveau
  const getLevelColor = (level: string) => {
    switch(level.toLowerCase()) {
      case 'débutant': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'intermédiaire': return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
      case 'avancé': return 'bg-red-500/10 text-red-600 border-red-500/20'
      default: return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    }
  }

  // Fonction pour obtenir l'icône du type
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'formation': return GraduationCap
      case 'atelier': return Wrench
      case 'evenement': return Zap
      default: return BookOpen
    }
  }

  // Calculer les places restantes
  const getSpotsRemaining = (workshop: Workshop) => {
    return workshop.max_participants - workshop.current_participants
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <video
            src="/video.mp4"
            autoPlay
            loop
            muted
            className="object-cover w-full h-full"
            onEnded={(e) => {
              const video = e.target as HTMLVideoElement;
              video.currentTime = 0;
              video.play();
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"></div>
        </div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <div className="relative z-10">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-center mb-8 fade-in-up">
              <PageBreadcrumb pageTitle="Ateliers & Événements" />
            </div>

            <div className="max-w-4xl mx-auto text-center fade-in-up">
              <Badge className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" variant="outline">
                <Sparkles className="w-4 h-4 mr-2" />
                Apprenez, créez, partagez
              </Badge>

              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
                <span className="block">Ateliers &</span>
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Événements
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto">
                Participez à nos formations, ateliers créatifs et événements communautaires.
                Développez vos compétences et rencontrez des passionnés de fabrication numérique.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300"
                  asChild
                >
                  <Link href="#ateliers">
                    <span className="relative z-10 flex items-center gap-2">
                      Découvrir les ateliers
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-black border-white/30 hover:bg-white/10 backdrop-blur-sm"
                  asChild
                >
                  <Link href="/contact">Nous contacter</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
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
                  <Card className="relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 group h-full">
                    <CardContent className="p-6 lg:p-8 text-center">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>

                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Icon className="text-primary" size={32} />
                      </div>

                      <div className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm font-semibold text-foreground mb-1">
                        {stat.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.description}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Types d'ateliers - Explication */}
      <section className="py-16 lg:py-24 bg-muted/30 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 fade-in-up">
              <Badge className="mb-4 px-4 py-2" variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Nos formats
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Trois types d'activités pour tous les besoins
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Que vous souhaitiez vous former sur une machine, créer un projet ou rencontrer la communauté
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workshopTypes.map((type, index) => {
                const Icon = type.icon
                return (
                  <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 group h-full">
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

      {/* Main Content */}
      <section id="ateliers" className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            title="Prochaines activités"
            subtitle="Inscrivez-vous aux formations, ateliers et événements à venir"
          />

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 fade-in-up">
            <Button
              variant={activeTab === "all" ? "default" : "outline"}
              size="lg"
              onClick={() => setActiveTab("all")}
              className={`gap-2 cursor-pointer ${activeTab === "all"
                  ? 'bg-primary hover:bg-primary/90'
                  : 'hover:bg-primary/10 hover:text-primary hover:border-primary/50'
                }`}
            >
              <Sparkles size={20} />
              Tout voir
              <Badge variant="secondary" className={activeTab === "all" ? 'bg-primary-foreground/20' : ''}>
                {workshops.length}
              </Badge>
            </Button>
            <Button
              variant={activeTab === "formation" ? "default" : "outline"}
              size="lg"
              onClick={() => setActiveTab("formation")}
              className={`gap-2 cursor-pointer ${activeTab === "formation"
                  ? 'bg-primary hover:bg-primary/90'
                  : 'hover:bg-primary/10 hover:text-primary hover:border-primary/50'
                }`}
            >
              <GraduationCap size={20} />
              Formations
              <Badge variant="secondary" className={activeTab === "formation" ? 'bg-primary-foreground/20' : ''}>
                {workshops.filter(w => w.type === 'formation').length}
              </Badge>
            </Button>
            <Button
              variant={activeTab === "atelier" ? "default" : "outline"}
              size="lg"
              onClick={() => setActiveTab("atelier")}
              className={`gap-2 cursor-pointer ${activeTab === "atelier"
                  ? 'bg-primary hover:bg-primary/90'
                  : 'hover:bg-primary/10 hover:text-primary hover:border-primary/50'
                }`}
            >
              <Wrench size={20} />
              Ateliers
              <Badge variant="secondary" className={activeTab === "atelier" ? 'bg-primary-foreground/20' : ''}>
                {workshops.filter(w => w.type === 'atelier').length}
              </Badge>
            </Button>
            <Button
              variant={activeTab === "evenement" ? "default" : "outline"}
              size="lg"
              onClick={() => setActiveTab("evenement")}
              className={`gap-2 cursor-pointer ${activeTab === "evenement"
                  ? 'bg-primary hover:bg-primary/90'
                  : 'hover:bg-primary/10 hover:text-primary hover:border-primary/50'
                }`}
            >
              <Zap size={20} />
              Événements
              <Badge variant="secondary" className={activeTab === "evenement" ? 'bg-primary-foreground/20' : ''}>
                {workshops.filter(w => w.type === 'evenement').length}
              </Badge>
            </Button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement des activités...</p>
            </div>
          ) : filteredWorkshops.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-muted-foreground" size={40} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Aucune activité prévue</h3>
              <p className="text-muted-foreground mb-6">De nouvelles activités seront bientôt disponibles.</p>
              <Button variant="outline" asChild>
                <Link href="/contact">Être informé des prochaines dates</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
              {filteredWorkshops.map((item, index) => {
                const TypeIcon = getTypeIcon(item.type)
                const spotsRemaining = getSpotsRemaining(item)
                
                return (
                  <div key={item.id} className="" style={{ animationDelay: `${index * 100}ms` }}>
                    <Link href={`/ateliers/${item.id}`} className="block h-full">
                      <Card className="relative overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 group h-full cursor-pointer">
                      {/* Image Section */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={item.image_url || "/logolab.png"}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

                        {/* Top Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />

                        {/* Type Badge */}
                        <div className="absolute top-4 left-4">
                          <Badge className="backdrop-blur-sm border-2 font-semibold bg-background/80">
                            <TypeIcon size={14} className="mr-1" />
                            {item.type === 'formation' ? 'Formation' : item.type === 'atelier' ? 'Atelier' : 'Événement'}
                          </Badge>
                        </div>

                        {/* Price Badge */}
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm border-none font-bold px-3 py-1.5">
                            {item.price === 0 ? 'Gratuit' : `${item.price?.toLocaleString()} FCFA`}
                          </Badge>
                        </div>

                        {/* Spots Remaining */}
                        {spotsRemaining <= 5 && spotsRemaining > 0 && (
                          <div className="absolute bottom-4 left-4">
                            <Badge variant="outline" className="bg-background/90 backdrop-blur-sm border-destructive text-destructive font-semibold animate-pulse">
                              Plus que {spotsRemaining} place{spotsRemaining > 1 ? 's' : ''} !
                            </Badge>
                          </div>
                        )}

                        {/* Full Badge */}
                        {spotsRemaining <= 0 && (
                          <div className="absolute bottom-4 left-4">
                            <Badge className="bg-destructive text-destructive-foreground font-semibold">
                              Complet
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <CardContent className="p-6 lg:p-8">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>

                        {/* Level Badge */}
                        <Badge className={`${getLevelColor(item.level)} backdrop-blur-sm border-2 font-semibold mb-3`}>
                          {item.level}
                        </Badge>

                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h3>

                        <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-2">
                          {item.description}
                        </p>

                        {/* Info Grid */}
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                            <Calendar size={16} className="text-primary flex-shrink-0" />
                            <span className="text-sm text-foreground font-medium">{formatDate(item.date)}</span>
                          </div>
                          <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                            <Clock size={16} className="text-primary flex-shrink-0" />
                            <span className="text-sm text-foreground font-medium">{item.time} ({item.duration})</span>
                          </div>
                          <div className="">
                            {/* <Users size={16} className="text-primary flex-shrink-0" /> */}
                            {/* <span className="text-sm text-foreground font-medium">{item.current_participants}/{item.max_participants} inscrits</span> */}
                          </div>
                          {item.instructor && (
                            <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                              <GraduationCap size={16} className="text-primary flex-shrink-0" />
                              <span className="text-sm text-foreground font-medium">Par {item.instructor}</span>
                            </div>
                          )}
                        </div>

                        {/* CTA Button */}
                        <Button 
                          className="w-full group relative overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            Voir les détails
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                          </span>
                        </Button>
                      </CardContent>
                    </Card>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-32 bg-muted/30 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 fade-in-up">
              <Badge className="mb-4 px-4 py-2" variant="outline">
                <HelpCircle className="w-4 h-4 mr-2" />
                Questions fréquentes
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Tout savoir sur nos activités
              </h2>
              <p className="text-lg text-muted-foreground">
                Retrouvez les réponses aux questions les plus courantes
              </p>
            </div>

            <div className="space-y-4 fade-in-up">
              {faqItems.map((item, index) => (
                <Card 
                  key={index} 
                  className={`border-2 transition-all duration-300 cursor-pointer ${openFaq === index ? 'border-primary/50 shadow-lg' : 'border-border hover:border-primary/30'}`}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground pr-4">{item.question}</h3>
                      <ChevronDown 
                        className={`text-primary flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} 
                        size={24} 
                      />
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 mt-4' : 'max-h-0'}`}>
                      <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      {/* <section className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto fade-in-up">
            <Card className="border-2 border-primary/30 shadow-2xl overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
              <CardContent className="p-10 lg:p-16 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="text-primary" size={40} />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Ne ratez aucune activité
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  Inscrivez-vous à notre newsletter pour recevoir les annonces de nouveaux ateliers,
                  formations et événements en avant-première.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      S'abonner
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3 justify-center pt-8 border-t border-border">
                  <Badge variant="outline" className="px-4 py-2 bg-background/50">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                    Alertes en priorité
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2 bg-background/50">
                    <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                    Offres exclusives
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2 bg-background/50">
                    <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                    Conseils makers
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>  */}
    </div>
  )
}
