"use client"

import type React from "react"

import { SectionHeader } from "./section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Send, Paperclip, X, FileIcon, AlertCircle } from "lucide-react"
import { useState } from "react"

export function ProjectRequestSection() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])
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
    setError(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const maxFiles = 5
    const maxSize = 10 * 1024 * 1024 // 10 MB

    // Vérifier le nombre total de fichiers
    if (files.length + selectedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} fichiers autorisés`)
      return
    }

    // Vérifier la taille de chaque fichier
    for (const file of selectedFiles) {
      if (file.size > maxSize) {
        setError(`Le fichier ${file.name} dépasse 10 MB`)
        return
      }
    }

    setFiles([...files, ...selectedFiles])
    setError(null)
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formDataToSend = new FormData()
      
      // Ajouter les données du formulaire
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('projectType', formData.projectType)
      formDataToSend.append('budget', formData.budget)
      formDataToSend.append('timeline', formData.timeline)
      formDataToSend.append('description', formData.description)

      // Ajouter les fichiers
      files.forEach((file) => {
        formDataToSend.append('files', file)
      })

      const response = await fetch('http://localhost:5000/api/project-submissions/submit', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de l\'envoi du projet')
      }

      const result = await response.json()
      console.log('Projet soumis:', result)

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
        setFiles([])
      }, 5000)
    } catch (error) {
      console.error('Erreur:', error)
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'envoi du projet. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="projet" className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          title="Soumettre un projet"
          subtitle="Vous avez une idée ? Partagez-la avec nous ! Notre équipe d'experts étudiera votre demande et vous accompagnera dans sa réalisation."
        />

        <div className="max-w-5xl mx-auto">
          {submitted ? (
            <Card className="border-2 border-primary/20 shadow-xl">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <CheckCircle2 size={40} className="text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-3">Demande envoyée avec succès !</h3>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                  Merci pour votre confiance. Notre équipe vous contactera sous 48h pour discuter de votre projet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border shadow-2xl">
              <CardContent className="p-8 lg:p-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Afficher les erreurs */}
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 rounded">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="text-red-500" size={20} />
                        <p className="text-red-700 dark:text-red-400">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Section 1: Informations personnelles */}
                  <div className="space-y-6">
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="text-lg font-semibold text-foreground">Vos informations</h3>
                      <p className="text-sm text-muted-foreground">Comment pouvons-nous vous contacter ?</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                          Nom complet <span className="text-red-500">*</span>
                        </Label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all"
                          placeholder="Ex: Jean Kouassi"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                            Adresse email <span className="text-red-500">*</span>
                          </Label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all"
                            placeholder="jean.kouassi@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-sm font-medium text-foreground mb-2 block">
                            Numéro de téléphone <span className="text-red-500">*</span>
                          </Label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all"
                            placeholder="+225 07 XX XX XX XX"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Séparateur */}
                  <div className="border-t border-border"></div>

                  {/* Section 2: Détails du projet */}
                  <div className="space-y-6">
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="text-lg font-semibold text-foreground">Détails du projet</h3>
                      <p className="text-sm text-muted-foreground">Décrivez votre projet en détail</p>
                    </div>

                    <div>
                      <Label htmlFor="projectType" className="text-sm font-medium text-foreground mb-2 block">
                        Type de projet <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="projectType"
                        name="projectType"
                        required
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all"
                      >
                        <option value="">-- Sélectionnez un type --</option>
                        <option value="Impression 3D">Impression 3D</option>
                        <option value="Découpe Laser">Découpe / Gravure Laser</option>
                        <option value="Usinage CNC">Usinage CNC</option>
                        <option value="Électronique">Électronique / IoT</option>
                        <option value="Prototypage">Prototypage complet</option>
                        <option value="Conception">Conception / Design 3D</option>
                        <option value="Formation">Formation / Atelier</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="budget" className="text-sm font-medium text-foreground mb-2 block">
                          Budget estimé (optionnel)
                        </Label>
                        <select
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all"
                        >
                          <option value="">-- Non défini --</option>
                          <option value="Moins de 200 000 FCFA">Moins de 200 000 FCFA</option>
                          <option value="200 000 - 500 000 FCFA">200 000 - 500 000 FCFA</option>
                          <option value="500 000 - 1 000 000 FCFA">500 000 - 1 000 000 FCFA</option>
                          <option value="Plus de 1 000 000 FCFA">Plus de 1 000 000 FCFA</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="timeline" className="text-sm font-medium text-foreground mb-2 block">
                          Délai souhaité (optionnel)
                        </Label>
                        <select
                          id="timeline"
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground transition-all"
                        >
                          <option value="">-- Flexible --</option>
                          <option value="Moins d'1 mois">Moins d&apos;1 mois</option>
                          <option value="1-3 mois">1 - 3 mois</option>
                          <option value="3-6 mois">3 - 6 mois</option>
                          <option value="Plus de 6 mois">Plus de 6 mois</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-foreground mb-2 block">
                        Description détaillée <span className="text-red-500">*</span>
                      </Label>
                      <textarea
                        id="description"
                        name="description"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground resize-none transition-all"
                        placeholder="Décrivez votre projet : objectifs, contraintes techniques, matériaux souhaités, quantités, dimensions, fonctionnalités attendues..."
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Plus votre description est détaillée, mieux nous pourrons vous accompagner
                      </p>
                    </div>
                  </div>

                  {/* Séparateur */}
                  <div className="border-t border-border"></div>

                  {/* Section 3: Fichiers */}
                  <div className="space-y-6">
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="text-lg font-semibold text-foreground">Documents (optionnel)</h3>
                      <p className="text-sm text-muted-foreground">
                        Plans, croquis, photos, fichiers 3D (.stl, .obj), PDF...
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="files" className="sr-only">
                        Fichiers
                      </Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                        <input
                          id="files"
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.stl,.obj,.step,.iges"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="files"
                          className="cursor-pointer flex flex-col items-center justify-center"
                        >
                          <Paperclip className="text-muted-foreground mb-3" size={32} />
                          <p className="text-sm font-medium text-foreground mb-1">
                            Cliquez pour ajouter des fichiers
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Maximum 5 fichiers • 10 MB par fichier
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Formats: PDF, Images, STL, OBJ, STEP, IGES
                          </p>
                        </label>
                      </div>

                      {/* Liste des fichiers */}
                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
                            >
                              <div className="flex items-center gap-3">
                                <FileIcon size={20} className="text-primary" />
                                <div>
                                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024).toFixed(2)} KB
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-muted-foreground hover:text-red-500 transition-colors"
                              >
                                <X size={20} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bouton de soumission */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 text-base shadow-lg hover:shadow-xl transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2" size={20} />
                          Envoyer ma demande de projet
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-3">
                      En soumettant ce formulaire, vous acceptez d&apos;être contacté par notre équipe
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Section informative en dessous du formulaire */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="border bg-card/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-primary font-bold text-xl">1</div>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Analyse de faisabilité</h4>
                <p className="text-sm text-muted-foreground">
                  Notre équipe étudie votre demande et évalue la faisabilité technique
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-card/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-primary font-bold text-xl">2</div>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Devis personnalisé</h4>
                <p className="text-sm text-muted-foreground">
                  Vous recevez un devis détaillé avec planning et coûts estimés
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-card/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-primary font-bold text-xl">3</div>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Réalisation</h4>
                <p className="text-sm text-muted-foreground">
                  Nous fabriquons votre projet avec notre expertise et nos équipements
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact rapide */}
          <Card className="mt-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6 text-center">
              <h4 className="font-semibold text-foreground mb-2">Des questions ?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Notre équipe est disponible pour vous aider
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <a
                  href="mailto:fablab@uvci.edu.ci"
                  className="text-primary hover:underline font-medium"
                >
                  fablab@uvci.edu.ci
                </a>
                <span className="text-muted-foreground">•</span>
                <a
                  href="tel:+2250759136905"
                  className="text-primary hover:underline font-medium"
                >
                  +225 07 59 13 69 05
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
