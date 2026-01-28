"use client"

import { SectionHeader } from "./section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Heart } from "lucide-react"
import { useState } from "react"

export function InnovationsSection() {
  const [likes, setLikes] = useState<{ [key: number]: number }>({
    0: 45,
    1: 67,
    2: 32,
    3: 89,
    4: 54,
    5: 71,
  })

  const projects = [
    {
      title: "Prothèse de main imprimée 3D",
      creator: "Sarah M.",
      category: "Santé",
      description: "Prothèse de main fonctionnelle imprimée en 3D pour enfants, accessible et personnalisable.",
      image: "/prosthetic-hand-3d-printed-innovative.jpg",
      tags: ["Impression 3D", "Social Impact"],
    },
    {
      title: "Système hydroponique connecté",
      creator: "Lucas B.",
      category: "Agriculture",
      description:
        "Système de culture hydroponique automatisé avec monitoring IoT pour une agriculture urbaine efficace.",
      image: "/smart-hydroponic-system-arduino-sensors.jpg",
      tags: ["IoT", "Arduino", "Écologie"],
    },
    {
      title: "Lampe design paramétrique",
      creator: "Emma L.",
      category: "Design",
      description: "Collection de lampes au design unique créées avec modélisation paramétrique et découpe laser.",
      image: "/parametric-design-laser-cut-lamp-modern.jpg",
      tags: ["Laser", "Design", "Art"],
    },
    {
      title: "Robot éducatif open-source",
      creator: "Thomas K.",
      category: "Éducation",
      description: "Robot pédagogique pour apprendre la programmation et la robotique de manière ludique.",
      image: "/educational-robot-arduino-open-source-learning.jpg",
      tags: ["Robotique", "Électronique", "Open Source"],
    },
    {
      title: "Mobilier modulaire éco-responsable",
      creator: "Marie D.",
      category: "Mobilier",
      description: "Meubles modulaires en bois recyclé, conçus pour être assemblés sans outils.",
      image: "/modular-eco-furniture-wood-sustainable-design.jpg",
      tags: ["CNC", "Bois", "Écologie"],
    },
    {
      title: "Station météo DIY",
      creator: "Alex P.",
      category: "Tech",
      description: "Station météo connectée avec affichage des données en temps réel et prévisions.",
      image: "/diy-weather-station-iot-display-technology.jpg",
      tags: ["IoT", "Impression 3D", "Data"],
    },
  ]

  const handleLike = (index: number) => {
    setLikes((prev) => ({
      ...prev,
      [index]: (prev[index] || 0) + 1,
    }))
  }

  return (
    <section id="innovations" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          title="Innovations & Créations"
          subtitle="Découvrez les projets inspirants réalisés par notre communauté de makers. De l'innovation sociale aux créations artistiques, chaque projet raconte une histoire unique."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-48 lg:h-56 overflow-hidden">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-background/90 backdrop-blur-sm">{project.category}</Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                </div>

                <p className="text-xs text-muted-foreground mb-2">Par {project.creator}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <button
                    onClick={() => handleLike(index)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group/like"
                  >
                    <Heart
                      size={18}
                      className="group-hover/like:fill-primary group-hover/like:text-primary transition-all"
                    />
                    <span className="text-sm font-medium">{likes[index]}</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <span className="text-sm font-medium">Voir plus</span>
                    <ExternalLink size={16} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8 lg:p-10 text-center">
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">Votre projet mérite d'être vu</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Vous avez réalisé un projet chez Voisilab ? Partagez-le avec la communauté et inspirez d'autres makers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#projet"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Soumettre mon projet
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-border rounded-lg hover:border-primary transition-colors font-medium"
                >
                  Voir tous les projets
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
