import { z } from 'zod'

export const projectSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom ne peut contenir que des lettres'),
  
  email: z
    .string()
    .email('Email invalide')
    .max(255, 'Email trop long')
    .toLowerCase()
    .trim(),
  
  phone: z
    .string()
    .min(8, 'Numéro de téléphone invalide')
    .max(20, 'Numéro de téléphone trop long')
    .regex(/^[\d\s+()-]+$/, 'Format de téléphone invalide'),
  
  projectType: z
    .string()
    .min(1, 'Veuillez sélectionner un type de projet'),
  
  budget: z.string().optional(),
  
  timeline: z.string().optional(),
  
  description: z
    .string()
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(2000, 'La description ne peut pas dépasser 2000 caractères')
    .trim(),
  
  files: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) => !files || files.every((file) => file.size <= 10 * 1024 * 1024),
      'Chaque fichier doit faire moins de 10 MB'
    )
    .refine(
      (files) => !files || files.length <= 5,
      'Maximum 5 fichiers'
    ),
})

export type ProjectFormData = z.infer<typeof projectSchema>