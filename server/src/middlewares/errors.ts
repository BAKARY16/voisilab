import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import logger from '../config/logger';

/**
 * Validation error handler middleware
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Erreur de validation',
      details: errors.array()
    });
  }

  next();
};

/**
 * Async error handler wrapper
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not Found error
 */
export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string = 'Ressource non trouvée') {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}

/**
 * Validation error
 */
export class ValidationError extends Error {
  statusCode: number;

  constructor(message: string = 'Données invalides') {
    super(message);
    this.statusCode = 400;
    this.name = 'ValidationError';
  }
}

/**
 * Unauthorized error
 */
export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string = 'Non autorisé') {
    super(message);
    this.statusCode = 401;
    this.name = 'UnauthorizedError';
  }
}

/**
 * Forbidden error
 */
export class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string = 'Accès interdit') {
    super(message);
    this.statusCode = 403;
    this.name = 'ForbiddenError';
  }
}

/**
 * Database error
 */
export class DatabaseError extends Error {
  statusCode: number;

  constructor(message: string = 'Erreur de base de données') {
    super(message);
    this.statusCode = 500;
    this.name = 'DatabaseError';
  }
}
