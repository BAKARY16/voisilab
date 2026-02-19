#!/bin/bash

# Script de déploiement automatique pour VoisiLab Backend
# Usage: ./deploy.sh

set -e  # Arrêter en cas d'erreur

echo "🚀 Déploiement VoisiLab Backend"
echo "================================"
echo ""

# Vérifier qu'on est dans le bon dossier
if [ ! -f "package.json" ]; then
  echo "❌ Erreur: package.json non trouvé. Êtes-vous dans le dossier server?"
  exit 1
fi

# Étape 1: Récupérer les dernières modifications
echo "📥 1/6 - Récupération des modifications Git..."
git pull

# Étape 2: Copier l'environnement de production
echo "⚙️  2/6 - Configuration de l'environnement..."
cp .env.production .env
echo "   .env.production → .env ✅"

# Étape 3: Installer les dépendances
echo "📦 3/6 - Installation des dépendances..."
npm install

# Étape 4: Build TypeScript
echo "🔨 4/6 - Compilation TypeScript..."
rm -rf dist
npm run build

# Vérifier que le build a créé les fichiers
if [ ! -f "dist/server.js" ]; then
  echo "❌ Erreur: Le build n'a pas créé dist/server.js"
  exit 1
fi

echo "✅ Build réussi! Fichiers créés:"
ls -lh dist/server.js

# Étape 5: Redémarrer PM2
echo "🔄 5/6 - Redémarrage du serveur..."
if pm2 describe voisilab-api &>/dev/null; then
  echo "   Arrêt de l'instance existante..."
  pm2 stop voisilab-api
  pm2 delete voisilab-api
fi

echo "   Démarrage de la nouvelle instance..."
pm2 start npm --name "voisilab-api" -- start
pm2 save

# Étape 6: Vérifier le statut
echo "📊 6/6 - Vérification du statut..."
sleep 2
pm2 status voisilab-api

echo ""
echo "✅ Déploiement terminé avec succès!"
echo ""
echo "📝 Commandes utiles:"
echo "   - Voir les logs: pm2 logs voisilab-api"
echo "   - Voir le statut: pm2 status"
echo "   - Redémarrer: pm2 restart voisilab-api"
