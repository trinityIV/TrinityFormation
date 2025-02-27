// Script pour ajouter automatiquement le background animé à toutes les pages
// Copiez ce code dans la console du navigateur pour l'exécuter sur une page

// 1. Ajouter le canvas pour le background animé
function addBackgroundCanvas() {
    // Vérifier si le canvas existe déjà
    if (document.getElementById('background-canvas')) {
        console.log('Le canvas existe déjà');
        return;
    }
    
    // Créer le canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'background-canvas';
    
    // Insérer le canvas après la div de navigation et avant le main
    const navPlaceholder = document.getElementById('navigation-placeholder');
    if (navPlaceholder && navPlaceholder.nextElementSibling) {
        navPlaceholder.parentNode.insertBefore(canvas, navPlaceholder.nextElementSibling);
        console.log('Canvas ajouté avec succès');
    } else {
        console.error('Impossible de trouver l\'emplacement pour insérer le canvas');
    }
}

// 2. Ajouter le script background.js
function addBackgroundScript() {
    // Vérifier si le script existe déjà
    const scripts = document.querySelectorAll('script');
    for (let script of scripts) {
        if (script.src.includes('background.js')) {
            console.log('Le script background.js existe déjà');
            return;
        }
    }
    
    // Créer le script
    const script = document.createElement('script');
    script.src = '../../js/background.js';
    
    // Ajouter le script à la fin du body
    document.body.appendChild(script);
    console.log('Script background.js ajouté avec succès');
}

// Exécuter les fonctions
addBackgroundCanvas();
addBackgroundScript();

// Afficher un message de confirmation
console.log('Background animé ajouté à la page');
