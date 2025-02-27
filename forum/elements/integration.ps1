# Script PowerShell pour intégrer les éléments dans index.html

# Définir le répertoire de travail
$forumDir = "c:\Users\pirat\Desktop\Trinity\forum"
Set-Location $forumDir

# Lire le contenu du fichier index.html
$indexPath = Join-Path $forumDir "index.html"
$indexContent = Get-Content -Path $indexPath -Raw

# Ajouter Font Awesome dans le head
$fontAwesomePath = Join-Path $forumDir "elements\font-awesome.html"
$fontAwesomeContent = Get-Content -Path $fontAwesomePath -Raw

if (-not ($indexContent -match '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/')) {
    $indexContent = $indexContent -replace '(</head>)', "    $fontAwesomeContent`n$1"
    Write-Host "Font Awesome ajouté dans le head"
}

# Remplacer le bouton de nouveau sujet par les boutons de connexion et nouveau sujet
$boutonConnexionPath = Join-Path $forumDir "elements\bouton-connexion.html"
$boutonConnexionContent = Get-Content -Path $boutonConnexionPath -Raw

$indexContent = $indexContent -replace '<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newTopicModal">\s*Nouveau Sujet\s*</button>', $boutonConnexionContent
Write-Host "Boutons de connexion et nouveau sujet ajoutés"

# Ajouter la barre de recherche après les boutons
$barreRecherchePath = Join-Path $forumDir "elements\barre-recherche.html"
$barreRechercheContent = Get-Content -Path $barreRecherchePath -Raw

$indexContent = $indexContent -replace '(</div>\s*</div>\s*)(<!-- Categories -->)', "$1`n    $barreRechercheContent`n`n    $2"
Write-Host "Barre de recherche ajoutée"

# Ajouter les annonces importantes après la barre de recherche
$annoncesPath = Join-Path $forumDir "elements\annonces-importantes.html"
$annoncesContent = Get-Content -Path $annoncesPath -Raw

$indexContent = $indexContent -replace '(</div>\s*</div>\s*)(<!-- Categories -->)', "$1`n    $annoncesContent`n`n    $2"
Write-Host "Annonces importantes ajoutées"

# Ajouter les sujets en tendance après les catégories
$sujetsTendancePath = Join-Path $forumDir "elements\sujets-tendance.html"
$sujetsTendanceContent = Get-Content -Path $sujetsTendancePath -Raw

$indexContent = $indexContent -replace '(</div>\s*</div>\s*</div>\s*)(<!-- Recent Topics -->)', "$1`n`n        $sujetsTendanceContent`n`n        $2"
Write-Host "Sujets en tendance ajoutés"

# Ajouter les statistiques du forum après les utilisateurs actifs
$statsPath = Join-Path $forumDir "elements\statistiques-forum.html"
$statsContent = Get-Content -Path $statsPath -Raw

$indexContent = $indexContent -replace '(</div>\s*</div>\s*</section>\s*)(</main>)', "$1`n`n        $statsContent`n    $2"
Write-Host "Statistiques du forum ajoutées"

# Ajouter le modal de connexion avant le footer
$modalConnexionPath = Join-Path $forumDir "elements\modal-connexion.html"
$modalConnexionContent = Get-Content -Path $modalConnexionPath -Raw

$indexContent = $indexContent -replace '(</div>\s*</div>\s*</div>\s*)(<!-- New Topic Modal -->)', "$1`n`n    $modalConnexionContent`n`n    $2"
Write-Host "Modal de connexion ajouté"

# Sauvegarder une copie de sauvegarde du fichier original
$backupPath = Join-Path $forumDir "index.html.bak"
Copy-Item -Path $indexPath -Destination $backupPath
Write-Host "Sauvegarde du fichier original créée: $backupPath"

# Écrire le contenu modifié dans le fichier
Set-Content -Path $indexPath -Value $indexContent
Write-Host "Modifications enregistrées dans index.html"

# Créer un fichier fusionné contenant tous les éléments
$elementsDir = Join-Path $forumDir "elements"
$allElementsPath = Join-Path $forumDir "tous-les-elements.html"

$allElementsContent = @"
<!-- TRINITY FORUM - TOUS LES ÉLÉMENTS ADDITIONNELS -->
<!-- ============================================== -->

<!-- Font Awesome pour les icônes -->
$fontAwesomeContent

<!-- Boutons de connexion et nouveau sujet -->
$boutonConnexionContent

<!-- Barre de recherche -->
$barreRechercheContent

<!-- Annonces importantes -->
$annoncesContent

<!-- Sujets en tendance -->
$sujetsTendanceContent

<!-- Statistiques du forum -->
$statsContent

<!-- Modal de connexion -->
$modalConnexionContent

<!-- FIN DES ÉLÉMENTS -->
"@

Set-Content -Path $allElementsPath -Value $allElementsContent
Write-Host "Fichier fusionné créé: $allElementsPath"

Write-Host "Terminé ! Tous les éléments ont été intégrés dans index.html"
