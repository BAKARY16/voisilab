"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  ArrowRight,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Send,
  GraduationCap,
  Award,
  Target,
  Sparkles,
  ChevronLeft,
  Printer,
  Scissors,
  CodeXml,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const workshops = [
  {
    id: "impression-3d",
    title: "Initiation Impression 3D",
    date: "15 Mars 2024",
    time: "14h00 - 17h00",
    duration: "3 heures",
    participants: "8/10",
    level: "Débutant",
    description: "Apprenez les bases de l'impression 3D, de la modélisation à l'impression de votre premier objet.",
    price: "Gratuit",
    priceValue: 0,
    spots: 2,
    gradient: "from-blue-500/10 to-cyan-500/10",
    levelColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    icon: Printer,
    image: "/banner1.jpg",
    program: [
      "Introduction à l'impression 3D FDM",
      "Découverte du logiciel de modélisation",
      "Préparation du fichier 3D (slicing)",
      "Lancement de votre première impression",
      "Finitions et post-traitement",
    ],
    prerequisites: "Aucun prérequis nécessaire",
    instructor: "Sarah Martin",
    instructorBio: "Experte en impression 3D avec 5 ans d'expérience",
  },
  {
    id: "laser-avance",
    title: "Découpeuse Laser Avancée",
    date: "22 Mars 2024",
    time: "10h00 - 13h00",
    duration: "3 heures",
    participants: "5/8",
    level: "Intermédiaire",
    description: "Maîtrisez les techniques avancées de découpe et gravure laser sur différents matériaux.",
    price: "10 000 FCFA",
    priceValue: 10000,
    spots: 3,
    gradient: "from-purple-500/10 to-pink-500/10",
    levelColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    icon: Scissors,
    image: "/banner2.jpg",
    program: [
      "Paramètres avancés de découpe/gravure",
      "Techniques de gravure photo",
      "Optimisation des fichiers vectoriels",
      "Multi-matériaux (bois, acrylique, cuir)",
      "Projet personnalisé",
    ],
    prerequisites: "Connaissances de base en design graphique",
    instructor: "Lucas Bernard",
    instructorBio: "Designer et formateur laser depuis 7 ans",
  },
  {
    id: "arduino-electronique",
    title: "Arduino & Électronique",
    date: "29 Mars 2024",
    time: "14h00 - 18h00",
    duration: "4 heures",
    participants: "6/12",
    level: "Débutant",
    description: "Introduction à la programmation Arduino et création de circuits électroniques simples.",
    price: "8 000 FCFA",
    priceValue: 8000,
    spots: 6,
    gradient: "from-green-500/10 to-emerald-500/10",
    levelColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    icon: CodeXml,
    image: "/banner1.jpg",
    program: [
      "Introduction à Arduino et l'électronique",
      "Premier programme : LED clignotante",
      "Capteurs (température, lumière, distance)",
      "Actionneurs (servomoteurs, buzzers)",
      "Projet final : Station météo connectée",
    ],
    prerequisites: "Aucun prérequis, ordinateur portable recommandé",
    instructor: "Alex Touré",
    instructorBio: "Ingénieur électronique et maker passionné",
  },
]

