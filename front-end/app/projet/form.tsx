"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import PageBreadcrumb from "@/components/PageBreadCrumb"
import { SectionHeader } from "@/components/section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Honeypot } from "@/components/honeypot"
import { projectSchema } from "@/lib/validations/project.schema"
import { sendProjectSubmission } from "@/lib/email.service"
import { checkRateLimit, getRemainingTime } from "@/lib/utils/rate-limit"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import {
    CheckCircle2,
    Send,
    Paperclip,
    Mail,
    Phone,
    Clock,
    Lightbulb,
    Target,
    Zap,
    FileText,
    AlertCircle,
    ArrowRight,
    Rocket,
    TrendingUp,
    Shield,
    AlertTriangle,
    Loader2,
    Lock,
    CheckCheck,
    X,
} from "lucide-react"

export type ProjectFormData = {
    name: string
    email: string
    phone: string
    projectType: string
    budget?: string
    timeline?: string
    description: string
    files?: File[] // Add this line to include the files field
}

export function SendPage() {
    useScrollAnimation()

    const [submitted, setSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [honeypot, setHoneypot] = useState("")
    const [rateLimitError, setRateLimitError] = useState<string | null>(null)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [uploadProgress, setUploadProgress] = useState<number>(0)

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        setValue,
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        mode: "onChange",
    })

    // Gestion des fichiers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        
        // Vérifier la taille totale
        const totalSize = files.reduce((acc, file) => acc + file.size, 0)
        const maxSize = 10 * 1024 * 1024 // 10 MB par fichier
        
        const validFiles = files.filter(file => {
            if (file.size > maxSize) {
                alert(`Le fichier ${file.name} dépasse 10 MB`)
                return false
            }
            return true
        })

        if (validFiles.length + selectedFiles.length > 5) {
            alert('Maximum 5 fichiers autorisés')
            return
        }

        const newFiles = [...selectedFiles, ...validFiles]
        setSelectedFiles(newFiles)
        setValue('files', newFiles, { shouldValidate: true })
    }

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index)
        setSelectedFiles(newFiles)
        setValue('files', newFiles.length > 0 ? newFiles : undefined, { shouldValidate: true })
    }

    const onSubmit = async (data: ProjectFormData) => {
        if (honeypot) {
            console.warn('🚫 Tentative de spam détectée (honeypot)')
            return
        }

        const userIdentifier = `${data.email}-${data.phone}`
        if (!checkRateLimit(userIdentifier, 3, 60000)) {
            const remainingTime = getRemainingTime(userIdentifier)
            setRateLimitError(`Trop de tentatives. Réessayez dans ${remainingTime} secondes.`)
            return
        }

        setIsLoading(true)
        setRateLimitError(null)
        setUploadProgress(0)

        try {
            console.log("📤 Envoi sécurisé de la demande...")

            // Simuler progression
            if (selectedFiles.length > 0) {
                setUploadProgress(20)
                await new Promise(resolve => setTimeout(resolve, 300))
            }

            const submissionData = {
                ...data,
                files: selectedFiles.length > 0 ? selectedFiles : undefined,
            }

            setUploadProgress(50)
            const result = await sendProjectSubmission(submissionData)
            setUploadProgress(100)

            if (result.success) {
                console.log("✅ Demande envoyée avec succès")
                setSubmitted(true)
                setSelectedFiles([])

                setTimeout(() => {
                    setSubmitted(false)
                    reset()
                    setUploadProgress(0)
                }, 6000)
            } else {
                throw new Error(result.error || "Erreur lors de l'envoi")
            }
        } catch (error) {
            console.error("❌ Erreur:", error)
            alert(
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue. Veuillez réessayer."
            )
            setUploadProgress(0)
        } finally {
            setIsLoading(false)
        }
    }

    const processSteps = [
        {
            title: "Soumettez votre demande",
            description: "Remplissez le formulaire sécurisé avec les détails de votre projet.",
            icon: FileText,
            gradient: "from-blue-500/10 to-cyan-500/10",
            iconColor: "text-blue-600 dark:text-blue-400"
        },
        {
            title: "Étude de faisabilité",
            description: "Notre équipe analyse votre demande en 24-48h.",
            icon: Target,
            gradient: "from-purple-500/10 to-pink-500/10",
            iconColor: "text-purple-600 dark:text-purple-400"
        },
        {
            title: "Devis personnalisé",
            description: "Recevez un devis détaillé avec planning et coûts.",
            icon: Lightbulb,
            gradient: "from-yellow-500/10 to-orange-500/10",
            iconColor: "text-yellow-600 dark:text-yellow-400"
        },
        {
            title: "Réalisation",
            description: "Fabrication de votre projet avec notre expertise.",
            icon: Zap,
            gradient: "from-green-500/10 to-emerald-500/10",
            iconColor: "text-green-600 dark:text-green-400"
        },
    ]

    const skills = [
        "Fabrication numérique",
        "Prototypage rapide",
        "Impression 3D avancée",
        "Découpe et gravure laser",
        "Électronique embarquée",
        "IoT et systèmes connectés",
        "Modélisation et design 3D",
        "Programmation et automatisation",
        "Conception assistée par ordinateur (CAO)",
        "Développement durable et éco-conception",
        "Développement web",
        "Solutions informatiques personnalisées",
    ]

    const benefits = [
        "Réponse garantie sous 48h",
        "Équipe d'experts à votre écoute",
        "Accompagnement personnalisé",
        "Devis transparent et détaillé",
        "Matériel de pointe",
        "Qualité professionnelle",
    ]

    const openingHours = [
        { day: "Lundi - Vendredi", hours: "9h00 - 18h00" },
        { day: "Samedi", hours: "10h00 - 16h00" },
        { day: "Dimanche", hours: "Fermé", closed: true },
    ]

    const securityFeatures = [
        { icon: Shield, text: "Protection anti-spam" },
        { icon: Lock, text: "Données chiffrées SSL" },
        { icon: CheckCheck, text: "Validation sécurisée" },
    ]

    return (
        <section className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
            {/* Decorative Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Hero Section */}
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
                                {securityFeatures.map((feature, index) => {
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
                                })}
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

            {/* Main Content */}
            <div className="py-12 lg:py-16">
                <div className="container mx-auto px-4 lg:px-8">
                    <SectionHeader
                        title="Votre projet en quelques étapes"
                        subtitle="Suivez notre processus simple et sécurisé pour concrétiser votre idée"
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
                        
                        {/* Form Section */}
                        <div className="lg:col-span-3 space-y-6">
                            <Card className="border border-border shadow-sm">
                                {/* Header simplifié */}
                                <div className="bg-muted/30 p-6 border-b border-border">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-foreground mb-1">
                                                Formulaire de demande
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                Remplissez les informations ci-dessous
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Shield className="text-primary" size={20} />
                                        </div>
                                    </div>
                                </div>

                                <CardContent className="p-6 lg:p-8">
                                    {submitted ? (
                                        <div className="flex flex-col items-center justify-center text-center py-12">
                                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                                                <CheckCircle2 className="text-green-600 dark:text-green-400" size={32} />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-2">Demande envoyée !</h3>
                                            <p className="text-muted-foreground mb-4">
                                                Notre équipe vous contactera sous 48h maximum.
                                            </p>
                                            <div className="flex flex-col gap-2 max-w-xs">
                                                <Badge variant="outline" className="text-primary border-primary py-1.5 justify-center">
                                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                                    Confirmation envoyée par email
                                                </Badge>
                                                <Badge variant="outline" className="border-border py-1.5 justify-center">
                                                    <Mail className="w-3.5 h-3.5 mr-1.5" />
                                                    Vérifiez votre boîte de réception
                                                </Badge>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Rate Limit Error */}
                                            {rateLimitError && (
                                                <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                                                    <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                                                    <div className="flex-1">
                                                        <p className="text-sm text-red-900 dark:text-red-200">
                                                            {rateLimitError}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => setRateLimitError(null)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            )}

                                            <Honeypot onChange={setHoneypot} />

                                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                                {/* Name */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1.5">
                                                        Nom complet <span className="text-red-500">*</span>
                                                    </Label>
                                                    <input
                                                        {...register("name")}
                                                        id="name"
                                                        type="text"
                                                        className={`w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                                                            errors.name ? 'border-red-500' : 'border-border'
                                                        }`}
                                                        placeholder="Jean Dupont"
                                                    />
                                                    {errors.name && (
                                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                                            <AlertCircle size={12} />
                                                            {errors.name.message}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Email & Phone */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1.5">
                                                            Email <span className="text-red-500">*</span>
                                                        </Label>
                                                        <div className="relative">
                                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                                            <input
                                                                {...register("email")}
                                                                id="email"
                                                                type="email"
                                                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                                                                    errors.email ? 'border-red-500' : 'border-border'
                                                                }`}
                                                                placeholder="jean@example.com"
                                                            />
                                                        </div>
                                                        {errors.email && (
                                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                                <AlertCircle size={12} />
                                                                {errors.email.message}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1.5">
                                                            Téléphone <span className="text-red-500">*</span>
                                                        </Label>
                                                        <div className="relative">
                                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                                            <input
                                                                {...register("phone")}
                                                                id="phone"
                                                                type="tel"
                                                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                                                                    errors.phone ? 'border-red-500' : 'border-border'
                                                                }`}
                                                                placeholder="+225 05 00 00 00 00"
                                                            />
                                                        </div>
                                                        {errors.phone && (
                                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                                <AlertCircle size={12} />
                                                                {errors.phone.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Project Type */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="projectType" className="text-sm font-medium flex items-center gap-1.5">
                                                        Type de projet <span className="text-red-500">*</span>
                                                    </Label>
                                                    <select
                                                        {...register("projectType")}
                                                        id="projectType"
                                                        className={`w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                                                            errors.projectType ? 'border-red-500' : 'border-border'
                                                        }`}
                                                    >
                                                        <option value="">Sélectionnez un type</option>
                                                        {skills.map((skill, index) => (
                                                            <option key={index} value={skill.toLowerCase().replace(/\s+/g, '-')}>
                                                                {skill}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.projectType && (
                                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                                            <AlertCircle size={12} />
                                                            {errors.projectType.message}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Budget & Timeline */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="budget" className="text-sm font-medium">
                                                            Budget estimé
                                                        </Label>
                                                        <select
                                                            {...register("budget")}
                                                            id="budget"
                                                            className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                                        >
                                                            <option value="">Choisir...</option>
                                                            <option value="<500">Moins de 500 000 FCFA</option>
                                                            <option value="500-1000">500 000 - 1 000 000 FCFA</option>
                                                            <option value="1000-3000">1 000 000 - 3 000 000 FCFA</option>
                                                            <option value=">3000">Plus de 3 000 000 FCFA</option>
                                                        </select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="timeline" className="text-sm font-medium">
                                                            Délai souhaité
                                                        </Label>
                                                        <select
                                                            {...register("timeline")}
                                                            id="timeline"
                                                            className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                                        >
                                                            <option value="">Choisir...</option>
                                                            <option value="urgent">Urgent (1-2 semaines)</option>
                                                            <option value="normal">Normal (1 mois)</option>
                                                            <option value="flexible">Flexible (2-3 mois)</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="description" className="text-sm font-medium flex items-center gap-1.5">
                                                        Description du projet <span className="text-red-500">*</span>
                                                    </Label>
                                                    <textarea
                                                        {...register("description")}
                                                        id="description"
                                                        rows={5}
                                                        className={`w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-colors ${
                                                            errors.description ? 'border-red-500' : 'border-border'
                                                        }`}
                                                        placeholder="Décrivez votre projet en détail (minimum 20 caractères)..."
                                                    />
                                                    {errors.description && (
                                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                                            <AlertCircle size={12} />
                                                            {errors.description.message}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* File Upload - REMPLACER LA SECTION EXISTANTE */}
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Fichiers (optionnel)</Label>
                                                    
                                                    <input
                                                        type="file"
                                                        id="file-upload"
                                                        multiple
                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.stl,.obj,.step,.iges"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />
                                                    
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="block border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 hover:bg-muted/20 transition-all cursor-pointer group"
                                                    >
                                                        <Paperclip className="mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" size={24} />
                                                        <p className="text-sm text-muted-foreground">
                                                            Cliquez pour ajouter des fichiers
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Plans, croquis, photos, fichiers 3D • Max 5 fichiers de 10 MB
                                                        </p>
                                                    </label>

                                                    {/* Liste des fichiers sélectionnés */}
                                                    {selectedFiles.length > 0 && (
                                                        <div className="space-y-2 mt-3">
                                                            {selectedFiles.map((file, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border"
                                                                >
                                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                        <Paperclip className="text-primary flex-shrink-0" size={16} />
                                                                        <div className="min-w-0 flex-1">
                                                                            <p className="text-sm font-medium truncate">{file.name}</p>
                                                                            <p className="text-xs text-muted-foreground">
                                                                                {(file.size / 1024).toFixed(2)} KB
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeFile(index)}
                                                                        className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                                                                    >
                                                                        <X size={18} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Security Info */}
                                                <div className="flex items-start gap-3 p-3 bg-muted/30 border border-border rounded-lg">
                                                    <Shield className="text-primary flex-shrink-0 mt-0.5" size={16} />
                                                    <p className="text-xs text-muted-foreground">
                                                        Vos données sont protégées par chiffrement SSL et ne seront jamais partagées.
                                                    </p>
                                                </div>

                                                {/* Submit Button avec progression */}
                                                <Button
                                                    type="submit"
                                                    disabled={isLoading || !isValid}
                                                    className="w-full h-11 font-medium relative overflow-hidden"
                                                >
                                                    <div className="relative z-10 flex items-center justify-center">
                                                        {isLoading ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                {uploadProgress > 0 && selectedFiles.length > 0
                                                                    ? `Upload... ${uploadProgress}%`
                                                                    : 'Envoi en cours...'}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Send className="w-4 h-4 mr-2" />
                                                                Envoyer la demande
                                                            </>
                                                        )}
                                                    </div>
                                                    {/* Barre de progression */}
                                                    {uploadProgress > 0 && (
                                                        <div 
                                                            className="absolute bottom-0 left-0 h-1 bg-primary-foreground/30 transition-all duration-300"
                                                            style={{ width: `${uploadProgress}%` }}
                                                        />
                                                    )}
                                                </Button>
                                            </form>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Opening Hours Card */}
                            <Card className="border border-border shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Clock className="text-primary" size={20} />
                                        </div>
                                        <h3 className="text-lg font-bold">Horaires d'ouverture</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {openingHours.map((schedule, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center py-2 border-b border-border last:border-0"
                                            >
                                                <span className="text-sm text-muted-foreground">{schedule.day}</span>
                                                <span className={`text-sm font-medium ${schedule.closed ? 'text-red-500' : 'text-foreground'}`}>
                                                    {schedule.hours}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Process Steps */}
                            <Card className="border border-border shadow-sm">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <TrendingUp className="text-primary" size={20} />
                                        Comment ça marche ?
                                    </h3>
                                    <div className="space-y-3">
                                        {processSteps.map((step, index) => {
                                            const Icon = step.icon
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex gap-3 p-3 bg-muted/30 rounded-lg border border-border hover:border-primary/30 transition-colors"
                                                >
                                                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Icon className="text-primary" size={18} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-sm mb-0.5">{step.title}</h4>
                                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Benefits */}
                            <Card className="border border-border shadow-sm">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold mb-4">Pourquoi nous choisir ?</h3>
                                    <div className="space-y-2">
                                        {benefits.map((benefit, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2.5 text-sm"
                                            >
                                                <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle2 className="text-primary" size={12} />
                                                </div>
                                                <span className="text-foreground">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Skills */}
                            <Card className="border border-border shadow-sm">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold mb-4">Nos compétences</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, index) => (
                                            <Badge
                                                key={index}
                                                variant="outline"
                                                className="px-2.5 py-1 text-xs hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact Help */}
                            <Card className="border border-border shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Phone className="text-primary" size={20} />
                                        </div>
                                        <h3 className="text-lg font-bold">Besoin d'aide ?</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Notre équipe est disponible pour répondre à vos questions.
                                    </p>
                                    <div className="space-y-3">
                                        <a
                                            href="mailto:fablab@uvci.edu.ci"
                                            className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <Mail className="text-primary flex-shrink-0" size={18} />
                                            <div>
                                                <div className="text-xs text-muted-foreground">Email</div>
                                                <span className="text-sm font-medium text-primary">
                                                    fablab@uvci.edu.ci
                                                </span>
                                            </div>
                                        </a>
                                        <a
                                            href="tel:+2250759136905"
                                            className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <Phone className="text-primary flex-shrink-0" size={18} />
                                            <div>
                                                <div className="text-xs text-muted-foreground">Téléphone</div>
                                                <span className="text-sm font-medium text-primary">
                                                    +225 07 59 13 69 05
                                                </span>
                                            </div>
                                        </a>
                                    </div>
                                    <Button variant="outline" className="w-full mt-4 text-sm" asChild>
                                        <Link href="/contact">
                                            Contactez-nous directement
                                            <ArrowRight size={14} className="ml-2" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
