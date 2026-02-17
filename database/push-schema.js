/**
 * Script pour pousser le schéma sur la base de données de production
 * Exécuter: node database/push-schema.js
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuration base de données production
const config = {
  host: 'srv1579.hstgr.io',
  port: 3306,
  user: 'u705315732_sinon',
  password: 'dHpLIN+M8h',
  database: 'u705315732_fablab',
  multipleStatements: true,
  charset: 'utf8mb4'
};

async function pushSchema() {
  console.log('🔌 Connexion à la base de données...');
  console.log(`   Host: ${config.host}`);
  console.log(`   Database: ${config.database}`);
  
  let connection;
  
  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Connexion établie!\n');
    
    // Lire le fichier schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Exécution du schéma SQL complet...\n');
    
    // Exécuter tout le schema d'un coup avec multipleStatements
    await connection.query(schema);
    
    console.log('✅ Schéma exécuté!\n');
    
    // Vérifier les tables créées
    console.log('📊 Tables dans la base de données:\n');
    const [tables] = await connection.query('SHOW TABLES');
    tables.forEach(t => {
      const tableName = Object.values(t)[0];
      console.log(`   • ${tableName}`);
    });
    
    // Compter les enregistrements
    console.log('\n📈 Données insérées:\n');
    const tablesToCheck = ['users', 'ppn_locations', 'blog_posts', 'settings'];
    for (const table of tablesToCheck) {
      try {
        const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   • ${table}: ${rows[0].count} enregistrements`);
      } catch (e) {
        // Table n'existe peut-être pas encore
      }
    }
    
    console.log('\n✅ Schéma poussé avec succès!');
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    if (err.sql) {
      console.error('   SQL problématique:', err.sql.substring(0, 100) + '...');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connexion fermée.');
    }
  }
}

pushSchema();
