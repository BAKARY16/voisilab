#!/bin/bash

# Script de build pour le backend VoisiLab
# Nettoie le dossier dist et compile TypeScript

echo "🔨 Building VoisiLab Backend..."

# Supprimer le dossier dist s'il existe
if [ -d "dist" ]; then
  echo "🧹 Cleaning dist folder..."
  rm -rf dist
fi

# Compiler TypeScript
echo "📦 Compiling TypeScript..."
npx tsc

# Vérifier si le build a réussi
if [ $? -eq 0 ]; then
  echo "✅ Build completed successfully!"
  echo "📂 Output: dist/"
  ls -lh dist/
  exit 0
else
  echo "❌ Build failed!"
  exit 1
fi
