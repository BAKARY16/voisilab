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
  Target
} from "lucide-react"
import { useState } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function WorkshopsSection() {
  useScrollAnimation()

  const [activeTab, setActiveTab] = useState<"formations" | "ateliers" | "evenements">("formations")

  const formations = [
    {
      title: "Initiation Impression 3D",
      date: "15 Mars 2024",
      time: "14h00 - 17h00",
      participants: "8/10",
      level: "Débutant",
      description: "Apprenez les bases de l'impression 3D, de la modélisation à l'impression de votre premier objet.",
      price: "Gratuit",
      image: "/workshop-3d-printing-beginner-training.jpg",
      gradient: "from-blue-500/10 to-cyan-500/10",
      levelColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      spots: 2,
    },
    {
      title: "Découpeuse Laser Avancée",
      date: "22 Mars 2024",
      time: "10h00 - 13h00",
      participants: "5/8",
      level: "Intermédiaire",
      description: "Maîtrisez les techniques avancées de découpe et gravure laser sur différents matériaux.",
      price: "25€",
      image: "/workshop-laser-cutting-advanced-techniques.jpg",
      gradient: "from-purple-500/10 to-pink-500/10",
      levelColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      spots: 3,
    },
    {
      title: "Arduino & Électronique",
      date: "29 Mars 2024",
      time: "14h00 - 18h00",
      participants: "6/12",
      level: "Débutant",
      description: "Introduction à la programmation Arduino et création de circuits électroniques simples.",
      price: "15€",
      image: "/workshop-arduino-electronics-programming.jpg",
      gradient: "from-green-500/10 to-emerald-500/10",
      levelColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      spots: 6,
    },
  ]

  const ateliers = [
    {
      title: "Fabriquez votre lampe design",
      date: "18 Mars 2024",
      time: "18h00 - 21h00",
      participants: "4/8",
      level: "Tous niveaux",
      description: "Créez une lampe unique en combinant découpe laser et assemblage créatif.",
      price: "30€",
      image: "/workshop-design-lamp-laser-creative.jpg",
      gradient: "from-yellow-500/10 to-orange-500/10",
      levelColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      spots: 4,
    },
    {
      title: "Bijoux imprimés en 3D",
      date: "25 Mars 2024",
      time: "14h00 - 17h00",
      participants: "7/10",
      level: "Débutant",
      description: "Concevez et imprimez vos propres bijoux personnalisés en résine.",
      price: "20€",
      image: "/workshop-3d-printed-jewelry-resin.jpg",
      gradient: "from-pink-500/10 to-rose-500/10",
      levelColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      spots: 3,
    },
  ]

  const evenements = [
    {
      title: "Hackathon Green Tech",
      date: "5-7 Avril 2024",
      time: "Weekend complet",
      participants: "20/40",
      level: "Tous niveaux",
      description: "48h pour créer des solutions innovantes aux défis environnementaux.",
      price: "Gratuit",
      image: "/event-hackathon-green-tech-innovation.jpg",
      gradient: "from-green-500/10 to-emerald-500/10",
      levelColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      spots: 20,
    },
    {
      title: "Portes Ouvertes",
      date: "12 Avril 2024",
      time: "10h00 - 18h00",
      participants: "Illimité",
      level: "Tous publics",
      description: "Découvrez le fablab, rencontrez l'équipe et testez nos machines.",
      price: "Gratuit",
      image: "/event-open-house-fablab-discover.jpg",
      gradient: "from-blue-500/10 to-cyan-500/10",
      levelColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      spots: null,
    },
    {
      title: "Maker Faire Voisilab",
      date: "20 Avril 2024",
      time: "14h00 - 20h00",
      participants: "Illimité",
      level: "Tous publics",
      description: "Exposition des projets des makers et démonstrations en direct.",
      price: "Gratuit",
      image: "/event-maker-faire-exhibition-demo.jpg",
      gradient: "from-orange-500/10 to-red-500/10",
      levelColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      spots: null,
    },
  ]

  const stats = [
    { icon: GraduationCap, value: "50+", label: "Formations organisées", gradient: "from-blue-500/10 to-cyan-500/10" },
    { icon: Users, value: "500+", label: "Participants formés", gradient: "from-purple-500/10 to-pink-500/10" },
    { icon: Trophy, value: "15+", label: "Événements annuels", gradient: "from-green-500/10 to-emerald-500/10" },
    { icon: Target, value: "98%", label: "Satisfaction", gradient: "from-orange-500/10 to-red-500/10" },
  ]

  const tabData = {
    formations: { items: formations, icon: GraduationCap },
    ateliers: { items: ateliers, icon: Wrench },
    evenements: { items: evenements, icon: Zap },
  }

  const currentData = tabData[activeTab]

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
                  <Card className={`relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 group h-full bg-gradient-to-br ${stat.gradient}`}>
                    <CardContent className="p-6 lg:p-8 text-center">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>

                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Icon className="text-primary" size={32} />
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

      {/* Main Content */}
      <section id="ateliers" className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            title="Nos activités"
            subtitle="Formations techniques, ateliers créatifs et événements communautaires pour tous les niveaux"
          />

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 fade-in-up">
            <Button
              variant={activeTab === "formations" ? "default" : "outline"}
              size="lg"
              onClick={() => setActiveTab("formations")}
              className={`gap-2 cursor-pointer ${activeTab === "formations"
                  ? 'bg-primary hover:bg-primary/90'
                  : 'hover:bg-primary/10 hover:text-primary hover:border-primary/50'
                }`}
            >
              <GraduationCap size={20} />
              Formations
              <Badge variant="secondary" className={activeTab === "formations" ? 'bg-primary-foreground/20' : ''}>
                {formations.length}
              </Badge>
            </Button>
            <Button
              variant={activeTab === "ateliers" ? "default" : "outline"}
              size="lg"
              onClick={() => setActiveTab("ateliers")}
              className={`gap-2 cursor-pointer ${activeTab === "ateliers"
                  ? 'bg-primary hover:bg-primary/90'
                  : 'hover:bg-primary/10 hover:text-primary hover:border-primary/50'
                }`}
            >
              <Wrench size={20} />
              Ateliers
              <Badge variant="secondary" className={activeTab === "ateliers" ? 'bg-primary-foreground/20' : ''}>
                {ateliers.length}
              </Badge>
            </Button>
            <Button
              variant={activeTab === "evenements" ? "default" : "outline"}
              size="lg"
              onClick={() => setActiveTab("evenements")}
              className={`gap-2 cursor-pointer ${activeTab === "evenements"
                  ? 'bg-primary hover:bg-primary/90'
                  : 'hover:bg-primary/10 hover:text-primary hover:border-primary/50'
                }`}
            >
              <Zap size={20} />
              Événements
              <Badge variant="secondary" className={activeTab === "evenements" ? 'bg-primary-foreground/20' : ''}>
                {evenements.length}
              </Badge>
            </Button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {currentData.items.map((item, index) => (
              <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className={`relative overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 group h-full bg-gradient-to-br ${item.gradient}`}>
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Top Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />

                    {/* Level Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className={`${item.levelColor} backdrop-blur-sm border-2 font-semibold`}>
                        {item.level}
                      </Badge>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm border-none font-bold px-3 py-1.5">
                        {item.price}
                      </Badge>
                    </div>

                    {/* Spots Remaining */}
                    {item.spots && item.spots <= 5 && (
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="outline" className="bg-background/90 backdrop-blur-sm border-destructive text-destructive font-semibold animate-pulse">
                          Plus que {item.spots} places !
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <CardContent className="p-6 lg:p-8">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>

                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                      {item.description}
                    </p>

                    {/* Info Grid */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Calendar size={18} className="text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground font-medium">{item.date}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Clock size={18} className="text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground font-medium">{item.time}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Users size={18} className="text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground font-medium">{item.participants}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button className="w-full group relative overflow-hidden">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        S'inscrire
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 lg:py-32 bg-muted/30 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto fade-in-up">
            <Card className="border-2 border-primary/30 shadow-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
              <CardContent className="p-10 lg:p-16 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="text-primary" size={40} />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  Ne ratez aucun atelier
                </h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
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

                {/* Benefits Pills */}
                <div className="flex flex-wrap gap-3 justify-center pt-8 border-t border-border">
                  <Badge variant="outline" className="px-4 py-2">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Alertes en priorité
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Offres exclusives
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Conseils makers
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
