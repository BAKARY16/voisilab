-- ============================================
-- SCHEMA COMPLET BASE DE DONNÉES VOISILAB
-- ============================================
-- Exécuter ce fichier pour créer toute la structure
-- MySQL 8.0+
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ============================================
-- TABLE: users (Administrateurs)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'admin',
    avatar_url VARCHAR(500) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    organization VARCHAR(255) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: notifications
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL COMMENT 'contact, blog, project, system',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255) DEFAULT NULL COMMENT 'Lien vers la ressource concernée',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_is_read (is_read),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: team_members (Équipe)
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    image VARCHAR(500) DEFAULT NULL,
    linkedin VARCHAR(255) DEFAULT NULL,
    twitter VARCHAR(255) DEFAULT NULL,
    facebook VARCHAR(255) DEFAULT NULL,
    order_index INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (active),
    INDEX idx_order (order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: contacts (Messages de contact)
-- ============================================
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied', 'archived') DEFAULT 'unread',
    replied_at TIMESTAMP NULL DEFAULT NULL,
    reply_message TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: project_submissions (Soumissions de projet)
-- ============================================
CREATE TABLE IF NOT EXISTS project_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'Nom du demandeur',
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    organization VARCHAR(255) DEFAULT NULL,
    project_name VARCHAR(255) NOT NULL,
    project_type VARCHAR(100) NOT NULL COMMENT 'impression3d, prototypage, formation, etc.',
    description TEXT NOT NULL,
    budget VARCHAR(100) DEFAULT NULL,
    deadline DATE DEFAULT NULL,
    files_json JSON DEFAULT NULL COMMENT 'Fichiers joints en JSON',
    status ENUM('pending', 'reviewing', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    admin_notes TEXT DEFAULT NULL,
    reviewed_by VARCHAR(36) DEFAULT NULL,
    reviewed_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_project_type (project_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: services
-- ============================================
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    content LONGTEXT DEFAULT NULL,
    icon VARCHAR(100) DEFAULT NULL,
    image VARCHAR(500) DEFAULT NULL,
    order_index INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: workshops (Ateliers)
-- ============================================
CREATE TABLE IF NOT EXISTS workshops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    content LONGTEXT DEFAULT NULL,
    date DATETIME NOT NULL,
    end_date DATETIME DEFAULT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INT DEFAULT 20,
    registered INT DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    image VARCHAR(500) DEFAULT NULL,
    instructor VARCHAR(255) DEFAULT NULL,
    level ENUM('debutant', 'intermediaire', 'avance') DEFAULT 'debutant',
    category VARCHAR(100) DEFAULT NULL,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_date (date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: workshop_registrations (Inscriptions ateliers)
-- ============================================
CREATE TABLE IF NOT EXISTS workshop_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workshop_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    organization VARCHAR(255) DEFAULT NULL,
    message TEXT DEFAULT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON DELETE CASCADE,
    INDEX idx_workshop (workshop_id),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: equipment (Équipements/Matériels)
-- ============================================
CREATE TABLE IF NOT EXISTS equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT NULL,
    description TEXT,
    image_url VARCHAR(500) DEFAULT NULL,
    count_info VARCHAR(255) DEFAULT NULL,
    specs JSON DEFAULT NULL,
    status ENUM('available', 'maintenance', 'unavailable') DEFAULT 'available',
    category_color VARCHAR(50) DEFAULT NULL,
    gradient VARCHAR(100) DEFAULT NULL,
    order_index INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données initiales équipements
INSERT INTO equipment (name, category, description, image_url, count_info, specs, status, category_color, gradient, order_index, active) VALUES
('Imprimante 3D FDM', 'Impression', 'Imprimantes 3D à dépôt de fil fondu pour prototypage rapide', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800', '3 machines', '["Volume 220x220x250mm", "Précision 0.1mm", "PLA/PETG/TPU"]', 'available', 'blue', 'from-blue-500/10 to-cyan-500/10', 1, TRUE),
('Imprimante Résine SLA', 'Impression', 'Impression haute résolution pour détails fins et bijoux', 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800', '2 machines', '["Résolution 50 microns", "Volume 192x120x200mm", "Résines standards et flexibles"]', 'available', 'purple', 'from-purple-500/10 to-pink-500/10', 2, TRUE),
('Découpeuse Laser CO2', 'Découpe', 'Découpe et gravure laser sur bois, acrylique, cuir', 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800', '2 machines', '["Surface 600x400mm", "Puissance 60W", "Bois/Acrylique/Cuir"]', 'available', 'orange', 'from-orange-500/10 to-red-500/10', 3, TRUE),
('Machine à Coudre Industrielle', 'Confection', 'Machines à coudre professionnelles pour textiles', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', '4 machines', '["Point droit et zigzag", "Tissus légers à épais", "Formation incluse"]', 'available', 'pink', 'from-pink-500/10 to-rose-500/10', 4, TRUE),
('Fraiseuse CNC', 'Création', 'Usinage CNC pour bois, aluminium et plastiques', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800', '1 machine', '["Surface 300x400mm", "Broche 24000 RPM", "Bois/Alu/Plastique"]', 'available', 'green', 'from-green-500/10 to-emerald-500/10', 5, TRUE),
('Kit Arduino & Électronique', 'Création', 'Composants électroniques pour projets IoT et robotique', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', 'Kits disponibles', '["Arduino/ESP32/Raspberry", "Capteurs variés", "Composants de base"]', 'available', 'cyan', 'from-cyan-500/10 to-blue-500/10', 6, TRUE);

-- ============================================
-- TABLE: innovations
-- ============================================
CREATE TABLE IF NOT EXISTS innovations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) DEFAULT NULL UNIQUE,
    description TEXT NOT NULL,
    content LONGTEXT DEFAULT NULL,
    category VARCHAR(100) DEFAULT NULL,
    creator_name VARCHAR(255) DEFAULT NULL,
    creator_email VARCHAR(255) DEFAULT NULL,
    image_url TEXT DEFAULT NULL,
    tags JSON DEFAULT NULL,
    status ENUM('draft', 'pending', 'published', 'archived') DEFAULT 'draft',
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    likes INT DEFAULT 0,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_published (is_published),
    INDEX idx_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: blog_posts (Actualités)
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    featured_image VARCHAR(500),
    author_id VARCHAR(36) DEFAULT NULL,
    category VARCHAR(100),
    tags JSON,
    status ENUM('draft', 'published', 'archived') DEFAULT 'published',
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords JSON,
    og_image VARCHAR(500),
    views INT DEFAULT 0,
    published_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: ppn_locations (Points PPN)
-- ============================================
CREATE TABLE IF NOT EXISTS ppn_locations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    address TEXT,
    type ENUM('Urban', 'Rural', 'Mixed') NOT NULL DEFAULT 'Urban',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    services TEXT COMMENT 'Services séparés par des virgules',
    email VARCHAR(255),
    phone VARCHAR(20),
    manager VARCHAR(255),
    opening_year INT,
    status ENUM('planned', 'construction', 'active') NOT NULL DEFAULT 'planned',
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: pages (Pages CMS)
-- ============================================
CREATE TABLE IF NOT EXISTS pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content LONGTEXT DEFAULT NULL,
    meta_title VARCHAR(255) DEFAULT NULL,
    meta_description TEXT DEFAULT NULL,
    status ENUM('draft', 'published') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: settings (Paramètres site)
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('text', 'number', 'boolean', 'json', 'image') DEFAULT 'text',
    category VARCHAR(50) DEFAULT 'general',
    description VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: media (Médiathèque)
-- ============================================
CREATE TABLE IF NOT EXISTS media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INT NOT NULL,
    path VARCHAR(500) NOT NULL,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255) DEFAULT NULL,
    uploaded_by VARCHAR(36) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_mime (mime_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DONNÉES INITIALES
-- ============================================

-- Insérer les PPN
INSERT INTO ppn_locations (id, name, city, region, address, type, latitude, longitude, services, email, phone, manager, opening_year, status) VALUES
('PPN-001', 'PPN Bassam', 'Abidjan', 'Sud-Comoé', 'Grand Bassam', 'Urban', 5.2198417, -3.7560239, 'Formation numérique, Hub technologique, Coworking, Impression 3D', 'incubateur@uvci.edu.ci', '+225 07 09 90 14 81', 'Dr. ...', 2025, 'active'),
('PPN-002', 'PPN Daloa', 'Daloa', 'Haut-Sassandra', 'UJLOG, Nouveau Bâtiment TD, Daloa', 'Urban', 6.9076649, -6.4397508, 'Formation numérique, Modélisation 3D, Robotique', 'incubateur@uvci.edu.ci', '+225 07 09 90 14 81', 'Mme ...', 2020, 'active'),
('PPN-003', 'PPN Andé', 'Andé', 'Moronou', 'Andé', 'Rural', 6.7842169, -4.0913174, 'Formation professionnelle, Hub technologique, E-commerce', 'incubateur@uvci.edu.ci', '+225 07 09 90 14 81', 'M. ...', 2026, 'active'),
('PPN-004', 'PPN Dingouin', 'Dingouin', 'Tonkpi', 'Dingouin', 'Urban', 6.832726, -7.673690, 'Formation professionnelle, Hub technologique, E-commerce', 'incubateur@uvci.edu.ci', '+225 07 09 90 14 81', 'M. ...', 2020, 'active'),
('PPN-005', 'PPN Bouaké Centre', 'Bouaké', 'Gbêkê', 'Quartier Commerce, Avenue Houphouët', 'Urban', 7.7005337, -5.1080258, 'Formation numérique, Hub technologique, Agriculture intelligente', 'incubateur@uvci.edu.ci', '+225 07 09 90 14 81', 'Dr. ...', 2019, 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insérer les actualités de base
INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, category, status, published_at) VALUES
('Technologies satellitaires : L''UVCI accueille un atelier régional', 'technologies-satellitaires-uvci-atelier-regional', 'Le Directeur de Cabinet du ministère de l''Enseignement supérieur et de la Recherche scientifique a procédé à l''ouverture officielle de l''atelier régional sur les technologies satellitaires.', '<p>Le Directeur de Cabinet du ministère de l''Enseignement supérieur et de la Recherche scientifique, Prof. Kobéa Arsène, a procédé à l''ouverture officielle de l''atelier régional sur les technologies satellitaires, organisé par l''Université Virtuelle de Côte d''Ivoire.</p>', 'https://uvci.online/portail/externes/images/actualites/17052016-1C4A10911.jpg', 'Événement', 'published', NOW()),
('Renforcement de la formation : L''UVCI et l''IPNETP scellent un partenariat', 'uvci-ipnetp-partenariat-strategique', 'L''Université Virtuelle de Côte d''Ivoire et l''IPNETP ont signé une convention de partenariat stratégique.', '<p>L''Université Virtuelle de Côte d''Ivoire et l''Institut Pédagogique National de l''Enseignement Technique et Professionnel ont signé une convention de partenariat.</p>', 'https://uvci.online/portail/externes/images/actualites/16052016-1C4A0236.jpg', 'Événement', 'published', NOW())
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Paramètres par défaut
INSERT INTO settings (setting_key, setting_value, setting_type, category, description) VALUES
('site_name', 'VoisiLab', 'text', 'general', 'Nom du site'),
('site_description', 'FabLab de l''Université Virtuelle de Côte d''Ivoire', 'text', 'general', 'Description du site'),
('contact_email', 'contact@voisilab.ci', 'text', 'contact', 'Email de contact'),
('contact_phone', '+225 07 09 90 14 81', 'text', 'contact', 'Téléphone de contact'),
('contact_address', 'Abidjan, Côte d''Ivoire', 'text', 'contact', 'Adresse'),
('social_facebook', '', 'text', 'social', 'Page Facebook'),
('social_twitter', '', 'text', 'social', 'Compte Twitter'),
('social_linkedin', '', 'text', 'social', 'Page LinkedIn'),
('social_instagram', '', 'text', 'social', 'Compte Instagram')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);