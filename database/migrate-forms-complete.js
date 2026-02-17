// Script de migration robuste pour ajouter les colonnes manquantes
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });
const mysql = require('mysql2/promise');

async function migrateDatabase() {
  console.log('🔄 Migration de la base de données...\n');

  const config = {
    host: process.env.DATABASE_HOST || process.env.DB_HOST || 'srv1579.hstgr.io',
    user: process.env.DATABASE_USER || process.env.DB_USER || 'u705315732_fablab',
    password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.DATABASE_NAME || process.env.DB_NAME || 'u705315732_fablab',
    port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '3306'),
    ssl: (process.env.DATABASE_SSL || process.env.DB_SSL) === 'true' ? { rejectUnauthorized: false } : undefined,
    multipleStatements: true
  };

  console.log('📡 Connexion à la base de données...');
  console.log(`   Host: ${config.host}`);
  console.log(`   Database: ${config.database}\n`);

  let connection;
  
  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Connecté à la base de données\n');

    // Fonction helper pour vérifier si une colonne existe
    async function columnExists(tableName, columnName) {
      const [rows] = await connection.query(
        `SELECT COUNT(*) as count FROM information_schema.COLUMNS 
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
        [config.database, tableName, columnName]
      );
      return rows[0].count > 0;
    }

    // Fonction helper pour ajouter une colonne
    async function addColumn(tableName, columnDef, columnName) {
      const exists = await columnExists(tableName, columnName);
      if (!exists) {
        await connection.query(`ALTER TABLE ${tableName} ${columnDef}`);
        console.log(`   ✅ Colonne ${columnName} ajoutée à ${tableName}`);
        return true;
      } else {
        console.log(`   ℹ️  Colonne ${columnName} existe déjà dans ${tableName}`);
        return false;
      }
    }

    // Fonction helper pour créer un index
    async function createIndex(tableName, indexName, columnName) {
      try {
        await connection.query(
          `CREATE INDEX ${indexName} ON ${tableName}(${columnName})`
        );
        console.log(`   ✅ Index ${indexName} créé sur ${tableName}.${columnName}`);
      } catch (error) {
        if (error.code === 'ER_DUP_KEYNAME') {
          console.log(`   ℹ️  Index ${indexName} existe déjà`);
        } else {
          console.log(`   ⚠️  Erreur création index ${indexName}: ${error.message}`);
        }
      }
    }

    console.log('📝 Migration table contact_messages...');
    
    // Ajouter colonnes à contact_messages
    await addColumn('contact_messages', 
      `ADD COLUMN ip_address VARCHAR(45) DEFAULT NULL COMMENT 'Adresse IP du visiteur'`,
      'ip_address');
    
    await addColumn('contact_messages',
      `ADD COLUMN user_agent VARCHAR(500) DEFAULT NULL COMMENT 'User agent du navigateur'`,
      'user_agent');
    
    await addColumn('contact_messages',
      `ADD COLUMN replied_by VARCHAR(36) DEFAULT NULL COMMENT 'ID admin qui a répondu'`,
      'replied_by');
    
    await addColumn('contact_messages',
      `ADD COLUMN reply_content TEXT DEFAULT NULL COMMENT 'Contenu de la réponse'`,
      'reply_content');

    // Créer index pour contact_messages
    await createIndex('contact_messages', 'idx_cm_ip_address', 'ip_address');

    console.log('\n📝 Migration table project_submissions...');
    
    // Ajouter colonnes à project_submissions
    await addColumn('project_submissions',
      `ADD COLUMN ip_address VARCHAR(45) DEFAULT NULL COMMENT 'Adresse IP du visiteur'`,
      'ip_address');
    
    await addColumn('project_submissions',
      `ADD COLUMN user_agent VARCHAR(500) DEFAULT NULL COMMENT 'User agent du navigateur'`,
      'user_agent');
    
    await addColumn('project_submissions',
      `ADD COLUMN submission_source VARCHAR(50) DEFAULT 'web' COMMENT 'Source de la soumission'`,
      'submission_source');
    
    await addColumn('project_submissions',
      `ADD COLUMN timeline VARCHAR(100) DEFAULT NULL COMMENT 'Délai souhaité'`,
      'timeline');

    // Créer index pour project_submissions
    await createIndex('project_submissions', 'idx_ps_ip_address', 'ip_address');
    await createIndex('project_submissions', 'idx_ps_submission_source', 'submission_source');

    console.log('\n📝 Création table submission_files...');
    
    // Créer table submission_files
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS submission_files (
          id INT AUTO_INCREMENT PRIMARY KEY,
          submission_id INT NOT NULL,
          original_filename VARCHAR(255) NOT NULL,
          stored_filename VARCHAR(255) NOT NULL,
          file_path VARCHAR(500) NOT NULL,
          file_size BIGINT NOT NULL COMMENT 'Taille en octets',
          mime_type VARCHAR(100) NOT NULL,
          file_extension VARCHAR(10) DEFAULT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_submission_id (submission_id),
          FOREIGN KEY (submission_id) REFERENCES project_submissions(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('   ✅ Table submission_files créée');
    } catch (error) {
      if (error.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log('   ℹ️  Table submission_files existe déjà');
      } else {
        console.log(`   ⚠️  Erreur création table: ${error.message}`);
      }
    }

    console.log('\n✅ Migration terminée avec succès !');
    console.log('\n📋 Résumé :');
    console.log('   ✓ contact_messages : ip_address, user_agent, replied_by, reply_content');
    console.log('   ✓ project_submissions : ip_address, user_agent, submission_source, timeline');
    console.log('   ✓ submission_files : Table créée');
    console.log('\n🎯 Les formulaires devraient maintenant fonctionner correctement !');

  } catch (error) {
    console.error('\n❌ Erreur lors de la migration:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connexion fermée\n');
    }
  }
}

migrateDatabase();
