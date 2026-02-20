"use client"

import { SectionHeader } from "./section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Linkedin, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import { teamService } from "@/lib/api"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.fablab.voisilab.online'

const getTeamImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return '/placeholder.svg'
  if (imagePath.startsWith('https://api.fablab.voisilab.online')) return imagePath
  if (imagePath.includes('localhost')) {
    const match = imagePath.match(/(\/uploads\/.+)/)
    return match ? `${API_URL}${match[1]}` : '/placeholder.svg'
  }
  if (imagePath.startsWith('http')) return imagePath
  if (imagePath.startsWith('/uploads/')) return `${API_URL}${imagePath}`
  return imagePath
}

export function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const members = await teamService.getActiveMembers()
        if (members && members.length > 0) {
          setTeamMembers(members)
        } else {
          // Données par défaut si l'API ne retourne rien
          setTeamMembers(defaultTeam)
        }
      } catch (error) {
        console.error('Erreur chargement équipe:', error)
        setTeamMembers(defaultTeam)
      } finally {
        setLoading(false)
      }
    }
    loadTeam()
  }, [])

  const defaultTeam = [
    {
      name: "Pierre Dubois",
      role: "Directeur & Fondateur",
      bio: "Passionné de fabrication numérique depuis 15 ans, Pierre a fondé Voisilab pour rendre ces technologies accessibles à tous.",
      image: "/team-director-fablab-expert-portrait.jpg",
      email: "pierre@voisilab.fr",
      linkedin: "#",
    },
    {
      name: "Sophie Martin",
      role: "Responsable Formations",
      bio: "Ingénieure de formation, Sophie anime les ateliers et forme les makers aux différentes machines du fablab.",
      image: "/team-training-manager-engineer-woman-portrait.jpg",
      email: "sophie@voisilab.fr",
      linkedin: "#",
    },
    {
      name: "Karim Benali",
      role: "FabManager & Tech Lead",
      bio: "Expert en impression 3D et électronique, Karim accompagne les projets techniques les plus ambitieux.",
      image: "/team-fabmanager-tech-expert-man-portrait.jpg",
      email: "karim@voisilab.fr",
      linkedin: "#",
    },
  ]

  const youngTalents = [
    {
      name: "Léa Rousseau",
      age: 22,
      speciality: "Design & Impression 3D",
      achievement: "Créatrice de la collection de bijoux 'Parametric Dreams'",
      image: "/young-talent-designer-3d-printing-woman.jpg",
    },
    {
      name: "Malik Diallo",
      age: 19,
      speciality: "Robotique & IoT",
      achievement: "Développeur du robot éducatif open-source 'RoboLearn'",
      image: "/young-talent-robotics-iot-developer-man.jpg",
    },
    {
      name: "Camille Lefebvre",
      age: 24,
      speciality: "Laser & Menuiserie",
      achievement: "Designer du mobilier modulaire en bois recyclé",
      image: "/young-talent-laser-woodworking-designer.jpg",
    },
    {
      name: "Rayan Ahmed",
      age: 20,
      speciality: "Électronique & Programmation",
      achievement: "Créateur de la station météo connectée DIY",
      image: "/young-talent-electronics-programming-student.jpg",
    },
  ]

  return (
    <section id="equipe" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Core Team */}
        <SectionHeader
          title="L'équipe Voisilab"
          subtitle="Des passionnés dédiés à votre accompagnement dans vos projets de fabrication numérique."
        />

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement de l'équipe...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card
                key={member.id || index}
                className="border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-64 lg:h-72 overflow-hidden">
                  <img
                    src={getTeamImageUrl(member.image || member.photo_url)}
                    alt={member.full_name || member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {member.full_name || member.name}
                  </h3>
                  <Badge variant="secondary" className="mb-4">
                    {member.position || member.role}
                  </Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {member.bio || member.description}
                  </p>

                  {(member.email || member.linkedin_url) && (
                    <div className="flex gap-3">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                          aria-label={`Email ${member.full_name || member.name}`}
                        >
                          <Mail size={18} />
                        </a>
                      )}
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                          aria-label={`LinkedIn ${member.full_name || member.name}`}
                        >
                          <Linkedin size={18} />
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>

        {/* Young Talents */}
        <SectionHeader
          title="Jeunes Talents"
          subtitle="Découvrez les makers prometteurs qui repoussent les limites de la créativité et de l'innovation chez Voisilab."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {youngTalents.map((talent, index) => (
            <Card
              key={index}
              className="border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={talent.image || "/placeholder.svg"}
                  alt={talent.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-accent text-accent-foreground">{talent.age} ans</Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-1">{talent.name}</h3>
                <p className="text-xs text-primary font-medium mb-3">{talent.speciality}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{talent.achievement}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Join CTA */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8 lg:p-10 text-center">
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">Rejoignez la communauté</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Vous êtes étudiant, maker ou simplement curieux ? Venez développer vos compétences et réaliser vos
                projets au sein de notre fablab.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Nous rejoindre
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
