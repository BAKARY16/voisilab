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
import { useState } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import dynamic from "next/dynamic"
import "@/map/ppn-map.css"

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

  // Données complètes des PPN
  const ppnLocations: PPNLocation[] = [
    {
      id: "ppn-001",
      name: "PPN Cocody",
      city: "Abidjan",
      region: "Abidjan",
      address: "Collège Moderne lycée technique",
      type: "Urban",
      coordinates: { lat: 5.3599, lng: -4.0083 },
      services: ["Formation numérique", "Hub technologique", "Coworking", "Impression 3D"],
      email: "ppn.cocody@uvci.edu.ci",
      phone: "+225 27 21 30 45 55",
      manager: "Dr. ...",
      openingYear: 2019,
      status: "active",
    },
    {
      id: "ppn-002",
      name: "PPN Yopougon",
      city: "Abidjan",
      region: "Abidjan",
      address: "Niangon, Avenue principale",
      type: "Urban",
      coordinates: { lat: 5.3364, lng: -4.0819 },
      services: ["Formation numérique", "Radio communautaire", "Agriculture urbaine"],
      email: "ppn.yopougon@uvci.edu.ci",
      phone: "+225 27 20 00 00 02",
      manager: "Mme ...",
      openingYear: 2020,
      status: "active",
    },
    {
      id: "ppn-003",
      name: "PPN Abobo Sud",
      city: "Abidjan",
      region: "Abidjan",
      address: "Lycée Moderne 1 & 2 d'Abobo",
      type: "Urban",
      coordinates: { lat: 5.4159, lng: -4.0151 },
      services: ["Formation professionnelle", "Hub technologique", "E-commerce"],
      email: "ppn.abobo@uvci.edu.ci",
      phone: "+225 27 20 00 00 03",
      manager: "M. ...",
      openingYear: 2020,
      status: "active",
    },
    {
      id: "ppn-024",
      name: "PPN Abobo Nord",
      city: "Abidjan",
      region: "Abidjan",
      address: "CFC de l'Université Nangui Abrogoua",
      type: "Urban",
      coordinates: { lat: 5.4159, lng: -4.0151 },
      services: ["Formation professionnelle", "Hub technologique", "E-commerce"],
      email: "ppn.abobo@uvci.edu.ci",
      phone: "+225 27 20 00 00 03",
      manager: "M. ...",
      openingYear: 2020,
      status: "active",
    },
    {
      id: "ppn-004",
      name: "PPN Koumassi",
      city: "Abidjan",
      region: "Abidjan",
      address: "Eglise Saint Etienne de Koumassi",
      type: "Urban",
      coordinates: { lat: 5.2906, lng: -3.9486 },
      services: ["Formation numérique", "Entrepreneuriat", "Marketing digital"],
      email: "ppn.koumassi@uvci.edu.ci",
      phone: "+225 27 20 00 00 04",
      manager: "Mme ...",
      openingYear: 2021,
      status: "active",
    },
    {
      id: "ppn-005",
      name: "PPN Treichville",
      city: "Abidjan",
      region: "Abidjan",
      address: "Zone 4, Boulevard VGE",
      type: "Urban",
      coordinates: { lat: 5.2832, lng: -4.0037 },
      services: ["Coworking", "Formation web", "Design graphique"],
      email: "ppn.treichville@uvci.edu.ci",
      phone: "+225 27 20 00 00 05",
      manager: "M. ...",
      openingYear: 2021,
      status: "active",
    },
    {
      id: "ppn-006",
      name: "PPN Bouaké Centre",
      city: "Bouaké",
      region: "Vallée du Bandama",
      address: "Quartier Commerce, Avenue Houphouët",
      type: "Urban",
      coordinates: { lat: 7.6889, lng: -5.0305 },
      services: ["Formation numérique", "Hub technologique", "Agriculture intelligente"],
      email: "ppn.bouake@uvci.edu.ci",
      phone: "+225 27 20 00 01 01",
      manager: "Dr. ...",
      openingYear: 2019,
      status: "active",
    },
    {
      id: "ppn-007",
      name: "PPN Bouaké Koko",
      city: "Bouaké",
      region: "Vallée du Bandama",
      address: "Koko, près de l'université",
      type: "Urban",
      coordinates: { lat: 7.6950, lng: -5.0150 },
      services: ["Recherche & Innovation", "Formation agricole", "IoT"],
      email: "ppn.koko@uvci.edu.ci",
      phone: "+225 27 20 00 01 02",
      manager: "M. ...",
      openingYear: 2020,
      status: "active",
    },
    {
      id: "ppn-008",
      name: "PPN Bouaké Air France",
      city: "Bouaké",
      region: "Vallée du Bandama",
      address: "Air France 2000",
      type: "Mixed",
      coordinates: { lat: 7.7100, lng: -5.0400 },
      services: ["Formation professionnelle", "Radio communautaire"],
      email: "ppn.airfrance@uvci.edu.ci",
      phone: "+225 27 20 00 01 03",
      manager: "Mme ...",
      openingYear: 2022,
      status: "active",
    },
    {
      id: "ppn-009",
      name: "PPN Yamoussoukro",
      city: "Yamoussoukro",
      region: "Yamoussoukro",
      address: "Quartier Habitat, Route de Bouaké",
      type: "Urban",
      coordinates: { lat: 6.8184, lng: -5.2755 },
      services: ["Formation numérique", "Hub innovation", "Smart agriculture"],
      email: "ppn.yamoussoukro@uvci.edu.ci",
      phone: "+225 27 20 00 02 01",
      manager: "Dr. ...",
      openingYear: 2020,
      status: "active",
    },
    {
      id: "ppn-010",
      name: "PPN Yamoussoukro Université",
      city: "Yamoussoukro",
      region: "Yamoussoukro",
      address: "Campus universitaire",
      type: "Urban",
      coordinates: { lat: 6.9000, lng: -5.2600 },
      services: ["Recherche", "Innovation", "Fab Lab"],
      email: "ppn.yam.univ@uvci.edu.ci",
      phone: "+225 27 20 00 02 02",
      manager: "Prof. ...",
      openingYear: 2021,
      status: "active",
    },
    {
      id: "ppn-011",
      name: "PPN San-Pedro Centre",
      city: "San-Pedro",
      region: "San-Pedro",
      address: "Centre-ville, près du port",
      type: "Urban",
      coordinates: { lat: 4.7467, lng: -6.6363 },
      services: ["Formation maritime", "Hub technologique", "Agriculture côtière"],
      email: "ppn.sanpedro@uvci.edu.ci",
      phone: "+225 27 20 00 03 01",
      manager: "M. ...",
      openingYear: 2021,
      status: "active",
    },
    {
      id: "ppn-012",
      name: "PPN San-Pedro Balmer",
      city: "San-Pedro",
      region: "San-Pedro",
      address: "Quartier Balmer",
      type: "Rural",
      coordinates: { lat: 4.7300, lng: -6.6500 },
      services: ["Formation agricole", "Aquaculture", "Radio communautaire"],
      email: "ppn.balmer@uvci.edu.ci",
      phone: "+225 27 20 00 03 02",
      manager: "Mme ...",
      openingYear: 2022,
      status: "active",
    },
    {
      id: "ppn-013",
      name: "PPN Korhogo",
      city: "Korhogo",
      region: "Savanes",
      address: "Centre-ville, Avenue de la République",
      type: "Urban",
      coordinates: { lat: 9.4580, lng: -5.6296 },
      services: ["Formation numérique", "Textile & Design", "Agriculture"],
      email: "ppn.korhogo@uvci.edu.ci",
      phone: "+225 27 20 00 04 01",
      manager: "M. ...",
      openingYear: 2020,
      status: "active",
    },
    {
      id: "ppn-014",
      name: "PPN Korhogo Sinématiali",
      city: "Korhogo",
      region: "Savanes",
      address: "Sinématiali, zone rurale",
      type: "Rural",
      coordinates: { lat: 9.5700, lng: -5.3900 },
      services: ["Formation agricole", "Élevage intelligent", "Radio"],
      email: "ppn.sinematialy@uvci.edu.ci",
      phone: "+225 27 20 00 04 02",
      manager: "M. ...",
      openingYear: 2022,
      status: "active",
    },
    {
      id: "ppn-015",
      name: "PPN Daloa",
      city: "Daloa",
      region: "Haut-Sassandra",
      address: "Quartier Commerce",
      type: "Urban",
      coordinates: { lat: 6.8770, lng: -6.4503 },
      services: ["Formation numérique", "Hub entrepreneuriat", "Cacao tech"],
      email: "ppn.daloa@uvci.edu.ci",
      phone: "+225 27 20 00 05 01",
      manager: "Dr. ...",
      openingYear: 2021,
      status: "active",
    },
    {
      id: "ppn-016",
      name: "PPN Daloa Gboguhé",
      city: "Daloa",
      region: "Haut-Sassandra",
      address: "Gboguhé, zone agricole",
      type: "Rural",
      coordinates: { lat: 6.9000, lng: -6.5000 },
      services: ["Agriculture intelligente", "Transformation cacao", "Radio"],
      email: "ppn.gbaguhe@uvci.edu.ci",
      phone: "+225 27 20 00 05 02",
      manager: "M. ...",
      openingYear: 2022,
      status: "active",
    },
    {
      id: "ppn-017",
      name: "PPN Man",
      city: "Man",
      region: "Montagnes",
      address: "Centre-ville, Route de Danané",
      type: "Urban",
      coordinates: { lat: 7.4125, lng: -7.5544 },
      services: ["Formation numérique", "Tourisme digital", "Artisanat tech"],
      email: "ppn.man@uvci.edu.ci",
      phone: "+225 27 20 00 06 01",
      manager: "Mme ...",
      openingYear: 2021,
      status: "active",
    },
    {
      id: "ppn-018",
      name: "PPN Gagnoa",
      city: "Gagnoa",
      region: "Gôh",
      address: "Quartier Dioulabougou",
      type: "Mixed",
      coordinates: { lat: 6.1319, lng: -5.9506 },
      services: ["Formation", "Agriculture", "Hub innovation"],
      email: "ppn.gagnoa@uvci.edu.ci",
      phone: "+225 27 20 00 07 01",
      manager: "M. ...",
      openingYear: 2022,
      status: "active",
    },
    {
      id: "ppn-019",
      name: "PPN Divo",
      city: "Divo",
      region: "Lôh-Djiboua",
      address: "Centre commercial",
      type: "Mixed",
      coordinates: { lat: 5.8372, lng: -5.3569 },
      services: ["Formation numérique", "Cacao tech", "E-commerce"],
      email: "ppn.divo@uvci.edu.ci",
      phone: "+225 27 20 00 08 01",
      manager: "M. ...",
      openingYear: 2022,
      status: "active",
    },
    {
      id: "ppn-020",
      name: "PPN Abengourou",
      city: "Abengourou",
      region: "Indénié-Djuablin",
      address: "Quartier Administratif",
      type: "Urban",
      coordinates: { lat: 6.7297, lng: -3.4967 },
      services: ["Formation", "Hub tech", "Agriculture café-cacao"],
      email: "ppn.abengourou@uvci.edu.ci",
      phone: "+225 27 20 00 09 01",
      manager: "Dr. ...",
      openingYear: 2021,
      status: "active",
    },
    {
      id: "ppn-021",
      name: "PPN Bondoukou",
      city: "Bondoukou",
      region: "Gontougo",
      address: "Centre-ville",
      type: "Mixed",
      coordinates: { lat: 8.0404, lng: -2.8000 },
      services: ["Formation numérique", "Agriculture", "Commerce transfrontalier"],
      email: "ppn.bondoukou@uvci.edu.ci",
      phone: "+225 27 20 00 10 01",
      manager: "M. ...",
      openingYear: 2022,
      status: "active",
    },
    {
      id: "ppn-022",
      name: "PPN Soubré",
      city: "Soubré",
      region: "Nawa",
      address: "Zone industrielle",
      type: "Rural",
      coordinates: { lat: 5.7858, lng: -6.6066 },
      services: ["Agriculture", "Transformation cacao", "Formation"],
      email: "ppn.soubre@uvci.edu.ci",
      phone: "+225 27 20 00 11 01",
      manager: "Mme ...",
      openingYear: 2022,
      status: "active",
    },
  ]

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
      description: "Les Points de Présence Numérique (PPN) sont des espaces physiques implantés dans les communautés rurales et urbaines de Côte d'Ivoire. Ils servent de hubs pour démocratiser l'accès au numérique et offrir des services de formation.",
    },
    {
      icon: Target,
      title: "Notre Mission",
      description: "Étendre les services de l'UVCI au-delà des campus traditionnels en créant des points d'accès stratégiques dans toutes les régions du pays, pour que chaque citoyen puisse bénéficier de la révolution numérique.",
    },
    {
      icon: Rocket,
      title: "Notre Vision",
      description: "Faire de la Côte d'Ivoire un leader africain en matière d'inclusion numérique en créant un réseau national de centres d'innovation connectés et performants.",
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
            <Badge className="mb-6 px-4 py-2" variant="outline">
              <Network className="w-4 h-4 mr-2" />
              UVCI - Innovation Territoriale
            </Badge>
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
        <div className="container mx-auto px-4 lg:px-8 mb-20">
          <SectionHeader
            title="Nos Implantations"
            subtitle={`${ppnLocations.length} Points de Présence répartis dans ${regions.length} régions`}
          />

          {/* Filtres */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  type="text"
                  placeholder="Rechercher un PPN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Tous les types</option>
                <option value="Urban">Urbain</option>
                <option value="Rural">Rural</option>
                <option value="Mixed">Mixte</option>
              </select>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-2 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Toutes les régions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabs: Carte et Liste */}
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
                <TabsTrigger value="list">
                  <Building2 className="w-4 h-4 mr-2" />
                  Liste
                </TabsTrigger>
                <TabsTrigger value="map">
                  <Map className="w-4 h-4 mr-2" />
                  Carte
                </TabsTrigger>
              </TabsList>

              {/* Liste des PPN */}
              <TabsContent value="list">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPPNs.map((ppn) => (
                    <Card key={ppn.id} className="border-2 border-border hover:border-primary/50 transition-all group overflow-hidden">
                      <CardContent className="p-0">
                        {/* En-tête */}
                        <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 border-b border-border">
                          <div className="flex items-start justify-between mb-3">
                            <Badge variant={ppn.status === "active" ? "default" : "secondary"}>
                              {ppn.type === "Urban" ? "Urbain" : ppn.type === "Rural" ? "Rural" : "Mixte"}
                            </Badge>
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                              {ppn.status === "active" ? "Actif" : "En construction"}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-bold mb-1">{ppn.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin size={14} />
                            {ppn.city}, {ppn.region}
                          </p>
                        </div>

                        {/* Contenu */}
                        <div className="p-6 space-y-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="text-primary flex-shrink-0 mt-0.5" size={16} />
                            <span className="text-sm text-muted-foreground">{ppn.address}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Mail className="text-primary flex-shrink-0" size={16} />
                            <a href={`mailto:${ppn.email}`} className="text-sm text-primary hover:underline truncate">
                              {ppn.email}
                            </a>
                          </div>

                          <div className="flex items-center gap-2">
                            <Phone className="text-primary flex-shrink-0" size={16} />
                            <a href={`tel:${ppn.phone}`} className="text-sm text-primary hover:underline">
                              {ppn.phone}
                            </a>
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="text-primary flex-shrink-0" size={16} />
                            <span className="text-sm text-muted-foreground">{ppn.manager}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="text-primary flex-shrink-0" size={16} />
                            <span className="text-sm text-muted-foreground">Ouvert depuis {ppn.openingYear}</span>
                          </div>

                          {/* Services */}
                          <div className="pt-4 border-t border-border">
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <Award className="text-primary" size={16} />
                              Services disponibles
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {ppn.services.map((service, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Bouton Contact */}
                          <Button 
                            variant="outline" 
                            className="w-full group/btn cursor-pointer"
                            onClick={() => {
                              setSelectedPPN(ppn.id)
                              const mapTab = document.querySelector('[data-value="map"]') as HTMLElement | null
                              mapTab?.click() // Switch to map tab
                            }}
                          >
                            <MapPin className="mr-2" size={16} />
                            Voir sur la carte
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredPPNs.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg">Aucun PPN trouvé avec ces critères.</p>
                  </div>
                )}
              </TabsContent>

              {/* Carte interactive */}
              <TabsContent value="map">
                <Card className="border-2 border-border overflow-hidden">
                  <CardContent className="p-0">
                    <PPNMap locations={filteredPPNs} selectedPPN={selectedPPN} />
                  </CardContent>
                </Card>

                {/* Statistiques sous la carte */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <Card className="border-2 hover:border-primary/50 transition-all">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">Urbain</span>
                      </div>
                      <span className="text-3xl font-bold">
                        {ppnLocations.filter(p => p.type === "Urban").length}
                      </span>
                    </CardContent>
                  </Card>
                  <Card className="border-2 hover:border-primary/50 transition-all">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Rural</span>
                      </div>
                      <span className="text-3xl font-bold">
                        {ppnLocations.filter(p => p.type === "Rural").length}
                      </span>
                    </CardContent>
                  </Card>
                  <Card className="border-2 hover:border-primary/50 transition-all">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium">Mixte</span>
                      </div>
                      <span className="text-3xl font-bold">
                        {ppnLocations.filter(p => p.type === "Mixed").length}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
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
                  <Button size="lg" className="group bg-gradient-to-r from-primary to-accent" asChild>
                    <Link href="/about">
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