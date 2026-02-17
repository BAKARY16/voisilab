import emailjs from '@emailjs/browser'
import { emailjsConfig } from '../emailjs.config'
import { uploadFilesToSupabase, type UploadedFile } from './upload.service'
import { saveProjectSubmission } from './projects.service'
import type { ProjectFormData } from '../validations/project.schema'

export interface ProjectSubmission extends ProjectFormData {
  files?: File[]
}

export const sendProjectSubmission = async (data: ProjectSubmission) => {
  let projectId: string | undefined
  let uploadedFiles: UploadedFile[] = []

  try {
    console.log('📧 Initialisation de la soumission...')
    
    emailjs.init(emailjsConfig.publicKey)

    projectId = `project_${Date.now()}_${Math.random().toString(36).substring(7)}`

    if (data.files && data.files.length > 0) {
      console.log(`📎 Upload de ${data.files.length} fichier(s) vers Supabase...`)
      
      try {
        uploadedFiles = await uploadFilesToSupabase(data.files, projectId)
        console.log('✅ Fichiers uploadés avec succès')
      } catch (error) {
        console.error('❌ Erreur upload fichiers:', error)
        throw new Error('Impossible d\'uploader les fichiers. Veuillez réessayer.')
      }
    }

    console.log('💾 Sauvegarde dans la base de données...')
    const saveResult = await saveProjectSubmission(data, uploadedFiles)

    if (!saveResult.success) {
      throw new Error(saveResult.error || 'Erreur de sauvegarde')
    }

    let filesInfo = 'Aucun fichier joint'
    if (uploadedFiles.length > 0) {
      filesInfo = uploadedFiles
        .map((file, index) => 
          `${index + 1}. ${file.name} (${(file.size / 1024).toFixed(2)} KB)\n   📥 ${file.url}`
        )
        .join('\n\n')
    }

    const teamParams = {
      to_email: emailjsConfig.recipientEmail,
      from_name: data.name,
      from_email: data.email,
      phone: data.phone,
      project_type: data.projectType,
      budget: data.budget || 'Non spécifié',
      timeline: data.timeline || 'Non spécifié',
      description: data.description,
      files_info: filesInfo,
      files_count: uploadedFiles.length.toString(),
      reply_to: data.email,
    }

    const clientParams = {
      client_email: data.email,
      client_name: data.name,
      project_type: data.projectType,
      budget: data.budget || 'Non spécifié',
      timeline: data.timeline || 'Non spécifié',
    }

    console.log('📤 Envoi des emails...')

    const [teamResponse, clientResponse] = await Promise.all([
      emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templates.team,
        teamParams
      ),
      emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templates.client,
        clientParams
      ),
    ])

    console.log('✅ Email équipe envoyé:', teamResponse.status)
    console.log('✅ Email client envoyé:', clientResponse.status)

    return {
      success: true,
      teamEmailSent: teamResponse.status === 200,
      clientEmailSent: clientResponse.status === 200,
      uploadedFiles,
      projectId: saveResult.projectId,
    }
  } catch (error: any) {
    console.error('❌ Erreur complète:', error)
    
    return {
      success: false,
      error: error?.text || error?.message || 'Erreur inconnue',
    }
  }
}