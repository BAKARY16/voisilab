import { supabase, PROJECTS_TABLE } from './client'
import type { ProjectFormData } from '../validations/project.schema'
import type { UploadedFile } from './upload.service'

export interface ProjectSubmission {
  id?: string
  name: string
  email: string
  phone: string
  project_type: string
  budget?: string
  timeline?: string
  description: string
  files?: UploadedFile[]
  status?: 'pending' | 'reviewed' | 'approved' | 'rejected'
  created_at?: string
}

export const saveProjectSubmission = async (
  data: ProjectFormData,
  uploadedFiles: UploadedFile[]
): Promise<{ success: boolean; projectId?: string; error?: string }> => {
  try {
    const submission: Omit<ProjectSubmission, 'id' | 'created_at'> = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      project_type: data.projectType,
      budget: data.budget,
      timeline: data.timeline,
      description: data.description,
      files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      status: 'pending',
    }

    const { data: insertedData, error } = await supabase
      .from(PROJECTS_TABLE)
      .insert([submission])
      .select()
      .single()

    if (error) {
      console.error('❌ Erreur sauvegarde projet:', error)
      throw new Error(`Erreur de sauvegarde: ${error.message}`)
    }

    console.log('✅ Projet sauvegardé avec succès:', insertedData.id)

    return {
      success: true,
      projectId: insertedData.id,
    }
  } catch (error: any) {
    console.error('❌ Erreur saveProjectSubmission:', error)
    return {
      success: false,
      error: error.message || 'Erreur inconnue',
    }
  }
}