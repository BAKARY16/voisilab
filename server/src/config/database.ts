import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

// Configuration du pool de connexions MySQL
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  user: process.env.DATABASE_USER || 'voisilab_user',
  password: process.env.DATABASE_PASSWORD || 'voisilab',
  database: process.env.DATABASE_NAME || 'voisilab_db',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000, // ping toutes les 10s pour éviter ECONNRESET
  connectTimeout: 20000,
});

// Test initial de connexion (non-bloquant)
pool.getConnection()
  .then(connection => {
    logger.info('✅ Connexion MySQL établie avec succès');
    connection.release();
  })
  .catch(error => {
    logger.error('❌ Impossible de se connecter à MySQL:', error);
  });

// Gestion des erreurs del pool
pool.on('connection', (connection) => {
  logger.info('✅ Nouvelle connexion à la base de données MySQL');
});

export { pool };
export default pool;
