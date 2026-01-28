"use client"

import { SectionHeader } from "../../components/section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import PageBreadcrumb from "@/components/PageBreadCrumb"
import {
  Printer,
  Scissors,
  Hammer,
  Cpu,
  Drill,
  Gauge,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  TrendingUp,
  Award,
  Wrench
} from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function EquipmentSection() {
  useScrollAnimation()

  const equipment = [
    {
      icon: Printer,
      name: "Imprimantes 3D",
      description: "Plusieurs imprimantes 3D FDM et résine pour donner vie à vos créations en trois dimensions.",
      specs: ["FDM & Résine", "Grand volume", "Haute précision"],
      category: "Impression",
      image: "/equipment-3d-printer-fdm-resin.jpg",
      gradient: "from-blue-500/10 to-cyan-500/10",
      categoryColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    {
      icon: Scissors,
      name: "Découpeuse Laser",
      description: "Découpe et gravure précise sur bois, acrylique, tissu et bien d'autres matériaux.",
      specs: ["CO2 100W", "Zone 1000x600mm", "Gravure & découpe"],
      category: "Découpe",
      image: "/equipment-laser-cutter-engraver.jpg",
      gradient: "from-purple-500/10 to-pink-500/10",
      categoryColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
    {
      icon: Hammer,
      name: "Fraiseuse CNC",
      description: "Usinage de précision pour le bois, le plastique et l'aluminium.",
      specs: ["3 axes", "Précision 0.1mm", "Multi-matériaux"],
      category: "Usinage",
      image: "/equipment-cnc-mill-precision.jpg",
      gradient: "from-green-500/10 to-emerald-500/10",
      categoryColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    },
    {
      icon: Cpu,
      name: "Station électronique",
      description: "Tout l'équipement pour vos projets d'électronique : Arduino, Raspberry Pi, composants.",
      specs: ["Microcontrôleurs", "Composants", "Outils de soudure"],
      category: "Électronique",
      image: "/equipment-electronics-station-arduino.jpg",
      gradient: "from-orange-500/10 to-red-500/10",
      categoryColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    },
    {
      icon: Drill,
      name: "Atelier bois",
      description: "Outils traditionnels et machines pour le travail du bois.",
      specs: ["Scie circulaire", "Perceuse", "Ponceuse"],
      category: "Bois",
      image: "/equipment-woodworking-workshop-tools.jpg",
      gradient: "from-yellow-500/10 to-orange-500/10",
      categoryColor: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    },
    {
      icon: Gauge,
      name: "Outils de mesure",
      description: "Équipements de mesure et de contrôle qualité pour vos prototypes.",
      specs: ["Pied à coulisse", "Micromètre", "Scanner 3D"],
      category: "Métrologie",
      image: "/equipment-measurement-tools-3d-scanner.jpg",
      gradient: "from-cyan-500/10 to-blue-500/10",
      categoryColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    },
  ]

  const stats = [
    { icon: Wrench, value: "15+", label: "Équipements disponibles", gradient: "from-blue-500/10 to-cyan-500/10" },
    { icon: Award, value: "500+", label: "Heures d'utilisation/mois", gradient: "from-purple-500/10 to-pink-500/10" },
    { icon: Shield, value: "100%", label: "Formations sécurité", gradient: "from-green-500/10 to-emerald-500/10" },
    { icon: TrendingUp, value: "24/7", label: "Support technique", gradient: "from-orange-500/10 to-red-500/10" },
  ]

  const benefits = [
    {
      icon: CheckCircle2,
      title: "Formations incluses",
      description: "Accès aux formations pour chaque machine avant utilisation",
    },
    {
      icon: Shield,
      title: "Sécurité garantie",
      description: "Équipements maintenus et contrôlés régulièrement",
    },
    {
      icon: Zap,
      title: "Réservation facile",
      description: "Système de réservation en ligne simple et intuitif",
    },
  ]

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
              <PageBreadcrumb pageTitle="Nos équipements" />
            </div>

            <div className="max-w-4xl mx-auto text-center fade-in-up">
              <Badge className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" variant="outline">
                <Wrench className="w-4 h-4 mr-2" />
                Technologie de pointe
              </Badge>

              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
                <span className="block">Un parc machine</span>
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  complet et moderne
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto">
                Accédez à des équipements professionnels pour concrétiser tous vos projets de fabrication numérique,
                de l'impression 3D à l'usinage CNC.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300"
                  asChild
                >
                  <Link href="#equipements">
                    <span className="relative z-10 flex items-center gap-2">
                      Découvrir les machines
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
                  <Link href="/ateliers">Voir les formations</Link>
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

      {/* Equipment Grid */}
      <section id="equipements" className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            title="Nos équipements"
            subtitle="Accédez à un parc machine complet et moderne pour concrétiser tous vos projets de fabrication numérique"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {equipment.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <Card className={`relative overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 group h-full bg-gradient-to-br ${item.gradient}`}>
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Top Bar */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />

                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className={`${item.categoryColor} backdrop-blur-sm border-2 font-semibold`}>
                          {item.category}
                        </Badge>
                      </div>

                      {/* Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-20 h-20 bg-primary/90 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                          <Icon className="text-primary-foreground" size={40} />
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <CardContent className="p-6 lg:p-8">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>

                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                          <Icon size={28} className="text-primary group-hover:text-primary-foreground transition-colors" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                        {item.description}
                      </p>

                      {/* Specs */}
                      <div className="space-y-2 mb-6">
                        {item.specs.map((spec, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                            <span className="text-sm text-foreground font-medium">{spec}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <Button variant="outline" className="w-full cursor-pointer group/btn">
                        <span className="flex items-center justify-center gap-2">
                          Réserver
                          <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={16} />
                        </span>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 bg-muted/30 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 fade-in-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Pourquoi utiliser nos équipements ?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Des avantages pensés pour votre réussite
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 group h-full">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          <Icon className="text-primary" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Access CTA */}
      <section className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto fade-in-up">
            <Card className="border-2 border-primary/30 shadow-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
              <CardContent className="p-10 lg:p-16 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="text-primary" size={40} />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  Comment accéder aux machines ?
                </h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                  Pour utiliser nos équipements, vous devez suivre une formation d'initiation spécifique à chaque machine.
                  Ces formations sont dispensées régulièrement et vous permettent d'acquérir les compétences nécessaires
                  pour une utilisation autonome et sécurisée.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300"
                    asChild
                  >
                    <Link href="/ateliers">
                      <span className="relative z-10 flex items-center gap-2">
                        Voir les formations
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/contact">
                      Nous contacter
                    </Link>
                  </Button>
                </div>

                {/* Benefits Pills */}
                <div className="flex flex-wrap gap-3 justify-center mt-8 pt-8 border-t border-border">
                  <Badge variant="outline" className="px-4 py-2">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Formation gratuite
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Shield className="w-4 h-4 mr-2" />
                    Certification sécurité
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Award className="w-4 h-4 mr-2" />
                    Accompagnement expert
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
