import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';
import { pool } from './config/database';
import logger from './config/logger';

// Import routes
import authRoutes from './routes/authRoutes';
import workshopRoutes from './routes/workshopRoutes';
import serviceRoutes from './routes/serviceRoutes';
import contactRoutes from './routes/contactRoutes';
import teamRoutes from './routes/teamRoutes';
import ppnRoutes from './routes/ppnRoutes';
import equipmentRoutes from './routes/equipmentRoutes';
import blogRoutes from './routes/blogRoutes';
import mediaRoutes from './routes/mediaRoutes';
import pageRoutes from './routes/pageRoutes';
import settingsRoutes from './routes/settingsRoutes';
import projectRoutes from './routes/projectRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:', 'http:'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));

// CORS configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.ADMIN_URL || 'http://localhost:3001',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});
app.use('/api/', limiter);

// Body parsing middleware
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

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/ppn', ppnRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.path
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Erreur serveur:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Serveur VoisiLab démarré sur le port ${PORT}`);
  logger.info(`📱 Mode: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  logger.info(`🔧 Admin: ${process.env.ADMIN_URL || 'http://localhost:3001'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM reçu, arrêt du serveur...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT reçu, arrêt du serveur...');
  await pool.end();
  process.exit(0);
});

export default app;
