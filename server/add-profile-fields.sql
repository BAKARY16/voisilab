-- Ajouter les nouveaux champs au profil utilisateur
ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT NULL AFTER avatar_url,
ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT NULL AFTER phone,
ADD COLUMN IF NOT EXISTS organization VARCHAR(255) DEFAULT NULL AFTER bio;

-- Créer le dossier pour les avatars
-- mkdir -p uploads/avatars (à faire manuellement ou via script)
