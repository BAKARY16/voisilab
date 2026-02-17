# Script de déploiement Front-End VoisiLab pour Windows
# Exécuter dans le dossier front-end/

Write-Host "🚀 Build Front-End VoisiLab" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Vérifier qu'on est dans le bon dossier
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: package.json non trouvé" -ForegroundColor Red
    Write-Host "   Êtes-vous dans le dossier front-end?" -ForegroundColor Yellow
    exit 1
}

# Étape 1: Nettoyer les anciens builds
Write-Host "🧹 1/4 - Nettoyage..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "   ✓ Dossier .next supprimé" -ForegroundColor Green
}

# Étape 2: Installer les dépendances
Write-Host "`n📦 2/4 - Installation des dépendances..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation" -ForegroundColor Red
    exit 1
}

# Étape 3: Build production
Write-Host "`n🔨 3/4 - Build de production..." -ForegroundColor Yellow
$env:NODE_ENV = "production"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur de build" -ForegroundColor Red
    exit 1
}

# Vérifier que le build a réussi
if (-not (Test-Path ".next\standalone\server.js")) {
    Write-Host "❌ Erreur: .next\standalone\server.js non créé" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build réussi!" -ForegroundColor Green

# Étape 4: Instructions de déploiement
Write-Host "`n🌐 4/4 - Prêt pour le déploiement!" -ForegroundColor Green
Write-Host "`nOptions de déploiement:" -ForegroundColor Cyan

Write-Host "`n[Option 1] Test local:" -ForegroundColor Yellow
Write-Host "  npm start" -ForegroundColor White
Write-Host "  Ouvrir: http://localhost:3501" -ForegroundColor White

Write-Host "`n[Option 2] Déploiement serveur (PM2):" -ForegroundColor Yellow
Write-Host "  1. Push sur Git:" -ForegroundColor White
Write-Host "     git add -A" -ForegroundColor Gray
Write-Host "     git commit -m 'build: Front-end avec API de production'" -ForegroundColor Gray
Write-Host "     git push origin main" -ForegroundColor Gray
Write-Host "`n  2. Sur le serveur:" -ForegroundColor White
Write-Host "     cd /path/to/voisilab-app/front-end" -ForegroundColor Gray
Write-Host "     git pull origin main" -ForegroundColor Gray
Write-Host "     npm install" -ForegroundColor Gray
Write-Host "     npm run build" -ForegroundColor Gray
Write-Host "     pm2 restart voisilab-frontend" -ForegroundColor Gray

Write-Host "`n[Option 3] Déploiement standalone:" -ForegroundColor Yellow
Write-Host "  Le dossier .next\standalone\ contient tout le nécessaire" -ForegroundColor White
Write-Host "  Copier sur le serveur et exécuter:" -ForegroundColor White
Write-Host "     node .next\standalone\server.js" -ForegroundColor Gray

Write-Host "`n✨ Configuration:" -ForegroundColor Cyan
Write-Host "  API Backend: https://api.fablab.voisilab.online" -ForegroundColor White
Write-Host "  Admin Panel: https://admin.fablab.voisilab.online" -ForegroundColor White
Write-Host "  Front-End:   https://fablab.voisilab.online" -ForegroundColor White

Write-Host "`n📊 Données dynamiques intégrées:" -ForegroundColor Cyan
Write-Host "  ✓ Team Members (7 membres)" -ForegroundColor Green
Write-Host "  ✓ Equipment (6 équipements)" -ForegroundColor Green
Write-Host "  ✓ PPN Locations (10 lieux)" -ForegroundColor Green
Write-Host "  ✓ Workshops, Innovations, Blog (avec fallback)" -ForegroundColor Green

Write-Host "`n🎯 Build local terminé!" -ForegroundColor Green
