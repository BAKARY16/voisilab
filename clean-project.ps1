# Script PowerShell pour nettoyer les fichiers inutiles du projet VoisiLab

Write-Host "Nettoyage des fichiers inutiles..." -ForegroundColor Cyan

$filesToDelete = @(
    # Fichiers temporaires et backup
    "NUL",
    "admins\src\pages\dashboard\default.jsx.backup",
    "admins\src\pages\voisilab\ContactsPage.jsx.backup",
    
    # Cache et build temporaires
    "front-end\.npm-cache",
    "front-end\.next",
    "front-end\tsconfig.tsbuildinfo"
)

$deletedCount = 0
$notFoundCount = 0

foreach ($file in $filesToDelete) {
    $fullPath = Join-Path $PSScriptRoot $file
    if (Test-Path $fullPath) {
        try {
            if (Test-Path $fullPath -PathType Container) {
                Remove-Item -Path $fullPath -Recurse -Force
                Write-Host "  Dossier supprime: $file" -ForegroundColor Green
            } else {
                Remove-Item -Path $fullPath -Force
                Write-Host "  Fichier supprime: $file" -ForegroundColor Green
            }
            $deletedCount++
        } catch {
            Write-Host "  Erreur lors de la suppression de $file : $_" -ForegroundColor Red
        }
    } else {
        Write-Host "  Deja absent: $file" -ForegroundColor Gray
        $notFoundCount++
    }
}

Write-Host ""
Write-Host "Résumé:" -ForegroundColor Cyan
Write-Host "Fichiers/dossiers supprimes: $deletedCount" -ForegroundColor Green
Write-Host "Deja absents: $notFoundCount" -ForegroundColor Gray

Write-Host ""
Write-Host "Voulez-vous aussi nettoyer les builds (admins/dist, server/dist)? (y/N)" -ForegroundColor Yellow
$response = Read-Host
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "Nettoyage des builds..." -ForegroundColor Cyan
    
    $buildDirs = @("admins\dist", "server\dist")
    foreach ($dir in $buildDirs) {
        $fullPath = Join-Path $PSScriptRoot $dir
        if (Test-Path $fullPath) {
            Remove-Item -Path $fullPath -Recurse -Force
            Write-Host "  $dir supprime" -ForegroundColor Green
        }
    }
    
    Write-Host ""
    Write-Host "Pour reconstruire: npm run build dans chaque dossier" -ForegroundColor Blue
}

Write-Host ""
Write-Host "Nettoyage termine!" -ForegroundColor Green
Write-Host "Les fichiers supprimes seront regeneres automatiquement lors du prochain build" -ForegroundColor Blue
