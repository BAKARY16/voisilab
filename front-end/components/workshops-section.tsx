"use client"

import { SectionHeader } from "./section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, GraduationCap, Zap, Wrench } from "lucide-react"
import { useState } from "react"

export function WorkshopsSection() {
  const [activeTab, setActiveTab] = useState<"formations" | "ateliers" | "evenements">("formations")

  const formations = [
    {
      title: "Initiation Impression 3D",
      date: "15 Mars 2024",
      time: "14h00 - 17h00",
      participants: "8/10",
      level: "Débutant",
      description: "Apprenez les bases de l'impression 3D, de la modélisation à l'impression de votre premier objet.",
      price: "Gratuit",
    },
    {
      title: "Découpeuse Laser Avancée",
      date: "22 Mars 2024",
      time: "10h00 - 13h00",
      participants: "5/8",
      level: "Intermédiaire",
      description: "Maîtrisez les techniques avancées de découpe et gravure laser sur différents matériaux.",
      price: "25€",
    },
    {
      title: "Arduino & Électronique",
      date: "29 Mars 2024",
      time: "14h00 - 18h00",
      participants: "6/12",
      level: "Débutant",
      description: "Introduction à la programmation Arduino et création de circuits électroniques simples.",
      price: "15€",
    },
  ]

  const ateliers = [
    {
      title: "Fabriquez votre lampe design",
      date: "18 Mars 2024",
      time: "18h00 - 21h00",
      participants: "4/8",
      level: "Tous niveaux",
      description: "Créez une lampe unique en combinant découpe laser et assemblage créatif.",
      price: "30€",
    },
    {
      title: "Bijoux imprimés en 3D",
      date: "25 Mars 2024",
      time: "14h00 - 17h00",
      participants: "7/10",
      level: "Débutant",
      description: "Concevez et imprimez vos propres bijoux personnalisés en résine.",
      price: "20€",
    },
  ]

  const evenements = [
    {
      title: "Hackathon Green Tech",
      date: "5-7 Avril 2024",
      time: "Weekend complet",
      participants: "20/40",
      level: "Tous niveaux",
      description: "48h pour créer des solutions innovantes aux défis environnementaux.",
      price: "Gratuit",
    },
    {
      title: "Portes Ouvertes",
      date: "12 Avril 2024",
      time: "10h00 - 18h00",
      participants: "Illimité",
      level: "Tous publics",
      description: "Découvrez le fablab, rencontrez l'équipe et testez nos machines.",
      price: "Gratuit",
    },
    {
      title: "Maker Faire Voisilab",
      date: "20 Avril 2024",
      time: "14h00 - 20h00",
      participants: "Illimité",
      level: "Tous publics",
      description: "Exposition des projets des makers et démonstrations en direct.",
      price: "Gratuit",
    },
  ]

  const tabData = {
    formations: { items: formations, icon: GraduationCap },
    ateliers: { items: ateliers, icon: Wrench },
    evenements: { items: evenements, icon: Zap },
  }

  const currentData = tabData[activeTab]

  return (
    <section id="ateliers" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          title="Ateliers & Événements"
          subtitle="Formations, ateliers créatifs et événements pour apprendre, créer et partager avec la communauté."
        />

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            variant={activeTab === "formations" ? "default" : "outline"}
            size="lg"
            onClick={() => setActiveTab("formations")}
            className="gap-2"
          >
            <GraduationCap size={20} />
            Formations
          </Button>
          <Button
            variant={activeTab === "ateliers" ? "default" : "outline"}
            size="lg"
            onClick={() => setActiveTab("ateliers")}
            className="gap-2"
          >
            <Wrench size={20} />
            Ateliers
          </Button>
          <Button
            variant={activeTab === "evenements" ? "default" : "outline"}
            size="lg"
            onClick={() => setActiveTab("evenements")}
            className="gap-2"
          >
            <Zap size={20} />
            Événements
          </Button>
        </div>

        {/* Content */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {currentData.items.map((item, index) => (
            <Card
              key={index}
              className="border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="h-2 bg-gradient-to-r from-primary to-accent" />
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {item.level}
                  </Badge>
                  <span className="text-lg font-bold text-primary">{item.price}</span>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{item.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar size={16} className="text-primary" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock size={16} className="text-primary" />
                    <span>{item.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Users size={16} className="text-primary" />
                    <span>{item.participants} participants</span>
                  </div>
                </div>

                <Button className="w-full bg-transparent" variant="outline">
                  S'inscrire
                </Button>
              </CardContent>
            </Card>
          ))}
        </div> */}

        {/* Newsletter */}
        <div className="mt-16 max-w-3xl mx-auto">
          <Card className="bg-card border-2 border-primary/20">
            <CardContent className="p-8 lg:p-10 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-3">Restez informé</h3>
              <p className="text-muted-foreground mb-6">
                Inscrivez-vous à notre newsletter pour recevoir les annonces de nouveaux ateliers et événements.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button>S'abonner</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
