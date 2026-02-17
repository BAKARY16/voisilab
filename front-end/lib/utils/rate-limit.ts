interface RateLimitEntry {
  count: number
  timestamp: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

/**
 * Vérifie si l'utilisateur a dépassé la limite de requêtes
 * @param identifier Identifiant unique (email, IP, etc.)
 * @param maxAttempts Nombre maximum de tentatives
 * @param windowMs Fenêtre de temps en millisecondes
 */
export const checkRateLimit = (
  identifier: string,
  maxAttempts: number = 3,
  windowMs: number = 60000 // 1 minute par défaut
): boolean => {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  // Si pas d'entrée ou fenêtre expirée, créer une nouvelle
  if (!entry || now - entry.timestamp > windowMs) {
    rateLimitMap.set(identifier, { count: 1, timestamp: now })
    return true
  }

  // Si limite dépassée
  if (entry.count >= maxAttempts) {
    return false
  }

  // Incrémenter le compteur
  entry.count++
  return true
}

/**
 * Obtenir le temps restant avant de pouvoir réessayer
 * @param identifier Identifiant unique
 * @param windowMs Fenêtre de temps en millisecondes
 */
export const getRemainingTime = (
  identifier: string,
  windowMs: number = 60000
): number => {
  const entry = rateLimitMap.get(identifier)
  if (!entry) return 0

  const elapsed = Date.now() - entry.timestamp
  const remaining = Math.ceil((windowMs - elapsed) / 1000)
  
  return remaining > 0 ? remaining : 0
}

/**
 * Réinitialiser le rate limit pour un identifiant
 * @param identifier Identifiant unique
 */
export const resetRateLimit = (identifier: string): void => {
  rateLimitMap.delete(identifier)
}

/**
 * Nettoyer les entrées expirées (à appeler périodiquement)
 * @param windowMs Fenêtre de temps en millisecondes
 */
export const cleanupRateLimit = (windowMs: number = 60000): void => {
  const now = Date.now()
  
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now - entry.timestamp > windowMs) {
      rateLimitMap.delete(key)
    }
  }
}