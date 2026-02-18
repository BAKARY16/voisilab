// Service API centralisé pour le front-end VoisiLab
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500'

/**
 * Fonction utilitaire pour gérer les réponses API
 */
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur serveur' }))
    throw new Error(error.message || `Erreur ${response.status}`)
  }
  return response.json()
}

/**
 * Classe générique pour les appels API
 */
class ApiService {
  protected baseUrl: string

  constructor(endpoint: string) {
    this.baseUrl = `${API_URL}/api/${endpoint}`
  }

  async getAll() {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store' // Toujours récupérer les données fraîches
      })
      const result = await handleResponse(response)
      return result.data || result
    } catch (error) {
      console.error(`Erreur API ${this.baseUrl}:`, error)
      return []
    }
  }

  async getById(id: string) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const result = await handleResponse(response)
      return result.data || result
    } catch (error) {
      console.error(`Erreur API ${this.baseUrl}/${id}:`, error)
      return null
    }
  }
}

/**
 * Service Team Members
 */
class TeamService extends ApiService {
  constructor() {
    super('team')
  }

  async getActiveMembers() {
    const members = await this.getAll()
    return Array.isArray(members) 
      ? members.filter((m: any) => m.active || m.is_active) 
      : []
  }
}

/**
 * Service Equipment
 */
class EquipmentService extends ApiService {
  constructor() {
    super('equipment')
  }

  async getAvailableEquipment() {
    const equipment = await this.getAll()
    return Array.isArray(equipment)
      ? equipment.filter((e: any) => e.status === 'available' || e.is_available)
      : []
  }
}

/**
 * Service Workshops
 */
class WorkshopsService extends ApiService {
  constructor() {
    super('workshops')
  }

  async getUpcomingWorkshops() {
    const workshops = await this.getAll()
    return Array.isArray(workshops)
      ? workshops.filter((w: any) => {
          const date = new Date(w.date || w.start_date)
          return date >= new Date()
        })
      : []
  }
}

/**
 * Service Innovations
 */
class InnovationsService extends ApiService {
  constructor() {
    super('innovations')
  }

  async getPublishedInnovations() {
    const innovations = await this.getAll()
    return Array.isArray(innovations)
      ? innovations.filter((i: any) => i.status === 'published' || i.is_published)
      : []
  }
}

/**
 * Service Blog Posts
 */
class BlogService extends ApiService {
  constructor() {
    super('blog')
  }

  async getPublishedPosts() {
    const posts = await this.getAll()
    return Array.isArray(posts)
      ? posts.filter((p: any) => p.status === 'published')
      : []
  }

  async getRecentPosts(limit = 3) {
    const posts = await this.getPublishedPosts()
    return posts.slice(0, limit)
  }
}

/**
 * Service PPN Locations
 */
class PPNService extends ApiService {
  constructor() {
    super('ppn')
  }

  async getActiveLocations() {
    const locations = await this.getAll()
    return Array.isArray(locations)
      ? locations.filter((l: any) => l.status === 'active' || l.is_active)
      : []
  }
}

/**
 * Service Contact (pour soumissions)
 */
class ContactService extends ApiService {
  constructor() {
    super('contacts')
  }

  async submit(data: any) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return await handleResponse(response)
    } catch (error) {
      console.error('Erreur soumission contact:', error)
      throw error
    }
  }
}

/**
 * Service Project Submissions
 */
class ProjectSubmissionService extends ApiService {
  constructor() {
    super('project-submissions')
  }

  async submit(data: any) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return await handleResponse(response)
    } catch (error) {
      console.error('Erreur soumission projet:', error)
      throw error
    }
  }
}

// Export des instances de service
export const teamService = new TeamService()
export const equipmentService = new EquipmentService()
export const workshopsService = new WorkshopsService()
export const innovationsService = new InnovationsService()
export const blogService = new BlogService()
export const ppnService = new PPNService()
export const contactService = new ContactService()
export const projectSubmissionService = new ProjectSubmissionService()

/**
 * Service Paramètres du site (public — pas d'auth requise)
 * Retourne un objet clé/valeur de tous les paramètres publics.
 */
export interface SiteSettings {
  site_name?: string
  site_tagline?: string
  contact_email?: string
  contact_phone?: string
  address?: string
  footer_description?: string
  footer_copyright?: string
  footer_address?: string
  footer_email?: string
  footer_phone?: string
  facebook_url?: string
  instagram_url?: string
  linkedin_url?: string
  twitter_url?: string
  youtube_url?: string
  meta_title?: string
  meta_description?: string
  google_analytics_id?: string
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const response = await fetch(`${API_URL}/api/settings/public`, {
      cache: 'no-store',
    })
    if (!response.ok) return {}
    const result = await response.json()
    return result.data || {}
  } catch {
    return {}
  }
}

// Export par défaut
export default {
  team: teamService,
  equipment: equipmentService,
  workshops: workshopsService,
  innovations: innovationsService,
  blog: blogService,
  ppn: ppnService,
  contact: contactService,
  projectSubmission: projectSubmissionService,
}
