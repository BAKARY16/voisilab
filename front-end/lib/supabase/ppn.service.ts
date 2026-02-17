import { supabase, TABLES } from './client'

/**
 * Récupérer tous les points PPN actifs
 */
export const getActivePPNLocations = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.PPN_LOCATIONS)
      .select('*')
      .eq('status', 'active')
      .order('city', { ascending: true })

    if (error) {
      console.error('Erreur récupération points PPN:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Récupérer un point PPN par ID avec ses membres
 */
export const getPPNLocationWithMembers = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.PPN_LOCATIONS)
      .select(`
        *,
        members:ppn_members(*)
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single()

    if (error) {
      console.error('Erreur récupération point PPN:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Récupérer tous les membres PPN actifs
 */
export const getActivePPNMembers = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.PPN_MEMBERS)
      .select(`
        *,
        ppn_location:ppn_location_id (
          name,
          city,
          latitude,
          longitude
        )
      `)
      .eq('active', true)
      .order('joined_at', { ascending: false })

    if (error) {
      console.error('Erreur récupération membres PPN:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}
