# Script PowerShell pour ajouter le background animé à toutes les pages de sécurité

# Définir le répertoire de travail
$securityDir = "c:\Users\pirat\Desktop\Trinity\courses\security"
Set-Location $securityDir

# Liste des fichiers HTML à modifier
$htmlFiles = Get-ChildItem -Path $securityDir -Filter "*.html" | Where-Object { $_.Name -ne "background-template.html" }

foreach ($file in $htmlFiles) {
    Write-Host "Traitement du fichier: $($file.Name)"
    
    # Lire le contenu du fichier
    $content = Get-Content -Path $file.FullName -Raw
    
    # Vérifier si le canvas existe déjà
    if ($content -match '<canvas id="background-canvas"></canvas>') {
        Write-Host "  - Canvas déjà présent dans $($file.Name)"
    } else {
        # Ajouter le canvas après la div de navigation
        $content = $content -replace '(<div id="navigation-placeholder"></div>\s*)', '$1

    <!-- Canvas pour le background animé -->
    <canvas id="background-canvas"></canvas>
'
        Write-Host "  - Canvas ajouté à $($file.Name)"
    }
    
    # Vérifier si le script background.js existe déjà
    if ($content -match '<script src="../../js/background.js"></script>') {
        Write-Host "  - Script background.js déjà présent dans $($file.Name)"
    } else {
        # Ajouter le script avant la fermeture de la balise body
        $content = $content -replace '(</body>)', '    <script src="../../js/background.js"></script>
$1'
        Write-Host "  - Script background.js ajouté à $($file.Name)"
    }
    
    # Écrire le contenu modifié dans le fichier
    Set-Content -Path $file.FullName -Value $content
    Write-Host "  - Modifications enregistrées dans $($file.Name)"
}

Write-Host "Terminé ! Tous les fichiers ont été mis à jour."
