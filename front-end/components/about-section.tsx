"use client"
import { SectionHeader } from "./section-header"
import { Lightbulb, Users, Rocket, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"


export function AboutSection() {
  useScrollAnimation()

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Nous encourageons la créativité et l'expérimentation pour repousser les limites de la fabrication numérique.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "Un espace ouvert où makers, artistes et entrepreneurs partagent leurs connaissances et compétences.",
    },
    {
      icon: Rocket,
      title: "Accessibilité",
      description: "Démocratiser l'accès aux technologies de fabrication pour tous, du débutant à l'expert.",
    },
    {
      icon: Heart,
      title: "Communauté",
      description: "Créer un écosystème bienveillant où chacun peut apprendre, créer et grandir ensemble.",
    },
  ]

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          title="Un fablab au cœur de l'innovation"
          subtitle="Depuis 2019, Voisilab est bien plus qu'un simple atelier. C'est un lieu de rencontre, d'apprentissage et de création où la technologie rencontre l'imagination."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <div key={index} className="fade-in-up">
                <Card className="border-border hover:border-primary/50 transition-all duration-300 group">
                  <CardContent className="p-6 lg:p-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon size={24} className="text-primary group-hover:text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        <div className="mt-16 max-w-4xl mx-auto fade-in-up">
          <Card className="bg-card border-2 border-primary/20">
            <CardContent className="p-8 lg:p-12 text-center">
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">Notre Mission</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Rendre la fabrication numérique accessible à tous en fournissant l'équipement, les connaissances et
                l'espace nécessaires pour transformer vos idées en réalité. Que vous soyez étudiant, entrepreneur,
                artiste ou simple curieux, Voisilab est votre partenaire dans l'innovation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
