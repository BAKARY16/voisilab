"use client"

import { SectionHeader } from "../../components/section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import PageBreadcrumb from "@/components/PageBreadCrumb"
import {
  Linkedin,
  Mail,
  Users,
  Zap,
  Award,
  ArrowRight,
  Rocket,
  Star,
  Trophy,
  Target
} from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function TeamSection() {
  useScrollAnimation()

  const coreTeam = [
    {
      name: "Pierre Dubois",
      role: "Directeur & Fondateur",
      bio: "Passionné de fabrication numérique depuis 15 ans, Pierre a fondé Voisilab pour rendre ces technologies accessibles à tous.",
      image: "/team-director-fablab-expert-portrait.jpg",
      email: "pierre@voisilab.fr",
      linkedin: "#",
      gradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      name: "Sophie Martin",
      role: "Responsable Formations",
      bio: "Ingénieure de formation, Sophie anime les ateliers et forme les makers aux différentes machines du fablab.",
      image: "/team-training-manager-engineer-woman-portrait.jpg",
      email: "sophie@voisilab.fr",
      linkedin: "#",
      gradient: "from-purple-500/10 to-pink-500/10",
    },
    {
      name: "Karim Benali",
      role: "FabManager & Tech Lead",
      bio: "Expert en impression 3D et électronique, Karim accompagne les projets techniques les plus ambitieux.",
      image: "/team-fabmanager-tech-expert-man-portrait.jpg",
      email: "karim@voisilab.fr",
      linkedin: "#",
      gradient: "from-green-500/10 to-emerald-500/10",
    },
  ]

  const youngTalents = [
    {
      name: "Léa Rousseau",
      age: 22,
      speciality: "Design & Impression 3D",
      achievement: "Créatrice de la collection de bijoux 'Parametric Dreams'",
      image: "/young-talent-designer-3d-printing-woman.jpg",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      name: "Malik Diallo",
      age: 19,
      speciality: "Robotique & IoT",
      achievement: "Développeur du robot éducatif open-source 'RoboLearn'",
      image: "/young-talent-robotics-iot-developer-man.jpg",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      name: "Camille Lefebvre",
      age: 24,
      speciality: "Laser & Menuiserie",
      achievement: "Designer du mobilier modulaire en bois recyclé",
      image: "/young-talent-laser-woodworking-designer.jpg",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      name: "Rayan Ahmed",
      age: 20,
      speciality: "Électronique & Programmation",
      achievement: "Créateur de la station météo connectée DIY",
      image: "/young-talent-electronics-programming-student.jpg",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ]

  const teamStats = [
    { icon: Users, value: "12+", label: "Membres actifs", gradient: "from-blue-500/10 to-cyan-500/10" },
    { icon: Award, value: "150+", label: "Projets accompagnés", gradient: "from-purple-500/10 to-pink-500/10" },
    { icon: Trophy, value: "50+", label: "Ateliers animés", gradient: "from-green-500/10 to-emerald-500/10" },
    { icon: Star, value: "98%", label: "Satisfaction", gradient: "from-orange-500/10 to-red-500/10" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
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
              <PageBreadcrumb pageTitle="Notre équipe" />
            </div>

            <div className="max-w-4xl mx-auto text-center fade-in-up">
              <Badge className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Une équipe passionnée
              </Badge>

              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
                <span className="block">Rencontrez les talents</span>
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  de Voisilab
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto">
                Des experts passionnés et des jeunes talents prometteurs, tous dédiés à votre accompagnement
                dans vos projets de fabrication numérique.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300"
                  asChild
                >
                  <Link href="/contact">
                    <span className="relative z-10 flex items-center gap-2">
                      Rejoignez-nous
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-black border-white/30 hover:bg-white/10 backdrop-blur-sm"
                  asChild
                >
                  <Link href="/projet">Soumettre un projet</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Team Stats */}
      <section className="py-12 lg:py-16 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto">
            {teamStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <Card className={`relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 group h-full bg-gradient-to-br ${stat.gradient}`}>
                    <CardContent className="p-6 lg:p-8 text-center">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>

                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Icon className="text-primary" size={32} />
                      </div>

                      <div className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Core Team */}
      <section className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            title="L'équipe Voisilab"
            subtitle="Des passionnés dédiés à votre accompagnement dans vos projets de fabrication numérique"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {coreTeam.map((member, index) => (
              <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className={`relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 group h-full bg-gradient-to-br ${member.gradient}`}>
                  {/* Image Section */}
                  <div className="relative h-64 lg:h-72 overflow-hidden">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Social Links Overlay */}
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a
                        href={`mailto:${member.email}`}
                        className="w-10 h-10 bg-white/90 dark:bg-background/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-lg"
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail size={18} />
                      </a>
                      <a
                        href={member.linkedin}
                        className="w-10 h-10 bg-white/90 dark:bg-background/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-lg"
                        aria-label={`LinkedIn ${member.name}`}
                      >
                        <Linkedin size={18} />
                      </a>
                    </div>
                  </div>

                  {/* Content Section */}
                  <CardContent className="p-6 lg:p-8">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>

                    <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2">{member.name}</h3>
                    <Badge variant="secondary" className="mb-4">
                      {member.role}
                    </Badge>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Young Talents */}
      <section className="py-20 lg:py-32 bg-muted/30 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            title="Jeunes Talents"
            subtitle="Découvrez les makers prometteurs qui repoussent les limites de la créativité et de l'innovation"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {youngTalents.map((talent, index) => (
              <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className="relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 group h-full">
                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={talent.image || "/placeholder.svg"}
                      alt={talent.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Age Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className={`${talent.bgColor} ${talent.color} border-none backdrop-blur-sm px-3 py-1.5 font-bold`}>
                        {talent.age} ans
                      </Badge>
                    </div>

                    {/* Star Icon */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-10 h-10 bg-primary/90 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Star className="text-primary-foreground fill-current" size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-1">{talent.name}</h3>
                    <p className={`text-xs font-semibold mb-3 ${talent.color}`}>
                      {talent.speciality}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {talent.achievement}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto fade-in-up">
            <Card className="border-2 border-primary/30 shadow-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
              <CardContent className="p-10 lg:p-16 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Rocket className="text-primary" size={40} />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  Rejoignez la communauté Voisilab
                </h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                  Vous êtes étudiant, maker ou simplement curieux ? Venez développer vos compétences et réaliser vos
                  projets au sein de notre fablab. Nous accueillons tous les profils avec la même passion !
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-2xl transition-all duration-300"
                    asChild
                  >
                    <Link href="/contact">
                      <span className="relative z-10 flex items-center gap-2">
                        <Users className="group-hover:scale-110 transition-transform" size={20} />
                        Nous rejoindre
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/about">
                      En savoir plus
                      <ArrowRight className="ml-2" size={20} />
                    </Link>
                  </Button>
                </div>

                {/* Benefits Pills */}
                <div className="flex flex-wrap gap-3 justify-center mt-8 pt-8 border-t border-border">
                  <Badge variant="outline" className="px-4 py-2">
                    <Target className="w-4 h-4 mr-2" />
                    Accompagnement personnalisé
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Award className="w-4 h-4 mr-2" />
                    Formation continue
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Zap className="w-4 h-4 mr-2" />
                    Accès aux équipements
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
