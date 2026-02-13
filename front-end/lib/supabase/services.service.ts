import { supabase, TABLES } from './client'

/**
 * Récupérer tous les services du fablab (actifs seulement)
 */
export const getActiveServices = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.SERVICES)
      .select('*')
      .eq('active', true)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Erreur récupération services:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Récupérer un service par ID
 */
export const getServiceById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.SERVICES)
      .select('*')
      .eq('id', id)
      .eq('active', true)
      .single()

    if (error) {
      console.error('Erreur récupération service:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}
