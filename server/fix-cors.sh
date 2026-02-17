#!/bin/bash

# Script de configuration CORS pour VoisiLab Backend
# À exécuter sur le serveur pour autoriser les domaines frontend

echo "🔧 Configuration CORS pour VoisiLab Backend"
echo "==========================================="
echo ""

# Vérifier qu'on est dans le bon dossier
if [ ! -f ".env" ]; then
  echo "❌ Erreur: Fichier .env non trouvé"
  echo "   Créez d'abord un fichier .env à partir de .env.example"
  exit 1
fi

echo "📝 Mise à jour de ALLOWED_ORIGINS dans .env..."

# Vérifier si ALLOWED_ORIGINS existe déjà
if grep -q "^ALLOWED_ORIGINS=" .env; then
  # Mettre à jour la ligne existante
  sed -i 's|^ALLOWED_ORIGINS=.*|ALLOWED_ORIGINS=https://fablab.voisilab.online,https://admin.fablab.voisilab.online,https://www.fablab.voisilab.online|' .env
  echo "✅ ALLOWED_ORIGINS mis à jour"
else
  # Ajouter la ligne
  echo "" >> .env
  echo "# CORS - Origines autorisées" >> .env
  echo "ALLOWED_ORIGINS=https://fablab.voisilab.online,https://admin.fablab.voisilab.online,https://www.fablab.voisilab.online" >> .env
  echo "✅ ALLOWED_ORIGINS ajouté"
fi

echo ""
echo "📋 Configuration CORS actuelle:"
grep "ALLOWED_ORIGINS" .env

echo ""
echo "🔄 Redémarrage du serveur backend..."
pm2 restart voisilab-api

echo ""
echo "✅ Configuration CORS terminée!"
echo ""
echo "Les domaines suivants sont maintenant autorisés:"
echo "  - https://fablab.voisilab.online"
echo "  - https://admin.fablab.voisilab.online"
echo "  - https://www.fablab.voisilab.online"
echo ""
echo "📊 Vérifiez les logs:"
echo "   pm2 logs voisilab-api"