export default function InscriptionAtelierPage() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    level: "",
    motivation: "",
    newsletter: false,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value
    setFormData({ ...formData, [target.name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Inscription submitted:", { ...formData, workshop: selectedWorkshop })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        level: "",
        motivation: "",
        newsletter: false,
      })
      setSelectedWorkshop(null)
    }, 5000)
  }

  const currentWorkshop = workshops.find((w) => w.id === selectedWorkshop)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="absolute inset-0 top-0">
        <video
          src="/video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/15 to-accent/15"></div>
      </div>
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Header */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 px-5 py-2 bg-primary/10 text-primary border-none font-medium">
              🎓 Inscription
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Inscrivez-vous à un{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                atelier
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Développez vos compétences en fabrication numérique avec nos formations
              pratiques encadrées par des experts.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-20 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        {/* Sidebar - Liste des ateliers */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24">
            <Card className="border-2 border-border">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Ateliers disponibles</h2>
            <div className="space-y-3">
              {workshops.map((workshop) => {
            const Icon = workshop.icon
            return (
              <button
                key={workshop.id}
                onClick={() => setSelectedWorkshop(workshop.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              selectedWorkshop === workshop.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                selectedWorkshop === workshop.id ? "bg-primary/20" : "bg-muted"
              }`}>
                <Icon className={selectedWorkshop === workshop.id ? "text-primary" : "text-muted-foreground"} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
                  {workshop.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  <span>{workshop.date}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge className={workshop.levelColor} variant="outline">
                {workshop.level}
                  </Badge>
                  <span className="text-sm font-bold text-primary">{workshop.price}</span>
                </div>
              </div>
                </div>
              </button>
            )
              })}
            </div>
          </CardContent>
            </Card>

            {/* Info card */}
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Sparkles className="text-primary" size={20} />
              </div>
              <h3 className="font-semibold text-foreground">Pourquoi nous ?</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
            <CheckCircle2 className="text-primary flex-shrink-0" size={16} />
            Formateurs experts
              </li>
              <li className="flex items-center gap-2">
            <CheckCircle2 className="text-primary flex-shrink-0" size={16} />
            Équipements professionnels
              </li>
              <li className="flex items-center gap-2">
            <CheckCircle2 className="text-primary flex-shrink-0" size={16} />
            Groupes limités (max 12)
              </li>
              <li className="flex items-center gap-2">
            <CheckCircle2 className="text-primary flex-shrink-0" size={16} />
            Certificat de participation
              </li>
            </ul>
          </CardContent>
            </Card>
          </div>
        </div>

        {/* Main content - Détails + Formulaire */}
        <div className="lg:col-span-8 space-y-8">
          {!selectedWorkshop && (
            <Card className="border-2 border-dashed border-border">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="text-muted-foreground" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Sélectionnez un atelier
            </h3>
            <p className="text-muted-foreground">
              Choisissez un atelier dans la liste pour voir les détails et vous inscrire
            </p>
          </CardContent>
            </Card>
          )}

          {currentWorkshop && (
            <>
          {/* Détails de l'atelier */}
          <Card className="border-2 border-border overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${currentWorkshop.gradient.replace('/10', '')}`} />
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                {currentWorkshop.title}
              </h2>
              <p className="text-muted-foreground mb-4">{currentWorkshop.description}</p>
              <div className="flex flex-wrap gap-3">
                <Badge className={currentWorkshop.levelColor} variant="outline">
              {currentWorkshop.level}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
              <Calendar size={14} />
              {currentWorkshop.date}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
              <Clock size={14} />
              {currentWorkshop.time}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
              <Users size={14} />
              {currentWorkshop.participants}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary mb-1">
                {currentWorkshop.price}
              </div>
              {currentWorkshop.spots <= 5 && (
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/50 animate-pulse">
              Plus que {currentWorkshop.spots} places !
                </Badge>
              )}
            </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Award className="text-primary" size={20} />
                Programme
              </h3>
              <ul className="space-y-2">
                {currentWorkshop.program.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="text-primary flex-shrink-0 mt-0.5" size={16} />
                {item}
              </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
              <GraduationCap className="text-primary" size={20} />
              Formateur
                </h3>
                <p className="text-sm font-medium text-foreground">{currentWorkshop.instructor}</p>
                <p className="text-sm text-muted-foreground">{currentWorkshop.instructorBio}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Prérequis</h3>
                <p className="text-sm text-muted-foreground">{currentWorkshop.prerequisites}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Durée</h3>
                <p className="text-sm text-muted-foreground">{currentWorkshop.duration}</p>
              </div>
            </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulaire d'inscription */}
          <Card className="border-2 border-primary/30">
            <CardContent className="p-8">
              {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Inscription confirmée !</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Merci pour votre inscription à <strong>{currentWorkshop.title}</strong>.
                Vous recevrez un email de confirmation avec tous les détails.
              </p>
              <Button onClick={() => setSelectedWorkshop(null)} variant="outline">
                <ChevronLeft size={16} className="mr-2" />
                Retour aux ateliers
              </Button>
            </div>
              ) : (
            <>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Formulaire d'inscription
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-foreground mb-2 block">
                  Prénom *
                </Label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50"
                  placeholder="Jean"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-foreground mb-2 block">
                  Nom *
                </Label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50"
                  placeholder="Dupont"
                />
              </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-foreground mb-2 block">
                  Email *
                </Label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50"
                  placeholder="jean.dupont@email.com"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-foreground mb-2 block">
                  Téléphone *
                </Label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50"
                  placeholder="+225 00 00 00 00 00"
                />
              </div>
                </div>

                <div>
              <Label htmlFor="level" className="text-foreground mb-2 block">
                Votre niveau *
              </Label>
              <select
                id="level"
                name="level"
                required
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all duration-300 hover:border-primary/50"
              >
                <option value="">Sélectionnez votre niveau</option>
                <option value="debutant">Débutant (aucune expérience)</option>
                <option value="intermediaire">Intermédiaire (quelques notions)</option>
                <option value="avance">Avancé (expérience confirmée)</option>
              </select>
                </div>

                <div>
              <Label htmlFor="motivation" className="text-foreground mb-2 block">
                Motivation (optionnel)
              </Label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground resize-none transition-all duration-300 hover:border-primary/50"
                placeholder="Pourquoi souhaitez-vous suivre cet atelier ? Quels sont vos objectifs ?"
              />
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
              <input
                id="newsletter"
                name="newsletter"
                type="checkbox"
                checked={formData.newsletter}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <Label htmlFor="newsletter" className="text-sm text-muted-foreground cursor-pointer">
                J'accepte de recevoir des emails sur les prochains ateliers et événements du fablab
              </Label>
                </div>

                {/* Récapitulatif */}
                <div className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border-2 border-border">
              <h4 className="font-semibold text-foreground mb-3">Récapitulatif</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Atelier :</span>
                  <span className="font-medium text-foreground">{currentWorkshop.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date :</span>
                  <span className="font-medium text-foreground">{currentWorkshop.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Horaire :</span>
                  <span className="font-medium text-foreground">{currentWorkshop.time}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">Tarif :</span>
                  <span className="font-bold text-primary text-lg">{currentWorkshop.price}</span>
                </div>
              </div>
                </div>

                <Button
              type="submit"
              size="lg"
              className="w-full group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300"
                >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Send size={20} />
                Confirmer l'inscription
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>

                <p className="text-xs text-center text-muted-foreground">
              En vous inscrivant, vous acceptez nos{" "}
              <Link href="/conditions" className="text-primary hover:underline">
                conditions générales
              </Link>
                </p>
              </form>
            </>
              )}
            </CardContent>
          </Card>
            </>
          )}
        </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 max-w-4xl mx-auto">
        <CardContent className="p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Une question sur nos ateliers ?
          </h2>
          <p className="text-muted-foreground mb-8">
            Notre équipe est disponible pour vous renseigner et vous aider à choisir la formation adaptée
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
          <Link href="/contact">
            Nous contacter
            <ArrowRight className="ml-2" size={20} />
          </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
          <Link href="/ateliers">
            Voir tous les ateliers
          </Link>
            </Button>
          </div>
        </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}