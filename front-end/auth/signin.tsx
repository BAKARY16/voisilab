"use client"

import { useState } from "react"
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth"
import Link from "next/link"

export function SignInDialog() {
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulation d'une authentification (à remplacer par votre API)
        setTimeout(() => {
            // Exemple de connexion réussie
            login({
                id: "1",
                name: email.split("@")[0],
                email: email,
                avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
            })
            setIsLoading(false)
            setOpen(false)
            setEmail("")
            setPassword("")
        }, 1000)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="cursor-pointer text-gray-400 hover:text-white" size="sm">
                    Se connecter
                    <LogIn className="w-4 h-4 mr-2" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-2 border-border">
                {/* En-tête simplifié et professionnel */}
                <div className="p-4 mt-4 mb-0 text-center">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-extrabold tracking-tight text-center">
                            Connexion à votre compte
                        </DialogTitle>
                        <DialogDescription className="text-sm text-center text-muted-foreground font-medium">
                            Veuillez entrer vos identifiants pour continuer.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold">
                            Adresse email
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="votre.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 h-12 border-2 focus:border-[#a306a1] transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Mot de passe */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-sm font-semibold">
                                Mot de passe
                            </Label>
                            <Link
                                href="/auth/forgot-password"
                                className="text-xs text-[#a306a1] hover:text-[#800091] font-medium transition-colors"
                            >
                                Mot de passe oublié ?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 pr-12 h-12 border-2 focus:border-[#a306a1] transition-colors"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Bouton de connexion avec animation de couleur */}
                    <Button
                        type="submit"
                        className="w-full cursor-pointer h-12 bg-primary text-white font-bold text-base shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                        disabled={isLoading}
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-[#a306a1] via-[#800091] to-[#a306a1] opacity-0 hover:opacity-20 transition-opacity"></span>
                        <span className="relative flex items-center justify-center">
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Connexion en cours...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5 mr-2" />
                                    Se connecter
                                </>
                            )}
                        </span>
                    </Button>

                    {/* Séparateur */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground font-medium">
                                Nouveau sur Voisilab ?
                            </span>
                        </div>
                    </div>

                    {/* Bouton d'inscription */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 border-2 border-[#a306a1] text-[#a306a1] hover:bg-[#a306a1] hover:text-white font-bold text-base transition-all"
                        asChild
                    >
                        <Link href="/auth/signup" onClick={() => setOpen(false)}>
                            Créer un compte
                        </Link>
                    </Button>

                    {/* Conditions */}
                    <p className="text-xs text-center text-muted-foreground">
                        En vous connectant, vous acceptez nos{" "}
                        <Link href="/terms" className="text-[#a306a1] hover:underline">
                            Conditions d'utilisation
                        </Link>{" "}
                        et notre{" "}
                        <Link href="/privacy" className="text-[#a306a1] hover:underline">
                            Politique de confidentialité
                        </Link>
                        .
                    </p>
                </form>
            </DialogContent>
        </Dialog>
    )
}