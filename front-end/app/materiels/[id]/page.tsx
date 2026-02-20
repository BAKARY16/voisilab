"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Layers,
    Settings,
    Package,
    Calendar,
    GraduationCap,
    Users,
    Wrench,
    AlertCircle,
    ChevronRight
} from 'lucide-react'

interface Equipment {
    id: number
    name: string
    category: string
    description: string
    image_url: string
    count_info: string
    specs: string[] | string
    status: string
    category_color: string
    gradient: string
    order_index: number
    active: number
}

const parseSpecs = (value: string[] | string | null | undefined): string[] => {
    if (!value) return []
    if (Array.isArray(value)) return value
    try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return value ? [value] : []
    }
}

const statusLabel: Record<string, { label: string; color: string }> = {
    available: { label: 'Disponible', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
    maintenance: { label: 'En maintenance', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
    unavailable: { label: 'Indisponible', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
}

export default function EquipmentDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [equipment, setEquipment] = useState<Equipment | null>(null)
    const [allEquipment, setAllEquipment] = useState<Equipment[]>([])
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.fablab.voisilab.online'

    useEffect(() => {
        fetch(`${API_URL}/api/equipment/available`)
            .then(res => res.json())
            .then(data => {
                const items: Equipment[] = data.data || []
                const found = items.find(e => String(e.id) === String(params.id))
                if (!found) {
                    setNotFound(true)
                } else {
                    setEquipment(found)
                    setAllEquipment(items.filter(e => String(e.id) !== String(params.id)))
                }
                setLoading(false)
            })
            .catch(() => {
                setNotFound(true)
                setLoading(false)
            })
    }, [params.id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Chargement...</p>
                </div>
            </div>
        )
    }

    if (notFound || !equipment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center max-w-md px-4">
                    <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-foreground mb-2">Équipement introuvable</h1>
                    <p className="text-muted-foreground mb-6">Cet équipement n'existe pas ou n'est plus disponible.</p>
                    <Button asChild>
                        <Link href="/materiels">
                            <ArrowLeft size={16} className="mr-2" />
                            Retour aux équipements
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    const specs = parseSpecs(equipment.specs)
    const status = statusLabel[equipment.status] || statusLabel['available']

    return (
        <div className="min-h-screen bg-background">

            {/* Hero */}
            <section className="relative h-[50vh] min-h-[380px] overflow-hidden">
                <Image
                    src={equipment.image_url || '/logolab.png'}
                    alt={equipment.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/40" />

                {/* Bouton retour — haut droite */}
                <div className="absolute top-6 right-6 lg:top-8 lg:right-12 z-10">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Retour
                    </Button>
                </div>

                {/* Textes — bas gauche */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 lg:px-12">
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                        <Badge className="bg-white/15 border border-white/30 text-white font-medium backdrop-blur-sm">
                            {equipment.category}
                        </Badge>
                        <Badge className={`${status.color} border font-medium backdrop-blur-sm`}>
                            {status.label}
                        </Badge>
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-3 drop-shadow-lg text-center">
                        {equipment.name}
                    </h1>
                    <p className="text-white/80 text-base flex items-center justify-center gap-2">
                        <Package size={16} />
                        {equipment.count_info}
                    </p>
                </div>
            </section>

            {/* Contenu principal */}
            <div className="container mx-auto px-4 lg:px-8 py-12 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Colonne principale */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Description */}
                        <Card className="border-2 border-border">
                            <CardContent className="p-6 lg:p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Layers size={20} className="text-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold text-foreground">Description</h2>
                                </div>
                                <Separator className="mb-5" />
                                <p className="text-muted-foreground leading-relaxed text-base">
                                    {equipment.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Spécifications techniques */}
                        {specs.length > 0 && (
                            <Card className="border-2 border-border">
                                <CardContent className="p-6 lg:p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Settings size={20} className="text-primary" />
                                        </div>
                                        <h2 className="text-xl font-bold text-foreground">Spécifications techniques</h2>
                                    </div>
                                    <Separator className="mb-5" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {specs.map((spec, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                                <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                                                <span className="text-sm text-foreground font-medium">{spec}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Comment y accéder */}
                        <Card className="border-2 border-border">
                            <CardContent className="p-6 lg:p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <GraduationCap size={20} className="text-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold text-foreground">Comment y accéder ?</h2>
                                </div>
                                <Separator className="mb-5" />
                                <div className="space-y-4">
                                    {[
                                        { num: '01', title: "Inscrivez-vous à une formation", desc: "Réservez votre place à la prochaine session de formation sur cet équipement." },
                                        { num: '02', title: "Suivez la formation", desc: "Apprenez les bases, les règles de sécurité et réalisez votre premier projet accompagné." },
                                        { num: '03', title: "Obtenez votre certification", desc: "Une fois validée, accédez à la machine en toute autonomie." },
                                        { num: '04', title: "Créez en toute liberté", desc: "Réservez vos créneaux et concrétisez vos projets." },
                                    ].map((step, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                                                {step.num}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground text-sm">{step.title}</p>
                                                <p className="text-muted-foreground text-sm mt-0.5">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Colonne latérale */}
                    <div className="space-y-6">

                        {/* Récapitulatif */}
                        <Card className="border-2 border-border sticky top-24">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-foreground mb-4">Informations</h3>
                                <Separator className="mb-4" />

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Package size={16} className="text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Disponibilité</p>
                                            <p className="text-sm font-semibold text-foreground">{equipment.count_info}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Wrench size={16} className="text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Catégorie</p>
                                            <p className="text-sm font-semibold text-foreground">{equipment.category}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 size={16} className="text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Statut</p>
                                            <p className="text-sm font-semibold text-foreground">{status.label}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                                            <GraduationCap size={16} className="text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Formation</p>
                                            <p className="text-sm font-semibold text-foreground">Incluse et obligatoire</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-5" />

                                <div className="space-y-3">
                                    <Button className="w-full group" asChild>
                                        <Link href="/ateliers">
                                            <Calendar size={16} className="mr-2" />
                                            Voir les formations
                                            <ArrowRight className="ml-auto group-hover:translate-x-1 transition-transform" size={16} />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/projet">
                                            Soumettre un projet
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>

                {/* Autres équipements */}
                {allEquipment.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-foreground">Autres équipements</h2>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/materiels" className="flex items-center gap-1 text-primary hover:underline">
                                    Voir tout
                                    <ChevronRight size={16} />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {allEquipment.slice(0, 3).map((item, index) => (
                                <Link key={item.id} href={`/materiels/${item.id}`}>
                                    <Card className="border-2 border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group overflow-hidden h-full">
                                        <div className="relative h-44 overflow-hidden bg-muted">
                                            <Image
                                                src={item.image_url || '/logolab.png'}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                            <div className="absolute bottom-3 left-3">
                                                <Badge className={`${item.category_color} border font-medium text-xs backdrop-blur-sm`}>
                                                    {item.category}
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-5">
                                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                                                {item.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground mb-3">{item.count_info}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
