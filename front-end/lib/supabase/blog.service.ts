import { supabase, TABLES } from './client'

/**
 * Récupérer les articles de blog publiés
 */
export const getPublishedPosts = async (limit?: number) => {
  try {
    let query = supabase
      .from(TABLES.BLOG_POSTS)
      .select(`
        *,
        author:author_id (
          full_name,
          avatar_url
        )
      `)
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erreur récupération articles:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Récupérer un article par slug
 */
export const getPostBySlug = async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.BLOG_POSTS)
      .select(`
        *,
        author:author_id (
          full_name,
          avatar_url
        )
      `)
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error) {
      console.error('Erreur récupération article:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Récupérer articles par tag
 */
export const getPostsByTag = async (tag: string) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.BLOG_POSTS)
      .select(`
        *,
        author:author_id (
          full_name,
          avatar_url
        )
      `)
      .contains('tags', [tag])
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Erreur récupération articles par tag:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}
