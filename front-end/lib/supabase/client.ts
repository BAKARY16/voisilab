import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables Supabase manquantes dans .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage buckets
export const STORAGE_BUCKETS = {
  PROJECT_FILES: 'project-files',
  WORKSHOP_IMAGES: 'workshop-images',
  TEAM_AVATARS: 'team-avatars',
  MEDIA_LIBRARY: 'media-library',
  BLOG_IMAGES: 'blog-images',
  PPN_IMAGES: 'ppn-images'
} as const

// Tables
export const TABLES = {
  USER_PROFILES: 'user_profiles',
  WORKSHOPS: 'workshops',
  WORKSHOP_REGISTRATIONS: 'workshop_registrations',
  SERVICES: 'services',
  CONTACT_MESSAGES: 'contact_messages',
  TEAM_MEMBERS: 'team_members',
  PPN_LOCATIONS: 'ppn_locations',
  PPN_MEMBERS: 'ppn_members',
  EQUIPMENT: 'equipment',
  BLOG_POSTS: 'blog_posts',
  DYNAMIC_PAGES: 'dynamic_pages',
  MEDIA_FILES: 'media_files',
  PROJECT_SUBMISSIONS: 'project_submissions',
  SITE_SETTINGS: 'site_settings'
} as const

// Legacy exports (pour compatibilité)
export const STORAGE_BUCKET = 'project-files'
export const PROJECTS_TABLE = 'project_submissions'