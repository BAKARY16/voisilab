"use client"

import { SectionHeader } from "../../components/section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import PageBreadcrumb from "@/components/PageBreadCrumb"
import { 
  ExternalLink, 
  Heart, 
  Lightbulb, 
  ArrowRight, 
  Rocket,
  Zap,
  Users,
  Eye,
  MessageSquare,
  Share2,
  TrendingUp
} from "lucide-react"
import { useState } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function InnovationsSection() {
  useScrollAnimation()

  const [likes, setLikes] = useState<{ [key: number]: number }>({
    0: 45,
    1: 67,
    2: 32,
    3: 89,
    4: 54,
    5: 71,
  })

  const [liked, setLiked] = useState<{ [key: number]: boolean }>({})

  const projects = [
    {
      title: "Prothèse de main imprimée 3D",
      creator: "Sarah M.",
      category: "Santé",
      description: "Prothèse de main fonctionnelle imprimée en 3D pour enfants, accessible et personnalisable.",
      image: "/prosthetic-hand-3d-printed-innovative.jpg",
      tags: ["Impression 3D", "Social Impact"],
      gradient: "from-blue-500/10 to-cyan-500/10",
      categoryColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      views: 1234,
      comments: 23,
    },
    {
      title: "Système hydroponique connecté",
      creator: "Lucas B.",
      category: "Agriculture",
      description:
        "Système de culture hydroponique automatisé avec monitoring IoT pour une agriculture urbaine efficace.",
      image: "/smart-hydroponic-system-arduino-sensors.jpg",
      tags: ["IoT", "Arduino", "Écologie"],
      gradient: "from-green-500/10 to-emerald-500/10",
      categoryColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      views: 2456,
      comments: 34,
    },
    {
      title: "Lampe design paramétrique",
      creator: "Emma L.",
      category: "Design",
      description: "Collection de lampes au design unique créées avec modélisation paramétrique et découpe laser.",
      image: "/parametric-design-laser-cut-lamp-modern.jpg",
      tags: ["Laser", "Design", "Art"],
      gradient: "from-purple-500/10 to-pink-500/10",
      categoryColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      views: 3789,
      comments: 45,
    },
    {
      title: "Robot éducatif open-source",
      creator: "Thomas K.",
      category: "Éducation",
      description: "Robot pédagogique pour apprendre la programmation et la robotique de manière ludique.",
      image: "/educational-robot-arduino-open-source-learning.jpg",
      tags: ["Robotique", "Électronique", "Open Source"],
      gradient: "from-orange-500/10 to-red-500/10",
      categoryColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      views: 4521,
      comments: 56,
    },
    {
      title: "Mobilier modulaire éco-responsable",
      creator: "Marie D.",
      category: "Mobilier",
      description: "Meubles modulaires en bois recyclé, conçus pour être assemblés sans outils.",
      image: "/modular-eco-furniture-wood-sustainable-design.jpg",
      tags: ["CNC", "Bois", "Écologie"],
      gradient: "from-yellow-500/10 to-orange-500/10",
      categoryColor: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
      views: 2134,
      comments: 28,
    },
    {
      title: "Station météo DIY",
      creator: "Alex P.",
      category: "Tech",
      description: "Station météo connectée avec affichage des données en temps réel et prévisions.",
      image: "/diy-weather-station-iot-display-technology.jpg",
      tags: ["IoT", "Impression 3D", "Data"],
      gradient: "from-cyan-500/10 to-blue-500/10",
      categoryColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
      views: 3245,
      comments: 41,
    },
  ]

  const stats = [
    { icon: Rocket, value: "150+", label: "Projets réalisés", gradient: "from-blue-500/10 to-cyan-500/10" },
    { icon: Users, value: "500+", label: "Makers actifs", gradient: "from-purple-500/10 to-pink-500/10" },
    { icon: Heart, value: "5000+", label: "Likes reçus", gradient: "from-pink-500/10 to-rose-500/10" },
    { icon: TrendingUp, value: "98%", label: "Projets aboutis", gradient: "from-green-500/10 to-emerald-500/10" },
  ]

  const categories = [
    { name: "Tous", count: 150, active: true },
    { name: "Santé", count: 23, active: false },
    { name: "Design", count: 45, active: false },
    { name: "IoT", count: 38, active: false },
    { name: "Robotique", count: 29, active: false },
    { name: "Écologie", count: 15, active: false },
  ]

  const handleLike = (index: number) => {
    if (!liked[index]) {
      setLikes((prev) => ({
        ...prev,
        [index]: (prev[index] || 0) + 1,
      }))
      setLiked((prev) => ({
        ...prev,
        [index]: true,
      }))
    } else {
      setLikes((prev) => ({
        ...prev,
        [index]: (prev[index] || 0) - 1,
      }))
      setLiked((prev) => ({
        ...prev,
        [index]: false,
      }))
    }
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
              <PageBreadcrumb pageTitle="Innovations" />
            </div>

            <div className="max-w-4xl mx-auto text-center fade-in-up">
              <Badge className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" variant="outline">
                <Lightbulb className="w-4 h-4 mr-2" />
                Créativité & Innovation
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
                <span className="block">Découvrez les</span>
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  innovations du Voisilab
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto">
                Explorez les projets inspirants réalisés par notre communauté de makers.
                De l'innovation sociale aux créations artistiques, chaque projet raconte une histoire unique.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300"
                  asChild
                >
                  <Link href="/projet">
                    <span className="relative z-10 flex items-center gap-2">
                      Soumettre mon projet
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
      <section className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            title="Projets de la communauté"
            subtitle="Découvrez les réalisations inspirantes de nos makers"
          />

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-12 fade-in-up">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={category.active ? "default" : "outline"}
                size="sm"
                className={`px-4 cursor-pointer py-2 ${
                  category.active 
                    ? 'bg-primary hover:bg-primary/90' 
                    : 'hover:bg-primary/10 hover:text-primary hover:border-primary/50'
                }`}
              >
                {category.name}
                <Badge 
                  variant="secondary" 
                  className={`ml-2 ${category.active ? 'bg-primary-foreground/20' : ''}`}
                >
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {projects.map((project, index) => (
              <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className={`relative overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 group h-full bg-gradient-to-br ${project.gradient}`}>
                  {/* Image Section */}
                  <div className="relative h-56 lg:h-64 overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className={`${project.categoryColor} backdrop-blur-sm border-2 font-semibold`}>
                        {project.category}
                      </Badge>
                    </div>

                    {/* Share Button */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-10 h-10 bg-background/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-lg">
                        <Share2 size={18} />
                      </button>
                    </div>

                    {/* View Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button 
                        size="lg" 
                        className="bg-primary/90 cursor-pointer backdrop-blur-sm hover:bg-primary"
                      >
                        <Eye className="mr-2" size={20} />
                        Voir le projet
                      </Button>
                    </div>
                  </div>

                  {/* Content Section */}
                  <CardContent className="p-6 lg:p-8">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                        {project.creator.charAt(0)}
                      </div>
                      <p className="text-sm text-muted-foreground">Par {project.creator}</p>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-default">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(index)}
                          className={`flex items-center gap-2 transition-all group/like ${
                            liked[index] 
                              ? 'text-pink-600 dark:text-pink-400' 
                              : 'text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400'
                          }`}
                        >
                          <Heart
                            size={20}
                            className={`transition-all cursor-pointer ${
                              liked[index] 
                                ? 'fill-current scale-110' 
                                : 'group-hover/like:fill-current group-hover/like:scale-110'
                            }`}
                          />
                          <span className="text-sm font-semibold">{likes[index]}</span>
                        </button>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Eye size={18} />
                          <span className="text-sm">{project.views}</span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MessageSquare size={18} />
                          <span className="text-sm">{project.comments}</span>
                        </div>
                      </div>

                      <button className="text-primary cursor-pointer hover:text-primary/80 transition-colors">
                        <ExternalLink size={20} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center fade-in-up">
            <Button 
              size="lg" 
              variant="outline" 
              className="group"
            >
              Voir plus de projets
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-muted/30 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto fade-in-up">
            <Card className="border-2 border-primary/30 shadow-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
              <CardContent className="p-10 lg:p-16 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Rocket className="text-primary" size={40} />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  Votre projet mérite d'être vu
                </h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                  Vous avez réalisé un projet chez Voisilab ? Partagez-le avec la communauté,
                  inspirez d'autres makers et faites partie de notre galerie d'innovations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300"
                    asChild
                  >
                    <Link href="/projet">
                      <span className="relative z-10 flex items-center gap-2">
                        <Zap className="group-hover:scale-110 transition-transform" size={20} />
                        Soumettre mon projet
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/about">
                      En savoir plus
                      <ArrowRight className="ml-2" size={20} />
                    </Link>
                  </Button>
                </div>

                {/* Benefits Pills */}
                <div className="flex flex-wrap gap-3 justify-center mt-8 pt-8 border-t border-border">
                  <Badge variant="outline" className="px-4 py-2">
                    <Heart className="w-4 h-4 mr-2" />
                    Visibilité garantie
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Users className="w-4 h-4 mr-2" />
                    Communauté active
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Inspiration partagée
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
