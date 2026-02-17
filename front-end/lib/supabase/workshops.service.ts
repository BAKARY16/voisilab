import { supabase, TABLES } from './client'

/**
 * Récupérer les ateliers à venir
 */
export const getUpcomingWorkshops = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.WORKSHOPS)
      .select('*')
      .in('status', ['upcoming', 'ongoing'])
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })

    if (error) {
      console.error('Erreur récupération ateliers:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Récupérer tous les ateliers
 */
export const getAllWorkshops = async (limit?: number) => {
  try {
    let query = supabase
      .from(TABLES.WORKSHOPS)
      .select('*')
      .order('date', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erreur récupération ateliers:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Récupérer un atelier par ID
 */
export const getWorkshopById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.WORKSHOPS)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erreur récupération atelier:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Enregistrer une inscription à un atelier
 */
export const registerToWorkshop = async (workshopId: string, registration: {
  name: string
  email: string
  phone?: string
  message?: string
}) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.WORKSHOP_REGISTRATIONS)
      .insert([{
        workshop_id: workshopId,
        ...registration,
        status: 'pending'
      }])
      .select()
      .single()

    if (error) {
      console.error('Erreur inscription atelier:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}
