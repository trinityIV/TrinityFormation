# Script de vérification des styles pour le site Trinity (Version 2)
# Ce script vérifie que toutes les pages HTML du site ont les styles et scripts nécessaires

# Fonction pour vérifier un fichier HTML
function Test-HTMLFile {
    param (
        [string]$FilePath
    )

    $content = Get-Content -Path $FilePath -Raw
    $fileName = Split-Path $FilePath -Leaf
    $relativePath = $FilePath.Replace("$PWD\", "")
    $result = @{
        Path = $relativePath
        HasBootstrap = $content -match 'bootstrap'
        HasStyleCSS = $content -match 'style.css'
        HasBackgroundJS = $content -match 'background.js'
        HasBackgroundCanvas = $content -match 'background-canvas'
        Issues = @()
    }

    # Vérifier les styles de base
    if (-not $result.HasBootstrap -and $FilePath -notmatch 'includes|elements|course-nav') {
        $result.Issues += "Manque Bootstrap"
    }
    
    if (-not $result.HasStyleCSS -and $FilePath -notmatch 'includes|elements|course-nav') {
        $result.Issues += "Manque style.css"
    }

    # Vérifier le background animé pour les pages de sécurité
    if ($FilePath -match 'courses.security' -and $FilePath -notmatch 'background-template' -and (-not $result.HasBackgroundJS)) {
        $result.Issues += "Manque background.js"
    }
    
    if ($FilePath -match 'courses.security' -and $FilePath -notmatch 'background-template' -and (-not $result.HasBackgroundCanvas)) {
        $result.Issues += "Manque canvas background-canvas"
    }

    return $result
}

# Trouver tous les fichiers HTML
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -Recurse

# Analyser chaque fichier
$results = @()
foreach ($file in $htmlFiles) {
    $results += Test-HTMLFile -FilePath $file.FullName
}

# Afficher les résultats
Write-Host "=== RÉSUMÉ DE LA VÉRIFICATION DES STYLES ==="
Write-Host "Nombre total de fichiers HTML: $($htmlFiles.Count)"

$filesWithIssues = $results | Where-Object { $_.Issues.Count -gt 0 }
Write-Host "Nombre de fichiers avec problèmes: $($filesWithIssues.Count)"

if ($filesWithIssues.Count -gt 0) {
    Write-Host "`n=== FICHIERS AVEC PROBLÈMES ==="
    foreach ($file in $filesWithIssues) {
        Write-Host "`nFichier: $($file.Path)"
        Write-Host "Problèmes:"
        foreach ($issue in $file.Issues) {
            Write-Host "  - $issue"
        }
    }
}

# Vérifier spécifiquement les pages de sécurité
$securityPages = $results | Where-Object { $_.Path -match 'courses.security' -and $_.Path -notmatch 'background-template' }
$securityPagesWithIssues = $securityPages | Where-Object { -not $_.HasBackgroundJS -or -not $_.HasBackgroundCanvas }

Write-Host "`n=== PAGES DE SÉCURITÉ ==="
Write-Host "Nombre total de pages de sécurité: $($securityPages.Count)"
Write-Host "Pages sans background animé: $($securityPagesWithIssues.Count)"

if ($securityPagesWithIssues.Count -gt 0) {
    Write-Host "`nPages de sécurité sans background animé:"
    foreach ($page in $securityPagesWithIssues) {
        Write-Host "  - $($page.Path)"
    }
}

# Vérifier les pages qui n'ont pas de lien vers style.css
$pagesWithoutStyleCSS = $results | Where-Object { -not $_.HasStyleCSS -and $_.Path -notmatch 'includes|elements|course-nav' }
if ($pagesWithoutStyleCSS.Count -gt 0) {
    Write-Host "`n=== PAGES SANS STYLE.CSS ==="
    foreach ($page in $pagesWithoutStyleCSS) {
        Write-Host "  - $($page.Path)"
    }
}

# Vérifier les pages qui n'ont pas de lien vers Bootstrap
$pagesWithoutBootstrap = $results | Where-Object { -not $_.HasBootstrap -and $_.Path -notmatch 'includes|elements|course-nav' }
if ($pagesWithoutBootstrap.Count -gt 0) {
    Write-Host "`n=== PAGES SANS BOOTSTRAP ==="
    foreach ($page in $pagesWithoutBootstrap) {
        Write-Host "  - $($page.Path)"
    }
}

Write-Host "`n=== VÉRIFICATION TERMINÉE ==="
