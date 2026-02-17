-- ============================================
-- Table des notifications
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

-- Notifications de test pour l'admin existant
INSERT INTO notifications (user_id, type, title, message, link, is_read) 
SELECT id, 'system', 'Bienvenue dans VoisiLab', 'Votre compte administrateur a été créé avec succès.', '/profile', FALSE
FROM users 
WHERE role = 'admin' 
LIMIT 1;
