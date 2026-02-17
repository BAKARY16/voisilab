// Service API pour récupérer les données depuis le backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

/**
 * Fonction utilitaire pour gérer les réponses API
 */
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur serveur' }))
    throw new Error(error.message || 'Erreur lors de la requête')
  }
  return response.json()
}

/**
 * Récupérer tous les points PPN
 */
export async function getAllPPN() {
  try {
    const response = await fetch(`${API_URL}/api/ppn`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const result = await handleResponse(response)
    return result.data || result
  } catch (error) {
    console.error('Erreur lors de la récupération des PPN:', error)
    throw error
  }
}

/**
 * Récupérer un PPN par ID
 */
export async function getPPNById(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/ppn/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const result = await handleResponse(response)
    return result.data || result
  } catch (error) {
    console.error(`Erreur lors de la récupération du PPN ${id}:`, error)
    throw error
  }
}

/**
 * Récupérer les PPN actifs uniquement
 */
export async function getActivePPN() {
  try {
    const allPPN = await getAllPPN()
    return allPPN.filter((ppn: any) => ppn.status === 'active')
  } catch (error) {
    console.error('Erreur lors de la récupération des PPN actifs:', error)
    throw error
  }
}
