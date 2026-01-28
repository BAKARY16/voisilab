"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import PageBreadcrumb from "@/components/PageBreadCrumb"
import { SectionHeader } from "../../components/section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
    CheckCircle2,
    Send,
    Paperclip,
    Mail,
    Phone,
    Clock,
    Lightbulb,
    Target,
    Users,
    Zap,
    FileText,
    AlertCircle,
    ArrowRight,
    Rocket,
    TrendingUp,
    Award
} from "lucide-react"
import { useState } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function SendPage() {
    useScrollAnimation()

    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        budget: "",
        timeline: "",
        description: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Project request submitted:", formData)
        setSubmitted(true)
        setTimeout(() => {
            setSubmitted(false)
            setFormData({
                name: "",
                email: "",
                phone: "",
                projectType: "",
                budget: "",
                timeline: "",
                description: "",
            })
        }, 20000)
    }

    const processSteps = [
        {
            number: "1",
            title: "Soumettez votre demande",
            description: "Remplissez le formulaire avec les détails de votre projet.",
            icon: FileText,
            gradient: "from-blue-500/10 to-cyan-500/10",
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-600 dark:text-blue-400"
        },
        {
            number: "2",
            title: "Étude de faisabilité",
            description: "Notre équipe analyse votre demande et évalue la faisabilité technique.",
            icon: Target,
            gradient: "from-purple-500/10 to-pink-500/10",
            iconBg: "bg-purple-500/10",
            iconColor: "text-purple-600 dark:text-purple-400"
        },
        {
            number: "3",
            title: "Devis personnalisé",
            description: "Vous recevez un devis détaillé avec planning et coûts.",
            icon: Lightbulb,
            gradient: "from-yellow-500/10 to-orange-500/10",
            iconBg: "bg-yellow-500/10",
            iconColor: "text-yellow-600 dark:text-yellow-400"
        },
        {
            number: "4",
            title: "Réalisation",
            description: "Nous fabriquons votre projet avec notre expertise et nos machines.",
            icon: Zap,
            gradient: "from-green-500/10 to-emerald-500/10",
            iconBg: "bg-green-500/10",
            iconColor: "text-green-600 dark:text-green-400"
        },
    ]

    const skills = [
        "Impression 3D",
        "Découpe Laser",
        "Usinage CNC",
        "Électronique",
        "IoT & Arduino",
        "Prototypage",
        "Design 3D",
        "CAO/DAO",
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

    return (
        <section className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
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

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 lg:gap-6 max-w-2xl mx-auto">
                                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                                    <div className="text-3xl lg:text-4xl font-bold text-white mb-1">150+</div>
                                    <div className="text-sm text-gray-300">Projets réalisés</div>
                                </div>
                                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                                    <div className="text-3xl lg:text-4xl font-bold text-white mb-1">48h</div>
                                    <div className="text-sm text-gray-300">Temps de réponse</div>
                                </div>
                                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                                    <div className="text-3xl lg:text-4xl font-bold text-white mb-1">98%</div>
                                    <div className="text-sm text-gray-300">Satisfaction</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </section>

            {/* Main Content */}
            <div className="relative z-10 py-12 lg:py-20">
                <div className="container mx-auto px-4 lg:px-8">
                    <SectionHeader
                        title="Votre projet en quelques étapes"
                        subtitle="Suivez notre processus simple et efficace pour concrétiser votre idée"
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">

                        {/* Form Section - 3 columns */}
                        <div className="lg:col-span-3 fade-in-up space-y-8">
                            {/* Main Form Card */}
                            <Card className="border-2 border-border shadow-2xl overflow-hidden">
                                {/* Card Header with gradient */}
                                <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-8 border-b border-border">
                                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                                        Formulaire de demande
                                    </h2>
                                    <p className="text-muted-foreground">
                                        Remplissez les informations ci-dessous pour démarrer votre projet
                                    </p>
                                </div>

                                <CardContent className="p-8">
                                    {submitted ? (
                                        <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in-50 zoom-in-95 duration-500">
                                            <div className="relative">
                                                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-in zoom-in-0 duration-700">
                                                    <CheckCircle2 size={48} className="text-primary" />
                                                </div>
                                                <div className="absolute inset-0 w-24 h-24 bg-primary/20 rounded-full animate-ping"></div>
                                            </div>
                                            <h3 className="text-3xl font-bold text-foreground mb-3">Demande envoyée avec succès !</h3>
                                            <p className="text-muted-foreground text-lg mb-6 max-w-md">
                                                Merci pour votre demande. Notre équipe vous contactera sous 48h pour discuter de votre projet.
                                            </p>
                                            <Badge variant="outline" className="text-primary border-primary px-4 py-2">
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                Confirmation envoyée par email
                                            </Badge>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {/* Name */}
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                    Nom complet <span className="text-destructive">*</span>
                                                </Label>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3.5 bg-muted/50 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50"
                                                    placeholder="Jean Dupont"
                                                />
                                            </div>

                                            {/* Email & Phone */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                        Email <span className="text-destructive">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                                        <input
                                                            id="email"
                                                            name="email"
                                                            type="email"
                                                            required
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50"
                                                            placeholder="jean@example.com"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="phone" className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                        Téléphone <span className="text-destructive">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                                        <input
                                                            id="phone"
                                                            name="phone"
                                                            type="tel"
                                                            required
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50"
                                                            placeholder="+225 05 00 00 00 00"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Project Type */}
                                            <div className="space-y-2">
                                                <Label htmlFor="projectType" className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                    Type de projet <span className="text-destructive">*</span>
                                                </Label>
                                                <select
                                                    id="projectType"
                                                    name="projectType"
                                                    required
                                                    value={formData.projectType}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3.5 bg-muted/50 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50"
                                                >
                                                    <option value="">Sélectionnez un type</option>
                                                    <option value="impression-3d">Impression 3D</option>
                                                    <option value="laser">Découpe / Gravure Laser</option>
                                                    <option value="cnc">Usinage CNC</option>
                                                    <option value="electronique">Électronique / IoT</option>
                                                    <option value="prototype">Prototypage complet</option>
                                                    <option value="autre">Autre</option>
                                                </select>
                                            </div>

                                            {/* Budget & Timeline */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="budget" className="text-sm font-semibold text-foreground">
                                                        Budget estimé
                                                    </Label>
                                                    <select
                                                        id="budget"
                                                        name="budget"
                                                        value={formData.budget}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3.5 bg-muted/50 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50"
                                                    >
                                                        <option value="">Choisir...</option>
                                                        <option value="<500">Moins de 500 000 FCFA</option>
                                                        <option value="500-1000">500 000 - 1 000 000 FCFA</option>
                                                        <option value="1000-3000">1 000 000 - 3 000 000 FCFA</option>
                                                        <option value=">3000">Plus de 3 000 000 FCFA</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="timeline" className="text-sm font-semibold text-foreground">
                                                        Délai souhaité
                                                    </Label>
                                                    <select
                                                        id="timeline"
                                                        name="timeline"
                                                        value={formData.timeline}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3.5 bg-muted/50 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50"
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
                                                <Label htmlFor="description" className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                    Description du projet <span className="text-destructive">*</span>
                                                </Label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    required
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    rows={6}
                                                    className="w-full px-4 py-3.5 bg-muted/50 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground resize-none transition-all duration-300 hover:border-primary/50"
                                                    placeholder="Décrivez votre projet en détail : objectifs, contraintes techniques, utilisation prévue..."
                                                />
                                            </div>

                                            {/* File Upload */}
                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold text-foreground">Fichiers (optionnel)</Label>
                                                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
                                                    <Paperclip className="mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" size={32} />
                                                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                                                        Glissez vos fichiers ici ou cliquez pour parcourir
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-2">Plans, croquis, photos, fichiers 3D (max 10MB)</p>
                                                </div>
                                            </div>

                                            {/* Info Alert */}
                                            <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                                                <AlertCircle className="text-primary flex-shrink-0 mt-0.5" size={20} />
                                                <p className="text-sm text-muted-foreground">
                                                    En soumettant ce formulaire, vous acceptez que nous traitions vos données pour étudier votre demande.
                                                </p>
                                            </div>

                                            {/* Submit Button */}
                                            <Button
                                                type="submit"
                                                size="lg"
                                                className="w-full cursor-pointer group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300"
                                            >
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    <Send className="group-hover:translate-x-1 transition-transform" size={20} />
                                                    Envoyer la demande
                                                </span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Opening Hours Card */}
                            <Card className="border-2 border-primary/20 shadow-xl">
                                <CardContent className="p-8 lg:p-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                                            <Clock className="text-primary" size={28} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground">Horaires d'ouverture</h3>
                                    </div>
                                    <p className="text-muted-foreground mb-6">
                                        Vous pouvez nous rendre visite pendant nos heures d'ouverture
                                    </p>
                                    <div className="space-y-4">
                                        {openingHours.map((schedule, index) => (
                                            <div
                                                key={index}
                                                className={`flex justify-between items-center p-4 rounded-xl ${schedule.closed
                                                        ? 'bg-destructive/10 border border-destructive/20'
                                                        : 'bg-muted/50'
                                                    }`}
                                            >
                                                <span className="text-muted-foreground font-medium">
                                                    {schedule.day}
                                                </span>
                                                <span className={`font-bold ${schedule.closed ? 'text-destructive' : 'text-foreground'}`}>
                                                    {schedule.hours}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar - 2 columns */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Process Steps */}
                            <div className="fade-in-up">
                                <Card className="border-2 border-primary/20 shadow-lg overflow-hidden">
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                            <TrendingUp className="text-primary" size={24} />
                                            Comment ça marche ?
                                        </h3>
                                        <div className="space-y-4">
                                            {processSteps.map((step, index) => {
                                                const Icon = step.icon
                                                return (
                                                    <Card
                                                        key={index}
                                                        className={`border-2 border-border hover:border-primary/50 transition-all duration-300 group bg-gradient-to-br ${step.gradient}`}
                                                    >
                                                        <CardContent className="p-4">
                                                            <div className="flex gap-4">
                                                                <div className={`flex-shrink-0 w-12 h-12 ${step.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                                    <Icon className={step.iconColor} size={24} />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-bold text-foreground mb-1">{step.title}</h4>
                                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                                        {step.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Benefits */}
                            <div className="fade-in-up">
                                <Card className="border-2 border-border shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold text-foreground mb-6">
                                            Pourquoi nous choisir ?
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {benefits.map((benefit, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background transition-colors"
                                                >
                                                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <CheckCircle2 className="text-primary" size={14} />
                                                    </div>
                                                    <span className="text-sm text-foreground font-medium">{benefit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Skills */}
                            <div className="fade-in-up">
                                <Card className="border-2 border-border shadow-lg">
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold text-foreground mb-6">Nos compétences</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map((skill, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="px-3 py-1.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 cursor-default"
                                                >
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Contact Help */}
                            <div className="fade-in-up">
                                <Card className="border-2 border-primary/20 shadow-xl">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                                <Phone className="text-primary" size={24} />
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground">Besoin d'aide ?</h3>
                                        </div>
                                        <p className="text-muted-foreground mb-6">
                                            Notre équipe est disponible pour répondre à vos questions.
                                        </p>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                                <Mail className="text-primary flex-shrink-0 mt-1" size={20} />
                                                <div className="flex-1">
                                                    <div className="text-xs text-muted-foreground mb-1">Email</div>
                                                    <a href="mailto:fablab@uvci.edu.ci" className="text-sm text-primary hover:underline font-medium">
                                                        fablab@uvci.edu.ci
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                                <Phone className="text-primary flex-shrink-0 mt-1" size={20} />
                                                <div className="flex-1">
                                                    <div className="text-xs text-muted-foreground mb-1">Téléphone</div>
                                                    <a href="tel:+2250500000000" className="text-sm text-primary hover:underline font-medium">
                                                        +225 05 00 00 00 00
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-border">
                                            <Button variant="outline" className="w-full group" asChild>
                                                <Link href="/contact">
                                                    Contactez-nous directement
                                                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
