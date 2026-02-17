#!/bin/bash

# Script de déploiement automatique pour VoisiLab Admin Dashboard
# Usage: ./deploy.sh

set -e  # Arrêter en cas d'erreur

echo "🚀 Déploiement VoisiLab Admin Dashboard"
echo "======================================="
echo ""

# Vérifier qu'on est dans le bon dossier
if [ ! -f "package.json" ]; then
  echo "❌ Erreur: package.json non trouvé. Êtes-vous dans le dossier admins?"
  exit 1
fi

# Étape 1: Récupérer les dernières modifications
echo "📥 1/6 - Récupération des modifications Git..."
git pull

# Étape 2: Installer les dépendances
echo "📦 2/6 - Installation des dépendances..."
npm install

# Étape 3: Créer le fichier .env de production si nécessaire
echo "⚙️ 3/6 - Vérification de la configuration..."
if [ ! -f ".env" ]; then
  if [ -f ".env.production" ]; then
    echo "   Copie de .env.production vers .env"
    cp .env.production .env
  else
    echo "⚠️  Attention: Aucun fichier .env trouvé"
  fi
fi

# Étape 4: Nettoyer le cache
echo "🧹 4/6 - Nettoyage du cache..."
rm -rf dist
rm -rf node_modules/.vite

# Étape 5: Build de production
echo "🔨 5/6 - Build de production..."
npm run build

# Vérifier que le build a créé les fichiers
if [ ! -d "dist" ]; then
  echo "❌ Erreur: Le build n'a pas créé le dossier dist"
  exit 1
fi

echo "✅ Build réussi!"
echo "📂 Fichiers générés dans dist/"
ls -lh dist/ | head -10

# Étape 6: Instructions pour servir le build
echo ""
echo "📊 6/6 - Build terminé avec succès!"
echo ""
echo "🌐 Pour servir le dashboard admin en production:"
echo ""
echo "Option 1 - Serveur HTTP simple (test):"
echo "   cd dist"
echo "   python3 -m http.server 3502"
echo "   # ou"
echo "   npx serve -s . -p 3502"
echo ""
echo "Option 2 - Nginx (recommandé):"
echo "   - Copier le contenu de dist/ vers /var/www/admin"
echo "   - Configurer Nginx (voir DEPLOYMENT.md)"
echo ""
echo "Option 3 - PM2 avec serve:"
echo "   pm2 serve dist 3502 --name voisilab-admin --spa"
echo "   pm2 save"
echo ""
echo "✅ Déploiement terminé avec succès!"
