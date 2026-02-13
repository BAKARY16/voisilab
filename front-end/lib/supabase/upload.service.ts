import { supabase, STORAGE_BUCKET } from './client'

export interface UploadedFile {
  name: string
  url: string
  size: number
  path: string
}

export const uploadFilesToSupabase = async (
  files: File[],
  projectId: string
): Promise<UploadedFile[]> => {
  if (!files || files.length === 0) {
    return []
  }

  const uploadPromises = files.map(async (file) => {
    const timestamp = Date.now()
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .substring(0, 100)
    const filePath = `${projectId}/${timestamp}_${sanitizedName}`

    try {
      console.log(`📤 Upload de ${file.name}...`)

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        console.error(`❌ Erreur upload ${file.name}:`, error)
        throw new Error(`Impossible d'uploader ${file.name}: ${error.message}`)
      }

      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath)

      console.log(`✅ ${file.name} uploadé avec succès`)

      return {
        name: file.name,
        url: urlData.publicUrl,
        size: file.size,
        path: filePath,
      }
    } catch (error) {
      console.error(`❌ Erreur upload ${file.name}:`, error)
      throw error
    }
  })

  return Promise.all(uploadPromises)
}

export const deleteFilesFromSupabase = async (filePaths: string[]): Promise<void> => {
  if (!filePaths || filePaths.length === 0) return

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove(filePaths)

  if (error) {
    console.error('❌ Erreur suppression fichiers:', error)
    throw error
  }

  console.log('✅ Fichiers supprimés avec succès')
}