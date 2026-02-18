import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractToken, TokenPayload } from '../config/auth';
import logger from '../config/logger';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware pour vérifier l'authentification
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ error: 'Authentification requise' });
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    logger.error('Erreur d\'authentification:', error);
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

/**
 * Middleware pour vérifier le rôle administrateur (admin ou superadmin)
 */
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentification requise' });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  }

  next();
};

/**
 * Middleware pour vérifier le rôle SuperAdmin uniquement
 */
export const requireSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentification requise' });
  }

  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Accès réservé aux SuperAdmins uniquement' });
  }

  next();
};

/**
 * Middleware optionnel d'authentification (n'échoue pas si pas de token)
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (token) {
      const payload = verifyToken(token);
      req.user = payload;
    }
  } catch (error) {
    // Ignore errors for optional auth
  }

  next();
};
