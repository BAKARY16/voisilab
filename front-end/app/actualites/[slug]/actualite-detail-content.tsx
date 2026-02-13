"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin, AlertCircle } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import PageBreadcrumb from "@/components/PageBreadCrumb"
import { Rocket } from "lucide-react"

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    featured_image: string
    category: string
    published_at: string
    author_name?: string
    views?: number
    created_at: string
}

export function ActualiteDetailContent({ slug }: { slug: string }) {
    useScrollAnimation()

    const [article, setArticle] = useState<BlogPost | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true)
                const response = await fetch(`http://localhost:5000/api/blog/slug/${slug}`)

                if (!response.ok) {
                    throw new Error('Article non trouvé')
                }

                const result = await response.json()
                setArticle(result.data)
                setError(null)
            } catch (err) {
                console.error('Erreur lors du chargement de l\'article:', err)
                setError(err instanceof Error ? err.message : 'Une erreur est survenue')
            } finally {
                setLoading(false)
            }
        }

        fetchArticle()
    }, [slug])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-16">
                    <Skeleton className="h-8 w-32 mb-8" />
                    <Skeleton className="h-96 w-full mb-8" />
                    <div className="max-w-4xl mx-auto space-y-4">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-2/3" />
                    </div>
                </div>
            </main>
        )
    }

    if (error || !article) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <Card className="max-w-md p-8 text-center">
                    <AlertCircle className="mx-auto mb-4 text-destructive" size={48} />
                    <h2 className="text-2xl font-bold mb-2">Article non trouvé</h2>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <Button asChild>
                        <Link href="/actualites">
                            <ArrowLeft className="mr-2" size={18} />
                            Retour aux actualités
                        </Link>
                    </Button>
                </Card>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background">{/* Hero Section */}
            <section className="relative pt-16 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
                <div className="absolute inset-0">
                    <video
                        src="/video.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"></div>
                </div>

                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

                <div className="relative z-10">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="flex items-center justify-center mb-8 fade-in-up">
                            <PageBreadcrumb pageTitle="Soumettre un projet" />
                        </div>

                        <div className="max-w-4xl mx-auto text-center fade-in-up">
                            <Badge className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" variant="outline">
                                <Rocket className="w-4 h-4 mr-2" />
                                Concrétisez vos idées
                            </Badge>

                            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
                                <span className="block">Donnez vie à</span>
                                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                                    votre projet
                                </span>
                            </h1>

                            <p className="text-lg lg:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto">
                                Notre équipe d'experts est prête à vous accompagner de l'idée à la réalisation.
                                Partagez votre vision avec nous et transformons-la en réalité.
                            </p>

                            {/* Security badges */}
                            <div className="flex flex-wrap justify-center gap-4 mb-8">
                                {/* {securityFeatures.map((feature, index) => {
                                            const Icon = feature.icon
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
                                                >
                                                    <Icon className="text-green-400" size={16} />
                                                    <span className="text-sm text-gray-200">{feature.text}</span>
                                                </div>
                                            )
                                        })} */}
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 lg:gap-6 max-w-2xl mx-auto">
                                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                                    <div className="text-3xl lg:text-4xl font-bold text-white mb-1">150+</div>
                                    <div className="text-sm text-gray-300">Projets réalisés</div>
                                </div>
                                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                                    <div className="text-3xl lg:text-4xl font-bold text-white mb-1">48h</div>
                                    <div className="text-sm text-gray-300">Temps de réponse</div>
                                </div>
                                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                                    <div className="text-3xl lg:text-4xl font-bold text-white mb-1">98%</div>
                                    <div className="text-sm text-gray-300">Satisfaction</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute top-20 left-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </section>

            {/* Contenu de l'article */}
            <article className="container mx-auto px-4 lg:px-8 py-12">
                <div className="max-w-5xl mx-auto">
                    {/* En-tête */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Badge variant="default">{article.category}</Badge>
                            <span className="text-sm text-muted-foreground">
                                {formatDate(article.published_at)}
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                            {article.title}
                        </h1>

                        {article.excerpt && (
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {article.excerpt}
                            </p>
                        )}
                    </div>

                    {/* Image principale */}
                    {article.featured_image && (
                        <div className="relative w-full h-[400px] lg:h-[500px] mb-12 rounded-lg overflow-hidden">
                            <Image
                                src={article.featured_image}
                                alt={article.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Métadonnées */}
                    <div className="flex items-center justify-between py-6 mb-8 border-y border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User size={20} className="text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-foreground text-sm">
                                    {article.author_name || 'Équipe Voisilab'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatTime(article.published_at)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground hidden sm:inline">Partager</span>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                                <a href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer">
                                    <Facebook size={16} />
                                </a>
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer">
                                    <Twitter size={16} />
                                </a>
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer">
                                    <Linkedin size={16} />
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Contenu principal */}
                    <div
                        className="prose prose-lg max-w-none
                            prose-headings:text-foreground prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-8
                            prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-6
                            prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80
                            prose-strong:text-foreground prose-strong:font-semibold
                            prose-ul:text-foreground prose-ol:text-foreground
                            prose-li:mb-2 prose-li:leading-relaxed
                            prose-img:rounded-lg prose-img:my-8
                            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
                            dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Navigation */}
                    <div className="mt-16 pt-8 border-t border-border">
                        <Button variant="outline" asChild>
                            <Link href="/actualites">
                                <ArrowLeft className="mr-2" size={16} />
                                Retour aux actualités
                            </Link>
                        </Button>
                    </div>
                </div>
            </article>
        </main>
    )
}
