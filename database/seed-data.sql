-- ============================================================
-- SEED DATA — Voisilab
-- Exécuter ce fichier UNE SEULE FOIS pour peupler la DB.
-- Les données statiques du frontend sont déplacées ici.
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ============================================================
-- TEAM MEMBERS (équipe)
-- Les paths sont relatifs au serveur → /uploads/team/...
-- ============================================================

-- Vider avant d'insérer pour éviter les doublons (optionnel)
-- TRUNCATE TABLE team_members;

INSERT INTO team_members (name, role, email, bio, image, linkedin, order_index, active) VALUES
(
  'Evih Elia Elienai Berenice',
  'Chef équipe & Project Manager',
  'elia.evih@uvci.edu.ci',
  'Leader engagée et passionnée par les technologies de fabrication numérique. Elle pilote les projets stratégiques et anime la communauté Voisilab avec une énergie communicative.',
  '/uploads/team/elia.jpeg',
  'https://www.linkedin.com/in/elia-evih-a93015352',
  1,
  TRUE
),
(
  'Gautier Oulai Mombo',
  'Chef équipe & Project Manager',
  'gautier.mombo@uvci.edu.ci',
  'Architecte rigoureux de projets complexes, Gautier transforme les idées en feuilles de route concrètes. Son approche structurée et son sens de l''écoute font de lui le pivot entre les équipes techniques et les clients.',
  '/uploads/team/gautier.png',
  'https://www.linkedin.com/in/gautier-oulai-mombo-3b37a2292/',
  2,
  TRUE
),
(
  'Hermane Nguessan Junior',
  'Développeur Full-stack',
  'hermane.nguessan@uvci.edu.ci',
  'Passionné d''architecture web, Hermane construit les fondations techniques de Voisilab avec une exigence de qualité et une curiosité permanente pour les nouvelles technologies.',
  '/uploads/team/devs1.jpg',
  'https://www.linkedin.com/in/hermane-junior-nguessan-2a9a05324',
  3,
  TRUE
),
(
  'Dallo Mardochée Désiré',
  'Développeur Full-stack',
  'gbalou.dallo@uvci.edu.ci',
  'Expert en développement full-stack, Dallo garantit la robustesse et la scalabilité de nos plateformes. Son souci du détail et son approche orientée performance font la fiabilité de nos services.',
  '/uploads/team/dev2.jpg',
  NULL,
  4,
  TRUE
),
(
  'Sinon Bakary',
  'Développeur Front-end & Data Scientist',
  'bakary.sinon@uvci.edu.ci',
  'Alliant créativité et rigueur analytique, Bakary conçoit des interfaces modernes et exploite la data pour améliorer continuellement nos services. Double expertise rare et précieuse.',
  '/uploads/team/dev3.png',
  'https://www.linkedin.com/in/bakary-sinon-29799a275/',
  5,
  TRUE
),
(
  'Blé Blango Flavien',
  'Modélisateur 3D & VFX Artist',
  'ble.flavien@uvci.edu.ci',
  'Véritable artiste de la fabrication numérique, Flavien donne vie aux idées les plus ambitieuses grâce à une maîtrise pointue de la modélisation 3D et des effets visuels.',
  '/uploads/team/ble.png',
  NULL,
  6,
  TRUE
),
(
  'Sai Jovencia Emmanuella',
  'Modélisation 3D & Impression',
  'sai.jovencia@uvci.edu.ci',
  'Passionnée de design 3D, Jovencia développe ses compétences en conception et impression 3D pour créer des objets innovants et fonctionnels.',
  '/uploads/team/sai.jpeg',
  NULL,
  7,
  TRUE
);

-- ============================================================
-- SERVICES
-- La colonne "features" est un tableau JSON.
-- "image" et "image_url" stockent le même chemin.
-- ============================================================

-- Vider avant d'insérer pour éviter les doublons (optionnel)
-- TRUNCATE TABLE services;

INSERT INTO services (title, name, slug, description, icon, features, image_url, image, order_index, active) VALUES
(
  'Impression 2D/3D',
  'Impression 2D/3D',
  'impression-2d-3d',
  'Prototypage rapide et production de pièces personnalisées en FDM et résine. Nous vous accompagnons du fichier numérique à la pièce finale.',
  'PrinterOutlined',
  JSON_ARRAY('Prototypage rapide', 'Petites séries', 'Matériaux variés (PLA, PETG, Résine)'),
  'https://mecaluxfr.cdnwm.com/blog/img/fabrication-additive-production.1.1.jpg',
  'https://mecaluxfr.cdnwm.com/blog/img/fabrication-additive-production.1.1.jpg',
  1,
  TRUE
),
(
  'Architecture & Dev Digital',
  'Architecture & Dev Digital',
  'architecture-dev-digital',
  'Conception et déploiement de solutions logicielles performantes, optimisées pour vos besoins métiers. Du site web à l''application mobile.',
  'CodeOutlined',
  JSON_ARRAY('Conception d''applications Web & Mobile', 'Audit & Architecture SI', 'Cloud & API'),
  'https://media.vertuoz.fr/uploads/Article_Quels_sont_les_avantages_d_un_developpement_informatique_sur_mesure_66c3ed4303.jpeg',
  'https://media.vertuoz.fr/uploads/Article_Quels_sont_les_avantages_d_un_developpement_informatique_sur_mesure_66c3ed4303.jpeg',
  2,
  TRUE
),
(
  'Robotique',
  'Robotique',
  'robotique',
  'Conception et programmation de robots pour des applications variées : éducation, automatisation industrielle ou projets sur mesure.',
  'RobotOutlined',
  JSON_ARRAY('Robots éducatifs', 'Automatisation de processus', 'Projets robotiques sur mesure'),
  'https://www.aq-tech.fr/fr/wp-content/uploads/sites/5/2022/12/Diff%C3%A9rents-types-de-prototype-700x700.jpg',
  'https://www.aq-tech.fr/fr/wp-content/uploads/sites/5/2022/12/Diff%C3%A9rents-types-de-prototype-700x700.jpg',
  3,
  TRUE
),
(
  'Électronique & IoT',
  'Électronique & IoT',
  'electronique-iot',
  'Développement de solutions connectées avec Arduino, Raspberry Pi et ESP32. De la domotique aux objets connectés professionnels.',
  'ThunderboltOutlined',
  JSON_ARRAY('Circuits imprimés & PCB', 'Objets connectés (IoT)', 'Domotique & automatisation'),
  'https://www.business-solutions-atlantic-france.com/wp-content/webp-express/webp-images/uploads/2019/04/electronique_professionnelle-1160x652.png.webp',
  'https://www.business-solutions-atlantic-france.com/wp-content/webp-express/webp-images/uploads/2019/04/electronique_professionnelle-1160x652.png.webp',
  4,
  TRUE
);

-- ============================================================
-- Vérification rapide après insertion
-- ============================================================
SELECT 'team_members' AS table_name, COUNT(*) AS lignes_inserees FROM team_members
UNION ALL
SELECT 'services', COUNT(*) FROM services;
