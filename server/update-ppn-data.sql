-- Mise à jour des données PPN pour synchroniser avec le frontend
-- Suppression des anciennes données
DELETE FROM ppn_locations;

-- Insertion des 5 PPN avec les données complètes du frontend
INSERT INTO ppn_locations (
  id, name, city, region, address, type, latitude, longitude,
  services, email, phone, manager, opening_year, status
) VALUES
(
  'PPN-001',
  'PPN Bassam',
  'Abidjan',
  'Sud-Comoé',
  'Grand Bassam',
  'Urban',
  5.2198417,
  -3.7560239,
  'Formation numérique, Hub technologique, Coworking, Impression 3D',
  'incubateur@uvci.edu.ci',
  '+225 07 09 90 14 81',
  'Dr. ...',
  2025,
  'active'
),
(
  'PPN-002',
  'PPN Daloa',
  'Daloa',
  'Haut-Sassandra',
  'UJLOG, Nouveau Bâtiment TD, Daloa',
  'Urban',
  6.9076649,
  -6.4397508,
  'Formation numérique, Modélisation 3D, Robotique',
  'incubateur@uvci.edu.ci',
  '+225 07 09 90 14 81',
  'Mme ...',
  2020,
  'active'
),
(
  'PPN-003',
  'PPN Andé',
  'Andé',
  'Moronou',
  'Andé',
  'Rural',
  6.7842169,
  -4.0913174,
  'Formation professionnelle, Hub technologique, E-commerce',
  'incubateur@uvci.edu.ci',
  '+225 07 09 90 14 81',
  'M. ...',
  2026,
  'active'
),
(
  'PPN-004',
  'PPN Dingouin',
  'Dingouin',
  'Tonkpi',
  'Dingouin',
  'Urban',
  6.832726,
  -7.673690,
  'Formation professionnelle, Hub technologique, E-commerce',
  'incubateur@uvci.edu.ci',
  '+225 07 09 90 14 81',
  'M. ...',
  2020,
  'active'
),
(
  'PPN-005',
  'PPN Bouaké Centre',
  'Bouaké',
  'Gbêkê',
  'Quartier Commerce, Avenue Houphouët',
  'Urban',
  7.7005337,
  -5.1080258,
  'Formation numérique, Hub technologique, Agriculture intelligente',
  'incubateur@uvci.edu.ci',
  '+225 07 09 90 14 81',
  'Dr. ...',
  2019,
  'active'
);
