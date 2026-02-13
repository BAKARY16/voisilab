import { supabase, TABLES } from './client'

/**
 * Récupérer tous les équipements disponibles
 */
export const getAvailableEquipment = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.EQUIPMENT)
      .select('*')
      .eq('status', 'available')
      .order('name', { ascending: true })

    if (error) {
      console.error('Erreur récupération équipements:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Récupérer tous les équipements (tous statuts)
 */
export const getAllEquipment = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.EQUIPMENT)
      .select('*')
      .order('category', { ascending: true })

    if (error) {
      console.error('Erreur récupération équipements:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Récupérer équipements par catégorie
 */
export const getEquipmentByCategory = async (category: string) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.EQUIPMENT)
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true })

    if (error) {
      console.error('Erreur récupération équipements par catégorie:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}
