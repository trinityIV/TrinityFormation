/**
 * Trinity Pro - Script principal
 * Gère les animations, les interactions et les fonctionnalités du site
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les composants
    initNavbar();
    initDropdowns();
    initParticles();
    initAnimations();
    initCounters();
    
    // Smooth scroll pour les liens d'ancrage
    initSmoothScroll();
});

/**
 * Initialise la navbar avec effet de transparence au scroll
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-blur');
        } else {
            navbar.classList.remove('navbar-blur');
        }
    });
    
    // Activer le lien courant
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath.endsWith('/') && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialise les menus déroulants
 */
function initDropdowns() {
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
            
            // Fermer tous les autres menus
            document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
                if (openMenu !== menu) {
                    openMenu.classList.remove('show');
                    openMenu.closest('.dropdown').classList.remove('show');
                }
            });
            
            // Toggle le menu actuel
            menu.classList.toggle('show');
            parent.classList.toggle('show');
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
}

/**
 * Initialise l'effet de particules en arrière-plan
 */
function initParticles() {
    if (!document.getElementById('particles-js')) return;
    
    // Vérifier si particlesJS est disponible
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#00ff00'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00ff00',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    } else {
        console.warn('particlesJS not loaded');
    }
}

/**
 * Initialise les animations au scroll avec AOS
 */
function initAnimations() {
    // Vérifier si AOS est chargé
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    } else {
        console.warn('AOS not loaded');
    }
}

/**
 * Initialise les compteurs animés
 */
function initCounters() {
    const counters = document.querySelectorAll('.counter-value');
    
    if (!counters.length) return;
    
    const speed = 200; // Durée de l'animation en ms
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        let count = 0;
        const increment = target / speed;
        
        const updateCount = () => {
            if (count < target) {
                count += increment;
                counter.innerText = Math.ceil(count);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        
        updateCount();
    };
    
    // Observer pour démarrer l'animation quand les compteurs sont visibles
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    } else {
        // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
        counters.forEach(counter => {
            animateCounter(counter);
        });
    }
}

/**
 * Initialise le défilement fluide pour les liens d'ancrage
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });
}
