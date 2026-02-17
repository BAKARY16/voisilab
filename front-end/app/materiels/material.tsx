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
  Shirt,
  Wrench
} from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function EquipmentSection() {
  useScrollAnimation()

  const equipment = [
    { icon: Printer, name: "Imprimantes 3D", count: "2 machines", description: "Imprimante 3D FDM haute performance, idéale pour le prototypage rapide. Elle offre une grande précision et un rendu professionnel.", category: "Impression", gradient: "from-blue-500/10 to-cyan-500/10", image: "https://www.makeitmarseille.com/wp-content/uploads/2017/09/Make-it-Marseille-impression-3D-ultimaker-2.jpg", categoryColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
    { icon: Scissors, name: "Découpeuse Laser", count: "100W CO2", description: "La découpeuse laser est un outil qui permet de découper et graver des matériaux à partir de l’énergie d’un laser focalisé par une lentille.", category: "Découpe", image: "https://lefablab.fr/wp-content/uploads/2019/07/p7121491.jpg", gradient: "from-purple-500/10 to-pink-500/10", categoryColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
    { icon: Shirt, name: "Machine à coudre  SGGEMSY", count: "Conception", description: "Machine industrielle SGGEMSY allie robustesse et haute productivité. Idéale pour des piqûres précises et une finition professionnelle sur tous textiles.", image: "https://lecoindupro.blob.core.windows.net/upload/2436551.Lg.jpg", category: "Confection", gradient: "from-green-500/10 to-emerald-500/10", categoryColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
    { icon: Shirt, name: "Machine à broder BROTHER", count: "Conception", description: "Brodeuse haute performance avec un large champ de 200x200mm, enfilage automatique et tri intelligent des couleurs. Rapide et précise avec une vitesse de 1000 points/minute.", image: "https://agrilab.unilasalle.fr/projets/attachments/download/1906/machine001.jpg", category: "Confection", gradient: "from-orange-500/10 to-red-500/10", categoryColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
    { icon: Drill, name: "Perceuse BOSCH", count: "Outillage pro", description: "Perceuse à colonne Bosch PBD 40, une machine de précision numérique et puissance. Intègre un écran d'affichage digital, un laser de pointage et un moteur de 710 W pour des perçages parfaits et sécurisés sur bois et métal.", image: "https://www.travaillerlebois.com/wp-content/uploads/2016/12/perceuse-a-colonne_bosch_pbd-40-23.jpg", category: "Création", gradient: "from-yellow-500/10 to-orange-500/10", categoryColor: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20" },
    { icon: Gauge, name: "Fraiseuse Numérique SHOPBOT", count: "Contrôle qualité", description: "Fraiseuse numérique ShopBot : solution CNC robuste et polyvalente. Idéale pour la découpe et la gravure de précision sur grands formats (bois, plastiques, métaux tendres). Permet la réalisation rapide de pièces complexes.", image: "https://lacasemate.fr/wp-content/uploads/2022/02/Fraiseuse_num%C3%A9rique.png", category: "Création", gradient: "from-cyan-500/10 to-blue-500/10", categoryColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20" },
]

  const stats = [
    { icon: Wrench, value: "15+", label: "Équipements disponibles", gradient: "" },
    { icon: Award, value: "500+", label: "Heures d'utilisation/mois", gradient: "" },
    { icon: Shield, value: "100%", label: "Formations sécurité", gradient: "" },
    { icon: TrendingUp, value: "24/7", label: "Support technique", gradient: "" },
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

      {/* Equipment Section - NOUVEAU DESIGN AVEC IMAGES */}
      <section id="equipements" className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            title="Nos équipements"
            subtitle="Accédez à un parc machine complet et moderne pour concrétiser tous vos projets de fabrication numérique"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto mb-12">
            {equipment.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="relative overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 group" style={{ minHeight: '400px' }}>
                    {/* Image de fond toujours visible */}
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={item.image || "/logolab.png"}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    {/* Overlay qui apparaît au hover avec le contenu texte */}
                    <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-background/95 via-background/95 to-background/90 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex flex-col">
                      <CardContent className="p-8 flex-1 flex flex-col">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>

                        {/* Icône */}
                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                          <Icon size={28} className="text-primary" />
                        </div>

                        {/* Titre */}
                        <h3 className="text-xl font-bold text-foreground mb-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150">
                          {item.name}
                        </h3>

                        {/* Badge catégorie */}
                        <Badge
                          className={`${item.categoryColor} backdrop-blur-sm mb-6 border-2 font-semibold mb-4 w-fit transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200`}
                        >
                          {item.category}
                        </Badge>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed flex-1 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                          {item.description}
                        </p>

                        {/* Bouton */}
                        <div className="mt-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-350 cursor-pointer">
                          <Link href="/materiels" passHref>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full group/btn border-primary/50 hover:bg-primary hover:text-white"
                            >
                              <span className="flex items-center justify-center gap-2">
                                En savoir plus
                                <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={16} />
                              </span>
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </div>

                    {/* Badge visible même sans hover (nom + icône) */}
                    <div className="absolute bottom-6 left-6 right-6 z-20 group-hover:opacity-0 transition-opacity duration-300">
                      <div className="flex items-center gap-3 bg-background backdrop-blur-md border-2 border-primary/30 rounded-xl p-4 shadow-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="text-primary" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-foreground truncate">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                    </div>
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
