"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  ArrowRight,
  Printer,
  CodeXml,
  Bot,
  Palette,
  Code,
  Package,
  CheckCircle2,
  Send,
  Play,
  Quote,
  Star,
  Users,
  Award,
  Zap,
  Target,
  ChevronDown,
  Download,
  Phone,
  Mail,
  Clock,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const services = [
  {
    id: "impression-3d",
    icon: Printer,
    title: "Impression 2D/3D",
    tagline: "De l'idée au prototype en quelques heures",
    description: "Transformez vos concepts en objets physiques grâce à nos imprimantes 3D professionnelles. Du prototypage rapide à la production de petites séries, nous maîtrisons toutes les technologies d'impression additive.",
    longDescription: "Notre service d'impression 3D couvre l'ensemble du processus de fabrication : de la modélisation 3D à la post-production. Nous travaillons avec plusieurs technologies (FDM, SLA, SLS) et une large gamme de matériaux pour répondre à tous vos besoins, qu'il s'agisse de prototypes fonctionnels, de maquettes architecturales ou de pièces finies.",
    features: [
      {
        title: "Technologies multiples",
        description: "FDM pour les prototypes fonctionnels, SLA pour les détails précis, SLS pour les pièces mécaniques"
      },
      {
        title: "Matériaux variés",
        description: "PLA, ABS, PETG, résines techniques, nylon, matériaux flexibles et composites"
      },
      {
        title: "Finitions professionnelles",
        description: "Ponçage, peinture, polissage, assemblage et post-traitement sur demande"
      },
      {
        title: "Accompagnement complet",
        description: "De la conception 3D à l'optimisation pour l'impression, notre équipe vous guide"
      }
    ],
    useCases: [
      "Prototypage rapide de produits",
      "Pièces de rechange sur mesure",
      "Maquettes architecturales",
      "Objets personnalisés et cadeaux",
      "Outillages et gabarits",
      "Prothèses et orthèses médicales"
    ],
    pricing: {
      starting: "5 000 FCFA",
      details: "Tarif à partir de 5 000 FCFA selon la complexité, le volume et le matériau"
    },
    process: [
      { step: 1, title: "Consultation", desc: "Discussion de votre projet et analyse de faisabilité" },
      { step: 2, title: "Modélisation", desc: "Création ou optimisation du fichier 3D" },
      { step: 3, title: "Validation", desc: "Aperçu du rendu et validation du devis" },
      { step: 4, title: "Impression", desc: "Lancement de l'impression avec suivi en temps réel" },
      { step: 5, title: "Finitions", desc: "Post-traitement et contrôle qualité" },
      { step: 6, title: "Livraison", desc: "Récupération ou envoi de votre pièce terminée" }
    ],
    gradient: "from-blue-500/10 to-cyan-500/10",
    gradientFull: "from-blue-500 to-cyan-500",
    image: "https://mecaluxfr.cdnwm.com/blog/img/fabrication-additive-production.1.1.jpg?imwidth=320&imdensity=1",
    gallery: [
      "https://mecaluxfr.cdnwm.com/blog/img/fabrication-additive-production.1.1.jpg?imwidth=320&imdensity=1",
      "/banner1.jpg",
      "/banner2.jpg"
    ],
    stats: [
      { label: "Projets imprimés", value: "500+", icon: Award },
      { label: "Matériaux", value: "15+", icon: Package },
      { label: "Délai moyen", value: "48h", icon: Clock }
    ]
  },
  {
    id: "architecture-dev-digital",
    icon: CodeXml,
    title: "Architecture & Dev Digital",
    tagline: "Solutions logicielles sur mesure et performantes",
    description: "Conception et déploiement de solutions logicielles performantes, optimisées pour vos besoins métiers. De l'application mobile à la plateforme web complexe, nous créons des solutions digitales robustes.",
    longDescription: "Notre équipe d'architectes logiciels et de développeurs expérimentés conçoit des solutions digitales évolutives et performantes. Nous maîtrisons les dernières technologies et méthodologies agiles pour livrer des applications web, mobiles et cloud adaptées à vos besoins spécifiques.",
    features: [
      {
        title: "Architecture évolutive",
        description: "Conception de systèmes scalables avec microservices, API REST et architectures cloud-native"
      },
      {
        title: "Technologies modernes",
        description: "React, Next.js, Node.js, Python, TypeScript, PostgreSQL, MongoDB et plus encore"
      },
      {
        title: "DevOps & CI/CD",
        description: "Automatisation des déploiements, monitoring et infrastructure as code"
      },
      {
        title: "Sécurité renforcée",
        description: "Authentification, chiffrement, conformité RGPD et audits de sécurité"
      }
    ],
    useCases: [
      "Applications web et mobile",
      "Plateformes e-commerce",
      "Systèmes de gestion (ERP, CRM)",
      "API et intégrations tierces",
      "Solutions cloud et SaaS",
      "Transformation digitale"
    ],
    pricing: {
      starting: "Sur devis",
      details: "Tarification adaptée selon la complexité et la durée du projet"
    },
    process: [
      { step: 1, title: "Audit", desc: "Analyse de vos besoins et de l'existant" },
      { step: 2, title: "Architecture", desc: "Conception de l'architecture technique" },
      { step: 3, title: "Développement", desc: "Sprints agiles avec démos régulières" },
      { step: 4, title: "Tests", desc: "Tests unitaires, d'intégration et de charge" },
      { step: 5, title: "Déploiement", desc: "Mise en production progressive" },
      { step: 6, title: "Support", desc: "Maintenance et évolutions continues" }
    ],
    gradient: "from-purple-500/10 to-pink-500/10",
    gradientFull: "from-purple-500 to-pink-500",
    image: "https://media.vertuoz.fr/uploads/Article_Quels_sont_les_avantages_d_un_developpement_informatique_sur_mesure_66c3ed4303.jpeg",
    gallery: [
      "https://media.vertuoz.fr/uploads/Article_Quels_sont_les_avantages_d_un_developpement_informatique_sur_mesure_66c3ed4303.jpeg",
      "/banner1.jpg",
      "/banner2.jpg"
    ],
    stats: [
      { label: "Projets livrés", value: "50+", icon: Award },
      { label: "Technologies", value: "20+", icon: Code },
      { label: "Disponibilité", value: "99.9%", icon: Shield }
    ]
  },
  {
    id: "robotique",
    icon: Bot,
    title: "Robotique",
    tagline: "Conception de robots pour applications variées",
    description: "Conception et programmation de robots pour des applications variées : éducation, automatisation industrielle et projets sur mesure.",
    longDescription: "Notre service de robotique couvre la conception mécanique, électronique et logicielle de systèmes robotiques. Des robots éducatifs aux solutions d'automatisation industrielle, nous développons des solutions innovantes adaptées à vos besoins.",
    features: [
      {
        title: "Conception mécanique",
        description: "Modélisation 3D, simulation et fabrication de châssis sur mesure"
      },
      {
        title: "Électronique embarquée",
        description: "Circuits de contrôle, capteurs, actionneurs et systèmes de puissance"
      },
      {
        title: "Programmation",
        description: "Algorithmes de contrôle, vision par ordinateur et intelligence artificielle"
      },
      {
        title: "Intégration complète",
        description: "Tests en conditions réelles et documentation technique détaillée"
      }
    ],
    useCases: [
      "Robots éducatifs (kits pédagogiques)",
      "Automatisation de process",
      "Drones personnalisés",
      "Bras robotiques",
      "Robots mobiles autonomes",
      "Prototypes de recherche"
    ],
    pricing: {
      starting: "Sur devis",
      details: "Tarification selon la complexité mécanique, électronique et logicielle"
    },
    process: [
      { step: 1, title: "Cahier des charges", desc: "Définition des besoins fonctionnels" },
      { step: 2, title: "Conception", desc: "Design mécanique et électronique" },
      { step: 3, title: "Prototypage", desc: "Fabrication du premier prototype" },
      { step: 4, title: "Programmation", desc: "Développement des algorithmes de contrôle" },
      { step: 5, title: "Tests", desc: "Validation en conditions réelles" },
      { step: 6, title: "Livraison", desc: "Remise avec formation et documentation" }
    ],
    gradient: "from-yellow-500/10 to-orange-500/10",
    gradientFull: "from-yellow-500 to-orange-500",
    image: "https://www.aq-tech.fr/fr/wp-content/uploads/sites/5/2022/12/Diff%C3%A9rents-types-de-prototype-700x700.jpg",
    gallery: [
      "https://www.aq-tech.fr/fr/wp-content/uploads/sites/5/2022/12/Diff%C3%A9rents-types-de-prototype-700x700.jpg",
      "/banner1.jpg",
      "/banner2.jpg"
    ],
    stats: [
      { label: "Robots créés", value: "30+", icon: Bot },
      { label: "Projets R&D", value: "15+", icon: TrendingUp },
      { label: "Satisfaction", value: "100%", icon: Star }
    ]
  },
  {
    id: "design-graphique",
    icon: Palette,
    title: "Design graphique & Conception visuelle",
    tagline: "Créations visuelles uniques et impactantes",
    description: "Création d'identités visuelles uniques, de supports marketing et de designs modernes pour vos projets. Du logo à la charte graphique complète.",
    longDescription: "Notre studio de design graphique transforme vos idées en visuels percutants. Nous créons des identités de marque cohérentes, des supports de communication modernes et des interfaces utilisateur élégantes pour renforcer votre image et séduire votre audience.",
    features: [
      {
        title: "Identité visuelle",
        description: "Logos, chartes graphiques, typographies et palettes de couleurs sur mesure"
      },
      {
        title: "Supports print",
        description: "Flyers, affiches, brochures, cartes de visite et packaging"
      },
      {
        title: "Design digital",
        description: "Bannières web, réseaux sociaux, newsletters et assets numériques"
      },
      {
        title: "UX/UI Design",
        description: "Maquettes d'applications et sites web centrées sur l'utilisateur"
      }
    ],
    useCases: [
      "Création de logo et branding",
      "Chartes graphiques complètes",
      "Supports publicitaires (print & digital)",
      "Illustrations personnalisées",
      "Maquettes UI/UX",
      "Motion design et vidéos"
    ],
    pricing: {
      starting: "15 000 FCFA",
      details: "Tarif à partir de 15 000 FCFA selon le type de création et les déclinaisons"
    },
    process: [
      { step: 1, title: "Brief créatif", desc: "Compréhension de votre univers et objectifs" },
      { step: 2, title: "Recherches", desc: "Moodboards et exploration graphique" },
      { step: 3, title: "Propositions", desc: "Présentation de 2-3 pistes créatives" },
      { step: 4, title: "Itérations", desc: "Affinement selon vos retours" },
      { step: 5, title: "Finalisation", desc: "Livraison des fichiers sources" },
      { step: 6, title: "Déclinaisons", desc: "Adaptations sur différents supports" }
    ],
    gradient: "from-indigo-500/10 to-purple-500/10",
    gradientFull: "from-indigo-500 to-purple-500",
    image: "https://www.canadafrancais.com/wp-content/uploads/sites/11/2018/08/CanadaFrancais.com-informe16.jpg",
    gallery: [
      "https://www.canadafrancais.com/wp-content/uploads/sites/11/2018/08/CanadaFrancais.com-informe16.jpg",
      "/banner1.jpg",
      "/banner2.jpg"
    ],
    stats: [
      { label: "Créations", value: "200+", icon: Palette },
      { label: "Clients satisfaits", value: "80+", icon: Users },
      { label: "Prix remportés", value: "5", icon: Award }
    ]
  },
  {
    id: "electronique-iot",
    icon: Code,
    title: "Électronique & IoT",
    tagline: "Objets connectés et solutions embarquées",
    description: "Développement de solutions connectées avec Arduino, Raspberry Pi et ESP32. Circuits imprimés, objets connectés et systèmes domotiques.",
    longDescription: "Notre expertise en électronique et IoT permet de créer des objets connectés intelligents et des systèmes embarqués performants. De la conception de circuits imprimés à la programmation de microcontrôleurs, nous développons des solutions sur mesure.",
    features: [
      {
        title: "Conception de PCB",
        description: "Design de circuits imprimés professionnels avec logiciels CAO"
      },
      {
        title: "Programmation embarquée",
        description: "Arduino, ESP32, Raspberry Pi et microcontrôleurs STM32"
      },
      {
        title: "Connectivité",
        description: "Wi-Fi, Bluetooth, LoRaWAN, MQTT et protocoles IoT"
      },
      {
        title: "Capteurs & actuateurs",
        description: "Intégration de capteurs environnementaux et contrôle d'actionneurs"
      }
    ],
    useCases: [
      "Stations météo connectées",
      "Systèmes domotiques",
      "Monitoring industriel",
      "Agriculture intelligente",
      "Wearables et trackers",
      "Prototypes IoT"
    ],
    pricing: {
      starting: "20 000 FCFA",
      details: "Tarif à partir de 20 000 FCFA selon la complexité électronique et logicielle"
    },
    process: [
      { step: 1, title: "Spécifications", desc: "Définition des contraintes techniques" },
      { step: 2, title: "Schématique", desc: "Conception du circuit électronique" },
      { step: 3, title: "PCB Design", desc: "Routage et fabrication du circuit imprimé" },
      { step: 4, title: "Firmware", desc: "Programmation du microcontrôleur" },
      { step: 5, title: "Assemblage", desc: "Soudure et montage des composants" },
      { step: 6, title: "Tests", desc: "Validation et calibration" }
    ],
    gradient: "from-orange-500/10 to-red-500/10",
    gradientFull: "from-orange-500 to-red-500",
    image: "https://www.business-solutions-atlantic-france.com/wp-content/webp-express/webp-images/uploads/2019/04/electronique_professionnelle-1160x652.png.webp",
    gallery: [
      "https://www.business-solutions-atlantic-france.com/wp-content/webp-express/webp-images/uploads/2019/04/electronique_professionnelle-1160x652.png.webp",
      "/banner1.jpg",
      "/banner2.jpg"
    ],
    stats: [
      { label: "Projets IoT", value: "40+", icon: Code },
      { label: "Capteurs intégrés", value: "100+", icon: Zap },
      { label: "Uptime", value: "99%", icon: Shield }
    ]
  },
  {
    id: "prototypage-complet",
    icon: Package,
    title: "Prototypage complet",
    tagline: "De l'idée au prototype final en un seul endroit",
    description: "De l'idée au prototype final, nous vous accompagnons dans tout le processus : étude de faisabilité, tests, itérations et finitions professionnelles.",
    longDescription: "Notre service de prototypage complet combine toutes nos expertises pour transformer votre idée en prototype fonctionnel. Nous gérons l'ensemble du processus, de la conception initiale aux tests finaux, en passant par la fabrication et les itérations.",
    features: [
      {
        title: "Étude de faisabilité",
        description: "Analyse technique, veille technologique et recommandations"
      },
      {
        title: "Conception intégrée",
        description: "Mécanique, électronique, software et design industriel"
      },
      {
        title: "Prototypage rapide",
        description: "Fabrication agile avec itérations successives"
      },
      {
        title: "Tests & validation",
        description: "Essais fonctionnels, tests utilisateurs et optimisations"
      }
    ],
    useCases: [
      "Produits innovants (MVP)",
      "Prototypes pour levées de fonds",
      "Validation de concepts",
      "Préséries industrielles",
      "Projets de recherche",
      "Concours et compétitions"
    ],
    pricing: {
      starting: "Sur devis",
      details: "Tarification globale incluant toutes les étapes du prototypage"
    },
    process: [
      { step: 1, title: "Idéation", desc: "Brainstorming et définition du concept" },
      { step: 2, title: "Faisabilité", desc: "Étude technique et financière" },
      { step: 3, title: "Conception", desc: "Design complet et simulations" },
      { step: 4, title: "Prototype V1", desc: "Première version fonctionnelle" },
      { step: 5, title: "Itérations", desc: "Améliorations basées sur les tests" },
      { step: 6, title: "Prototype final", desc: "Version optimisée et documentée" }
    ],
    gradient: "from-cyan-500/10 to-blue-500/10",
    gradientFull: "from-cyan-500 to-blue-500",
    image: "https://assets.justinmind.com/wp-content/uploads/2021/01/paper-prototyping-cutouts.png",
    gallery: [
      "https://assets.justinmind.com/wp-content/uploads/2021/01/paper-prototyping-cutouts.png",
      "/banner1.jpg",
      "/banner2.jpg"
    ],
    stats: [
      { label: "Prototypes créés", value: "100+", icon: Package },
      { label: "Taux de réussite", value: "95%", icon: Target },
      { label: "Délai moyen", value: "6 sem", icon: Clock }
    ]
  }
]

