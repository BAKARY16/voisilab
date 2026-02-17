-- ============================================
-- FIX TABLES POUR FORMULAIRES DE CONTACT ET PROJETS
-- Ajouter les colonnes manquantes
-- ============================================

-- Fix contact_messages - Ajouter colonnes sécurité
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45) DEFAULT NULL COMMENT 'Adresse IP du visiteur',
ADD COLUMN IF NOT EXISTS user_agent VARCHAR(500) DEFAULT NULL COMMENT 'User agent du navigateur',
ADD COLUMN IF NOT EXISTS replied_by VARCHAR(36) DEFAULT NULL COMMENT 'ID admin qui a répondu',
ADD COLUMN IF NOT EXISTS reply_content TEXT DEFAULT NULL COMMENT 'Contenu de la réponse';

-- Créer index pour sécurité
CREATE INDEX IF NOT EXISTS idx_ip_address ON contact_messages(ip_address);

-- Fix project_submissions - Ajouter colonnes manquantes
ALTER TABLE project_submissions 
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45) DEFAULT NULL COMMENT 'Adresse IP du visiteur',
ADD COLUMN IF NOT EXISTS user_agent VARCHAR(500) DEFAULT NULL COMMENT 'User agent du navigateur',
ADD COLUMN IF NOT EXISTS submission_source VARCHAR(50) DEFAULT 'web' COMMENT 'Source de la soumission',
ADD COLUMN IF NOT EXISTS timeline VARCHAR(100) DEFAULT NULL COMMENT 'Délai souhaité';

-- Renommer deadline en old_deadline (temporairement) si elle existe
-- ALTER TABLE project_submissions CHANGE deadline old_deadline DATE DEFAULT NULL;

-- Créer index pour sécurité
CREATE INDEX IF NOT EXISTS idx_ip_address ON project_submissions(ip_address);
CREATE INDEX IF NOT EXISTS idx_submission_source ON project_submissions(submission_source);

-- Créer table submission_files si elle n'existe pas (pour les fichiers joints)
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Tables contact_messages et project_submissions corrigées avec succès !' as status;
