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
    Shirt,
    CodeXml,
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
    Download,
    Eye,
    FileText
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
        { icon: Lightbulb, title: "Innovation", description: "Nous encourageons la créativité et l'expérimentation pour repousser les limites de la fabrication numérique.", gradient: "" },
        { icon: Users, title: "Collaboration", description: "Un espace ouvert où makers, artistes et entrepreneurs partagent leurs connaissances et compétences.", gradient: "" },
        { icon: Rocket, title: "Accessibilité", description: "Démocratiser l'accès aux technologies de fabrication pour tous, du débutant à l'expert.", gradient: "" },
        { icon: Heart, title: "Communauté", description: "Créer un écosystème bienveillant où chacun peut apprendre, créer et grandir ensemble.", gradient: "" },
    ]

    const services = [
        {
            icon: Printer,
            title: "Impression 3D",
            description: "Prototypage rapide et production de pièces personnalisées en FDM et résine.",
            items: ["Prototypage", "Petites séries", "Matériaux variés"],
            gradient: "from-blue-500/10 to-cyan-500/10",
            image: "https://mecaluxfr.cdnwm.com/blog/img/fabrication-additive-production.1.1.jpg?imwidth=320&imdensity=1"
        },
        {
            icon: CodeXml,
            title: "Architecture & Dev Digital",
            description: "Conception et déploiement de solutions logicielles performantes, optimisées pour vos besoins métiers.",
            items: ["Conception d'applications Web & Mobile", "Audit & Architecture", "Cloud & API"],
            gradient: "from-purple-500/10 to-pink-500/10",
            image: "https://media.vertuoz.fr/uploads/Article_Quels_sont_les_avantages_d_un_developpement_informatique_sur_mesure_66c3ed4303.jpeg"
        },
        {
            icon: Shirt,
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
        { icon: Printer, name: "Imprimantes 3D", count: "2 machines", description: "Imprimante 3D FDM haute performance, idéale pour le prototypage rapide. Elle offre une grande précision et un rendu professionnel.", category: "Impression", gradient: "from-blue-500/10 to-cyan-500/10", image: "https://www.makeitmarseille.com/wp-content/uploads/2017/09/Make-it-Marseille-impression-3D-ultimaker-2.jpg", categoryColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
        { icon: Scissors, name: "Découpeuse Laser", count: "100W CO2", description: "La découpeuse laser est un outil qui permet de découper et graver des matériaux à partir de l’énergie d’un laser focalisé par une lentille.", category: "Découpe", image: "https://lefablab.fr/wp-content/uploads/2019/07/p7121491.jpg", gradient: "from-purple-500/10 to-pink-500/10", categoryColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
        { icon: Shirt, name: "Machine à coudre  SGGEMSY", count: "Conception", description: "Machine industrielle SGGEMSY allie robustesse et haute productivité. Idéale pour des piqûres précises et une finition professionnelle sur tous textiles.", image: "https://lecoindupro.blob.core.windows.net/upload/2436551.Lg.jpg", category: "Confection", gradient: "from-green-500/10 to-emerald-500/10", categoryColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
        { icon: Shirt, name: "Machine à broder BROTHER", count: "Conception", description: "Brodeuse haute performance avec un large champ de 200x200mm, enfilage automatique et tri intelligent des couleurs. Rapide et précise avec une vitesse de 1000 points/minute.", image: "https://agrilab.unilasalle.fr/projets/attachments/download/1906/machine001.jpg", category: "Confection", gradient: "from-orange-500/10 to-red-500/10", categoryColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
        { icon: Drill, name: "Perceuse BOSCH", count: "Outillage pro", description: "Perceuse à colonne Bosch PBD 40, une machine de précision numérique et puissance. Intègre un écran d'affichage digital, un laser de pointage et un moteur de 710 W pour des perçages parfaits et sécurisés sur bois et métal.", image: "https://www.travaillerlebois.com/wp-content/uploads/2016/12/perceuse-a-colonne_bosch_pbd-40-23.jpg", category: "Création", gradient: "from-yellow-500/10 to-orange-500/10", categoryColor: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20" },
        { icon: Gauge, name: "Fraiseuse Numérique SHOPBOT", count: "Contrôle qualité", description: "Fraiseuse numérique ShopBot : solution CNC robuste et polyvalente. Idéale pour la découpe et la gravure de précision sur grands formats (bois, plastiques, métaux tendres). Permet la réalisation rapide de pièces complexes.", image: "https://lacasemate.fr/wp-content/uploads/2022/02/Fraiseuse_num%C3%A9rique.png", category: "Création", gradient: "from-cyan-500/10 to-blue-500/10", categoryColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20" },
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
                                    📍 Cocody Angré, Abidjan - Côte d'Ivoire  |  ☎️ +225 05 00 00 00 00
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto mb-12">
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

                    {/* Mission Card */}
                    <div className="max-w-5xl mx-auto fade-in-up">
                        <Card className="border-2 border-primary/30 shadow-lg overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/10">
                            <CardContent className="p-10 lg:p-16 text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Target className="text-primary" size={36} />
                                </div>
                                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">Notre Mission</h3>
                                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
                                    Rendre la fabrication numérique accessible à tous en fournissant l'équipement, les connaissances et l'espace nécessaires pour transformer vos idées en réalité. Que vous soyez étudiant, entrepreneur, artiste ou simple curieux, Voisilab est votre partenaire dans l'innovation.
                                </p>

                                {/* Facilities Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {facilities.map((facility, index) => {
                                        const Icon = facility.icon
                                        return (
                                            <div key={index} className="group text-center">
                                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
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

                    {/* Liste des services - Design moderne */}
                    <div className="max-w-6xl mx-auto space-y-6">
                        {services.map((service, index) => {
                            const Icon = service.icon
                            return (
                                <div
                                    key={index}
                                    className="fade-in-up"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <Card className="border-2 border-border hover:border-primary/50 transition-all duration-500 group overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

                                                {/* Partie gauche - Icône & Titre (4 colonnes) */}
                                                <div className="lg:col-span-4 bg-gradient-to-br from-primary/5 to-accent/5 p-8 flex items-center gap-6 border-b lg:border-b-0 lg:border-r border-border relative overflow-hidden">
                                                    <div className="absolute inset-0 z-0">
                                                        <Image
                                                            src={service.image}
                                                            alt={service.title}
                                                            fill
                                                            className="object-cover "
                                                        />
                                                    </div>
                                                </div>

                                                {/* Partie centre - Description & Items (6 colonnes) */}
                                                <div className="lg:col-span-6 p-8">

                                                    <div className="z-10 flex items-center gap-2 mb-1">
                                                        <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                                            <Icon size={32} className="text-primary" />
                                                        </div>
                                                        <h3 className="text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                                                            {service.title}
                                                        </h3>
                                                    </div>

                                                    <p className="text-muted-foreground leading-relaxed mb-6">
                                                        {service.description}
                                                    </p>

                                                    {/* Liste des prestations */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {service.items.map((item, i) => (
                                                            <div key={i} className="flex items-center gap-2">
                                                                <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                                    <CheckCircle className="w-3 h-3 text-primary" />
                                                                </div>
                                                                <span className="text-sm text-foreground font-medium">
                                                                    {item}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Partie droite - CTA (2 colonnes) */}
                                                <div className="lg:col-span-2 p-8 flex items-center justify-center bg-muted/30 border-t lg:border-t-0 lg:border-l border-border cursor-pointer">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="group/btn flex flex-col items-center gap-2 h-auto py-4 hover:bg-primary/10"
                                                        asChild
                                                    >
                                                        <Link href={`/service#${service.title.toLowerCase().replace(/\s+/g, '-')}`}>
                                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover/btn:bg-primary transition-colors">
                                                                <ArrowRight
                                                                    className="text-primary group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all"
                                                                    size={20}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-medium text-muted-foreground group-hover/btn:text-primary">
                                                                En savoir plus
                                                            </span>
                                                        </Link>
                                                    </Button>
                                                </div>

                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        })}
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
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/tarifs">
                                        Voir les tarifs
                                        <ArrowRight className="ml-2" size={16} />
                                    </Link>
                                </Button>
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
                                    Obtenez un devis personnalisé sous 48h pour votre projet
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
                                    <Link href="/contact">
                                        Nous contacter
                                        <Phone className="ml-2" size={16} />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Bandeau CTA final */}
                    <div className="max-w-4xl mx-auto mt-16 fade-in-up" style={{ animationDelay: '500ms' }}>
                        <Card className="border-2 border-primary/50 bg-gradient-to-r from-primary/5 via-background to-accent/5 overflow-hidden">
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
            <section id="innovations" className="py-20 lg:py-32 bg-muted/30 relative overflow-hidden">
                {/* Background Pattern Animé */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="container mx-auto px-4 lg:px-8 relative z-10">

                    {/* En-tête moderne */}
                    <div className="max-w-4xl mx-auto text-center mb-16 fade-in-up">
                        <Badge className="mb-6 px-5 py-2 bg-primary/10 text-primary border-none font-medium">
                            🚀 Innovations
                        </Badge>
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
                    <div className="flex flex-wrap justify-center gap-3 mb-12 fade-in-up">
                        {['Tous', 'Santé', 'Agriculture', 'Design', 'Robotique', 'Éco-design', 'Musique'].map((category, index) => (
                            <Button
                                key={index}
                                variant={index === 0 ? "default" : "outline"}
                                size="sm"
                                className={`${index === 0 ? 'bg-primary' : 'hover:bg-primary/10'} transition-all duration-300`}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>

                    {/* Grid des projets - Nouveau design */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto mb-12">
                        {projects.map((project, index) => (
                            <div
                                key={index}
                                className="fade-in-up group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <Card className="relative overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 h-full">

                                    {/* Image avec overlay moderne */}
                                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                                        {project.image ? (
                                            <>
                                                <Image
                                                    src={project.image}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                                            </>
                                        ) : (
                                            // Placeholder avec gradient si pas d'image
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-6xl opacity-20">🔧</div>
                                            </div>
                                        )}

                                        {/* Badge catégorie flottant */}
                                        <div className="absolute top-4 left-4">
                                            <Badge className={`${project.categoryColor} backdrop-blur-md border-2 font-semibold shadow-lg`}>
                                                {project.category}
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
                                                <Link href={`/innovations/${index}`}>
                                                    <ExternalLink size={16} />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>

                                    <CardContent className="p-6">
                                        {/* Header avec avatar créateur */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                {project.creator.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                                    {project.title}
                                                </h3>
                                                <p className="text-xs text-muted-foreground">Par {project.creator}</p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                                            {project.description}
                                        </p>

                                        {/* Tags compacts */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.tags.slice(0, 3).map((tag, i) => (
                                                <Badge
                                                    key={i}
                                                    variant="secondary"
                                                    className="text-xs px-2 py-0.5 hover:bg-primary/10 transition-colors"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {project.tags.length > 3 && (
                                                <Badge variant="outline" className="text-xs px-2 py-0.5">
                                                    +{project.tags.length - 3}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Footer stats */}
                                        <div className="flex items-center justify-between pt-4 border-t border-border">
                                            <div className="flex items-center gap-4">
                                                {/* Likes */}
                                                <button
                                                    onClick={() => handleLike(index)}
                                                    className="flex items-center gap-1.5 text-muted-foreground hover:text-pink-500 transition-colors group/heart"
                                                >
                                                    <Heart
                                                        size={16}
                                                        className={`transition-all ${liked[index]
                                                            ? 'fill-pink-500 text-pink-500 scale-110'
                                                            : 'group-hover/heart:fill-pink-500 group-hover/heart:scale-110'
                                                            }`}
                                                    />
                                                    <span className="text-sm font-semibold">{likes[index]}</span>
                                                </button>

                                                {/* Views (optionnel) */}
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Eye size={16} />
                                                    <span className="text-sm">{Math.floor(Math.random() * 500) + 100}</span>
                                                </div>
                                            </div>

                                            {/* Bouton voir plus */}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-auto p-0 text-primary hover:text-primary/80"
                                                asChild
                                            >
                                                <Link href={`/innovations/${index}`}>
                                                    Voir →
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {/* CTA avec stats */}
                    <div className="max-w-5xl mx-auto fade-in-up">
                        <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 overflow-hidden">
                            <CardContent className="p-8 lg:p-12">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                                    {/* Texte à gauche */}
                                    <div>
                                        <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-none">
                                            💡 Vous aussi, créez !
                                        </Badge>
                                        <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                                            Partagez votre projet
                                        </h3>
                                        <p className="text-muted-foreground mb-6 leading-relaxed">
                                            Rejoignez notre communauté de makers et inspirez des milliers de personnes avec vos créations.
                                        </p>
                                        <Button size="lg" className="group" asChild>
                                            <Link href="/innovations">
                                                Voir tous les projets
                                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                                            </Link>
                                        </Button>
                                    </div>

                                    {/* Stats à droite */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { icon: Rocket, label: 'Projets', value: projects.length },
                                            { icon: Users, label: 'Makers', value: '50+' },
                                            { icon: Heart, label: 'Likes', value: Object.values(likes).reduce((a, b) => a + b, 0) },
                                            { icon: Award, label: 'Catégories', value: '6' },
                                        ].map((stat, i) => {
                                            const Icon = stat.icon
                                            return (
                                                <div
                                                    key={i}
                                                    className="p-6 bg-muted/50 rounded-2xl border-2 border-border hover:border-primary/50 transition-all duration-300 text-center"
                                                >
                                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                                                        <Icon className="text-primary" size={24} />
                                                    </div>
                                                    <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
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