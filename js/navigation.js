document.addEventListener('DOMContentLoaded', function() {
    // Charger la navigation complète
    loadFullNavigation();
    
    // Gérer les liens actifs
    setActiveLinks();
    
    // Ajouter des écouteurs d'événements pour les liens de navigation
    setupNavigationEvents();
});

// Charger la navigation complète
function loadFullNavigation() {
    // Vérifier si la navigation est déjà chargée
    if (document.querySelector('.navbar-nav').children.length > 2) return;
    
    // Définir les éléments de navigation
    const navItems = [
        {
            title: 'Accueil',
            icon: 'fas fa-home',
            url: 'index.html'
        },
        {
            title: 'Cours',
            icon: 'fas fa-graduation-cap',
            dropdown: true,
            items: [
                { header: 'Cybersécurité' },
                { title: 'Hacking Éthique', url: 'courses/cybersecurity/ethical-hacking.html' },
                { title: 'Tests d\'Intrusion', url: 'courses/cybersecurity/penetration-testing.html' },
                { title: 'Développement d\'Exploits', url: 'courses/cybersecurity/exploit-development.html' },
                { title: 'Réponse aux Incidents', url: 'courses/cybersecurity/incident-response.html' },
                { title: 'Threat Hunting', url: 'courses/cybersecurity/threat-hunting.html' },
                { title: 'Forensique Numérique', url: 'courses/cybersecurity/digital-forensics.html' },
                { divider: true },
                { header: 'Game Hacking' },
                { title: 'Cheat Engine Basics', url: 'courses/game-hacking/cheat-engine-basics.html' },
                { title: 'Pointeurs & Structures', url: 'courses/game-hacking/cheat-engine-pointers.html' },
                { title: 'IDA Pro Basics', url: 'courses/game-hacking/ida-pro-basics.html' },
                { title: 'IDA Pro Intermédiaire', url: 'courses/game-hacking/ida-pro-intermediate.html' },
                { title: 'Analyse de Protocoles', url: 'courses/game-hacking/network-protocol-analysis.html' },
                { title: 'Création de Signatures', url: 'courses/game-hacking/signature-creation.html' },
                { title: 'Injection de Code Avancée', url: 'courses/game-hacking/advanced-code-injection.html' },
                { divider: true },
                { header: 'OSINT' },
                { title: 'Réseaux Sociaux', url: 'courses/osint/social-media.html' },
                { title: 'Recherche de Domaines', url: 'courses/osint/domain-dns.html' },
                { title: 'Dark Web OSINT', url: 'courses/osint/dark-web-osint.html' },
                { divider: true },
                { header: 'Programmation' },
                { title: 'Python Basics', url: 'courses/programming/python-basics.html' },
                { title: 'Python Avancé', url: 'courses/programming/python-advanced.html' },
                { title: 'C++ Fondamentaux', url: 'courses/programming/cpp-fundamentals.html' },
                { title: 'C++ Avancé', url: 'courses/programming/cpp-advanced.html' }
            ]
        },
        {
            title: 'Exercices',
            icon: 'fas fa-tasks',
            url: 'exercises/index.html'
        },
        {
            title: 'Forum',
            icon: 'fas fa-comments',
            url: 'forum/index.html'
        },
        {
            title: 'Ressources',
            icon: 'fas fa-book',
            dropdown: true,
            items: [
                { title: 'Bibliothèque', url: 'resources/index.html' },
                { title: 'Téléchargements', url: 'resources/downloads/cheatsheets.html' },
                { title: 'Templates', url: 'resources/downloads/templates.html' }
            ]
        },
        {
            title: 'Outils',
            icon: 'fas fa-tools',
            dropdown: true,
            items: [
                { title: 'Outils Gratuits', url: 'tools/free-tools.html' },
                { title: 'Game Hacking', url: 'tools/game-hacking.html' },
                { title: 'Protection', url: 'tools/protection.html' }
            ]
        },
        {
            title: 'Communauté',
            icon: 'fas fa-users',
            dropdown: true,
            items: [
                { title: 'Discord', url: 'community/discord.html' },
                { title: 'Événements', url: 'community/events.html' },
                { title: 'Contribuer', url: 'community/contribute.html' },
                { title: 'Partenaires', url: 'community/partners.html' }
            ]
        }
    ];
    
    // Construire la navigation
    const navbarNav = document.querySelector('.navbar-nav');
    
    // Vider la navigation existante
    navbarNav.innerHTML = '';
    
    // Ajouter chaque élément de navigation
    navItems.forEach(item => {
        if (item.dropdown) {
            // Élément avec dropdown
            const dropdownHTML = `
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="${item.icon} me-1"></i> ${item.title}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-dark">
                        ${item.items.map(subItem => {
                            if (subItem.header) {
                                return `<li><h6 class="dropdown-header">${subItem.header}</h6></li>`;
                            } else if (subItem.divider) {
                                return `<li><hr class="dropdown-divider"></li>`;
                            } else {
                                return `<li><a class="dropdown-item" href="${subItem.url}">${subItem.title}</a></li>`;
                            }
                        }).join('')}
                    </ul>
                </li>
            `;
            
            navbarNav.innerHTML += dropdownHTML;
        } else {
            // Élément simple
            const navItemHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="${item.url}">
                        <i class="${item.icon} me-1"></i> ${item.title}
                    </a>
                </li>
            `;
            
            navbarNav.innerHTML += navItemHTML;
        }
    });
}

// Définir les liens actifs
function setActiveLinks() {
    // Obtenir le chemin de la page actuelle
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();
    
    // Trouver tous les liens de navigation
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Parcourir tous les liens
    navLinks.forEach(link => {
        // Obtenir l'URL du lien
        const href = link.getAttribute('href');
        
        // Si c'est un lien vers la page actuelle
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            // Ajouter la classe active
            link.classList.add('active');
        } else if (link.classList.contains('dropdown-toggle')) {
            // Si c'est un dropdown, vérifier les sous-éléments
            const dropdownItems = link.nextElementSibling.querySelectorAll('.dropdown-item');
            
            dropdownItems.forEach(item => {
                const itemHref = item.getAttribute('href');
                
                // Si un sous-élément correspond à la page actuelle
                if (currentPath.includes(itemHref)) {
                    // Ajouter la classe active au dropdown
                    link.classList.add('active');
                    // Ajouter la classe active au sous-élément
                    item.classList.add('active');
                }
            });
        }
    });
}

// Configurer les événements de navigation
function setupNavigationEvents() {
    // Gestion des dropdowns
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            // Empêcher le comportement par défaut
            e.preventDefault();
            
            // Trouver le menu dropdown
            const dropdownMenu = this.nextElementSibling;
            
            // Basculer la classe show
            dropdownMenu.classList.toggle('show');
            
            // Ajouter un gestionnaire d'événements pour fermer le dropdown quand on clique ailleurs
            document.addEventListener('click', function closeDropdown(event) {
                if (!event.target.matches('.dropdown-toggle') && !event.target.closest('.dropdown-menu')) {
                    dropdownMenu.classList.remove('show');
                    document.removeEventListener('click', closeDropdown);
                }
            });
        });
    });
    
    // Animation smooth scroll pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Fonction pour obtenir le chemin relatif vers la racine
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
