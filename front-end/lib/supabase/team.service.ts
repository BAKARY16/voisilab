import { supabase, TABLES } from './client'

/**
 * Récupérer tous les membres de l'équipe (actifs seulement)
 */
export const getActiveTeamMembers = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TEAM_MEMBERS)
      .select('*')
      .eq('active', true)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Erreur récupération équipe:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Récupérer un membre par ID
 */
export const getTeamMemberById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TEAM_MEMBERS)
      .select('*')
      .eq('id', id)
      .eq('active', true)
      .single()

    if (error) {
      console.error('Erreur récupération membre:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}
