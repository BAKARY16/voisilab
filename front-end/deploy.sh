#!/bin/bash

# Script de déploiement automatique pour VoisiLab Front-End
# Usage: ./deploy.sh

set -e  # Arrêter en cas d'erreur

echo "🚀 Déploiement VoisiLab Front-End"
echo "================================="
echo ""

# Vérifier qu'on est dans le bon dossier
if [ ! -f "package.json" ]; then
  echo "❌ Erreur: package.json non trouvé. Êtes-vous dans le dossier front-end?"
  exit 1
fi

# Étape 1: Récupérer les dernières modifications
echo "📥 1/6 - Récupération des modifications Git..."
git pull

# Étape 2: Installer les dépendances
echo "📦 2/6 - Installation des dépendances..."
# Utiliser npm ou pnpm selon ce qui est disponible
if command -v pnpm &> /dev/null; then
  echo "   Utilisation de pnpm..."
  pnpm install
else
  echo "   Utilisation de npm..."
  npm install
fi

# Étape 3: Mettre à jour baseline-browser-mapping
echo "🔄 3/6 - Mise à jour baseline-browser-mapping..."
npm install baseline-browser-mapping@latest -D || true

# Étape 4: Nettoyer le cache
echo "🧹 4/6 - Nettoyage du cache..."
rm -rf .next

# Étape 5: Build de production
echo "🔨 5/6 - Build de production..."
npm run build

# Vérifier que le build a créé les fichiers
if [ ! -d ".next" ]; then
  echo "❌ Erreur: Le build n'a pas créé le dossier .next"
  exit 1
fi

echo "✅ Build réussi!"

# Étape 6: Redémarrer PM2
echo "🔄 6/6 - Redémarrage du serveur..."
if pm2 describe voisilab-front &>/dev/null; then
  echo "   Arrêt de l'instance existante..."
  pm2 stop voisilab-front
  pm2 delete voisilab-front
fi

echo "   Démarrage de la nouvelle instance..."
pm2 start npm --name "voisilab-front" -- start
pm2 save

# Vérifier le statut
echo "📊 Vérification du statut..."
sleep 2
pm2 status voisilab-front

echo ""
echo "✅ Déploiement terminé avec succès!"
echo ""
echo "🌐 L'application devrait être accessible sur le port 3501"
echo ""
echo "📝 Commandes utiles:"
echo "   - Voir les logs: pm2 logs voisilab-front"
echo "   - Voir le statut: pm2 status"
echo "   - Redémarrer: pm2 restart voisilab-front"
