// Service PPN - Point de Présence Numérique
import { ppnService } from './index'

// Export avec noms compatibles
export const getAllPPN = async () => {
  try {
    const result = await ppnService.getAll()
    console.log('🔍 PPN Service - Données récupérées:', result)
    return result
  } catch (error) {
    console.error('❌ PPN Service - Erreur:', error)
    return []
  }
}

export const getPPNById = async (id: string) => {
  return await ppnService.getById(id)
}

export const getActivePPN = async () => {
  return await ppnService.getActiveLocations()
}

export default {
  getAllPPN,
  getPPNById,
  getActivePPN
}
