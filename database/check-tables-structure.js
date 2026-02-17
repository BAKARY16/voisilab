// Script pour vérifier la structure des tables contact_messages et project_submissions
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });
const mysql = require('mysql2/promise');

async function checkTablesStructure() {
  console.log('🔍 Vérification de la structure des tables...\n');

  const config = {
    host: process.env.DATABASE_HOST || process.env.DB_HOST || 'srv1579.hstgr.io',
    user: process.env.DATABASE_USER || process.env.DB_USER || 'u705315732_fablab',
    password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.DATABASE_NAME || process.env.DB_NAME || 'u705315732_fablab',
    port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '3306'),
    ssl: (process.env.DATABASE_SSL || process.env.DB_SSL) === 'true' ? { rejectUnauthorized: false } : undefined,
  };

  console.log('📡 Connexion à la base de données...');
  console.log(`   Host: ${config.host}`);
  console.log(`   Database: ${config.database}\n`);

  let connection;
  
  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Connecté à la base de données\n');

    // Vérifier contact_messages
    console.log('📋 Structure de contact_messages:');
    const [contactColumns] = await connection.query('DESCRIBE contact_messages');
    console.table(contactColumns.map(col => ({
      Champ: col.Field,
      Type: col.Type,
      Null: col.Null,
      Default: col.Default
    })));

    // Vérifier si les colonnes requises existent
    const requiredContactColumns = ['lastname', 'firstname', 'email', 'phone', 'subject', 'message', 'ip_address', 'user_agent'];
    const existingContactColumns = contactColumns.map(col => col.Field);
    
    console.log('\n✅ Colonnes présentes dans contact_messages:');
    requiredContactColumns.forEach(col => {
      const exists = existingContactColumns.includes(col);
      console.log(`   ${exists ? '✓' : '✗'} ${col}${!exists ? ' (MANQUANT!)' : ''}`);
    });

    // Vérifier project_submissions
    console.log('\n📋 Structure de project_submissions:');
    const [projectColumns] = await connection.query('DESCRIBE project_submissions');
    console.table(projectColumns.map(col => ({
      Champ: col.Field,
      Type: col.Type,
      Null: col.Null,
      Default: col.Default
    })));

    // Vérifier si les colonnes requises existent
    const requiredProjectColumns = ['name', 'email', 'phone', 'project_type', 'budget', 'timeline', 'description', 'ip_address', 'user_agent', 'submission_source'];
    const existingProjectColumns = projectColumns.map(col => col.Field);
    
    console.log('\n✅ Colonnes présentes dans project_submissions:');
    requiredProjectColumns.forEach(col => {
      const exists = existingProjectColumns.includes(col);
      console.log(`   ${exists ? '✓' : '✗'} ${col}${!exists ? ' (MANQUANT!)' : ''}`);
    });

    // Vérifier submission_files
    try {
      const [filesColumns] = await connection.query('DESCRIBE submission_files');
      console.log('\n📋 Structure de submission_files:');
      console.table(filesColumns.map(col => ({
        Champ: col.Field,
        Type: col.Type,
        Null: col.Null
      })));
    } catch (error) {
      console.log('\n❌ Table submission_files n\'existe pas');
    }

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connexion fermée\n');
    }
  }
}

checkTablesStructure();