const testimonials = [
  {
    name: "Marie Dupont",
    role: "CEO, TechStart",
    service: "Prototypage complet",
    content: "L'équipe de Voisilab a transformé notre concept en prototype fonctionnel en seulement 4 semaines. Leur expertise et leur réactivité nous ont permis de lever des fonds rapidement.",
    rating: 5,
    avatar: "M"
  },
  {
    name: "Alexandre Konan",
    role: "Designer produit",
    service: "Impression 3D",
    content: "Service d'impression 3D au top ! Qualité professionnelle, délais respectés et conseils précieux pour optimiser mes fichiers. Je recommande à 100%.",
    rating: 5,
    avatar: "A"
  },
  {
    name: "Sarah Bah",
    role: "Startup AgriTech",
    service: "Électronique & IoT",
    content: "Notre système de monitoring agricole a été développé de A à Z par Voisilab. Leur expertise en IoT et leur accompagnement ont été essentiels pour notre projet.",
    rating: 5,
    avatar: "S"
  }
]

export default function ServicePage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"features" | "process" | "pricing">("features")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Demande de devis:", formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: "", email: "", phone: "", service: "", message: "" })
    }, 5000)
  }

  const currentService = services.find((s) => s.id === selectedService)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
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
              🛠️ Nos Services
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Solutions de{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                fabrication numérique
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              De l'impression 3D au développement logiciel, découvrez nos services pour
              concrétiser vos projets avec expertise et innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 lg:py-20 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card
                  key={service.id}
                  className="relative overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 group cursor-pointer"
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradientFull}`} />
                  
                  {/* Image de fond */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="text-primary" size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-sm text-primary font-medium mb-3">{service.tagline}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-primary">{service.pricing.starting}</span>
                      <Button size="sm" variant="ghost" className="group/btn">
                        En savoir plus
                        <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      {currentService && (
        <section className="py-12 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Header du service */}
              <div className="mb-12">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedService(null)}
                  className="mb-6"
                >
                  ← Retour aux services
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      {React.createElement(currentService.icon, {
                        className: "text-primary",
                        size: 48,
                      })}
                      <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                        {currentService.title}
                      </h2>
                    </div>
                    <p className="text-xl text-primary font-semibold mb-4">
                      {currentService.tagline}
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {currentService.longDescription}
                    </p>
                  </div>

                  <div className="relative h-80 rounded-2xl overflow-hidden border-2 border-border">
                    <Image
                      src={currentService.image}
                      alt={currentService.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {currentService.stats.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                      <Card key={i} className="border-2 border-border">
                        <CardContent className="p-6 text-center">
                          <Icon className="text-primary mx-auto mb-2" size={32} />
                          <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                          <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-8">
                <div className="flex gap-2 border-b border-border">
                  {[
                    { id: "features", label: "Caractéristiques" },
                    { id: "process", label: "Processus" },
                    { id: "pricing", label: "Tarifs" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-6 py-3 font-medium transition-all ${
                        activeTab === tab.id
                          ? "text-primary border-b-2 border-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="mb-12">
                {activeTab === "features" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentService.features.map((feature, i) => (
                      <Card key={i} className="border-2 border-border hover:border-primary/50 transition-all">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                            <CheckCircle2 className="text-primary" size={20} />
                            {feature.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}

                    <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 md:col-span-2">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-foreground mb-4">Cas d'usage</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {currentService.useCases.map((useCase, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                              <CheckCircle2 className="text-primary flex-shrink-0" size={16} />
                              {useCase}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === "process" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentService.process.map((step, i) => (
                      <Card key={i} className="border-2 border-border hover:border-primary/50 transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                              {step.step}
                            </div>
                            <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {activeTab === "pricing" && (
                  <Card className="border-2 border-border max-w-2xl mx-auto">
                    <CardContent className="p-12 text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Target className="text-primary" size={32} />
                      </div>
                      <h3 className="text-3xl font-bold text-foreground mb-4">
                        À partir de {currentService.pricing.starting}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-8">
                        {currentService.pricing.details}
                      </p>
                      <Button size="lg" className="group" onClick={() => {
                        setFormData({ ...formData, service: currentService.title })
                        document.getElementById("devis")?.scrollIntoView({ behavior: "smooth" })
                      }}>
                        Demander un devis gratuit
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Badge className="mb-6 px-5 py-2 bg-primary/10 text-primary border-none font-medium">
              💬 Témoignages
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Ce que disent nos clients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="border-2 border-border hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <Quote className="text-primary/20 mb-4" size={40} />
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="fill-primary text-primary" size={16} />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <Badge variant="secondary" className="mb-4">{testimonial.service}</Badge>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Devis Form */}
      <section id="devis" className="py-12 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-6 px-5 py-2 bg-primary/10 text-primary border-none font-medium">
                📝 Devis gratuit
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Demandez votre devis personnalisé
              </h2>
              <p className="text-lg text-muted-foreground">
                Remplissez le formulaire et recevez une réponse sous 48h
              </p>
            </div>

            <Card className="border-2 border-border">
              <CardContent className="p-8">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 size={32} className="text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Demande envoyée !</h3>
                    <p className="text-muted-foreground max-w-md">
                      Merci pour votre demande. Notre équipe vous contactera sous 48h pour discuter de votre projet.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-foreground mb-2 block">
                          Nom complet *
                        </Label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all"
                          placeholder="Jean Dupont"
                        />
                      </div>
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
                          className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all"
                          placeholder="jean@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className="text-foreground mb-2 block">
                          Téléphone
                        </Label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all"
                          placeholder="+225 00 00 00 00 00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="service" className="text-foreground mb-2 block">
                          Service souhaité *
                        </Label>
                        <select
                          id="service"
                          name="service"
                          required
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground transition-all"
                        >
                          <option value="">Sélectionnez un service</option>
                          {services.map((service) => (
                            <option key={service.id} value={service.title}>
                              {service.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-foreground mb-2 block">
                        Décrivez votre projet *
                      </Label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground resize-none transition-all"
                        placeholder="Décrivez votre projet, vos besoins et vos objectifs..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-primary to-accent"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Send size={20} />
                        Envoyer ma demande
                      </span>
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      En soumettant ce formulaire, vous acceptez notre{" "}
                      <Link href="/confidentialite" className="text-primary hover:underline">
                        politique de confidentialité
                      </Link>
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 max-w-4xl mx-auto">
            <CardContent className="p-12 text-center">
              <Sparkles className="text-primary mx-auto mb-6" size={48} />
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Prêt à démarrer votre projet ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Notre équipe d'experts est à votre écoute pour transformer vos idées en réalité
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group" asChild>
                  <Link href="#devis">
                    Demander un devis
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">
                    <Phone className="mr-2" size={20} />
                    Nous contacter
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