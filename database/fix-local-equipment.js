const mysql = require('mysql2/promise');

async function fixEquipment() {
  const pool = mysql.createPool({
    host: 'localhost', // MySQL Docker local
    port: 3306,
    user: 'voisilab_user',
    password: 'changez_moi_en_production',
    database: 'voisilab_db'
  });

  try {
    // Désactiver les contraintes de clés étrangères
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Supprimer la table existante
    await pool.query('DROP TABLE IF EXISTS equipment');
    console.log('Table supprimée');
    
    // Réactiver les contraintes
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    
    // Créer avec la bonne structure (correspondant au controller)
    await pool.query(`
      CREATE TABLE equipment (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) DEFAULT NULL,
        description TEXT,
        image_url VARCHAR(500) DEFAULT NULL,
        count_info VARCHAR(255) DEFAULT NULL,
        specs JSON DEFAULT NULL,
        status ENUM('available', 'maintenance', 'unavailable') DEFAULT 'available',
        category_color VARCHAR(100) DEFAULT NULL,
        gradient VARCHAR(100) DEFAULT NULL,
        order_index INT DEFAULT 0,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_status (status),
        INDEX idx_active (active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('Table créée avec la bonne structure');

    // Insérer les équipements
    const equipments = [
      {
        name: 'Imprimantes 3D FDM',
        category: 'Impression',
        description: 'Imprimantes 3D à dépôt de fil fondu pour prototypage rapide et pièces fonctionnelles. Idéales pour créer des objets en PLA, PETG ou TPU.',
        image_url: 'https://www.makeitmarseille.com/wp-content/uploads/2017/09/Make-it-Marseille-impression-3D-ultimaker-2.jpg',
        count_info: '3 machines',
        specs: JSON.stringify(['Volume 220x220x250mm', 'Précision 0.1mm', 'PLA/PETG/TPU']),
        category_color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        gradient: 'from-blue-500/10 to-cyan-500/10',
        order_index: 1
      },
      {
        name: 'Découpeuse Laser CO2',
        category: 'Découpe',
        description: 'Découpe et gravure laser sur bois, acrylique, cuir et autres matériaux. Permet des découpes précises et des gravures détaillées.',
        image_url: 'https://lefablab.fr/wp-content/uploads/2019/07/p7121491.jpg',
        count_info: '2 machines',
        specs: JSON.stringify(['Surface 600x400mm', 'Puissance 60W', 'Bois/Acrylique/Cuir']),
        category_color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        gradient: 'from-purple-500/10 to-pink-500/10',
        order_index: 2
      },
      {
        name: 'Machine à coudre SGGEMSY',
        category: 'Confection',
        description: 'Machine industrielle pour tous types de textiles avec finition professionnelle. Robuste et haute productivité.',
        image_url: 'https://lecoindupro.blob.core.windows.net/upload/2436551.Lg.jpg',
        count_info: '4 machines',
        specs: JSON.stringify(['Point droit et zigzag', 'Tissus légers à épais', 'Formation incluse']),
        category_color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
        gradient: 'from-green-500/10 to-emerald-500/10',
        order_index: 3
      },
      {
        name: 'Machine à broder BROTHER',
        category: 'Confection',
        description: 'Brodeuse haute performance avec large champ de 200x200mm, enfilage automatique et tri intelligent des couleurs.',
        image_url: 'https://agrilab.unilasalle.fr/projets/attachments/download/1906/machine001.jpg',
        count_info: '1 machine',
        specs: JSON.stringify(['Champ 200x200mm', '1000 points/min', 'Enfilage auto']),
        category_color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
        gradient: 'from-orange-500/10 to-red-500/10',
        order_index: 4
      },
      {
        name: 'Perceuse BOSCH PBD 40',
        category: 'Création',
        description: 'Perceuse à colonne de précision avec écran digital, laser de pointage et moteur 710W pour perçages parfaits sur bois et métal.',
        image_url: 'https://www.travaillerlebois.com/wp-content/uploads/2016/12/perceuse-a-colonne_bosch_pbd-40-23.jpg',
        count_info: '2 machines',
        specs: JSON.stringify(['Moteur 710W', 'Laser de pointage', 'Bois/Métal']),
        category_color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
        gradient: 'from-yellow-500/10 to-orange-500/10',
        order_index: 5
      },
      {
        name: 'Fraiseuse Numérique ShopBot',
        category: 'Création',
        description: 'Fraiseuse CNC robuste et polyvalente pour découpe et gravure de précision sur grands formats (bois, plastiques, métaux tendres).',
        image_url: 'https://lacasemate.fr/wp-content/uploads/2022/02/Fraiseuse_num%C3%A9rique.png',
        count_info: '1 machine',
        specs: JSON.stringify(['Surface 1200x600mm', 'Broche 24000 RPM', 'Bois/Alu/Plastique']),
        category_color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
        gradient: 'from-cyan-500/10 to-blue-500/10',
        order_index: 6
      }
    ];

    for (const eq of equipments) {
      await pool.query(
        'INSERT INTO equipment (name, category, description, image_url, count_info, specs, status, category_color, gradient, order_index, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [eq.name, eq.category, eq.description, eq.image_url, eq.count_info, eq.specs, 'available', eq.category_color, eq.gradient, eq.order_index, true]
      );
    }
    console.log(equipments.length + ' équipements insérés');
    
    // Vérifier
    const [rows] = await pool.query('SELECT id, name, category, status, active FROM equipment');
    console.log('Vérification - Équipements en base:');
    rows.forEach(r => console.log(`  - ${r.id}: ${r.name} (${r.category}) - ${r.status} - active:${r.active}`));
    
    await pool.end();
    console.log('\nTerminé avec succès!');
  } catch (err) {
    console.error('Erreur:', err.message);
    await pool.end();
    process.exit(1);
  }
}

fixEquipment();
