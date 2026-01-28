"use client"

import type React from "react"

import { SectionHeader } from "./section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Send, Paperclip } from "lucide-react"
import { useState } from "react"

export function ProjectRequestSection() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    timeline: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    console.log("Project request submitted:", formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        budget: "",
        timeline: "",
        description: "",
      })
    }, 3000)
  }

  return (
    <section id="projet" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          title="Soumettre un projet"
          subtitle="Vous avez une idée ? Partagez-la avec nous ! Notre équipe d'experts étudiera votre demande et vous accompagnera dans sa réalisation."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Form */}
          <Card className="border-border">
            <CardContent className="p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Demande envoyée !</h3>
                  <p className="text-muted-foreground">
                    Merci pour votre demande. Nous vous contacterons sous 48h pour discuter de votre projet.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
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
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      placeholder="Jean Dupont"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                        placeholder="jean@example.com"
                      />
                    </div>
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
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                  </div>

                  {/* Project Type */}
                  <div>
                    <Label htmlFor="projectType" className="text-foreground mb-2 block">
                      Type de projet *
                    </Label>
                    <select
                      id="projectType"
                      name="projectType"
                      required
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    >
                      <option value="">Sélectionnez un type</option>
                      <option value="impression-3d">Impression 3D</option>
                      <option value="laser">Découpe / Gravure Laser</option>
                      <option value="cnc">Usinage CNC</option>
                      <option value="electronique">Électronique / IoT</option>
                      <option value="prototype">Prototypage complet</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  {/* Budget & Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budget" className="text-foreground mb-2 block">
                        Budget estimé
                      </Label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      >
                        <option value="">Choisir...</option>
                        <option value="<500">Moins de 500 000 FCFA</option>
                        <option value="500-1000">500 000 FCFA - 1000€</option>
                        <option value="1000-3000">1000€ - 3000€</option>
                        <option value=">3000">Plus de 3000€</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="timeline" className="text-foreground mb-2 block">
                        Délai souhaité
                      </Label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      >
                        <option value="">Choisir...</option>
                        <option value="urgent">Urgent (1-2 semaines)</option>
                        <option value="normal">Normal (1 mois)</option>
                        <option value="flexible">Flexible (2-3 mois)</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description" className="text-foreground mb-2 block">
                      Description du projet *
                    </Label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
                      placeholder="Décrivez votre projet en détail : objectifs, contraintes techniques, utilisation prévue..."
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <Label className="text-foreground mb-2 block">Fichiers (optionnel)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Paperclip className="mx-auto mb-2 text-muted-foreground" size={24} />
                      <p className="text-sm text-muted-foreground">
                        Glissez vos fichiers ici ou cliquez pour parcourir
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Plans, croquis, photos, fichiers 3D...</p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" size="lg" className="w-full">
                    <Send className="mr-2" size={20} />
                    Envoyer la demande
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Info */}
          <div className="space-y-6">
            <Card className="border-border">
              <CardContent className="p-6 lg:p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Comment ça marche ?</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Soumettez votre demande</h4>
                      <p className="text-sm text-muted-foreground">
                        Remplissez le formulaire avec les détails de votre projet.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Étude de faisabilité</h4>
                      <p className="text-sm text-muted-foreground">
                        Notre équipe analyse votre demande et évalue la faisabilité technique.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Devis personnalisé</h4>
                      <p className="text-sm text-muted-foreground">
                        Vous recevez un devis détaillé avec planning et coûts.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Réalisation</h4>
                      <p className="text-sm text-muted-foreground">
                        Nous fabriquons votre projet avec notre expertise et nos machines.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-6 lg:p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Nos compétences</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Impression 3D",
                    "Découpe Laser",
                    "Usinage CNC",
                    "Électronique",
                    "IoT & Arduino",
                    "Prototypage",
                    "Design 3D",
                    "CAO/DAO",
                  ].map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-background border border-border rounded-full text-sm text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/50 border-2">
              <CardContent className="p-6 lg:p-8">
                <h3 className="text-xl font-semibold text-foreground mb-2">Besoin d'aide ?</h3>
                <p className="text-muted-foreground mb-4">
                  Notre équipe est disponible pour répondre à vos questions avant de soumettre votre projet.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-foreground">
                    <span className="font-medium">Email:</span>{" "}
                    <a href="mailto:fablab@uvci.edu.ci" className="text-primary hover:underline">
                      fablab@uvci.edu.ci
                    </a>
                  </p>
                  <p className="text-foreground">
                    <span className="font-medium">Téléphone:</span>{" "}
                    <a href="tel:+2250500000000" className="text-primary hover:underline">
                      +225 05 00 00 00 00
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
