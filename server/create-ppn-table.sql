-- Table pour les Points PPN (Pôles de Proximité Numérique)
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

-- Insertion des 3 PPN prédéfinis du front-end
INSERT INTO ppn_locations (id, name, city, region, address, type, latitude, longitude, services, email, phone, manager, opening_year, status, image) VALUES
('PPN-001', 'PPN Grand-Bassam', 'Grand-Bassam', 'Sud-Comoé', 'Grand Bassam, Côte d''Ivoire', 'Urban', 5.2198417, -3.7560239, 'Formation numérique,Hub technologique,Coworking', 'ppn.bassam@voisilab.ci', '+225 XX XX XX XX XX', 'Mme. Ange', 2023, 'active', '/images/ppn/bassam.jpg'),
('PPN-002', 'PPN Daloa', 'Daloa', 'Haut-Sassandra', 'Daloa, Côte d''Ivoire', 'Urban', 6.9076649, -6.4397508, 'Formation numérique,Hub technologique,Coworking,Impression 3D', 'ppn.daloa@voisilab.ci', '+225 XX XX XX XX XX', 'Mr. Koné', 2024, 'active', '/images/ppn/daloa.jpg'),
('PPN-003', 'PPN Andé', 'Andé', 'Indénié-Djuablin', 'Andé, Côte d''Ivoire', 'Rural', 6.7842169, -4.0913174, 'Formation numérique,Hub technologique', 'ppn.ande@voisilab.ci', '+225 XX XX XX XX XX', 'Mme. Yao', 2024, 'active', '/images/ppn/ande.jpg');
