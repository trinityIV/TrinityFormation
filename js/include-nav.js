document.addEventListener('DOMContentLoaded', function() {
    // Charger la navigation
    // Déterminer le chemin relatif vers la racine du site
    const pathToRoot = getPathToRoot();
    
    // Charger la navigation avec le chemin relatif
    fetch(pathToRoot + 'includes/navigation.html')
        .then(response => response.text())
        .then(data => {
            // Insérer la navigation
            document.getElementById('navigation-placeholder').innerHTML = data;
            
            // Activer l'élément de navigation correspondant à la page courante
            const currentPath = window.location.pathname;
            const currentHash = window.location.hash;
            
            // Sélectionner tous les liens de navigation (dropdown-items et nav-links)
            const navLinks = document.querySelectorAll('.navbar-nav a');
            
            navLinks.forEach(link => {
                const linkHref = link.getAttribute('href');
                
                // Vérifier si le lien correspond au chemin actuel
                const isPathMatch = linkHref === currentPath;
                
                // Vérifier si le lien contient une ancre (#) qui correspond à l'ancre actuelle
                const hasHash = linkHref && linkHref.includes('#');
                const linkHash = hasHash ? linkHref.substring(linkHref.indexOf('#')) : '';
                const isHashMatch = currentHash && linkHash && currentHash === linkHash;
                
                // Vérifier si le lien pointe vers la page actuelle avec une ancre
                const linkPathBeforeHash = hasHash ? linkHref.substring(0, linkHref.indexOf('#')) : linkHref;
                const isPageWithHashMatch = linkPathBeforeHash && 
                                           (linkPathBeforeHash === '' || linkPathBeforeHash === currentPath) && 
                                           isHashMatch;
                
                // Si le lien correspond au chemin actuel ou à l'ancre actuelle
                if (isPathMatch || isHashMatch || isPageWithHashMatch) {
                    // Ajouter la classe active au lien
                    link.classList.add('active');
                    
                    // Si c'est un élément de dropdown, activer aussi le dropdown parent
                    if (link.classList.contains('dropdown-item')) {
                        const dropdownToggle = link.closest('.dropdown').querySelector('.dropdown-toggle');
                        if (dropdownToggle) {
                            dropdownToggle.classList.add('active');
                        }
                    }
                    
                    // Si c'est un élément avec une ancre, activer aussi la catégorie parente
                    if (hasHash && link.closest('.dropdown-menu')) {
                        const category = link.closest('.dropdown-menu').previousElementSibling;
                        if (category && category.classList.contains('dropdown-toggle')) {
                            category.classList.add('active');
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Erreur de chargement de la navigation:', error));
});

// Fonction pour déterminer le chemin relatif vers la racine du site
function getPathToRoot() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment.length > 0);
    
    // Si nous sommes à la racine, retourner une chaîne vide
    if (segments.length === 0 || (segments.length === 1 && segments[0] === 'index.html')) {
        return '';
    }
    
    // Sinon, construire le chemin relatif vers la racine
    let pathToRoot = '';
    for (let i = 0; i < segments.length; i++) {
        if (segments[i].includes('.html')) {
            // Si c'est un fichier HTML, ne pas le compter comme un niveau de répertoire
            continue;
        }
        pathToRoot += '../';
    }
    
    return pathToRoot;
}
