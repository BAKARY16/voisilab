"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import PageBreadcrumb from "@/components/PageBreadCrumb"
import { SectionHeader } from "@/components/section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, ArrowRight, Search, Filter, AlertCircle } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string
    featured_image: string
    category: string
    published_at: string
    author_name?: string
}

export function ActualitesContent() {
    useScrollAnimation()

    const [news, setNews] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string>("Tous")
    const [searchQuery, setSearchQuery] = useState("")

    // Catégories disponibles
    const categories = ["Tous", "Événement", "Cérémonie", "Formation", "Partenariat"]

    // Récupérer les actualités depuis le backend
    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true)
                const response = await fetch('http://localhost:5000/api/blog/published')
                
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des actualités')
                }

                const result = await response.json()
                setNews(result.data || [])
                setError(null)
            } catch (err) {
                console.error('Erreur:', err)
                setError(err instanceof Error ? err.message : 'Une erreur est survenue')
            } finally {
                setLoading(false)
            }
        }

        // Charger au démarrage
        fetchNews()
        
        // Auto-refresh toutes les 30 secondes en arrière-plan (au lieu de 5s)
        const interval = setInterval(() => {
            fetch('http://localhost:5000/api/blog/published')
                .then(res => res.ok ? res.json() : null)
                .then(result => {
                    if (result) {
                        setNews(result.data || [])
                        setError(null)
                    }
                })
                .catch(() => {}) // Silencieux en arrière-plan
        }, 30000) // 30 secondes au lieu de 5
        
        return () => clearInterval(interval)
    }, [])

    // Filtrer les actualités
    const filteredNews = news.filter(article => {
        const matchesCategory = selectedCategory === "Tous" || article.category === selectedCategory
        const matchesSearch = searchQuery === "" || 
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    // Formater la date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
        })
    }

    return (
        <section className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative pt-16 pb-12 lg:pt-32 lg:pb-20 bg-muted/30">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-center mb-8 fade-in-up">
                        <PageBreadcrumb pageTitle="Actualités" />
                    </div>

                    <div className="max-w-4xl mx-auto text-center fade-in-up">
                        <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                            Actualités
                        </h1>
                        <p className="text-lg lg:text-xl text-muted-foreground mb-10 leading-relaxed">
                            Restez informé des dernières nouveautés, événements et partenariats de l'UVCI
                        </p>
                    </div>
                </div>
            </section>

            {/* Filtres et recherche */}
            <section className="py-8 border-b border-border">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start lg:items-center justify-between">
                            {/* Recherche */}
                            <div className="relative flex-1 w-full lg:max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="text"
                                    placeholder="Rechercher une actualité..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                />
                            </div>

                            {/* Filtres par catégorie */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <Filter className="text-muted-foreground" size={18} />
                                {categories.map((category) => (
                                    <Button
                                        key={category}
                                        variant={selectedCategory === category ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedCategory(category)}
                                        className="text-sm"
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Compteur de résultats */}
                        {!loading && (
                            <div className="mt-4 text-sm text-muted-foreground">
                                {filteredNews.length} {filteredNews.length > 1 ? 'actualités trouvées' : 'actualité trouvée'}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Liste des actualités */}
            <section className="py-12 lg:py-20">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* État de chargement */}
                        {loading && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <Card key={i} className="overflow-hidden">
                                        <Skeleton className="h-56 w-full" />
                                        <CardContent className="p-6 space-y-3">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-6 w-full" />
                                            <Skeleton className="h-6 w-3/4" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-2/3" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Erreur */}
                        {error && !loading && (
                            <div className="max-w-2xl mx-auto">
                                <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
                                    <CardContent className="p-8 text-center">
                                        <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
                                        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
                                            Erreur de chargement
                                        </h3>
                                        <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
                                        <Button onClick={() => window.location.reload()} variant="outline">
                                            Réessayer
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Aucun résultat */}
                        {!loading && !error && filteredNews.length === 0 && (
                            <div className="max-w-2xl mx-auto text-center py-12">
                                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="text-muted-foreground" size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    Aucune actualité trouvée
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    Essayez de modifier vos critères de recherche ou de filtrage
                                </p>
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        setSelectedCategory("Tous")
                                        setSearchQuery("")
                                    }}
                                >
                                    Réinitialiser les filtres
                                </Button>
                            </div>
                        )}

                        {/* Actualités */}
                        {!loading && !error && filteredNews.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredNews.map((article, index) => (
                                    <div 
                                        key={article.id} 
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <Link href={`/actualites/${article.slug}`}>
                                            <Card className="overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full bg-background group cursor-pointer">
                                                <div className="relative h-56 overflow-hidden bg-muted">
                                                    <Image 
                                                        src={article.featured_image || "/placeholder.svg"} 
                                                        alt={article.title} 
                                                        fill 
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300" 
                                                    />
                                                </div>
                                                <CardContent className="p-6">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <Badge variant="outline" className="text-xs font-medium">
                                                            {article.category}
                                                        </Badge>
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <Calendar size={14} />
                                                            <span>{formatDate(article.published_at)}</span>
                                                        </div>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                                        {article.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                                                        {article.excerpt}
                                                    </p>
                                                    <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                                                        Lire la suite
                                                        <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" size={16} />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </section>
    )
}
