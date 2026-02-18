#!/usr/bin/env node
/**
 * Migration complète : Ajout des colonnes formulaires
 * - contact_messages : 8 nouvelles colonnes
 * - project_submissions : 6 nouvelles colonnes + table submission_files
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const dbConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

/**
 * Vérifie si une colonne existe dans une table
 */
async function columnExists(connection, tableName, columnName) {
  const [rows] = await connection.query(
    `SELECT COLUMN_NAME 
     FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [dbConfig.database, tableName, columnName]
  );
  return rows.length > 0;
}

/**
 * Vérifie si une table existe
 */
async function tableExists(connection, tableName) {
  const [rows] = await connection.query(
    `SELECT TABLE_NAME 
     FROM INFORMATION_SCHEMA.TABLES 
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
    [dbConfig.database, tableName]
  );
  return rows.length > 0;
}

async function migrate() {
  let connection;

  try {
    console.log('🔌 Connexion à la base de données...');
    connection = await mysql.createConnection(dbConfig);
    console.log(`✅ Connecté à: ${dbConfig.database}\n`);

    // ============================================
    // 1. MIGRATION contact_messages
    // ============================================
    
    console.log('📝 Migration contact_messages...');
    
    const contactColumns = [
      { name: 'ip_address', sql: 'ip_address VARCHAR(45) NULL AFTER message' },
      { name: 'user_agent', sql: 'user_agent TEXT NULL AFTER ip_address' },
      { name: 'replied', sql: 'replied BOOLEAN DEFAULT FALSE AFTER user_agent' },
      { name: 'replied_at', sql: 'replied_at TIMESTAMP NULL AFTER replied' },
      { name: 'replied_by', sql: 'replied_by CHAR(36) NULL AFTER replied_at' },
      { name: 'reply_content', sql: 'reply_content TEXT NULL AFTER replied_by' },
      { name: 'notes', sql: 'notes TEXT NULL AFTER reply_content' },
      { name: 'tags', sql: 'tags JSON NULL AFTER notes' }
    ];

    for (const column of contactColumns) {
      const exists = await columnExists(connection, 'contact_messages', column.name);
      if (!exists) {
        await connection.query(`ALTER TABLE contact_messages ADD COLUMN ${column.sql}`);
        console.log(`  ✅ Ajouté: ${column.name}`);
      } else {
        console.log(`  ⏭️  Déjà présent: ${column.name}`);
      }
    }

    // ============================================
    // 2. MIGRATION project_submissions
    // ============================================
    
    console.log('\n📦 Migration project_submissions...');
    
    const projectColumns = [
      { name: 'ip_address', sql: 'ip_address VARCHAR(45) NULL AFTER description' },
      { name: 'user_agent', sql: 'user_agent TEXT NULL AFTER ip_address' },
      { name: 'submission_source', sql: 'submission_source VARCHAR(50) DEFAULT "web" AFTER user_agent' },
      { name: 'timeline', sql: 'timeline VARCHAR(100) NULL AFTER budget' },
      { name: 'review_notes', sql: 'review_notes TEXT NULL AFTER status' },
      { name: 'reviewed_by', sql: 'reviewed_by CHAR(36) NULL AFTER review_notes' }
    ];

    for (const column of projectColumns) {
      const exists = await columnExists(connection, 'project_submissions', column.name);
      if (!exists) {
        await connection.query(`ALTER TABLE project_submissions ADD COLUMN ${column.sql}`);
        console.log(`  ✅ Ajouté: ${column.name}`);
      } else {
        console.log(`  ⏭️  Déjà présent: ${column.name}`);
      }
    }

    // ============================================
    // 3. CRÉATION TABLE submission_files
    // ============================================
    
    console.log('\n📎 Table submission_files...');
    
    const submissionFilesExists = await tableExists(connection, 'submission_files');
    
    if (!submissionFilesExists) {
      await connection.query(`
        CREATE TABLE submission_files (
          id CHAR(36) PRIMARY KEY,
          submission_id CHAR(36) NOT NULL,
          original_filename VARCHAR(255) NOT NULL,
          stored_filename VARCHAR(255) NOT NULL,
          file_path VARCHAR(500) NOT NULL,
          file_size INT NOT NULL,
          mime_type VARCHAR(100) NULL,
          uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (submission_id) REFERENCES project_submissions(id) ON DELETE CASCADE,
          INDEX idx_submission_id (submission_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      console.log('  ✅ Table submission_files créée');
    } else {
      console.log('  ⏭️  Table submission_files existe déjà');
    }

    // ============================================
    // 4. FOREIGN KEYS
    // ============================================
    
    console.log('\n🔗 Vérification des clés étrangères...');
    
    // Vérifier FK replied_by dans contact_messages
    const [contactFKs] = await connection.query(
      `SELECT CONSTRAINT_NAME 
       FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'contact_messages' AND COLUMN_NAME = 'replied_by'`,
      [dbConfig.database]
    );
    
    if (contactFKs.length === 0) {
      try {
        await connection.query(`
          ALTER TABLE contact_messages 
          ADD CONSTRAINT fk_contact_replied_by 
          FOREIGN KEY (replied_by) REFERENCES users(id) ON DELETE SET NULL
        `);
        console.log('  ✅ FK contact_messages.replied_by → users.id');
      } catch (error) {
        console.log('  ⚠️  FK replied_by non créée (peut-être déjà existante)');
      }
    } else {
      console.log('  ⏭️  FK replied_by existe déjà');
    }

    // Vérifier FK reviewed_by dans project_submissions
    const [projectFKs] = await connection.query(
      `SELECT CONSTRAINT_NAME 
       FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'project_submissions' AND COLUMN_NAME = 'reviewed_by'`,
      [dbConfig.database]
    );
    
    if (projectFKs.length === 0) {
      try {
        await connection.query(`
          ALTER TABLE project_submissions 
          ADD CONSTRAINT fk_project_reviewed_by 
          FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
        `);
        console.log('  ✅ FK project_submissions.reviewed_by → users.id');
      } catch (error) {
        console.log('  ⚠️  FK reviewed_by non créée (peut-être déjà existante)');
      }
    } else {
      console.log('  ⏭️  FK reviewed_by existe déjà');
    }

    console.log('\n✅ Migration terminée avec succès !');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de la migration:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrate();
