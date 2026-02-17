import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import pool from './config/database';
import logger from './config/logger';
import authRoutes from './routes/authRoutes';
import teamRoutes from './routes/teamRoutes';
import serviceRoutes from './routes/serviceRoutes';
import contactRoutes from './routes/contactRoutes';
import projectSubmissionRoutes from './routes/projectSubmissionRoutes';
import statsRoutes from './routes/statsRoutes';
import blogRoutes from './routes/blogRoutes';
import notificationsRoutes from './routes/notificationsRoutes';
import uploadRoutes from './routes/uploadRoutes';
import ppnRoutes from './routes/ppnRoutes';
import equipmentRoutes from './routes/equipmentRoutes';
import workshopRoutes from './routes/workshopRoutes';
import innovationRoutes from './routes/innovationRoutes';
import userRoutes from './routes/userRoutes';
import mediaRoutes from './routes/mediaRoutes';
import settingsRoutes from './routes/settingsRoutes';
import pageRoutes from './routes/pageRoutes';

const app = express();

// Middleware de sécurité
app.use(helmet());

// CORS
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3501',
    process.env.ADMIN_URL || 'http://localhost:3502',
    'http://localhost:5001', // Frontend Next.js
    'http://localhost:5002', // Admin Vite
    'http://localhost:5173', // Vite dev server (default)
    'http://localhost:5174', // Vite dev server (alternate)
    'http://localhost:5175'  // Vite dev server (alternate)
  ],
  credentials: true
};

app.use(cors(corsOptions));

// Rate limiting - Désactivé en développement, augmenté en production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 10000 : 500, // Quasi illimité en dev
  skip: () => process.env.NODE_ENV === 'development', // Skip rate limiting en dev
  message: { error: 'Trop de requêtes, veuillez réessayer plus tard.' }
});

app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
} else {
  app.use(morgan('dev'));
}

// Serve uploaded files (public only - confidential are protected)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Bloquer accès direct aux fichiers confidentiels
app.use('/uploads/confidential', (req: Request, res: Response) => {
  res.status(403).json({ error: 'Accès refusé. Fichiers confidentiels.' });
});

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/project-submissions', projectSubmissionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ppn', ppnRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/innovations', innovationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/pages', pageRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'VoisiLab API',
    version: '2.0.0',
    database: 'MySQL',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      team: '/api/team',
      services: '/api/services',
      contacts: '/api/contacts',
      projectSubmissions: '/api/project-submissions',
      stats: '/api/stats',
      blog: '/api/blog',
      notifications: '/api/notifications'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.path
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur serveur';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  logger.info(`🚀 Serveur VoisiLab démarré sur le port ${PORT}`);
  logger.info(`📱 Mode: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3501'}`);
  logger.info(`🔧 Admin: ${process.env.ADMIN_URL || 'http://localhost:3502'}`);
});

export default app;
