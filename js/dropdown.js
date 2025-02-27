/**
 * Trinity Pro - Script pour les menus déroulants
 * Remplace la fonctionnalité de Bootstrap pour les menus déroulants
 */

document.addEventListener('DOMContentLoaded', function() {
    // Désactiver les événements de clic par défaut de Bootstrap sur les dropdowns
    const disableBootstrapDropdowns = () => {
        // Supprimer les gestionnaires d'événements de Bootstrap
        const dropdownToggleList = document.querySelectorAll('.dropdown-toggle');
        dropdownToggleList.forEach(dropdownToggle => {
            const newToggle = dropdownToggle.cloneNode(true);
            dropdownToggle.parentNode.replaceChild(newToggle, dropdownToggle);
        });
    };

    // Initialiser nos propres menus déroulants
    const initCustomDropdowns = () => {
        // Récupérer tous les toggles de dropdown
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        // Pour chaque toggle, ajouter un gestionnaire d'événements
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Trouver le parent dropdown et le menu
                const parent = this.closest('.dropdown');
                const menu = parent.querySelector('.dropdown-menu');
                
                // Vérifier si ce menu est déjà ouvert
                const isOpen = menu.classList.contains('show');
                
                // Fermer tous les menus
                document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
                    openMenu.classList.remove('show');
                    openMenu.closest('.dropdown').classList.remove('show');
                });
                
                // Si le menu n'était pas ouvert, l'ouvrir maintenant
                if (!isOpen) {
                    menu.classList.add('show');
                    parent.classList.add('show');
                }
            });
        });
        
        // Fermer les menus déroulants quand on clique ailleurs
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    menu.classList.remove('show');
                    menu.closest('.dropdown').classList.remove('show');
                });
            }
        });
        
        // Empêcher la fermeture du menu quand on clique à l'intérieur
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });
        
        // Fermer les menus quand on clique sur un lien dans le menu
        document.querySelectorAll('.dropdown-menu a').forEach(link => {
            link.addEventListener('click', function() {
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    menu.classList.remove('show');
                    menu.closest('.dropdown').classList.remove('show');
                });
            });
        });
    };

    // Exécuter nos fonctions
    disableBootstrapDropdowns();
    initCustomDropdowns();
    
    console.log('Custom dropdowns initialized');
});
