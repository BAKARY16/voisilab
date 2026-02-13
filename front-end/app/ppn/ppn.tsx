"use client"

import type React from "react"
import Link from "next/link"
import PageBreadcrumb from "@/components/PageBreadCrumb"
import { SectionHeader } from "../../components/section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle2,
  Send,
  Mail,
  Phone,
  MapPin,
  Clock,
  Zap,
  ArrowRight,
  Radio,
  Wheat,
  Cpu,
  GraduationCap,
  Users,
  Globe,
  Building2,
  Target,
  Rocket,
  Heart,
  Sparkles,
  Network,
  BookOpen,
  Factory,
  Home,
  Search,
  Filter,
  Map,
  Calendar,
  Award,
  TrendingUp,
  Wifi,
  Monitor,
  Briefcase,
  ChevronRight,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import dynamic from "next/dynamic"
import "@/map/ppn-map.css"
import { getAllPPN } from "@/lib/api/ppn.service"

// Import dynamique SANS SSR
const PPNMap = dynamic(
  () => import("@/map/ppn-map").then(mod => ({ default: mod.PPNMap })),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-muted animate-pulse rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de la carte...</p>
        </div>
      </div>
    )
  }
)

// Types
interface PPNLocation {
  id: string
  name: string
  city: string
  region: string
  address: string
  type: "Urban" | "Rural" | "Mixed"
  coordinates: { lat: number; lng: number }
  services: string[]
  email: string
  phone: string
  manager: string
  openingYear: number
  status: "active" | "construction" | "planned"
  image?: string
}

