-- Table des actualités (blog_posts)
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    featured_image VARCHAR(500),
    author_id INT,
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
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer les actualités existantes
INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, category, status, published_at) VALUES
(
    'Technologies satellitaires : L''UVCI accueille un atelier régional',
    'technologies-satellitaires-uvci-atelier-regional',
    'Le Directeur de Cabinet du ministère de l''Enseignement supérieur et de la Recherche scientifique, Prof. Kobéa Arsène, a procédé mardi 27 janvier 2026 à Cocody-II Plateaux, à l''ouverture officielle de l''atelier régional sur les technologies satellitaires, organisé par l''Université Virtuelle de Côte d''Ivoire.',
    '<p>Le Directeur de Cabinet du ministère de l''Enseignement supérieur et de la Recherche scientifique, Prof. Kobéa Arsène, a procédé mardi 27 janvier 2026 à Cocody-II Plateaux, à l''ouverture officielle de l''atelier régional sur les technologies satellitaires, organisé par l''Université Virtuelle de Côte d''Ivoire.</p><p>Cet événement majeur réunit des experts régionaux pour discuter des avancées et applications des technologies satellitaires dans l''enseignement supérieur et la recherche scientifique.</p>',
    'https://uvci.online/portail/externes/images/actualites/17052016-1C4A10911.jpg',
    'Événement',
    'published',
    '2026-01-30 10:00:00'
),
(
    'Renforcement de la formation et de l''innovation : L''UVCI et l''IPNETP scellent un partenariat stratégique',
    'uvci-ipnetp-partenariat-strategique',
    'C''est le début d''une belle aventure entre deux références du secteur Education-formation. L''Université Virtuelle de Côte d''Ivoire (UVCI) et l''Institut Pédagogique National de l''Enseignement Technique et Professionnel (IPNETP) ont signé, lundi 26 janvier 2026, une convention de partenariat dans les locaux de l''IPNETP à Cocody.',
    '<p>C''est le début d''une belle aventure entre deux références du secteur Education-formation. L''Université Virtuelle de Côte d''Ivoire (UVCI) et l''Institut Pédagogique National de l''Enseignement Technique et Professionnel (IPNETP) ont signé, lundi 26 janvier 2026, une convention de partenariat dans les locaux de l''IPNETP à Cocody.</p><p>Ce partenariat stratégique vise à renforcer les capacités en formation technique et professionnelle tout en favorisant l''innovation pédagogique à travers le numérique.</p>',
    'https://uvci.online/portail/externes/images/actualites/16052016-1C4A0236.jpg',
    'Événement',
    'published',
    '2026-01-29 09:00:00'
),
(
    'L''Université Virtuelle de Côte d''Ivoire et l''Université Numérique du Tchad signent un accord de partenariat',
    'uvci-tchad-accord-partenariat',
    'Dans le cadre de la coopération interuniversitaire, l''Université Virtuelle de Côte d''Ivoire et l''Université Numérique du Tchad ont procédé à une signature de convention ce lundi 26 janvier 2026',
    '<p>Dans le cadre de la coopération interuniversitaire, l''Université Virtuelle de Côte d''Ivoire et l''Université Numérique du Tchad ont procédé à une signature de convention ce lundi 26 janvier 2026.</p><p>Cette collaboration internationale marque une étape importante dans le renforcement de la coopération sud-sud et le partage d''expertises en matière d''enseignement numérique et à distance.</p>',
    'https://uvci.online/portail/externes/images/actualites/26012026-Capture_décran_2026-01-26_170534.jpg',
    'Cérémonie',
    'published',
    '2026-01-27 14:00:00'
);
