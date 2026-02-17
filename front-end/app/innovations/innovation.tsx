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
  Share2,
  Loader2
} from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500'
const AUTO_REFRESH_INTERVAL = 15000 // 15 secondes - rafraîchissement silencieux

interface Innovation {
  id: number
  title: string
  description: string
  category: string
  creator_name: string
  creator_email: string
  image_url: string
  tags: string[] | string
  status: string
  is_published: boolean
  is_featured: boolean
  likes: number
  views: number
  created_at: string
}

export function InnovationsSection() {
  useScrollAnimation()

  const [innovations, setInnovations] = useState<Innovation[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<{name: string, count: number, active: boolean}[]>([])
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [likedProjects, setLikedProjects] = useState<{[key: number]: boolean}>({})
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fonction de rafraîchissement silencieux (sans indicateur de loading)
  const silentRefresh = useCallback(async () => {
    try {
      const [innovationsRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}/api/innovations/published`),
        fetch(`${API_URL}/api/innovations/categories`)
      ])
      
      if (innovationsRes.ok) {
        const data = await innovationsRes.json()
        const innovationsData = data.data || data
        setInnovations(Array.isArray(innovationsData) ? innovationsData : [])
      }
      
      if (categoriesRes.ok) {
        const catData = await categoriesRes.json()
        const cats = catData.data || catData
        if (Array.isArray(cats) && cats.length > 0) {
          const total = cats.reduce((sum: number, cat: any) => sum + (cat.count || 0), 0)
          setCategories(prev => {
            const currentActive = prev.find(c => c.active)?.name || 'Tous'
            return [
              { name: 'Tous', count: total, active: currentActive === 'Tous' },
              ...cats.map((cat: any) => ({ 
                name: cat.category || cat.name, 
                count: cat.count || 0, 
                active: currentActive === (cat.category || cat.name) 
              }))
            ]
          })
        }
      }
    } catch (error) {
      console.error('Erreur rafraîchissement silencieux:', error)
    }
  }, [])

  // Charger les innovations depuis l'API
  useEffect(() => {
    const fetchInnovations = async () => {
      try {
        const response = await fetch(`${API_URL}/api/innovations/published`)
        if (!response.ok) throw new Error('Erreur API')
        const data = await response.json()
        const innovationsData = data.data || data
        setInnovations(Array.isArray(innovationsData) ? innovationsData : [])
        setLoading(false)
      } catch (error) {
        console.error('Erreur lors du chargement des innovations:', error)
        setInnovations([])
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/innovations/categories`)
        if (!response.ok) throw new Error('Erreur API')
        const data = await response.json()
        const cats = data.data || data
        if (Array.isArray(cats) && cats.length > 0) {
          const total = cats.reduce((sum: number, cat: any) => sum + (cat.count || 0), 0)
          setCategories([
            { name: 'Tous', count: total, active: true },
            ...cats.map((cat: any) => ({ name: cat.category || cat.name, count: cat.count || 0, active: false }))
          ])
        }
      } catch (error) {
        console.error('Erreur lors du chargement des categories:', error)
      }
    }

    fetchInnovations()
    fetchCategories()
    
    // Rafraîchissement automatique toutes les 30 secondes
    refreshIntervalRef.current = setInterval(silentRefresh, AUTO_REFRESH_INTERVAL)
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [silentRefresh])

  // Parser les tags
  const parseTags = (tags: string[] | string | undefined): string[] => {
    if (!tags) return []
    if (Array.isArray(tags)) return tags
    try {
      return JSON.parse(tags)
    } catch {
      return []
    }
  }

  // Couleur de catégorie
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Santé': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      'Robotique': 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
      'Design': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      'IoT': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      'Agriculture': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      'Tech': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      'Éducation': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
      'Mobilier': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    }
    return colors[category] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
  }

  // Gradient par catégorie
  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      'Santé': 'from-blue-500/10 to-cyan-500/10',
      'Robotique': 'from-green-500/10 to-emerald-500/10',
      'Design': 'from-purple-500/10 to-pink-500/10',
      'IoT': 'from-cyan-500/10 to-blue-500/10',
      'Agriculture': 'from-emerald-500/10 to-green-500/10',
      'Tech': 'from-indigo-500/10 to-purple-500/10',
    }
    return gradients[category] || 'from-gray-500/10 to-slate-500/10'
  }

  // Liker un projet
  const handleLike = async (id: number) => {
    if (likedProjects[id]) return
    
    try {
      await fetch(`${API_URL}/api/innovations/${id}/like`, { method: 'POST' })
      setLikedProjects(prev => ({ ...prev, [id]: true }))
      setInnovations(prev => prev.map(innovation => 
        innovation.id === id 
          ? { ...innovation, likes: (innovation.likes || 0) + 1 }
          : innovation
      ))
    } catch (error) {
      console.error('Erreur lors du like:', error)
    }
  }

  // Filtrer par categorie
  const handleCategoryFilter = (categoryName: string) => {
    setSelectedCategory(categoryName)
    setCategories(prev => prev.map(cat => ({
      ...cat,
      active: cat.name === categoryName
    })))
  }

  // Innovations filtrees
  const filteredInnovations = selectedCategory === 'Tous'
    ? innovations
    : innovations.filter(i => i.category === selectedCategory)

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
                onClick={() => handleCategoryFilter(category.name)}
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

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Chargement des innovations...</p>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
              {filteredInnovations.map((innovation, index) => (
                <div key={innovation.id} className="" style={{ animationDelay: `${index * 100}ms` }}>
                  <Card className={`relative overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 group h-full bg-gradient-to-br`}>
                    {/* Image Section */}
                    <div className="relative h-56 lg:h-64 overflow-hidden">
                      {innovation.image_url ? (
                        <Image
                          src={innovation.image_url}
                          alt={innovation.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Lightbulb className="w-16 h-16 text-primary/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className={`${getCategoryColor(innovation.category)} backdrop-blur-sm border-2 font-semibold`}>
                          {innovation.category}
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
                          asChild
                        >
                          <Link href={`/innovations/${innovation.id}`}>
                            <Eye className="mr-2" size={20} />
                            Voir le projet
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Content Section */}
                    <CardContent className="p-6 lg:p-8">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {innovation.title}
                      </h3>
                      
                      {innovation.creator_name && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                            {innovation.creator_name.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-sm text-muted-foreground">Par {innovation.creator_name}</p>
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {innovation.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {parseTags(innovation.tags).slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-default">
                            {tag}
                          </Badge>
                        ))}
                        {parseTags(innovation.tags).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{parseTags(innovation.tags).length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Stats & Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleLike(innovation.id)}
                            className={`flex items-center gap-2 transition-all group/like ${
                              likedProjects[innovation.id]
                                ? 'text-pink-600 dark:text-pink-400' 
                                : 'text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400'
                            }`}
                          >
                            <Heart
                              size={20}
                              className={`transition-all cursor-pointer ${
                                likedProjects[innovation.id]
                                  ? 'fill-current scale-110' 
                                  : 'group-hover/like:fill-current group-hover/like:scale-110'
                              }`}
                            />
                            <span className="text-sm font-semibold">{innovation.likes || 0}</span>
                          </button>

                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Eye size={18} />
                            <span className="text-sm">{innovation.views || 0}</span>
                          </div>
                        </div>

                        <Link 
                          href={`/innovations/${innovation.id}`}
                          className="text-primary cursor-pointer hover:text-primary/80 transition-colors"
                        >
                          <ExternalLink size={20} />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredInnovations.length === 0 && (
            <div className="text-center py-20">
              <Lightbulb className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Aucune innovation trouvée</h3>
              <p className="text-muted-foreground">
                {selectedCategory === 'Tous' 
                  ? "Il n'y a pas encore d'innovations publiées."
                  : `Aucune innovation dans la catégorie "${selectedCategory}".`}
              </p>
            </div>
          )}
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
