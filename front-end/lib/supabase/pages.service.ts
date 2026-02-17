import { supabase, TABLES } from './client'

/**
 * Récupérer une page dynamique par clé
 */
export const getPageByKey = async (pageKey: string) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.DYNAMIC_PAGES)
      .select('*')
      .eq('page_key', pageKey)
      .eq('published', true)
      .single()

    if (error) {
      console.error(`Erreur récupération page ${pageKey}:`, error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Récupérer toutes les pages publiées
 */
export const getAllPublishedPages = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.DYNAMIC_PAGES)
      .select('*')
      .eq('published', true)
      .order('page_key', { ascending: true })

    if (error) {
      console.error('Erreur récupération pages:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}
