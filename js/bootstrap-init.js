/**
 * Trinity Pro - Bootstrap Initialization
 * Ce fichier initialise les fonctionnalités de Bootstrap
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser tous les tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialiser tous les popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Initialiser tous les dropdowns
    const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl);
    });

    // Initialiser tous les modals
    const modalTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="modal"]'));
    modalTriggerList.map(function (modalTriggerEl) {
        return new bootstrap.Modal(modalTriggerEl);
    });

    // Initialiser tous les toasts
    const toastElList = [].slice.call(document.querySelectorAll('.toast'));
    toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl);
    });

    // Initialiser tous les collapses
    const collapseElementList = [].slice.call(document.querySelectorAll('.collapse'));
    collapseElementList.map(function (collapseEl) {
        return new bootstrap.Collapse(collapseEl, {
            toggle: false
        });
    });

    // Initialiser tous les carousels
    const carouselElementList = [].slice.call(document.querySelectorAll('.carousel'));
    carouselElementList.map(function (carouselEl) {
        return new bootstrap.Carousel(carouselEl, {
            interval: 5000,
            wrap: true
        });
    });

    // Gestion des événements de navigation pour les liens d'ancrage internes uniquement
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Vérifier que le lien pointe uniquement vers une ancre et non vers une autre page
        // Les liens vers d'autres pages avec des ancres contiennent généralement '/' ou '.html'
        if (anchor.getAttribute('href').indexOf('/') === -1 && anchor.getAttribute('href').indexOf('.html') === -1) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    // Fermer le menu mobile après un clic
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            });
        }
    });
});
