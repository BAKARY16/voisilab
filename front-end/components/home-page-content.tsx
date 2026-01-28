"use client"

import React from "react"
import { SectionHeader } from "./section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import {
    ArrowRight,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Lightbulb,
    Users,
    Rocket,
    Heart,
    Printer,
    Scissors,
    Hammer,
    Cpu,
    Drill,
    Gauge,
    Calendar,
    Clock,
    GraduationCap,
    Zap,
    Wrench,
    ExternalLink,
    Linkedin,
    Mail,
    CheckCircle2,
    Send,
    Paperclip,
    Award,
    TrendingUp,
    Target,
    Shield,
    Star,
    Quote,
    Play,
    MapPin,
    Phone,
    Building2,
    Wifi,
    Coffee,
    Palette,
    Code,
    Package,
    Globe,
    BookOpen,
    Video,
    Users2,
    CheckCircle,
    Newspaper,
    Download
} from "lucide-react"
import { useState, useEffect } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const heroSlides = [
    { image: "/banner1.jpg", alt: "Fablab workspace" },
    { image: "/banner2.jpg", alt: "3D printing in action" },
    { image: "/banner1.jpg", alt: "Fablab workspace" },
    { image: "/banner2.jpg", alt: "3D printing in action" },
]

export function HomePageContent() {
    useScrollAnimation()

    const [currentSlide, setCurrentSlide] = useState(0)
    const [likes, setLikes] = useState<{ [key: number]: number }>({
        0: 45, 1: 67, 2: 32, 3: 89, 4: 54, 5: 71,
    })
    const [liked, setLiked] = useState<{ [key: number]: boolean }>({})
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", projectType: "", budget: "", timeline: "", description: "",
    })

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
        }, 5000)
        return () => clearInterval(timer)
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
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Project request submitted:", formData)
        setSubmitted(true)
        setTimeout(() => {
            setSubmitted(false)
            setFormData({ name: "", email: "", phone: "", projectType: "", budget: "", timeline: "", description: "" })
        }, 3000)
    }

    const stats = [
        { icon: Users2, value: "1000+", label: "Makers actifs", gradient: "from-blue-500/10 to-cyan-500/10" },
        { icon: Award, value: "500+", label: "Projets réalisés", gradient: "from-purple-500/10 to-pink-500/10" },
        { icon: Wrench, value: "15+", label: "Machines disponibles", gradient: "from-green-500/10 to-emerald-500/10" },
        { icon: GraduationCap, value: "50+", label: "Formations/an", gradient: "from-orange-500/10 to-red-500/10" },
    ]

    const values = [
        { icon: Lightbulb, title: "Innovation", description: "Nous encourageons la créativité et l'expérimentation pour repousser les limites de la fabrication numérique.", gradient: "" }, //from-blue-500/10 to-cyan-500/10
        { icon: Users, title: "Collaboration", description: "Un espace ouvert où makers, artistes et entrepreneurs partagent leurs connaissances et compétences.", gradient: "" }, //from-purple-500/10 to-pink-500/10
        { icon: Rocket, title: "Accessibilité", description: "Démocratiser l'accès aux technologies de fabrication pour tous, du débutant à l'expert.", gradient: "" }, //from-green-500/10 to-emerald-500/10
        { icon: Heart, title: "Communauté", description: "Créer un écosystème bienveillant où chacun peut apprendre, créer et grandir ensemble.", gradient: "" }, //from-pink-500/10 to-rose-500/10
    ]

    const services = [
        {
            icon: Printer,
            title: "Impression 3D",
            description: "Prototypage rapide et production de pièces personnalisées en FDM et résine.",
            items: ["Prototypage", "Petites séries", "Matériaux variés"],
            gradient: "from-blue-500/10 to-cyan-500/10",
            image: "https://www.makeitmarseille.com/wp-content/uploads/2017/09/Make-it-Marseille-impression-3D-ultimaker-2.jpg" // Ajoutez vos images
        },
        {
            icon: Scissors,
            title: "Découpe Laser",
            description: "Découpe et gravure précise sur bois, acrylique, cuir, carton et plus encore.",
            items: ["Signalétique", "Packaging", "Décoration"],
            gradient: "from-purple-500/10 to-pink-500/10",
            image: "https://lefablab.fr/wp-content/uploads/2019/07/p7121491.jpg"
        },
        {
            icon: Hammer,
            title: "Usinage CNC",
            description: "Fraisage de précision pour bois, plastique et aluminium avec notre fraiseuse 3 axes.",
            items: ["Moules", "Pièces mécaniques", "Prototypes"],
            gradient: "from-green-500/10 to-emerald-500/10",
            image: "/cnc-machining-service.jpg"
        },
        {
            icon: Code,
            title: "Électronique & IoT",
            description: "Développement de solutions connectées avec Arduino, Raspberry Pi et ESP32.",
            items: ["Circuits imprimés", "Objets connectés", "Domotique"],
            gradient: "from-orange-500/10 to-red-500/10",
            image: "/electronics-iot-service.jpg"
        },
        {
            icon: Palette,
            title: "Design & CAO",
            description: "Accompagnement en conception 3D avec Fusion 360, Blender et Inkscape.",
            items: ["Modélisation 3D", "Design graphique", "Plans techniques"],
            gradient: "from-pink-500/10 to-rose-500/10",
            image: "/design-cao-service.jpg"
        },
        {
            icon: Package,
            title: "Prototypage complet",
            description: "De l'idée au prototype final, nous vous accompagnons dans tout le processus.",
            items: ["Étude de faisabilité", "Tests & itérations", "Finitions"],
            gradient: "from-cyan-500/10 to-blue-500/10",
            image: "/prototyping-service.jpg"
        },
    ]

    const equipment = [
        { icon: Printer, name: "Imprimantes 3D", count: "5 machines", description: "FDM (Prusa, Creality) et résine (Elegoo) pour tous types de projets", category: "Impression", gradient: "from-blue-500/10 to-cyan-500/10", categoryColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
        { icon: Scissors, name: "Découpeuse Laser", count: "100W CO2", description: "Zone de travail 1000x600mm, compatible bois, acrylique, tissu", category: "Découpe", gradient: "from-purple-500/10 to-pink-500/10", categoryColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
        { icon: Hammer, name: "Fraiseuse CNC", count: "3 axes", description: "Précision 0.1mm, usinage bois, plastique et aluminium", category: "Usinage", gradient: "from-green-500/10 to-emerald-500/10", categoryColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
        { icon: Cpu, name: "Station électronique", count: "Équipée complète", description: "Arduino, Raspberry Pi, composants, outils de soudure", category: "Électronique", gradient: "from-orange-500/10 to-red-500/10", categoryColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" },
        { icon: Drill, name: "Atelier bois", count: "Outillage pro", description: "Scie circulaire, perceuse, ponceuse, établi", category: "Bois", gradient: "from-yellow-500/10 to-orange-500/10", categoryColor: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20" },
        { icon: Gauge, name: "Métrologie", count: "Contrôle qualité", description: "Pied à coulisse, micromètre, scanner 3D", category: "Mesure", gradient: "from-cyan-500/10 to-blue-500/10", categoryColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20" },
    ]

    const workshops = [
        { title: "Initiation Impression 3D", date: "15 Mars 2024", time: "14h00 - 17h00", participants: "8/10", level: "Débutant", description: "Apprenez les bases de l'impression 3D, de la modélisation à l'impression de votre premier objet.", price: "Gratuit", spots: 2, gradient: "from-blue-500/10 to-cyan-500/10", levelColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
        { title: "Découpeuse Laser Avancée", date: "22 Mars 2024", time: "10h00 - 13h00", participants: "5/8", level: "Intermédiaire", description: "Maîtrisez les techniques avancées de découpe et gravure laser sur différents matériaux.", price: "10 000 FCFA", spots: 3, gradient: "from-purple-500/10 to-pink-500/10", levelColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" },
        { title: "Arduino & Électronique", date: "29 Mars 2024", time: "14h00 - 18h00", participants: "6/12", level: "Débutant", description: "Introduction à la programmation Arduino et création de circuits électroniques simples.", price: "8 000 FCFA", spots: 6, gradient: "from-green-500/10 to-emerald-500/10", levelColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
    ]

    const projects = [
        { title: "Prothèse de main imprimée 3D", creator: "Sarah M.", category: "Santé", description: "Prothèse de main fonctionnelle imprimée en 3D pour enfants, accessible et personnalisable.", image: "/prosthetic-hand-3d-printed-innovative.jpg", tags: ["Impression 3D", "Social Impact"], gradient: "from-blue-500/10 to-cyan-500/10", categoryColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
        { title: "Système hydroponique connecté", creator: "Lucas B.", category: "Agriculture", description: "Système de culture hydroponique automatisé avec monitoring IoT pour une agriculture urbaine efficace.", image: "/smart-hydroponic-system-arduino-sensors.jpg", tags: ["IoT", "Arduino", "Écologie"], gradient: "from-green-500/10 to-emerald-500/10", categoryColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
        { title: "Lampe design paramétrique", creator: "Emma L.", category: "Design", description: "Collection de lampes au design unique créées avec modélisation paramétrique et découpe laser.", image: "/parametric-design-laser-cut-lamp-modern.jpg", tags: ["Laser", "Design", "Art"], gradient: "from-purple-500/10 to-pink-500/10", categoryColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
        { title: "Drone personnalisé FPV", creator: "Alex T.", category: "Robotique", description: "Construction complète d'un drone FPV avec châssis imprimé en 3D et électronique custom.", image: "/custom-fpv-drone-3d-printed-frame.jpg", tags: ["Impression 3D", "Électronique", "FPV"], gradient: "from-orange-500/10 to-red-500/10", categoryColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" },
        { title: "Mobilier urbain éco-responsable", creator: "Marie D.", category: "Éco-design", description: "Banc public modulaire fabriqué à partir de plastique recyclé et bois local avec découpe CNC.", image: "/eco-urban-furniture-recycled-cnc.jpg", tags: ["CNC", "Écologie", "Design"], gradient: "from-green-500/10 to-teal-500/10", categoryColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
        { title: "Instruments de musique MIDI", creator: "Tom R.", category: "Musique", description: "Contrôleur MIDI personnalisé avec capteurs tactiles et LEDs RGB programmables.", image: "/custom-midi-controller-arduino-leds.jpg", tags: ["Arduino", "Audio", "Électronique"], gradient: "from-purple-500/10 to-indigo-500/10", categoryColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
    ]

    const testimonials = [
        { name: "Sophie Martin", role: "Entrepreneur", avatar: "S", content: "Grâce à Voisilab, j'ai pu prototyper et tester mon produit avant de lancer ma startup. L'équipe est incroyablement compétente et toujours prête à aider !", rating: 5 },
        { name: "Alexandre Kouassi", role: "Étudiant en design", avatar: "A", content: "Le fablab m'a permis de donner vie à mes projets les plus fous. Les formations sont top et l'ambiance collaborative est vraiment stimulante.", rating: 5 },
        { name: "Fatou Traoré", role: "Artiste", avatar: "F", content: "J'ai découvert la découpe laser et ça a révolutionné mon travail artistique. Je recommande vivement pour tous les créatifs !", rating: 5 },
        { name: "Jean-Marc Dupont", role: "Maker passionné", avatar: "J", content: "Après 2 ans de membership, je ne peux plus m'en passer. C'est devenu mon deuxième atelier. Équipements pros, communauté géniale !", rating: 5 },
    ]

    const team = [
        { name: "Hermane Nguessan Junior", role: "Développeur Full-stack", bio: "Jeune talent en développement web et applications, Hermane gère les aspects techniques et assure la maintenance des plateformes numériques de Voisilab.", image: "/devs1.jpg", email: "hermane.nguessan@uvci.edu.ci", linkedin: "https://www.linkedin.com/in/hermane-junior-nguessan-2a9a05324?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app", folio: "https://hermanenguessan.vercel.app/" },
        { name: "Dallo Mardochee Desire", role: "Développeur Full-stack", bio: "Jeune talent en développement full-stack et administration de base de données, Dallo crée des solutions robustes et performantes pour les plateformes de Voisilab.", image: "/dev2.jpg", email: "gbalou.dallo@uvci.edu.ci", linkedin: "" },
        { name: "Sinon Bakary", role: "Développeur Front-end & Data Scientist", bio: "Jeune talent en développement front-end, il apporte une expertise unique pour créer des interfaces utilisateur modernes et analyser les données pour des solutions innovantes.", image: "/dev3.png", email: "bakary.sinon@uvci.edu.ci", linkedin: "https://www.linkedin.com/in/bakary-sinon-29799a275/" },
        { name: "GAUTIER OULAI MOMBO", role: "Chef d'équipe & Project Manager", bio: "Architecte de projets et leader de talents, Gautier est à la croisée de l'expertise technique et du management humain. Chef d'équipe & Project Manager, il pilote l'intégralité du cycle de vie technique avec un seul objectif : l'excellence des livrables et l'innovation continue.", image: "/gautier.png", email: "gautier.mombo@uvci.edu.ci", linkedin: "https://www.linkedin.com/in/gautier-oulai-mombo-3b37a2292/" },
        { name: "EVIH ELIA ELIENAÏ BERENICE", role: "Chef d'équipe & Project Manager", bio: "Développeur Front-End spécialisé dans la conception d’interfaces modernes, ergonomiques et responsives. Capable de produire des prototypes haute fidélité, d’optimiser l’expérience utilisateur et de collaborer efficacement avec les équipes Back-End. Passionné par la créativité, l’innovation et la conception d’expériences digitales fluides.", image: "/elia.jpeg", email: "elia.evih@uvci.edu.ci", linkedin: "https://www.linkedin.com/in/elia-evih-a93015352?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
        { name: "Blé Blango Flavien", role: "Modelisateur 3d et vfx artiste", bio: "Architecte de projets et leader de talents, Gautier est à la croisée de l'expertise technique et du management humain. Chef d'équipe & Project Manager, il pilote l'intégralité du cycle de vie technique avec un seul objectif : l'excellence des livrables et l'innovation continue.", image: "/ble.png", email: "gautier.mombo@uvci.edu.ci", linkedin: "https://www.linkedin.com/in/gautier-oulai-mombo-3b37a2292/" },
        { name: "Sai jovencia emmanuella", role: "modélisation 3D et en impression", bio: "Je développe mes compétences en communication tout en me spécialisant dans le design 3D, en participant à la conception et à la réalisation de modèles destinés à des prototypes réels. Ce rôle me permet de combiner créativité, technique et innovation tout en mettant en valeur le potentiel des jeunes talents dans la fabrication numérique.et réalise des modèles 3D pour des prototypes réels, alliant créativité, technique et innovation.", image: "/sai.jpeg", email: "gautier.mombo@uvci.edu.ci", linkedin: "https://www.linkedin.com/in/gautier-oulai-mombo-3b37a2292/" },

    ]

    const news = [
        { title: "Renforcement de la formation et de l’innovation : L’UVCI et l’IPNETP scellent un partenariat stratégique", date: "Publié le 24/11/2025", category: "Événement", image: "https://uvci.online/portail/externes/images/actualites/16052016-1C4A0236.jpg", excerpt: "C’est le début d’une belle aventure entre deux références du secteur Education-formation. L’Université Virtuelle de Côte d’Ivoire (UVCI) et l’Institut Pédagogique National de l’Enseignement Technique et Professionnel (IPNETP) ont signé, lundi 26 janvier 2026, une convention de partenariat dans les locaux de l’IPNETP à Cocody.", gradient: "" },
        { title: "Premier Hackathon réussi pour l’Université Virtuelle de Côte d’Ivoire", date: "28 Février 2024", category: "Événement", image: "/2O0A00263.jpg", excerpt: "L’Université Virtuelle de Côte d’Ivoire (UVCI) a organisé avec brio son tout premier HACKATHON. Cette compétition qui s’est tenue les 15 et 16 octobre 2024 au sein même de l’Université a débuté par l’intervention des responsables de l’Université par la voix du Prof. Kouamé Fernand Vice-Président de l’UVCI qui a adressé des mots de bienvenue et d’encouragements aux différents participants en présence du Prof. Koné Tiémoman, Président de l’UVCI.", gradient: "" },
        { title: "8ème édition de l’Open Access Week : l’UVCI au cœur de la réflexion sur la Science Ouverte en Côte d’Ivoire", date: "Publié le 07/12/2025", category: "Cérémonie", image: "https://uvci.online/portail/externes/images/actualites/890B8832_(1)_11zon.jpg", excerpt: "L’Université Virtuelle de Côte d’Ivoire (UVCI) abrite du lundi 1er au mardi 2 décembre 2025 la 8ème édition de l’Open Access Week, placé sous le thème : « De la propriété du savoir à, la science ouverte : repenser la production et la diffusion de la recherche en Côte d’Ivoire »...", gradient: "from-purple-500/10 to-pink-500/10" },
    ]

    const process = [
        { num: 1, title: "Venez nous rencontrer", desc: "Visitez le fablab lors de nos portes ouvertes ou prenez rendez-vous", icon: Users },
        { num: 2, title: "Choisissez votre formule", desc: "Adhésion annuelle, carte 10 heures ou accès ponctuel", icon: Package },
        { num: 3, title: "Formez-vous", desc: "Suivez les formations obligatoires pour utiliser les machines", icon: GraduationCap },
        { num: 4, title: "Créez librement", desc: "Réservez les machines et lancez-vous dans vos projets", icon: Rocket },
    ]

    const facilities = [
        { icon: Wifi, title: "Wifi gratuit", desc: "Connexion haut débit" },
        { icon: Coffee, title: "Espace détente", desc: "Café et thé à volonté" },
        { icon: Building2, title: "200m²", desc: "d'espace de travail" },
        { icon: Users, title: "Coworking", desc: "Espaces collaboratifs" },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
            {/* Decorative Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

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

                <div className="absolute inset-0 bg-grid-pattern opacity-10 z-10" />

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
            <section className="py-8 lg:py-14 relative">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        {/* Main Intro Card */}
                        <div className="fade-in-up p-6 text-center  mb-12">
                            <div className="flex flex-col lg:flex-row items-center gap-8">
                                {/* Icon Section */}
                                {/* <div className="flex-shrink-0">
                                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                                        <Sparkles className="text-white" size={48} />
                                    </div>
                                </div> */}

                                {/* Content Section */}
                                <div className="flex-1 text-center lg:text-left">
                                    <h2 className="text-4xl text-bold text-center lg:text-4xl font-bold text-foreground mb-4">
                                        Bienvenue chez{" "}
                                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-foreground">
                                            Voisilab
                                        </span>
                                    </h2>
                                    <p className="text-lg text-center text-muted-foreground leading-relaxed mb-6">
                                        Premier fablab de Côte d'Ivoire dédié à la fabrication numérique, Voisilab est un espace ouvert où makers, entrepreneurs, artistes et étudiants se rencontrent pour imaginer, concevoir et fabriquer ensemble.
                                    </p>

                                    {/* Badges Section */}
                                    <div className="flex items-center flex-wrap gap-3 justify-center">
                                        {[{
                                            icon: TrendingUp,
                                            label: "Innovation collaborative",
                                            bgColor: "bg-transparent",
                                            textColor: "text-foreground",
                                            borderColor: "border-foreground/20",
                                            hoverText: "text-foreground",
                                        },
                                        {
                                            icon: Award,
                                            label: "Accompagnement expert",
                                            bgColor: "bg-transparent",
                                            textColor: "text-foreground",
                                            borderColor: "border-foreground/20",
                                            hoverText: "text-foreground",
                                        },
                                        {
                                            icon: Wrench,
                                            label: "Équipements professionnels",
                                            bgColor: "bg-transparent",
                                            textColor: "text-foreground",
                                            borderColor: "border-foreground/20",
                                            hoverText: "text-foreground",
                                        },
                                        ].map((badge, index) => (
                                            <Badge
                                                key={index}
                                                className={`px-4 py-2 ${badge.bgColor} ${badge.textColor} ${badge.borderColor} ${badge.hoverText} transition-all cursor-default`}
                                            >
                                                <badge.icon className="w-4 h-4 mr-2" />
                                                {badge.label}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Benefits Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in-up" style={{ animationDelay: '100ms' }}>
                            <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 group">
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                        <Rocket className="text-blue-500" size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-2">Concrétisez vos idées</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Du simple prototype au projet d'entreprise, nous vous aidons à transformer vos concepts en réalité tangible.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 group">
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                        <Users className="text-purple-500" size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-2">Rejoignez la communauté</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Intégrez un réseau dynamique de créateurs, partagez vos compétences et apprenez des autres membres.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 group">
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                        <GraduationCap className="text-green-500" size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-2">Formez-vous gratuitement</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Accédez à nos formations sur les machines et développez de nouvelles compétences techniques.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Access CTA */}
                        <div className="mt-12 text-center fade-in-up" style={{ animationDelay: '200ms' }}>
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-muted/50 backdrop-blur-sm rounded-full border-2 border-border">
                                <MapPin className="text-primary" size={20} />
                                <span className="text-sm font-medium text-foreground">
                                    📍 Cocody Angré, Abidjan - Côte d'Ivoire
                                </span>
                                <span className="mx-2 text-border">|</span>
                                <Phone className="text-primary" size={20} />
                                <span className="text-sm font-medium text-foreground">
                                    +225 05 00 00 00 00
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Grid - Bien placée DANS le container 
            <section className="py-8 lg:py-16 relative">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto mb-16 fade-in-up">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <div key={index} className={`group relative overflow-hidden rounded-2xl p-6 border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-gradient-to-br ${stat.gradient}`}>
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full" />
                                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                        <Icon className="text-primary" size={28} />
                                    </div>
                                    <div className="text-3xl md:text-4xl font-bold text-foreground mb-2 group-hover:scale-110 transition-transform drop-shadow-sm">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-muted-foreground font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section> 
            */}

            {/* About Section */}
            <section className="py-20 lg:py-32 relative">
                <div className="container mx-auto px-4 lg:px-8">
                    <SectionHeader
                        title="Un fablab au cœur de l'innovation"
                        subtitle="Depuis 2019, Voisilab est bien plus qu'un simple atelier. C'est un lieu de rencontre, d'apprentissage et de création où la technologie rencontre l'imagination."
                    />

                    {/* Values Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto mb-12">
                        {values.map((value, index) => {
                            const Icon = value.icon
                            return (
                                <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                    <Card className={`relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 group h-full bg-gradient-to-br ${value.gradient}`}>
                                        <CardContent className="p-8">
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>
                                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                                <Icon size={32} className="text-primary" />
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>

                    {/* Mission Card */}
                    <div className="max-w-4xl mx-auto fade-in-up">
                        <Card className="border-2 border-primary/30 shadow-2xl overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/10">
                            <CardContent className="p-10 lg:p-16 text-center">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Target className="text-primary" size={40} />
                                </div>
                                <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Notre Mission</h3>
                                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
                                    Rendre la fabrication numérique accessible à tous en fournissant l'équipement, les connaissances et l'espace nécessaires pour transformer vos idées en réalité. Que vous soyez étudiant, entrepreneur, artiste ou simple curieux, Voisilab est votre partenaire dans l'innovation.
                                </p>

                                {/* Facilities Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {facilities.map((facility, index) => {
                                        const Icon = facility.icon
                                        return (
                                            <div key={index} className="group text-center">
                                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                                    <Icon className="text-primary" size={24} />
                                                </div>
                                                <div className="text-sm font-semibold text-foreground">{facility.title}</div>
                                                <div className="text-xs text-muted-foreground">{facility.desc}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 lg:py-32 bg-muted/30 relative">
                <div className="container mx-auto px-4 lg:px-8">
                    <SectionHeader
                        title="Nos services"
                        subtitle="De l'impression 3D au prototypage complet, découvrez toutes nos prestations pour donner vie à vos projets"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
                        {services.map((service, index) => {
                            const Icon = service.icon
                            return (
                                <div
                                    key={index}
                                    className="fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <Card className="relative overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 group" style={{ minHeight: '450px' }}>
                                        {/* Image de fond toujours visible */}
                                        <div className="absolute inset-0 z-0">
                                            <Image
                                                src={service.image || "/placeholder.svg"}
                                                alt={service.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Overlay qui apparaît au hover avec le contenu texte */}
                                        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-background/90 via-background/90 to-background/90 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex flex-col">
                                            <CardContent className="p-8 flex-1 flex flex-col">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>
                                                
                                                {/* Icône */}
                                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                                    <Icon size={28} className="text-primary" />
                                                </div>

                                                {/* Titre */}
                                                <h3 className="text-xl font-bold text-foreground mb-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150">
                                                    {service.title}
                                                </h3>

                                                {/* Description */}
                                                <p className="text-sm text-muted-foreground leading-relaxed mb-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                                                    {service.description}
                                                </p>

                                                {/* Liste des items */}
                                                <div className="space-y-2 flex-1 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-250">
                                                    {service.items.map((item, i) => (
                                                        <div key={i} className="flex items-center gap-3">
                                                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                                            <span className="text-sm text-foreground">{item}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Bouton */}
                                                <div className="mt-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                                                    <Button
                                                        size="lg"
                                                        className="w-full group/btn relative overflow-hidden"
                                                        asChild
                                                    >
                                                        <Link href="/service">
                                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                                Voir plus
                                                                <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={20} />
                                                            </span>
                                                            <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </div>

                                        {/* Badge visible même sans hover */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 group-hover:opacity-0 transition-opacity duration-300">
                                            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm border-none font-bold shadow-lg px-4 py-2">
                                                {service.title}
                                            </Badge>
                                        </div>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Equipment Section */}
            <section id="equipements" className="py-20 lg:py-32 relative">
                <div className="container mx-auto px-4 lg:px-8">
                    <SectionHeader title="Nos équipements" subtitle="Accédez à un parc machine complet et moderne pour concrétiser tous vos projets de fabrication numérique" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto mb-12">
                        {equipment.map((item, index) => {
                            const Icon = item.icon
                            return (
                                <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                    <Card className={`relative overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 group h-full bg-gradient-to-br`}>
                                        <CardContent className="p-8">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                                    <Icon size={28} className="text-primary group-hover:text-primary-foreground transition-colors" />
                                                </div>
                                                <Badge className={`${item.categoryColor} backdrop-blur-sm border-2 font-semibold`}>{item.category}</Badge>
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                                            <Badge variant="secondary" className="mb-3">{item.count}</Badge>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>

                    <div className="text-center fade-in-up">
                        <Button size="lg" variant="outline" className="group" asChild>
                            <Link href="/materiels">
                                <span className="relative z-10 flex items-center gap-2">
                                    Voir tous les équipements
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </span>
                                {/* <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* How it works Section */}
            <section className="py-20 lg:py-32 bg-muted/30 relative">
                <div className="container mx-auto px-4 lg:px-8">
                    <SectionHeader title="Comment ça marche ?" subtitle="Rejoignez Voisilab en 4 étapes simples et commencez à créer dès aujourd'hui" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
                        {process.map((step, index) => {
                            const Icon = step.icon
                            return (
                                <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                    <Card className="relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 group h-full">
                                        <CardContent className="p-8 text-center">
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>
                                            <div className="relative w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                                                <Icon className="text-primary" size={28} />
                                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                                                    {step.num}
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Workshops Section */}
            <section id="ateliers" className="py-20 lg:py-32 relative">
                <div className="container mx-auto px-4 lg:px-8">
                    <SectionHeader title="Ateliers & Formations" subtitle="Formations, ateliers créatifs et événements pour apprendre, créer et partager avec la communauté" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto mb-12">
                        {workshops.map((item, index) => (
                            <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <Card className={`relative overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 group h-full bg-gradient-to-br`}>
                                    <div className="absolute top-0 left-0 right-0 h-1  from-primary to-accent" />
                                    <CardContent className="p-8">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>
                                        <div className="flex items-start justify-between mb-4">
                                            <Badge className={`${item.levelColor} backdrop-blur-sm border-2 font-semibold`}>{item.level}</Badge>
                                            <span className="text-lg font-bold text-primary">{item.price}</span>
                                        </div>
                                        {item.spots && item.spots <= 5 && (
                                            <Badge variant="outline" className="mb-3 bg-background/90 backdrop-blur-sm border-destructive text-destructive font-semibold animate-pulse">
                                                Plus que {item.spots} places !
                                            </Badge>
                                        )}
                                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{item.description}</p>
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
            <section id="innovations" className="py-20 lg:py-32 bg-muted/30 relative">
                <div className="container mx-auto px-4 lg:px-8">
                    <SectionHeader title="Innovations & Créations" subtitle="Découvrez les projets inspirants réalisés par notre communauté de makers" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto mb-12">
                        {projects.map((project, index) => (
                            <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <Card className={`relative overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 group h-full bg-gradient-to-br`}> {/*${project.gradient}*/}
                                    <div className="relative h-48 overflow-hidden">
                                        <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute top-4 left-4">
                                            <Badge className={`${project.categoryColor} backdrop-blur-sm border-2 font-semibold`}>{project.category}</Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>
                                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">{project.title}</h3>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">{project.creator.charAt(0)}</div>
                                            <p className="text-sm text-muted-foreground">Par {project.creator}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{project.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {project.tags.map((tag, i) => (
                                                <Badge key={i} variant="secondary" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-default">{tag}</Badge>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-border">
                                            <button onClick={() => handleLike(index)} className={`flex items-center gap-2 transition-all group/like ${liked[index] ? 'text-pink-600 dark:text-pink-400' : 'text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400'}`}>
                                                <Heart size={20} className={`transition-all ${liked[index] ? 'fill-current scale-110' : 'group-hover/like:fill-current group-hover/like:scale-110'}`} />
                                                <span className="text-sm font-semibold">{likes[index]}</span>
                                            </button>
                                            <button className="text-primary hover:text-primary/80 transition-colors">
                                                <ExternalLink size={20} />
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    <div className="text-center fade-in-up">
                        <Button size="lg" variant="outline" className="group" asChild>
                            <Link href="/innovations">
                                Voir tous les projets
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 lg:py-32 relative">
                <div className="container mx-auto px-4 lg:px-8">
                    <SectionHeader title="Ce qu'ils en pensent" subtitle="Les retours de notre communauté de makers et créateurs" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <Card className="relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 group h-full">
                                    <CardContent className="p-8">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>
                                        <Quote className="text-primary/20 mb-4" size={48} />
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="fill-primary text-primary" size={18} />
                                            ))}
                                        </div>
                                        <p className="text-foreground leading-relaxed mb-6 italic">"{testimonial.content}"</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                                                {testimonial.avatar}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-foreground">{testimonial.name}</div>
                                                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* News Section */}
            <section className="py-20 lg:py-32 bg-muted/30 relative">
                <div className="container mx-auto px-4 lg:px-8">
                    <SectionHeader title="Actualités" subtitle="Restez informé des dernières nouveautés, événements et partenariats du fablab" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto mb-12">
                        {news.map((article, index) => (
                            <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <Card className={`relative overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 group h-full bg-gradient-to-br ${article.gradient}`}>
                                    <div className="relative h-48 overflow-hidden">
                                        <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm border-none font-bold">{article.category}</Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                            <Calendar size={16} />
                                            <span>{article.date}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{article.excerpt}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    <div className="text-center fade-in-up">
                        <Button size="lg" variant="outline" className="group" asChild>
                            <Link href="/actualites">
                                Toutes les actualités
                                <Newspaper className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section id="equipe" className="py-20 lg:py-32 relative">
                <div className="container mx-auto px-4 lg:px-8">
                    <SectionHeader title="L'équipe jeunes talents" subtitle="Découvrez l'équipe Voisilab, des experts passionnés qui mettent leur savoir-faire au service de vos projets" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-12">
                        {team.map((member, index) => (
                            <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <Card className="relative overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 group h-full">
                                    <div className="relative h-80 overflow-hidden bg-muted/30">
                                        <Image
                                            src={member.image || "/placeholder.svg"}
                                            alt={member.name}
                                            fill
                                            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-semibold uppercase text-foreground mb-1">{member.name}</h3>
                                        <Badge variant="secondary" className="mb-4">{member.role}</Badge>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 text-justify text-left">{member.bio}</p>
                                        <div className="flex gap-3">
                                            <a href={`mailto:${member.email}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors" aria-label={`Email ${member.name}`}>
                                                <Mail size={18} />
                                            </a>
                                            {member.linkedin && (
                                                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors" aria-label={`LinkedIn ${member.name}`}>
                                                    <Linkedin size={18} />
                                                </a>
                                            )}
                                            {member.folio && (
                                                <a href={member.folio} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors" aria-label={`Portfolio ${member.name}`}>
                                                    <ExternalLink size={18} />
                                                </a>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    <div className="max-w-4xl mx-auto fade-in-up">
                        <Card className="border-2 border-primary/30 shadow-sm overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
                            <CardContent className="p-10 lg:p-16 text-center">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Users className="text-primary" size={40} />
                                </div>
                                <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Rejoignez la communauté</h3>
                                <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                                    Vous êtes étudiant, maker ou simplement curieux ? Venez développer vos compétences et réaliser vos projets au sein de notre fablab.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300" asChild>
                                        <Link href="/contact">
                                            <span className="relative z-10 flex items-center gap-2">
                                                Nous rejoindre
                                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" asChild>
                                        <Link href="/tarifs">
                                            <Download className="mr-2" size={20} />
                                            Télécharger la brochure
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Video Section */}
            <section className="py-15 lg:py-32 bg-muted/30 relative">
                <div className="container mx-auto px-4 lg:px-8">
                    <SectionHeader
                        title="Visite virtuelle"
                        subtitle="Découvrez notre FABLAB en vidéo et plongez dans l'univers de la fabrication numérique."
                    />
                    <div className="max-w-4xl mx-auto fade-in-up">
                        <Card className="border-2 border-primary/30 shadow-sm overflow-hidden">
                            <div className="relative h-96 group">
                                <iframe
                                    src="https://www.youtube.com/embed/oCZJ-RQFRi8"
                                    title="Visite virtuelle du fablab"
                                    className="absolute inset-0 w-full h-full"
                                    style={{ border: 0 }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </Card>
                    </div>
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
                                            <select id="projectType" name="projectType" required value={formData.projectType} onChange={handleChange} className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50">
                                                <option value="">Sélectionnez un type</option>
                                                <option value="impression-3d">Impression 3D</option>
                                                <option value="laser">Découpe / Gravure Laser</option>
                                                <option value="cnc">Usinage CNC</option>
                                                <option value="electronique">Électronique / IoT</option>
                                                <option value="prototype">Prototypage complet</option>
                                                <option value="autre">Autre</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="budget" className="text-foreground mb-2 block">Budget estimé</Label>
                                                <select id="budget" name="budget" value={formData.budget} onChange={handleChange} className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50">
                                                    <option value="">Choisir...</option>
                                                    <option value="<500">Moins de 500€</option>
                                                    <option value="500-1000">500€ - 1000€</option>
                                                    <option value="1000-3000">1000€ - 3000€</option>
                                                    <option value=">3000">Plus de 3000€</option>
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
                                            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                                                <Paperclip className="mx-auto mb-2 text-muted-foreground" size={24} />
                                                <p className="text-sm text-muted-foreground">Glissez vos fichiers ici ou cliquez pour parcourir</p>
                                                <p className="text-xs text-muted-foreground mt-1">Plans, croquis, photos, fichiers 3D...</p>
                                            </div>
                                        </div>
                                        <Button type="submit" size="lg" className="w-full group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300">
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                <Send size={20} />
                                                Envoyer la demande
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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