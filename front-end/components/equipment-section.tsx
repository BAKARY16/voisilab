"use client"

import { SectionHeader } from "./section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Printer, Scissors, Hammer, Cpu, Drill, Gauge, Box } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useEffect, useState } from "react"
import { equipmentService } from "@/lib/api"

export function EquipmentSection() {
  useScrollAnimation()
  const [equipmentList, setEquipmentList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const data = await equipmentService.getAll()
        if (data && data.length > 0) {
          setEquipmentList(data)
        } else {
          setEquipmentList(defaultEquipment)
        }
      } catch (error) {
        console.error('Erreur chargement équipements:', error)
        setEquipmentList(defaultEquipment)
      } finally {
        setLoading(false)
      }
    }
    loadEquipment()
  }, [])
  
  const defaultEquipment = [
    {
      icon: Printer,
      name: "Imprimantes 3D",
      description: "Plusieurs imprimantes 3D FDM et résine pour donner vie à vos créations en trois dimensions.",
      specs: ["FDM & Résine", "Grand volume", "Haute précision"],
      category: "Impression",
    },
    {
      icon: Scissors,
      name: "Découpeuse Laser",
      description: "Découpe et gravure précise sur bois, acrylique, tissu et bien d'autres matériaux.",
      specs: ["CO2 100W", "Zone 1000x600mm", "Gravure & découpe"],
      category: "Découpe",
    },
    {
      icon: Hammer,
      name: "Fraiseuse CNC",
      description: "Usinage de précision pour le bois, le plastique et l'aluminium.",
      specs: ["3 axes", "Précision 0.1mm", "Multi-matériaux"],
      category: "Usinage",
    },
    {
      icon: Cpu,
      name: "Station électronique",
      description: "Tout l'équipement pour vos projets d'électronique : Arduino, Raspberry Pi, composants.",
      specs: ["Microcontrôleurs", "Composants", "Outils de soudure"],
      category: "Électronique",
    },
    {
      icon: Drill,
      name: "Atelier bois",
      description: "Outils traditionnels et machines pour le travail du bois.",
      specs: ["Scie circulaire", "Perceuse", "Ponceuse"],
      category: "Bois",
    },
    {
      icon: Gauge,
      name: "Outils de mesure",
      description: "Équipements de mesure et de contrôle qualité pour vos prototypes.",
      specs: ["Pied à coulisse", "Micromètre", "Scanner 3D"],
      category: "Métrologie",
    },
  ]

  return (
    <section id="equipements" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          title="Nos équipements"
          subtitle="Accédez à un parc machine complet et moderne pour concrétiser tous vos projets de fabrication numérique."
        />

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement des équipements...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {equipmentList.map((item, index) => {
            const Icon = item.icon
              const Icon = item.icon || Box
              const specs = item.specs || item.specifications?.split(',') || []
              const category = item.category || item.type || 'Équipement'
              
              return (
                <Card
                  key={item.id || index}
                  className="border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 group"
                >
                  <CardContent className="p-6 lg:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <Icon size={28} className="text-primary group-hover:text-primary-foreground" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-semibold text-foreground mb-3">{item.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {specs.length > 0 && (
                      <div className="space-y-2">
                        {specs.slice(0, 3).map((spec: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Access info */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8 lg:p-10 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">Comment accéder aux machines ?</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Pour utiliser nos équipements, vous devez suivre une formation d'initiation spécifique à chaque machine.
                Ces formations sont dispensées régulièrement et vous permettent d'acquérir les compétences nécessaires
                pour une utilisation autonome et sécurisée.
              </p>
              <a href="#ateliers" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                Voir les prochaines formations
                <span>→</span>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
