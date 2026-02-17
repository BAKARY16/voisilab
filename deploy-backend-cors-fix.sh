#!/bin/bash
# ============================================
# SCRIPT DE DÉPLOIEMENT BACKEND - VOISILAB
# ============================================
# Usage: bash deploy-backend-cors-fix.sh
# Ce script met à jour le .env et redémarre le backend

set -e  # Arrêter en cas d'erreur

echo "🚀 Déploiement Backend VoisiLab - Fix CORS Admin"
echo "================================================"
echo ""

# Vérifier qu'on est sur le serveur
if [ ! -d ~/voisilab-app ]; then
    echo "❌ Erreur: Dossier ~/voisilab-app non trouvé"
    echo "   Ce script doit être exécuté sur le serveur de production"
    exit 1
fi

cd ~/voisilab-app

# 1. Git pull (optionnel)
read -p "Voulez-vous faire un git pull ? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📥 Git pull..."
    git pull origin main
    echo "✅ Code mis à jour"
fi

# 2. Naviguer vers server
cd server

# 3. Vérifier si .env existe
if [ ! -f .env ]; then
    echo "❌ Erreur: Fichier .env non trouvé dans ~/voisilab-app/server"
    exit 1
fi

# 4. Backup du .env actuel
echo "💾 Backup de .env..."
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup créé"

# 5. Mettre à jour ALLOWED_ORIGINS
echo "🔧 Mise à jour ALLOWED_ORIGINS..."

# Supprimer l'ancienne ligne ALLOWED_ORIGINS si elle existe
sed -i '/^ALLOWED_ORIGINS=/d' .env

# Ajouter la nouvelle ligne
echo "ALLOWED_ORIGINS=https://fablab.voisilab.online,https://admin.fablab.voisilab.online,https://www.fablab.voisilab.online,http://localhost:3501,http://localhost:3502" >> .env

echo "✅ ALLOWED_ORIGINS mis à jour"

# 6. Vérifier la configuration
echo ""
echo "📋 Configuration CORS actuelle:"
grep "ALLOWED_ORIGINS" .env
echo ""

# 7. Optionnel : npm install et rebuild
read -p "Voulez-vous faire npm install et rebuild ? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📦 npm install..."
    npm install
    echo "🔨 npm run build..."
    npm run build
    echo "✅ Build terminé"
fi

# 8. Redémarrer PM2
echo "🔄 Redémarrage du backend..."
pm2 restart voisilab-backend

# Attendre 2 secondes
sleep 2

# 9. Vérifier les logs
echo ""
echo "📊 Logs PM2 (dernières 20 lignes):"
echo "=================================="
pm2 logs voisilab-backend --lines 20 --nostream

echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "🧪 Tests à effectuer:"
echo "  1. Visiter https://admin.fablab.voisilab.online"
echo "  2. Se connecter → Devrait fonctionner sans erreur CORS"
echo "  3. Vérifier console navigateur (F12) → Aucune erreur CORS"
echo ""
echo "📝 En cas de problème:"
echo "  - Vérifier les logs: pm2 logs voisilab-backend"
echo "  - Restaurer backup: cp .env.backup.* .env && pm2 restart voisilab-backend"
echo ""
