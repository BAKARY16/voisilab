"use client"

import React, { useState, useEffect } from "react"
import { SectionHeader } from "./section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import {
    ArrowRight,
    Bot,
    ChevronLeft,
    ChevronRight,
    Lightbulb,
    Users,
    Rocket,
    Heart,
    Printer,
    Scissors,
    Shirt,
    CodeXml,
    Drill,
    Calendar,
    Clock,
    GraduationCap,
    Wrench,
    ExternalLink,
    Mail,
    Linkedin,
    CheckCircle2,
    Send,
    Paperclip,
    Award,
    Phone,
    Code,
    Users2,
    CheckCircle,
    Newspaper,
    Eye,
    FileText,
    AlertCircle,
    Star,
    X,
    Zap,
    FlaskConical,
    Monitor,
    Smartphone,
    Cloud,
    Database,
    Shield,
    Headphones,
    MapPin
} from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const heroSlides = [
    { image: "/banner1.jpg", alt: "Fablab workspace" },
    { image: "/banner2.jpg", alt: "3D printing in action" },
    { image: "/banner1.jpg", alt: "Fablab workspace" },
    { image: "/banner2.jpg", alt: "3D printing in action" },
]

const API_URL = 'https://api.fablab.voisilab.online'

export function HomePageContent() {
    useScrollAnimation()

    const [currentSlide, setCurrentSlide] = useState(0)
    const [likes, setLikes] = useState<{ [key: number]: number }>({
        0: 45, 1: 67, 2: 32, 3: 89, 4: 54, 5: 71,
    })
    const [news, setNews] = useState<any[]>([]) // État pour les actualités
    const [loadingNews, setLoadingNews] = useState(true) // État de chargement
    const [equipment, setEquipment] = useState<any[]>([]) // État pour les équipements
    const [workshops, setWorkshops] = useState<any[]>([]) // État pour les ateliers
    const [loadingWorkshops, setLoadingWorkshops] = useState(true) // État de chargement ateliers
    const [innovations, setInnovations] = useState<any[]>([]) // État pour les innovations
    const [loadingInnovations, setLoadingInnovations] = useState(true) // État de chargement innovations
    const [services, setServices] = useState<any[]>([]) // État pour les services
    const [loadingServices, setLoadingServices] = useState(true) // État de chargement services
    const [selectedCategory, setSelectedCategory] = useState('Tous')
    const [liked, setLiked] = useState<{ [key: number]: boolean }>({})
    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isSliderPaused, setIsSliderPaused] = useState(false) // État pour pause slider équipe
    const [teamMembers, setTeamMembers] = useState<any[]>([]) // État pour les membres d'équipe
    const [loadingTeam, setLoadingTeam] = useState(true) // État de chargement équipe
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", projectType: "", budget: "", timeline: "", description: "",
    })

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    // Charger les actualités depuis le backend
    useEffect(() => {

        const fetchNews = async () => {
            try {
                const response = await fetch(`${API_URL}/api/blog/published?limit=3`)
                if (response.ok) {
                    const result = await response.json()
                    setNews(result.data || [])
                }
            } catch (error) {
                console.error('Erreur lors du chargement des actualités:', error)
            } finally {
                setLoadingNews(false)
            }
        }

        // Charger au démarrage
        fetchNews()

        // Auto-refresh toutes les 15 secondes en arrière-plan (silencieux)
        const interval = setInterval(() => {
            fetch(`${API_URL}/api/blog/published?limit=3`)
                .then(res => res.ok ? res.json() : null)
                .then(result => result && setNews(result.data || []))
                .catch(() => { }) // Silencieux en arrière-plan
        }, 15000) // 15 secondes

        return () => clearInterval(interval)
    }, [])

    // Charger les équipements depuis le backend
    useEffect(() => {
        console.log('🔄 Fetching equipment from:', `${API_URL}/api/equipment/available`)
        fetch(`${API_URL}/api/equipment/available`)
            .then(res => {
                console.log('📥 Equipment response status:', res.status)
                return res.ok ? res.json() : null
            })
            .then(result => {
                console.log('📊 Equipment API result:', result)
                if (result?.data) {
                    console.log('✅ Equipment loaded:', result.data.length, result.data)
                    setEquipment(result.data)
                }
            })
            .catch((err) => {
                console.error('❌ Equipment fetch error:', err)
            })
    }, [])

    // Charger les ateliers depuis le backend avec rafraîchissement automatique
    useEffect(() => {
        const fetchWorkshops = () => {
            fetch(`${API_URL}/api/workshops/published`)
                .then(res => res.ok ? res.json() : null)
                .then(result => {
                    setWorkshops(result?.data || [])
                    setLoadingWorkshops(false)
                })
                .catch(() => { setLoadingWorkshops(false) })
        }

        fetchWorkshops()

        // Rafraîchissement silencieux toutes les 15 secondes
        const interval = setInterval(() => {
            fetch(`${API_URL}/api/workshops/published`)
                .then(res => res.ok ? res.json() : null)
                .then(result => result && setWorkshops(result.data || []))
                .catch(() => { })
        }, 15000)

        return () => clearInterval(interval)
    }, [])

    // Charger les innovations depuis le backend avec rafraîchissement automatique
    useEffect(() => {
        const fetchInnovations = () => {
            fetch(`${API_URL}/api/innovations/published?limit=3`)
                .then(res => res.ok ? res.json() : null)
                .then(result => {
                    setInnovations(result?.data || [])
                    setLoadingInnovations(false)
                })
                .catch(() => { setLoadingInnovations(false) })
        }

        fetchInnovations()

        // Rafraîchissement silencieux toutes les 15 secondes
        const interval = setInterval(() => {
            fetch(`${API_URL}/api/innovations/published?limit=3`)
                .then(res => res.ok ? res.json() : null)
                .then(result => result && setInnovations(result.data || []))
                .catch(() => { })
        }, 15000)

        return () => clearInterval(interval)
    }, [])

    // Charger les services depuis le backend avec rafraîchissement automatique
    useEffect(() => {
        const fetchServices = () => {
            fetch(`${API_URL}/api/services/active`)
                .then(res => res.ok ? res.json() : null)
                .then(result => {
                    setServices(result?.data || [])
                    setLoadingServices(false)
                })
                .catch(() => { setLoadingServices(false) })
        }

        fetchServices()

        // Rafraîchissement silencieux toutes les 15 secondes
        const interval = setInterval(() => {
            fetch(`${API_URL}/api/services/active`)
                .then(res => res.ok ? res.json() : null)
                .then(result => result && setServices(result.data || []))
                .catch(() => { })
        }, 15000)

        return () => clearInterval(interval)
    }, [])

    // Fonction de transformation des données d'équipe
    const transformTeamData = (data: any[]) => {
        return data.map(member => ({
            name: member.name || member.full_name,
            role: member.role,
            bio: member.bio,
            // La colonne DB s'appelle "image" (pas avatar_url ni photo_url)
            image: member.image || member.avatar_url || member.photo_url,
            image_url: member.image || member.avatar_url || member.photo_url,
            email: member.email,
            linkedin: member.linkedin || member.linkedin_url,
            twitter: member.twitter || member.twitter_url
        }))
    }

    // Charger les membres d'équipe depuis le backend
    useEffect(() => {
        const fetchTeam = () => {
            console.log('🔄 Fetching team from:', `${API_URL}/api/team/active`)
            fetch(`${API_URL}/api/team/active`)
                .then(res => {
                    console.log('📥 Team response status:', res.status)
                    return res.ok ? res.json() : null
                })
                .then(result => {
                    console.log('📊 Team API result:', result)
                    if (result?.data) {
                        const transformed = transformTeamData(result.data)
                        console.log('✅ Team members loaded:', transformed.length, transformed)
                        setTeamMembers(transformed)
                    }
                    setLoadingTeam(false)
                })
                .catch((err) => {
                    console.error('❌ Team fetch error:', err)
                    setLoadingTeam(false)
                })
        }

        fetchTeam()

        // Rafraîchissement silencieux toutes les 60 secondes
        const interval = setInterval(() => {
            fetch(`${API_URL}/api/team/active`)
                .then(res => res.ok ? res.json() : null)
                .then(result => {
                    if (result?.data) {
                        setTeamMembers(transformTeamData(result.data))
                    }
                })
                .catch(() => { })
        }, 60000)

        return () => clearInterval(interval)
    }, [])

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)

    const handleLike = (index: number) => {
        if (!liked[index]) {
            setLikes((prev) => ({ ...prev, [index]: (prev[index] || 0) + 1 }))
            setLiked((prev) => ({ ...prev, [index]: true }))
        } else {
            setLikes((prev) => ({ ...prev, [index]: (prev[index] || 0) - 1 }))
            setLiked((prev) => ({ ...prev, [index]: false }))
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError(null)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files)
            // Limiter à 5 fichiers maximum
            if (files.length + selectedFiles.length > 5) {
                setError('Maximum 5 fichiers autorisés')
                return
            }
            // Vérifier la taille (10MB par fichier)
            const oversized = files.filter(f => f.size > 10 * 1024 * 1024)
            if (oversized.length > 0) {
                setError('Certains fichiers dépassent la taille maximale de 10MB')
                return
            }
            setSelectedFiles([...selectedFiles, ...files])
            setError(null)
        }
    }

    const removeFile = (index: number) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            console.log('?? Préparation de l\'envoi du projet...')
            console.log('API_URL:', API_URL)

            const formDataToSend = new FormData()
            formDataToSend.append('name', formData.name)
            formDataToSend.append('email', formData.email)
            formDataToSend.append('phone', formData.phone)
            formDataToSend.append('projectType', formData.projectType)
            formDataToSend.append('budget', formData.budget)
            formDataToSend.append('timeline', formData.timeline)
            formDataToSend.append('description', formData.description)

            // Ajouter les fichiers
            selectedFiles.forEach(file => {
                formDataToSend.append('files', file)
            })

            console.log('?? Données du formulaire:', {
                name: formData.name,
                email: formData.email,
                projectType: formData.projectType,
                filesCount: selectedFiles.length
            })

            console.log('?? Envoi vers:', `${API_URL}/api/project-submissions/submit`)
            const response = await fetch(`${API_URL}/api/project-submissions/submit`, {
                method: 'POST',
                body: formDataToSend
            })

            console.log('?? Réponse reçue - Status:', response.status, response.statusText)

            if (!response.ok) {
                const errorData = await response.json()
                console.error('? Erreur serveur:', errorData)
                throw new Error(errorData.message || 'Erreur lors de l\'envoi de la demande')
            }

            const result = await response.json()
            console.log('? Projet soumis avec succès:', result)
            setSubmitted(true)

            setTimeout(() => {
                setSubmitted(false)
                setFormData({ name: "", email: "", phone: "", projectType: "", budget: "", timeline: "", description: "" })
                setSelectedFiles([])
            }, 5000)
        } catch (error) {
            console.error('? Erreur complète:', error)
            setError(error instanceof Error ? error.message : 'Erreur lors de l\'envoi. Veuillez réessayer.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const stats = [
        { icon: Users2, value: "1000+", label: "Makers actifs", gradient: "from-blue-500/10 to-cyan-500/10" },
        { icon: Award, value: "500+", label: "Projets réalisés", gradient: "from-purple-500/10 to-pink-500/10" },
        { icon: Wrench, value: "15+", label: "Machines disponibles", gradient: "from-green-500/10 to-emerald-500/10" },
        { icon: GraduationCap, value: "50+", label: "Formations/an", gradient: "from-orange-500/10 to-red-500/10" },
    ]

    const values = [
        { icon: Lightbulb, title: "Innovation", description: "Nous encourageons la créativité et l'expérimentation pour repousser les limites de la fabrication numérique.", gradient: "" },
        { icon: Users, title: "Collaboration", description: "Un espace ouvert où makers, artistes et entrepreneurs partagent leurs connaissances et compétences.", gradient: "" },
        { icon: Rocket, title: "Accessibilité", description: "Démocratiser l'accès aux technologies de fabrication pour tous, du débutant à l'expert.", gradient: "" },
        { icon: Heart, title: "Communauté", description: "Créer un écosystème bienveillant où chacun peut apprendre, créer et grandir ensemble.", gradient: "" },
    ]

    // Icon mapping pour les services (icônes du backend vers Lucide)
    const serviceIconMap: Record<string, any> = {
        "PrinterOutlined": Printer,
        "CodeOutlined": Code,
        "RobotOutlined": Bot,
        "ThunderboltOutlined": Zap,
        "ToolOutlined": Wrench,
        "ExperimentOutlined": FlaskConical,
        "BulbOutlined": Lightbulb,
        "RocketOutlined": Rocket,
        "DesktopOutlined": Monitor,
        "MobileOutlined": Smartphone,
        "CloudOutlined": Cloud,
        "DatabaseOutlined": Database,
        "SafetyCertificateOutlined": Shield,
        "TeamOutlined": Users,
        "CustomerServiceOutlined": Headphones
    }

    // Services — toutes chargées depuis l'API (voir database/seed-data.sql)

    // Fonction pour transformer les services de l'API
    const transformService = (service: any) => {
        let features = service.features
        if (typeof features === 'string') {
            try { features = JSON.parse(features) } catch { features = [] }
        }
        return {
            ...service,
            title: service.title || service.name || 'Service',
            description: service.description || '',
            icon: serviceIconMap[service.icon] || Wrench,
            features: features || [],
            gradient: "from-primary/10 to-accent/10",
            // La colonne DB s'appelle "image" (pas image_url)
            image_url: service.image || service.image_url || null
        }
    }

    // Services à afficher — uniquement depuis l'API
    const displayServices = services.map(transformService)

    // Icon mapping pour les catégories d'équipement
    const categoryIcons: Record<string, any> = {
        "Impression": Printer,
        "Découpe": Scissors,
        "Confection": Shirt,
        "Création": Drill,
        "default": Wrench
    }

    // Données statiques de fallback pour les équipements
    const defaultEquipment = [
        { id: 1, name: "Imprimantes 3D FDM", count_info: "3 machines", description: "Imprimante 3D FDM haute performance, idéale pour le prototypage rapide.", category: "Impression", gradient: "from-blue-500/10 to-cyan-500/10", image_url: "https://www.makeitmarseille.com/wp-content/uploads/2017/09/Make-it-Marseille-impression-3D-ultimaker-2.jpg", category_color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", specs: ["Volume 220x220x250mm", "Précision 0.1mm", "PLA/PETG/TPU"], status: "available" },
        { id: 2, name: "Découpeuse Laser CO2", count_info: "2 machines", description: "Découpe et gravure laser sur bois, acrylique, cuir avec précision professionnelle.", category: "Découpe", image_url: "https://lefablab.fr/wp-content/uploads/2019/07/p7121491.jpg", gradient: "from-purple-500/10 to-pink-500/10", category_color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20", specs: ["Surface 600x400mm", "Puissance 60W"], status: "available" },
        { id: 3, name: "Machine à coudre SGGEMSY", count_info: "4 machines", description: "Machine industrielle pour textiles professionnels, robuste et précise.", image_url: "https://lecoindupro.blob.core.windows.net/upload/2436551.Lg.jpg", category: "Confection", gradient: "from-green-500/10 to-emerald-500/10", category_color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20", specs: ["Point droit et zigzag"], status: "available" },
    ]

    // Équipements à afficher (API si disponible, sinon par défaut)
    const displayEquipment = equipment.length > 0 ? equipment : defaultEquipment

    // Equipment et workshops maintenant chargés depuis l'API via useState/useEffect

    // Fonction pour obtenir la couleur du niveau
    const getLevelColor = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'débutant': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
            case 'intermédiaire': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
            case 'avancé': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
            default: return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
        }
    }

    // Obtenir les 3 premiers ateliers pour l'accueil
    const recentWorkshops = workshops.slice(0, 3)

    // Obtenir les 3 premières innovations pour l'accueil
    const recentInnovations = innovations.slice(0, 3)

    // Fonction pour obtenir la couleur de catégorie
    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Santé': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
            'Robotique': 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
            'Design': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
            'IoT': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
            'Agriculture': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        }
        return colors[category] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
    }

    // Parser les tags JSON
    const parseTags = (tags: string | string[] | undefined): string[] => {
        if (!tags) return []
        if (Array.isArray(tags)) return tags
        try {
            return JSON.parse(tags)
        } catch {
            return []
        }
    }

    // Helper pour construire l'URL complète des images depuis l'API
    const getImageUrl = (imagePath: string | undefined | null): string => {
        if (!imagePath) return '/placeholder.svg'
        // URL déjà complète vers l'API en ligne → retourner telle quelle
        if (imagePath.startsWith('https://api.fablab.voisilab.online')) return imagePath
        // URL localhost → extraire le chemin /uploads/ et préfixer par API_URL
        if (imagePath.includes('localhost')) {
            const match = imagePath.match(/(\/uploads\/.+)/)
            return match ? `${API_URL}${match[1]}` : '/placeholder.svg'
        }
        // URL externe déjà complète (autres domaines)
        if (imagePath.startsWith('http')) return imagePath
        // Chemin relatif /uploads/... → préfixer avec l'URL de l'API (tous sous-dossiers)
        if (imagePath.startsWith('/uploads/')) return `${API_URL}${imagePath}`
        return imagePath
    }

    // Données équipe — toutes chargées depuis l'API (voir database/seed-data.sql)
    // const news_old = [  // Données chargées depuis l'API
    // ]



    return (
        <div className="min-h-screen bg-background">

            {/* Hero Section */}
            <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    {heroSlides.map((slide, index) => (
                        <div key={index} className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}>
                            <Image src={slide.image} alt={slide.alt} fill className="object-cover" priority={index === 0} quality={90} />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/70 to-black/65" />
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/15 to-accent/15" />
                        </div>
                    ))}
                </div>

                <button onClick={prevSlide} className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group" aria-label="Diapositive précédente">
                    <ChevronLeft className="text-white group-hover:scale-110 transition-transform" size={24} />
                </button>
                <button onClick={nextSlide} className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group" aria-label="Diapositive suivante">
                    <ChevronRight className="text-white group-hover:scale-110 transition-transform" size={24} />
                </button>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {heroSlides.map((_, index) => (
                        <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "w-8 bg-primary" : "w-2 bg-white/50 hover:bg-white/70"}`} aria-label={`Aller à la diapositive ${index + 1}`} />
                    ))}
                </div>

                <div className="container mx-auto px-4 lg:px-8 relative z-20 pt-16">
                    <div className="max-w-5xl mx-auto text-center">

                        <h1 className="uppercase text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 leading-tight tracking-tight fade-in-up drop-shadow-2xl" style={{ animationDelay: '100ms' }}>
                            <span className="block text-white drop-shadow-lg">Votre espace de</span>
                            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-lg">fabrication numerique</span>
                        </h1>

                        <p className="text-lg md:text-xl lg:text-2xl text-gray-100 mb-10 max-w-3xl mx-auto leading-relaxed fade-in-up drop-shadow-lg" style={{ animationDelay: '200ms' }}>
                            Vous entrez avec des idées, vous repartez avec des projets concrets grâce à notre expertise et nos équipements de pointe.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 fade-in-up" style={{ animationDelay: '300ms' }}>
                            <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300 text-base shadow-2xl" asChild>
                                <a href="/projet">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Soumettre un projet
                                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </a>
                            </Button>
                            <Button size="lg" variant="outline" className="text-base bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 shadow-2xl" asChild>
                                <a href="#services">Découvrir nos services</a>
                            </Button>
                        </div>

                    </div>
                </div>

                <div className="absolute top-20 left-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-pulse z-0" />
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/30 rounded-full blur-3xl animate-pulse z-0" style={{ animationDelay: '1s' }} />
            </section>

            {/* Introduction Section - NOUVEAU */}
            <section className="py-12 lg:py-20">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
                            Bienvenue chez <span className="text-primary">Voisilab</span>
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Premier fablab de Côte d'Ivoire, Voisilab est un espace où créativité et technologie se rencontrent pour transformer vos idées en réalité.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary/10 rounded-full">
                                <Rocket className="text-primary" size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Concrétisez vos idées</h3>
                            <p className="text-sm text-muted-foreground">
                                Transformez vos concepts en projets concrets grâce à notre expertise et nos équipements.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary/10 rounded-full">
                                <Users className="text-primary" size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Rejoignez la communauté</h3>
                            <p className="text-sm text-muted-foreground">
                                Collaborez avec des créateurs passionnés et partagez vos connaissances.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary/10 rounded-full">
                                <GraduationCap className="text-primary" size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Formez-vous</h3>
                            <p className="text-sm text-muted-foreground">
                                Apprenez à utiliser nos machines et développez vos compétences techniques.
                            </p>
                        </div>
                    </div>

                    {/* <div className="mt-12 flex justify-center">
                        <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 max-w-xl w-full text-center">
                            <CardContent className="p-6">
                                <p className="text-sm text-muted-foreground">
                                    ?? Cocody Angré, Abidjan - Côte d'Ivoire  |  ?? +225 05 00 00 00 00
                                </p>
                            </CardContent>
                        </Card>
                    </div> */}
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 lg:py-32 relative">
                <div className="container mx-auto px-4 lg:px-8">
                    <SectionHeader
                        title="Un fablab au cœur de l'innovation"
                        subtitle="Depuis 2019, Voisilab est bien plus qu'un simple atelier. C'est un lieu de rencontre, d'apprentissage et de création où la technologie rencontre l'imagination."
                    />

                    {/* Values Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
                        {values.map((value, index) => {
                            const Icon = value.icon
                            return (
                                <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                    <Card className="relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 group h-full">
                                        <CardContent className="p-8">
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>
                                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                                <Icon size={28} className="text-primary" />
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground mb-3">{value.title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Services Section - REFONTE COMPLÈTE */}
            <section id="services" className="py-20 lg:py-32 bg-muted/30 relative overflow-hidden">
                {/* Background decoratif */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 lg:px-8 relative z-10">
                    <SectionHeader
                        title="Nos services"
                        subtitle="Solutions complètes de fabrication numérique pour concrétiser vos projets"
                    />

                    {/* Liste des services - Design 3 colonnes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
                        {displayServices.slice(0, 3).map((service, index) => {
                            const Icon = service.icon
                            return (
                                <div
                                    key={service.id || index}
                                    className=""
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <Card className="border-2 border-border hover:border-primary/50 transition-all duration-500 group overflow-hidden h-full">
                                        {/* Image de fond */}
                                        <div className="relative h-48 overflow-hidden bg-muted">
                                            {service.image_url ? (
                                                <Image
                                                    src={getImageUrl(service.image_url)}
                                                    alt={service.title || 'Service'}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                                                    <Icon size={48} className="text-primary/50" />
                                                </div>
                                            )}

                                            {/* Icône flottante */}
                                            <div className="absolute bottom-4 left-4">
                                                <div className="w-14 h-14 bg-background/90 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300 shadow-lg">
                                                    <Icon size={28} className="text-primary group-hover:text-white transition-colors" />
                                                </div>
                                            </div>
                                        </div>

                                        <CardContent className="p-6">
                                            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                                {service.title || 'Service'}
                                            </h3>

                                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                                {service.description || ''}
                                            </p>

                                            {/* Liste des prestations */}
                                            <div className="space-y-2 mb-6">
                                                {(service.features || []).slice(0, 3).map((item: string, i: number) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                                        <span className="text-sm text-foreground">{item}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Bouton */}
                                            <Button variant="outline" size="sm" className="w-full group/btn" asChild>
                                                <Link href={`/service#${(service.title || 'service').toLowerCase().replace(/\s+/g, '-')}`}>
                                                    En savoir plus
                                                    <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={16} />
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>

                    {/* Boutons voir plus */}
                    <div className="flex justify-center mt-12 fade-in-up" style={{ animationDelay: '350ms' }}>
                        <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300 text-base shadow-2xl" asChild>
                            <Link href="/service">
                                <span className="relative z-10 flex items-center gap-2">
                                    Voir tous les services
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Link>
                        </Button>
                    </div>

                    {/* Section infos complémentaires */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-16 fade-in-up" style={{ animationDelay: '400ms' }}>

                        {/* Tarifs */}
                        <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300">
                            <CardContent className="p-6 text-center">
                                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Badge className="text-blue-500" />
                                </div>
                                <h4 className="text-lg font-bold text-foreground mb-2">Tarifs accessibles</h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Des prix compétitifs pour tous types de projets, du particulier à l'entreprise
                                </p>
                                {/* <Button variant="outline" size="sm" asChild>
                                    <Link href="/tarifs">
                                        Voir les tarifs
                                        <ArrowRight className="ml-2" size={16} />
                                    </Link>
                                </Button> */}
                            </CardContent>
                        </Card>

                        {/* Devis */}
                        <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300">
                            <CardContent className="p-6 text-center">
                                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FileText className="text-purple-500" size={28} />
                                </div>
                                <h4 className="text-lg font-bold text-foreground mb-2">Devis gratuit</h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Obtenez un devis personnalisé pour votre projet
                                </p>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/projet">
                                        Demander un devis
                                        <Send className="ml-2" size={16} />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Support */}
                        <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300">
                            <CardContent className="p-6 text-center">
                                <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Users className="text-green-500" size={28} />
                                </div>
                                <h4 className="text-lg font-bold text-foreground mb-2">Accompagnement</h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Notre équipe vous guide à chaque étape de votre projet
                                </p>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/about#contact-section">
                                        Nous contacter
                                        <Phone className="ml-2" size={16} />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Bandeau CTA final */}
                    <div className="max-w-4xl mx-auto mt-16 fade-in-up" style={{ animationDelay: '500ms' }}>
                        <Card className="overflow-hidden">
                            <CardContent className="p-8 lg:p-12">
                                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                                    <div className="text-center lg:text-left flex-1">
                                        <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
                                            Votre projet mérite le meilleur
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Confiez-nous vos idées, nous les transformons en réalité avec notre expertise et nos équipements de pointe.
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button size="lg" className="group" asChild>
                                            <Link href="/projet">
                                                Démarrer un projet
                                                <Rocket className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                                            </Link>
                                        </Button>
                                        <Button size="lg" variant="outline" asChild>
                                            <Link href="/service">
                                                Tous les services
                                                <ExternalLink className="ml-2" size={20} />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
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
                        {displayEquipment.slice(0, 3).map((item, index) => {
                            const Icon = categoryIcons[item.category] || categoryIcons.default
                            return (
                                <div
                                    key={item.id || index}
                                    className=""
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <Card className="relative overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 group" style={{ minHeight: '400px' }}>
                                        {/* Image de fond toujours visible */}
                                        <div className="absolute inset-0 z-0">
                                            <Image
                                                src={getImageUrl(item.image_url) || "/logolab.png"}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>

                                        {/* Overlay qui apparaît au hover avec le contenu texte */}
                                        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-background/95 via-background/95 to-background/90 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex flex-col">
                                            <CardContent className="p-8  flex flex-col">
                                                {/* flex-1 */}
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
                                                    className={`${item.category_color} backdrop-blur-sm mb-6 border-2 font-semibold mb-4 w-fit transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200`}
                                                >
                                                    {item.category}
                                                </Badge>

                                                {/* Description */}
                                                <p className="text-sm text-muted-foreground leading-relaxed flex-1 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                                                    {item.description}
                                                </p>
                                                {/* Bouton */}
                                                <div className="mt-6 flex items-center transform translate-y-4 opacity-0 group-hover:translate-y-0 
                                                   group-hover:opacity-100 transition-all duration-500 delay-350">
                                                    <Link href="/materiels">
                                                        <Button size="lg" variant="outline" className="group" asChild>
                                                            <Link href="/materiels">
                                                                <span className="relative z-10 flex items-center gap-2">
                                                                    En savoir plus
                                                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                                                </span>
                                                            </Link>
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

                    {/* CTA Button */}
                    <div className="text-center fade-in-up">
                        <Button size="lg" variant="outline" className="group" asChild>
                            <Link href="/materiels">
                                <span className="relative z-10 flex items-center gap-2">
                                    Voir tous les équipements
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Workshops Section */}
            <section id="ateliers" className="py-20 lg:py-32 relative">
                <div className="container mx-auto px-4 lg:px-8">
                    <SectionHeader title="Ateliers & Formations" subtitle="Formations, ateliers créatifs et événements pour apprendre, créer et partager avec la communauté" />

                    {loadingWorkshops ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Chargement des activités...</p>
                        </div>
                    ) : recentWorkshops.length === 0 ? (
                        <div className="text-center py-12 mb-12">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="text-muted-foreground" size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Aucune activité prévue</h3>
                            <p className="text-muted-foreground">De nouvelles activités seront bientôt disponibles.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto mb-12">
                            {recentWorkshops.map((item, index) => {
                                const maxParticipants = item.capacity ?? item.max_participants ?? 0
                                const currentParticipants = item.registered ?? item.current_participants ?? 0
                                const spotsRemaining = maxParticipants - currentParticipants
                                return (
                                    <div key={item.id || index} className="" style={{ animationDelay: `${index * 100}ms` }}>
                                        <Link href={`/ateliers/${item.id}`} className="block h-full">
                                            <Card className={`relative overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 group h-full bg-gradient-to-br cursor-pointer`}>
                                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
                                                <CardContent className="p-8">
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>
                                                    <div className="flex items-start justify-between mb-4">
                                                        <Badge className={`${getLevelColor(item.level)} backdrop-blur-sm border-2 font-semibold`}>{item.level || 'Tous niveaux'}</Badge>
                                                        <span className="text-lg font-bold text-primary">{item.price === 0 ? 'Gratuit' : `${item.price?.toLocaleString()} FCFA`}</span>
                                                    </div>
                                                    {spotsRemaining > 0 && spotsRemaining <= 5 && (
                                                        <Badge variant="outline" className="mb-3 bg-background/90 backdrop-blur-sm border-destructive text-destructive font-semibold animate-pulse">
                                                            Plus que {spotsRemaining} place{spotsRemaining > 1 ? 's' : ''} !
                                                        </Badge>
                                                    )}
                                                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                                                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-2">{item.description}</p>
                                                    <div className="space-y-3 mb-6">
                                                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                                            <Calendar size={18} className="text-primary flex-shrink-0" />
                                                            <span className="text-sm text-foreground font-medium">{new Date(item.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                                            <Clock size={18} className="text-primary flex-shrink-0" />
                                                            <span className="text-sm text-foreground font-medium">
                                                                {new Date(item.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        {item.location && (
                                                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                                                <MapPin size={18} className="text-primary flex-shrink-0" />
                                                                <span className="text-sm text-foreground font-medium">{item.location}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button className="w-full cursor-pointer group relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
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

                    <div className="text-center fade-in-up">
                        <Button size="lg" variant="outline" className="group" asChild>
                            <Link href="/ateliers">
                                Voir tous les ateliers
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Innovations Section */}
            <section id="innovations" className="py-20 lg:py-32 bg-muted/30 relative overflow-hidden">
                {/* Background Pattern Animé */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="container mx-auto px-4 lg:px-8 relative z-10">

                    {/* En-tête moderne */}
                    <div className="max-w-4xl mx-auto text-center mb-16 fade-in-up">
                        {/* <Badge className="mb-6 px-5 py-2 bg-primary/10 text-primary border-none font-medium">
                            ?? Innovations
                        </Badge> */}
                        <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
                            Créations de la{" "}
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                communauté
                            </span>
                        </h2>
                        <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Découvrez les projets inspirants réalisés par nos makers et laissez-vous inspirer
                        </p>
                    </div>

                    {/* Filtres de catégories */}
                    {/* <div className="flex flex-wrap justify-center gap-3 mb-12 fade-in-up">
                        {['Tous', 'Santé', 'Agriculture', 'Design', 'Robotique', 'Éco-design', 'Musique'].map((category, index) => (
                            <Button
                                key={index}
                                onClick={() => setSelectedCategory(category)}
                                variant={selectedCategory === category ? "default" : "outline"}
                                size="sm"
                                className={`${selectedCategory === category ? 'bg-primary' : 'hover:bg-primary/10'} transition-all duration-300`}
                            >
                                {category}
                            </Button>
                        ))}
                    </div> */}

                    {/* Grid des projets - Nouveau design */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto mb-12">
                        {recentInnovations.map((innovation, index) => (
                            <div
                                key={index}
                                className="group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <Card className="relative overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 h-full">

                                    {/* Image avec overlay moderne */}
                                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                                        {innovation.image_url ? (
                                            <>
                                                <Image
                                                    src={getImageUrl(innovation.image_url)}
                                                    alt={innovation.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                {/* <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" /> */}
                                            </>
                                        ) : (
                                            // Placeholder avec gradient si pas d'image
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-6xl opacity-20"></div>
                                            </div>
                                        )}

                                        {/* Badge catégorie flottant */}
                                        <div className="absolute top-4 left-4">
                                            <Badge className={`backdrop-blur-md border-2 font-semibold shadow-lg`}>
                                                {innovation.category}
                                            </Badge>
                                        </div>

                                        {/* Actions rapides */}
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="w-9 h-9 bg-background/90 backdrop-blur-md hover:bg-primary hover:text-white"
                                                onClick={() => handleLike(index)}
                                            >
                                                <Heart
                                                    size={16}
                                                    className={liked[index] ? 'fill-pink-500 text-pink-500' : ''}
                                                />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="w-9 h-9 bg-background/90 backdrop-blur-md hover:bg-primary hover:text-white"
                                                asChild
                                            >
                                                <Link href={`/innovations/${innovation.id}`}>
                                                    <ExternalLink size={16} />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>

                                    <CardContent className="p-6">
                                        {/* Header avec avatar créateur */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                                    {innovation.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                                            {innovation.description}
                                        </p>

                                        {/* Tags compacts */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {parseTags(innovation.tags).slice(0, 3).map((tag, i) => (
                                                <Badge
                                                    key={i}
                                                    variant="secondary"
                                                    className="text-xs px-2 py-0.5 hover:bg-primary/10 transition-colors"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {parseTags(innovation.tags).length > 3 && (
                                                <Badge variant="outline" className="text-xs px-2 py-0.5">
                                                    +{parseTags(innovation.tags).length - 3}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Footer stats */}
                                        <div className="flex items-center justify-between pt-4 border-t border-border">
                                            <div className="flex items-center gap-4">
                                                {/* Likes */}
                                                <div className="flex items-center gap-1.5 text-muted-foreground hover:text-pink-500 transition-colors">
                                                    <Heart size={16} />
                                                    <span className="text-sm font-semibold">{innovation.likes || 0}</span>
                                                </div>

                                                {/* Views */}
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Eye size={16} />
                                                    <span className="text-sm">{innovation.views || 0}</span>
                                                </div>
                                            </div>

                                            {/* Bouton voir plus */}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-auto p-2 text-primary hover:text-white hover:bg-primary"
                                                asChild
                                            >
                                                <Link href={`/innovations/${innovation.id}`}>
                                                    Voir plus
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="text-center fade-in-up">
                        <Button size="lg" variant="outline" className="group" asChild>
                            <Link href="/innovations">
                                <span className="relative z-10 flex items-center gap-2">
                                    Voir toutes les innovations
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </span>
                            </Link>
                        </Button>
                    </div>

                </div>
            </section>

            {/* News Section - Design Simplifié et Professionnel */}
            <section className="py-20 lg:py-32 bg-muted/30">
                <div className="container mx-auto px-4 lg:px-8">
                    <SectionHeader title="Actualités" subtitle="Restez informé des dernières nouveautés, événements et partenariats de l'UVCI" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-8">
                        {loadingNews ? (
                            <div className="col-span-3 text-center py-8 text-muted-foreground">
                                Chargement des actualités...
                            </div>
                        ) : news.length === 0 ? (
                            <div className="col-span-3 text-center py-8 text-muted-foreground">
                                Aucune actualité disponible
                            </div>
                        ) : (
                            news.map((article: any, index: number) => (
                                <div key={index} style={{ animationDelay: `${index * 100}ms` }}>
                                    <Card className="overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full bg-background">
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
                                                    <span>{new Date(article.published_at || article.created_at).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 leading-tight">
                                                {article.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                                {article.excerpt}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="text-center fade-in-up">
                        <Button size="lg" variant="outline" className="group" asChild>
                            <Link href="/actualites">
                                Toutes les actualités
                                <Newspaper className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Team Section - Slider Infini */}
            <section className="py-20 lg:py-32 relative overflow-hidden">
                <div className="container mx-auto px-4 lg:px-8">
                    <SectionHeader
                        title="Notre équipe"
                        subtitle="Une équipe passionnée de makers, designers et développeurs dédiés à transformer vos idées en réalité"
                    />
                </div>

                {/* Slider infini avec pause au hover */}
                <div
                    className="relative w-full overflow-hidden"
                    style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
                    onMouseEnter={() => setIsSliderPaused(true)}
                    onMouseLeave={() => setIsSliderPaused(false)}
                >
                    <div
                        className="flex gap-6"
                        style={{
                            width: 'max-content',
                            animation: 'scroll-left 30s linear infinite',
                            animationPlayState: isSliderPaused ? 'paused' : 'running',
                        }}
                    >
                        {/* Double les éléments pour l'effet infini — données uniquement depuis l'API */}
                        {loadingTeam ? (
                            <div className="flex items-center justify-center w-full py-12">
                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : null}
                        {[...teamMembers, ...teamMembers].map((member, index) => (
                            <div key={index} className="flex-shrink-0 w-[280px]">
                                <Card className="overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 group h-full">
                                    <div className="relative h-64 overflow-hidden bg-muted">
                                        <Image
                                            src={getImageUrl(member.image || member.image_url)}
                                            alt={member.name}
                                            fill
                                            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                            sizes="280px"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Social links on hover */}
                                        <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            {member.linkedin && (
                                                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                                                    <Linkedin size={16} className="text-white" />
                                                </a>
                                            )}
                                            <a href={`mailto:${member.email}`} className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                                                <Mail size={16} className="text-white" />
                                            </a>
                                        </div>
                                    </div>
                                    <CardContent className="p-5 text-center">
                                        <h3 className="font-bold text-foreground mb-1 line-clamp-1">{member.name}</h3>
                                        <p className="text-sm text-primary font-medium line-clamp-1">{member.role}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="container mx-auto px-4 lg:px-8 mt-10">
                    <div className="text-center fade-in-up">
                        <Button size="lg" variant="outline" className="group" asChild>
                            <Link href="/equipe">
                                Découvrir toute l&apos;équipe
                                <Users className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* CSS pour l'animation */}
                <style jsx>{`
                    @keyframes scroll-left {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(-50%);
                        }
                    }
                    .animate-scroll-left {
                        animation: scroll-left 30s linear infinite;
                    }
                    .group\\/slider:hover .animate-scroll-left {
                        animation-play-state: paused;
                    }
                `}</style>
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

            <section className="py-20 lg:py-32 bg-muted/30 relative">
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
            </section>

            {/* Project Request Section */}
            <section id="projet" className="py-20 lg:py-32 relative">
                <div className="container mx-auto px-4 lg:px-8">
                    <SectionHeader title="Soumettre un projet" subtitle="Vous avez une idée ? Partagez-la avec nous ! Notre équipe d'experts étudiera votre demande et vous accompagnera dans sa réalisation." />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
                        <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300">
                            <CardContent className="p-8">
                                {submitted ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                            <CheckCircle2 size={32} className="text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground mb-2">Demande envoyée !</h3>
                                        <p className="text-muted-foreground">Merci pour votre demande. Nous vous contacterons sous 48h pour discuter de votre projet.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Affichage des erreurs */}
                                        {error && (
                                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 p-4 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle className="text-red-600" size={20} />
                                                    <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <Label htmlFor="name" className="text-foreground mb-2 block">Nom complet *</Label>
                                            <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50" placeholder="Jean " />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="email" className="text-foreground mb-2 block">Email *</Label>
                                                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50" placeholder="jean@gmail.com" />
                                            </div>
                                            <div>
                                                <Label htmlFor="phone" className="text-foreground mb-2 block">Téléphone</Label>
                                                <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50" placeholder="+225 00 00 00 00 00" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="projectType" className="text-foreground mb-2 block">Type de projet *</Label>
                                            <input
                                                id="projectType"
                                                name="projectType"
                                                type="text"
                                                required
                                                value={formData.projectType}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50"
                                                placeholder="Ex: Impression 3D, Découpe laser, Électronique..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="budget" className="text-foreground mb-2 block">Budget estimé</Label>
                                                <select id="budget" name="budget" value={formData.budget} onChange={handleChange} className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50">
                                                    <option value="">Choisir...</option>
                                                    <option value="<500000">Moins de 500 000 FCFA</option>
                                                    <option value="500000-1000000">500 000 - 1 000 000 FCFA</option>
                                                    <option value="1000000-3000000">1 000 000 - 3 000 000 FCFA</option>
                                                    <option value=">3000000">Plus de 3 000 000 FCFA</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label htmlFor="timeline" className="text-foreground mb-2 block">Délai souhaité</Label>
                                                <select id="timeline" name="timeline" value={formData.timeline} onChange={handleChange} className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50">
                                                    <option value="">Choisir...</option>
                                                    <option value="urgent">Urgent (1-2 semaines)</option>
                                                    <option value="normal">Normal (1 mois)</option>
                                                    <option value="flexible">Flexible (2-3 mois)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="description" className="text-foreground mb-2 block">Description du projet *</Label>
                                            <textarea id="description" name="description" required value={formData.description} onChange={handleChange} rows={6} className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground resize-none transition-all duration-300 hover:border-primary/50" placeholder="Décrivez votre projet en détail : objectifs, contraintes techniques, utilisation prévue..." />
                                        </div>
                                        <div>
                                            <Label className="text-foreground mb-2 block">Fichiers (optionnel)</Label>
                                            <div className="space-y-3">
                                                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.stl,.obj"
                                                        multiple
                                                        onChange={handleFileChange}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                    <Paperclip className="mx-auto mb-2 text-muted-foreground" size={24} />
                                                    <p className="text-sm text-muted-foreground">Glissez vos fichiers ici ou cliquez pour parcourir</p>
                                                    <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, Images, fichiers 3D (max 5 fichiers, 10MB chacun)</p>
                                                </div>
                                                {selectedFiles.length > 0 && (
                                                    <div className="space-y-2">
                                                        {selectedFiles.map((file, index) => (
                                                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                                                <div className="flex items-center gap-2">
                                                                    <FileText size={16} className="text-primary" />
                                                                    <span className="text-sm text-foreground">{file.name}</span>
                                                                    <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(0)} KB)</span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeFile(index)}
                                                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={isSubmitting}
                                            className="w-full bg-primary hover:bg-primary/90"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                                    Envoi en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={20} />
                                                    <span className="ml-2">Envoyer la demande</span>
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>


                        <div className="space-y-6">
                            <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300">
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-semibold text-foreground mb-4">Comment ça marche ?</h3>
                                    <div className="space-y-4">
                                        {[
                                            { num: 1, title: "Soumettez votre demande", desc: "Remplissez le formulaire avec les détails de votre projet." },
                                            { num: 2, title: "Étude de faisabilité", desc: "Notre équipe analyse votre demande et évalue la faisabilité technique." },
                                            { num: 3, title: "Devis personnalisé", desc: "Vous recevez un devis détaillé avec planning et coûts." },
                                            { num: 4, title: "Réalisation", desc: "Nous fabriquons votre projet avec notre expertise et nos machines." },
                                        ].map((step) => (
                                            <div key={step.num} className="flex gap-4">
                                                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">{step.num}</div>
                                                <div>
                                                    <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                                                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-primary/5 to-accent/5">
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-semibold text-foreground mb-4">Nos compétences</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {["Impression 3D", "Découpe Laser", "Usinage CNC", "Électronique", "IoT & Arduino", "Prototypage", "Design 3D", "CAO/DAO"].map((skill, index) => (
                                            <Badge key={index} variant="secondary" className="px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default">{skill}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-primary/50">
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-semibold text-foreground mb-2">Besoin d'aide ?</h3>
                                    <p className="text-muted-foreground mb-4">Notre équipe est disponible pour répondre à vos questions avant de soumettre votre projet.</p>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-foreground"><span className="font-medium">Email:</span> <a href="mailto:fablab@uvci.edu.ci" className="text-primary hover:underline">fablab@uvci.edu.ci</a></p>
                                        <p className="text-foreground"><span className="font-medium">Téléphone:</span> <a href="tel:+2250500000000" className="text-primary hover:underline">+225 05 00 00 00 00</a></p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}


