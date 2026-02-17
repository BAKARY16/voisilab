// Script pour créer un utilisateur admin dans la base de données de production
// ATTENTION: À exécuter uniquement sur le serveur (SSH) ou depuis un environnement autorisé

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createProductionAdmin() {
  console.log('🔐 Création d\'un administrateur en production');
  console.log('=' .repeat(50));
  console.log('');
  
  // Configuration des identifiants admin par défaut
  const adminData = {
    full_name: 'Administrateur Voisilab',
    email: 'admin@fablab.voisilab.online',
    password: 'Admin@2026!Voisilab',  // Mot de passe par défaut - À CHANGER après connexion!
    role: 'admin'
  };

  console.log('📋 Informations du compte admin:');
  console.log(`   Full Name: ${adminData.full_name}`);
  console.log(`   Email: ${adminData.email}`);
  console.log(`   Password: ${adminData.password}`);
  console.log(`   Role: ${adminData.role}`);
  console.log('');
  console.log('⚠️  IMPORTANT: Changez ce mot de passe après la première connexion!');
  console.log('');

  // Connexion à la base de données
  const config = {
    host: process.env.DB_HOST || process.env.DATABASE_HOST || 'srv1579.hstgr.io',
    port: parseInt(process.env.DB_PORT || process.env.DATABASE_PORT || '3306'),
    user: process.env.DB_USER || process.env.DATABASE_USER || 'u705315732_fablab',
    password: process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD,
    database: process.env.DB_NAME || process.env.DATABASE_NAME || 'u705315732_fablab'
  };

  console.log(`📡 Connexion à: ${config.host}:${config.port}`);
  console.log(`🗄️  Base de données: ${config.database}`);
  console.log('');

  let connection;

  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Connexion à la base de données réussie!');
    console.log('');

    // Vérifier si la table users existe
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'users'"
    );

    if (tables.length === 0) {
      console.log('❌ Erreur: La table "users" n\'existe pas.');
      console.log('💡 Exécutez d\'abord: cd ../database && node push-schema.js');
      return;
    }

    // Vérifier si l'email existe déjà
    const [existingUsers] = await connection.execute(
      'SELECT id, email, full_name FROM users WHERE email = ?',
      [adminData.email]
    );

    if (existingUsers.length > 0) {
      console.log('⚠️  Un utilisateur avec cet email existe déjà:');
      existingUsers.forEach(user => {
        console.log(`   - ID: ${user.id}, Full Name: ${user.full_name}, Email: ${user.email}`);
      });
      console.log('');
      console.log('💡 Options:');
      console.log('   1. Utilisez cet utilisateur existant pour vous connecter');
      console.log('   2. Modifiez le script pour utiliser un autre email');
      console.log('   3. Supprimez l\'utilisateur existant si nécessaire');
      return;
    }

    // Hash du mot de passe
    console.log('🔒 Hashage du mot de passe...');
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Insérer l'utilisateur admin
    console.log('💾 Insertion de l\'administrateur dans la base de données...');
    const [result] = await connection.execute(
      `INSERT INTO users (email, password_hash, full_name, role, active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, TRUE, NOW(), NOW())`,
      [adminData.email, hashedPassword, adminData.full_name, adminData.role]
    );

    console.log('');
    console.log('✅ Administrateur créé avec succès!');
    console.log('');
    console.log('=' .repeat(50));
    console.log('🎉 COMPTE ADMIN CRÉÉ');
    console.log('=' .repeat(50));
    console.log('');
    console.log('📋 Informations de connexion:');
    console.log(`   ID: ${result.insertId}`);
    console.log(`   Full Name: ${adminData.full_name}`);
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Password: ${adminData.password}`);
    console.log('');
    console.log('🌐 Connectez-vous à:');
    console.log('   https://admin.fablab.voisilab.online');
    console.log('');
    console.log('⚠️  SÉCURITÉ:');
    console.log('   1. Connectez-vous immédiatement');
    console.log('   2. Changez le mot de passe via votre profil');
    console.log('   3. Ne partagez jamais ces identifiants');
    console.log('');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('');
      console.log('💡 Erreur d\'accès:');
      console.log('   Ce script doit être exécuté sur le serveur:');
      console.log('');
      console.log('   ssh jean1@69.62.106.191');
      console.log('   cd ~/voisilab/database');
      console.log('   node create-production-admin.js');
      console.log('');
    } else if (error.code === 'ER_DUP_ENTRY') {
      console.log('');
      console.log('💡 Un utilisateur avec cet email existe déjà.');
      console.log('   Modifiez l\'email dans le script ou utilisez create-admin.js');
      console.log('');
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('');
      console.log('💡 La table users n\'existe pas.');
      console.log('   Exécutez: node push-schema.js');
      console.log('');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connexion fermée.');
    }
  }
}

// Exécution
createProductionAdmin().catch(console.error);
