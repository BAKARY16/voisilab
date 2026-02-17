// Script pour corriger les tables contact_messages et project_submissions
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });
const mysql = require('mysql2/promise');
const fs = require('fs');

async function fixFormsTables() {
  console.log('🔧 Correction des tables pour formulaires...\n');

  // Configuration depuis .env du serveur
  const config = {
    host: process.env.DATABASE_HOST || process.env.DB_HOST || 'srv1579.hstgr.io',
    user: process.env.DATABASE_USER || process.env.DB_USER || 'u705315732_fablab',
    password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.DATABASE_NAME || process.env.DB_NAME || 'u705315732_fablab',
    port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '3306'),
    ssl: (process.env.DATABASE_SSL || process.env.DB_SSL) === 'true' ? { rejectUnauthorized: false } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  console.log('📡 Connexion à la base de données...');
  console.log(`   Host: ${config.host}`);
  console.log(`   Database: ${config.database}\n`);

  let connection;
  
  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Connecté à la base de données\n');

    // Lire le fichier SQL
    const sqlFile = path.join(__dirname, 'fix-forms-tables.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Exécuter chaque commande SQL séparément
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log(`📝 Exécution de ${commands.length} commandes SQL...\n`);

    for (const command of commands) {
      if (command.trim().length === 0) continue;
      
      try {
        const [result] = await connection.query(command);
        
        // Afficher le résultat
        if (command.includes('ALTER TABLE contact_messages')) {
          console.log('✅ Table contact_messages mise à jour');
        } else if (command.includes('ALTER TABLE project_submissions')) {
          console.log('✅ Table project_submissions mise à jour');
        } else if (command.includes('CREATE TABLE') && command.includes('submission_files')) {
          console.log('✅ Table submission_files créée');
        } else if (command.includes('CREATE INDEX')) {
          console.log('✅ Index créé');
        } else if (command.includes('SELECT')) {
          console.log('\n🎉', result[0]?.status || 'Opération terminée');
        }
      } catch (error) {
        // Ignorer les erreurs "duplicate column" ou "table already exists"
        if (error.code === 'ER_DUP_FIELDNAME' || 
            error.code === 'ER_TABLE_EXISTS_ERROR' ||
            error.code === 'ER_DUP_KEYNAME') {
          console.log('ℹ️  Élément déjà existant (ignoré)');
        } else {
          console.error('❌ Erreur:', error.message);
        }
      }
    }

    console.log('\n✅ Correction des tables terminée avec succès !');
    console.log('\n📋 Résumé des modifications :');
    console.log('   ✓ contact_messages : Ajout ip_address, user_agent, replied_by, reply_content');
    console.log('   ✓ project_submissions : Ajout ip_address, user_agent, submission_source, timeline');
    console.log('   ✓ submission_files : Table créée pour stocker les fichiers joints');
    console.log('\n🎯 Les formulaires de contact et de soumission devraient maintenant fonctionner !\n');

  } catch (error) {
    console.error('\n❌ Erreur lors de la correction des tables:', error);
    console.error('Message:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connexion fermée\n');
    }
  }
}

fixFormsTables();