export function PPN() {
  useScrollAnimation()

  const [submitted, setSubmitted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    email: "",
    phone: "",
    ppnLocation: "",
    ppnInterest: "",
    description: "",
  })
  const [selectedPPN, setSelectedPPN] = useState<string | null>(null)
  const [ppnLocations, setPpnLocations] = useState<PPNLocation[]>([])
  const [loading, setLoading] = useState(true)

  // Charger les données PPN depuis l'API
  useEffect(() => {
    const fetchPPNData = async () => {
      try {
        setLoading(true)
        console.log('🔍 Chargement des PPN depuis l\'API...')
        const data = await getAllPPN()
        console.log('✅ Données reçues:', data)
        console.log('📊 Nombre de PPN:', data?.length)
        
        // Transformation des données API vers le format attendu
        const transformedData: PPNLocation[] = data.map((ppn: any) => ({
          id: ppn.id,
          name: ppn.name,
          city: ppn.city,
          region: ppn.region,
          address: ppn.address,
          type: ppn.type,
          coordinates: {
            lat: parseFloat(ppn.latitude),
            lng: parseFloat(ppn.longitude),
          },
          services: ppn.services ? ppn.services.split(', ') : [],
          email: ppn.email || '',
          phone: ppn.phone || '',
          manager: ppn.manager || '',
          openingYear: ppn.opening_year || new Date().getFullYear(),
          status: ppn.status,
          image: ppn.image,
        }))
        console.log('🔄 Données transformées:', transformedData)
        setPpnLocations(transformedData)
      } catch (error) {
        console.error('❌ Erreur lors du chargement des PPN:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPPNData()
  }, [])

  const regions = Array.from(new Set(ppnLocations.map(ppn => ppn.region)))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("PPN request submitted:", formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        lastname: "",
        firstname: "",
        email: "",
        phone: "",
        ppnLocation: "",
        ppnInterest: "",
        description: "",
      })
    }, 20000)
  }

  // Filtrage des PPN
  const filteredPPNs = ppnLocations.filter(ppn => {
    const matchesSearch = ppn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ppn.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ppn.region.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || ppn.type === selectedType
    const matchesRegion = selectedRegion === "all" || ppn.region === selectedRegion
    return matchesSearch && matchesType && matchesRegion
  })

  const ppnStats = [
    {
      icon: Network,
      value: ppnLocations.length.toString(),
      label: "Points de Présence",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Users,
      value: "8000+",
      label: "Bénéficiaires formés",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: GraduationCap,
      value: "75+",
      label: "Formations disponibles",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: Globe,
      value: regions.length.toString(),
      label: "Régions couvertes",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ]

  const whatIsPPN = [
    {
      icon: Network,
      title: "Qu'est-ce qu'un PPN ?",
      description: "Le Point de Présence Numérique (PPN) est un espace dédié à l'innovation, à la formation numérique et à l'entrepreneuriat technologique. Ce point de présence est équipé de matériels informatiques de dernière génération et sert de lieu d'apprentissage et d'expérimentation pour les apprenants et les passionnés de technologie.",
    },
    {
      icon: Target,
      title: "Notre Mission",
      description: "Étendre les services de l'UVCI au-delà des campus traditionnels en créant des points d'accès stratégiques dans toutes les régions du pays, pour que chaque citoyen puisse bénéficier de la révolution numérique.",
    },
    {
      icon: Rocket,
      title: "Notre Vision",
      description: "Faire de la Côte d'Ivoire un hub africain en matière d'inclusion numérique en créant un réseau national de centres d'innovation connectés et performants.",
    },
  ]

  const ppnRoles = [
    {
      icon: GraduationCap,
      title: "Formation & Éducation",
      points: [
        "Formations en bureautique et informatique de base",
        "Programmation et développement web",
        "Marketing digital et e-commerce",
        "Design graphique et multimédia",
        "Certifications professionnelles reconnues",
      ],
    },
    {
      icon: Wheat,
      title: "Agriculture Intelligente",
      points: [
        "Techniques agricoles modernes",
        "Agriculture de précision avec IoT",
        "Gestion intelligente des cultures",
        "Transformation et valorisation des produits",
        "Entrepreneuriat agricole",
      ],
    },
    {
      icon: Cpu,
      title: "Innovation & Technologie",
      points: [
        "Espaces de coworking équipés",
        "Prototypage et fabrication numérique",
        "Accompagnement de startups",
        "Accès à internet haut débit",
        "Mentorat et networking",
      ],
    },
    {
      icon: Radio,
      title: "Médias & Communication",
      points: [
        "Radios communautaires",
        "Production de contenu éducatif",
        "Information locale et citoyenne",
        "Programmes culturels et débats",
        "Formation en journalisme digital",
      ],
    },
  ]

  const whyPPN = [
    {
      icon: Heart,
      title: "Inclusion Numérique",
      description: "Réduire la fracture numérique entre zones urbaines et rurales",
    },
    {
      icon: TrendingUp,
      title: "Développement Économique",
      description: "Créer des opportunités d'emploi et stimuler l'entrepreneuriat local",
    },
    {
      icon: BookOpen,
      title: "Éducation Pour Tous",
      description: "Rendre la formation de qualité accessible à tous les citoyens",
    },
    {
      icon: Sparkles,
      title: "Innovation Locale",
      description: "Encourager des solutions adaptées aux réalités locales",
    },
  ]

  const benefits = [
    "Accès gratuit aux formations de base",
    "Équipements modernes et performants",
    "Connexion internet haut débit",
    "Accompagnement personnalisé",
    "Certifications reconnues internationalement",
    "Réseau national de partenaires",
    "Opportunités de financement",
    "Événements et networking réguliers",
  ]

  return (
    <section className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative z-10 pt-8 pb-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center fade-in-up mb-8">
            <PageBreadcrumb pageTitle="PPN - Points de Présence Numérique" />
          </div>
        </div>

        {/* Hero Header */}
        <div className="container mx-auto px-4 lg:px-8 mb-20">
          <div className="max-w-4xl mx-auto text-center fade-in-up">
            {/* <Badge className="mb-6 px-4 py-2" variant="outline">
              <Network className="w-4 h-4 mr-2" />
              UVCI - Innovation Territoriale
            </Badge> */}
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black text-foreground mb-6 tracking-tight uppercase">
              Points de Présence
              <span className="block mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-primary">
                Numérique
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Un réseau national de <strong>{ppnLocations.length} centres d'innovation</strong> répartis sur tout le territoire ivoirien 
              pour démocratiser l'accès au numérique et accompagner le développement local.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="container mx-auto px-4 lg:px-8 mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto">
            {ppnStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <Card className="relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 group h-full">
                    <CardContent className="p-6 lg:p-8 text-center">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>
                      <div className={`w-16 h-16 ${stat.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <Icon className={`${stat.iconColor}`} size={32} />
                      </div>
                      <div className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                      <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>

        {/* Qu'est-ce qu'un PPN ? */}
        <div className="container mx-auto px-4 lg:px-8 mb-20">
          <SectionHeader
            title="Qu'est-ce qu'un PPN ?"
            subtitle="Comprendre le concept et la vision des Points de Présence Numérique"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {whatIsPPN.map((item, index) => {
              const Icon = item.icon
              return (
                <Card key={index} className="border-2 border-border hover:border-primary/50 transition-all group">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="text-primary" size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Rôles et Services des PPN */}
        <div className="container mx-auto px-4 lg:px-8 mb-20 bg-muted/30 py-16 rounded-3xl">
          <SectionHeader
            title="Rôles et Services"
            subtitle="Ce que nos Points de Présence Numérique offrent à la communauté"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {ppnRoles.map((role, index) => {
              const Icon = role.icon
              return (
                <Card key={index} className="border-2 border-border hover:border-primary/50 transition-all group">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="text-primary" size={28} />
                      </div>
                      <h3 className="text-2xl font-bold">{role.title}</h3>
                    </div>
                    <ul className="space-y-3">
                      {role.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="text-primary flex-shrink-0 mt-0.5" size={18} />
                          <span className="text-sm text-muted-foreground">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Pourquoi les PPN ? */}
        <div className="container mx-auto px-4 lg:px-8 mb-20">
          <SectionHeader
            title="Pourquoi les PPN ?"
            subtitle="L'impact des Points de Présence Numérique sur le développement"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {whyPPN.map((item, index) => {
              const Icon = item.icon
              return (
                <Card key={index} className="border-2 border-border hover:border-primary/50 transition-all group text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="text-primary" size={28} />
                    </div>
                    <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Carte et Liste des PPN */}
        <div className="border-t border-border pt-32 pb-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-16 text-center">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">Nos Implantations</h2>
                <p className="text-muted-foreground">
                  {ppnLocations.length} Points de Présence dans {regions.length} régions
                </p>
              </div>

              {/* Filtres minimalistes */}
              <div className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-11 border-border focus:border-foreground/20 transition-colors h-11"
                    />
                  </div>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-foreground/20 transition-colors text-sm h-11"
                  >
                    <option value="all">Tous les types</option>
                    <option value="Urban">Urbain</option>
                    <option value="Rural">Rural</option>
                    <option value="Mixed">Mixte</option>
                  </select>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-foreground/20 transition-colors text-sm h-11"
                  >
                    <option value="all">Toutes les régions</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tabs épurés */}
              <Tabs defaultValue="list" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto mb-12 bg-muted/50 p-1 h-11">
                  <TabsTrigger value="list" className="data-[state=active]:bg-background text-sm">
                    <Building2 className="w-4 h-4 mr-2" />
                    Liste
                  </TabsTrigger>
                  <TabsTrigger value="map" className="data-[state=active]:bg-background text-sm">
                    <Map className="w-4 h-4 mr-2" />
                    Carte
                  </TabsTrigger>
                </TabsList>

                {/* Liste des PPN - Design minimaliste */}
                <TabsContent value="list">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPPNs.map((ppn) => (
                      <Card 
                        key={ppn.id} 
                        className="border border-border hover:border-foreground/20 transition-all duration-300 overflow-hidden group"
                      >
                        <CardContent className="p-0">
                          {/* Header simplifié */}
                          <div className="p-6 border-b border-border bg-muted/20">
                            <div className="flex items-start justify-between mb-3">
                              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                                {ppn.type === "Urban" ? "Urbain" : ppn.type === "Rural" ? "Rural" : "Mixte"}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs text-green-600">
                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                                Actif
                              </span>
                            </div>
                            <h3 className="text-xl font-semibold mb-1.5 group-hover:text-primary transition-colors">
                              {ppn.name}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              {ppn.city}, {ppn.region}
                            </p>
                          </div>

                          {/* Contenu épuré */}
                          <div className="p-6">
                            <div className="space-y-3.5 text-sm mb-6">
                              <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <span className="text-muted-foreground leading-snug">{ppn.address}</span>
                              </div>

                              <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <a 
                                  href={`mailto:${ppn.email}`} 
                                  className="text-foreground hover:text-primary transition-colors truncate"
                                >
                                  {ppn.email}
                                </a>
                              </div>

                              {/* <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <a 
                                  href={`tel:${ppn.phone}`} 
                                  className="text-foreground hover:text-primary transition-colors"
                                >
                                  {ppn.phone}
                                </a>
                              </div> */}

                              {/* <div className="flex items-center gap-3">
                                <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground">{ppn.manager}</span>
                              </div> */}

                              <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground">Depuis {ppn.openingYear}</span>
                              </div>
                            </div>

                            {/* Services - Tags minimalistes */}
                            <div className="pt-4 border-t border-border mb-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Award className="w-4 h-4 text-muted-foreground" />
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                                  Services
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {ppn.services.slice(0, 3).map((service, idx) => (
                                  <span 
                                    key={idx} 
                                    className="text-xs px-2.5 py-1 bg-muted/50 rounded-md text-muted-foreground"
                                  >
                                    {service}
                                  </span>
                                ))}
                                {ppn.services.length > 3 && (
                                  <span className="text-xs px-2.5 py-1 bg-muted/50 rounded-md text-muted-foreground">
                                    +{ppn.services.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Bouton minimaliste */}
                            <Button 
                              variant="ghost" 
                              className="w-full cursor-pointer hover:text-green-600 justify-between group/btn border border-border hover:border-foreground/20 hover:bg-transparent h-10"
                              onClick={() => {
                                setSelectedPPN(ppn.id)
                                const mapTab = document.querySelector('[data-value="map"]') as HTMLElement | null
                                mapTab?.click()
                              }}
                            >
                              <span className="text-sm">Voir sur la carte</span>
                              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredPPNs.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-border rounded-xl">
                      <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun PPN trouvé avec ces critères.</p>
                    </div>
                  )}
                </TabsContent>

                {/* Carte interactive - Design épuré */}
                <TabsContent value="map">
                  <div className="border border-border rounded-xl overflow-hidden mb-6">
                    <PPNMap locations={filteredPPNs} selectedPPN={selectedPPN} />
                  </div>

                  {/* Stats sous la carte - Grid avec séparateurs */}
                  <div className="grid grid-cols-3 gap-px bg-border border border-border rounded-xl overflow-hidden">
                    <div className="bg-background p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                          Urbain
                        </span>
                      </div>
                      <span className="text-3xl font-bold">
                        {ppnLocations.filter(p => p.type === "Urban").length}
                      </span>
                    </div>

                    <div className="bg-background p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                          Rural
                        </span>
                      </div>
                      <span className="text-3xl font-bold">
                        {ppnLocations.filter(p => p.type === "Rural").length}
                      </span>
                    </div>

                    <div className="bg-background p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                          Mixte
                        </span>
                      </div>
                      <span className="text-3xl font-bold">
                        {ppnLocations.filter(p => p.type === "Mixed").length}
                      </span>
                    </div>
                  </div>

                  {/* Légende de la carte */}
                  <div className="mt-6 p-4 bg-muted/30 border border-border rounded-xl">
                    <div className="flex items-center justify-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-muted-foreground">PPN sélectionné</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-muted-foreground">Urbain</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-muted-foreground">Rural</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-muted-foreground">Mixte</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto fade-in-up">
            <Card className="border-2 border-primary/30 shadow-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
              <CardContent className="p-10 lg:p-16 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="text-primary" size={40} />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  Rejoignez le Réseau PPN UVCI
                </h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Ensemble, démocratisons l'accès au numérique et développons nos communautés à travers toute la Côte d'Ivoire.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="group cursor-pointer bg-gradient-to-r from-primary to-accent" asChild>
                    <Link href="https://uvci.online/portail/Main/index/fr"  target="_blank">
                      En savoir plus sur l'UVCI
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/ateliers">Voir nos formations</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export function PPNBanner() {
  return (
    <section className="relative pt-16 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
      <div className="absolute inset-0">
        <video src="/video.mp4" autoPlay loop muted className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"></div>
      </div>

      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center mb-8 fade-in-up">
            <PageBreadcrumb pageTitle="Points de Présence Numérique" />
          </div>

          <div className="max-w-4xl mx-auto text-center fade-in-up">
            <Badge className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" variant="outline">
              <Network className="w-4 h-4 mr-2" />
              UVCI - Réseau National
            </Badge>

            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-6 tracking-tight uppercase">
              <span className="block">Points de Présence</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Numérique
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto">
              22+ espaces d'innovation répartis sur tout le territoire ivoirien pour démocratiser 
              l'accès au numérique et accompagner le développement local.
            </p>

            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">22+</div>
                <div className="text-sm text-gray-300">Points actifs</div>
              </div>
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">5000+</div>
                <div className="text-sm text-gray-300">Bénéficiaires</div>
              </div>
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-gray-300">Formations</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
    </section>
  )
}