document.addEventListener('DOMContentLoaded', function() {
    // Charger les cours pour chaque section
    loadCourses('cybersecurity', getCybersecurityCourses());
    loadCourses('game-hacking', getGameHackingCourses());
    loadCourses('osint', getOSINTCourses());
    loadCourses('programming', getProgrammingCourses());
    loadCourses('security', getSecurityCourses());
    
    // Ajouter des animations
    initAnimations();
});

// Fonction pour charger les cours dans une section
function loadCourses(sectionId, courses) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const courseContainer = section.querySelector('.row');
    if (!courseContainer) return;
    
    // Vider le conteneur
    courseContainer.innerHTML = '';
    
    // Ajouter chaque cours
    courses.forEach(course => {
        const courseHTML = `
            <div class="col-md-4 mb-4">
                <div class="card h-100 bg-dark border-light">
                    <div class="card-body">
                        <h5 class="card-title ${getCourseIconClass(sectionId)}">
                            <i class="${getCourseIcon(course.category)}"></i> ${course.title}
                        </h5>
                        <p class="card-text">${course.description}</p>
                        <a href="${course.url}" class="btn ${getCourseButtonClass(sectionId)}">
                            Commencer
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        courseContainer.innerHTML += courseHTML;
    });
}

// Fonction pour obtenir la classe d'icône en fonction de la section
function getCourseIconClass(sectionId) {
    switch (sectionId) {
        case 'cybersecurity':
            return 'text-success';
        case 'game-hacking':
            return 'text-danger';
        case 'osint':
            return 'text-info';
        case 'programming':
            return 'text-warning';
        case 'security':
            return 'text-primary';
        default:
            return 'text-light';
    }
}

// Fonction pour obtenir la classe de bouton en fonction de la section
function getCourseButtonClass(sectionId) {
    switch (sectionId) {
        case 'cybersecurity':
            return 'btn-outline-success';
        case 'game-hacking':
            return 'btn-outline-danger';
        case 'osint':
            return 'btn-outline-info';
        case 'programming':
            return 'btn-outline-warning';
        case 'security':
            return 'btn-outline-primary';
        default:
            return 'btn-outline-light';
    }
}

// Fonction pour obtenir l'icône en fonction de la catégorie
function getCourseIcon(category) {
    switch (category) {
        case 'ethical-hacking':
            return 'fas fa-user-secret';
        case 'forensics':
            return 'fas fa-search';
        case 'incident-response':
            return 'fas fa-fire-extinguisher';
        case 'exploit-dev':
            return 'fas fa-bug';
        case 'threat-hunting':
            return 'fas fa-binoculars';
        case 'penetration-testing':
            return 'fas fa-key';
        case 'cheat-engine':
            return 'fas fa-memory';
        case 'ida-pro':
            return 'fas fa-microchip';
        case 'network-analysis':
            return 'fas fa-network-wired';
        case 'signature-creation':
            return 'fas fa-signature';
        case 'anti-cheat':
            return 'fas fa-shield-alt';
        case 'code-injection':
            return 'fas fa-code';
        case 'social-media':
            return 'fas fa-hashtag';
        case 'domain-research':
            return 'fas fa-globe';
        case 'dark-web':
            return 'fas fa-user-secret';
        case 'business-intel':
            return 'fas fa-briefcase';
        case 'crypto-tracing':
            return 'fas fa-coins';
        case 'email-recon':
            return 'fas fa-envelope';
        case 'image-metadata':
            return 'fas fa-image';
        case 'python':
            return 'fab fa-python';
        case 'cpp':
            return 'fas fa-code';
        case 'java':
            return 'fab fa-java';
        case 'assembly':
            return 'fas fa-microchip';
        case 'reverse-engineering':
            return 'fas fa-puzzle-piece';
        case 'malware-analysis':
            return 'fas fa-virus';
        case 'web-security':
            return 'fas fa-globe';
        case 'network-security':
            return 'fas fa-network-wired';
        case 'secure-coding':
            return 'fas fa-lock';
        case 'firewall':
            return 'fas fa-shield-alt';
        default:
            return 'fas fa-book';
    }
}

// Initialiser les animations
function initAnimations() {
    // Animation au scroll
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Données des cours de cybersécurité
function getCybersecurityCourses() {
    return [
        {
            title: 'Hacking Éthique',
            description: 'Introduction aux principes du hacking éthique et de la sécurité offensive',
            url: 'courses/cybersecurity/ethical-hacking.html',
            category: 'ethical-hacking'
        },
        {
            title: 'Tests d\'Intrusion',
            description: 'Méthodologies et techniques pour les tests d\'intrusion professionnels',
            url: 'courses/cybersecurity/penetration-testing.html',
            category: 'penetration-testing'
        },
        {
            title: 'Développement d\'Exploits',
            description: 'Création et exploitation de vulnérabilités logicielles',
            url: 'courses/cybersecurity/exploit-development.html',
            category: 'exploit-dev'
        },
        {
            title: 'Réponse aux Incidents',
            description: 'Techniques de détection et de réponse aux incidents de sécurité',
            url: 'courses/cybersecurity/incident-response.html',
            category: 'incident-response'
        },
        {
            title: 'Threat Hunting',
            description: 'Recherche proactive de menaces dans les systèmes et réseaux',
            url: 'courses/cybersecurity/threat-hunting.html',
            category: 'threat-hunting'
        },
        {
            title: 'Forensique Numérique',
            description: 'Analyse et investigation des preuves numériques',
            url: 'courses/cybersecurity/digital-forensics.html',
            category: 'forensics'
        }
    ];
}

// Données des cours de game hacking
function getGameHackingCourses() {
    return [
        {
            title: 'Cheat Engine Basics',
            description: 'Fondamentaux de la modification de mémoire avec Cheat Engine',
            url: 'courses/game-hacking/cheat-engine-basics.html',
            category: 'cheat-engine'
        },
        {
            title: 'Pointeurs & Structures',
            description: 'Utilisation avancée des pointeurs et structures dans Cheat Engine',
            url: 'courses/game-hacking/cheat-engine-pointers.html',
            category: 'cheat-engine'
        },
        {
            title: 'IDA Pro Basics',
            description: 'Introduction au reverse engineering avec IDA Pro',
            url: 'courses/game-hacking/ida-pro-basics.html',
            category: 'ida-pro'
        },
        {
            title: 'IDA Pro Intermédiaire',
            description: 'Techniques avancées d\'analyse avec IDA Pro',
            url: 'courses/game-hacking/ida-pro-intermediate.html',
            category: 'ida-pro'
        },
        {
            title: 'Analyse de Protocoles',
            description: 'Analyse et modification des protocoles réseau de jeux',
            url: 'courses/game-hacking/network-protocol-analysis.html',
            category: 'network-analysis'
        },
        {
            title: 'Création de Signatures',
            description: 'Techniques pour créer des signatures de code fiables',
            url: 'courses/game-hacking/signature-creation.html',
            category: 'signature-creation'
        },
        {
            title: 'Injection de Code Avancée',
            description: 'Techniques avancées d\'injection de code dans les jeux',
            url: 'courses/game-hacking/advanced-code-injection.html',
            category: 'code-injection'
        },
        {
            title: 'Anti-Cheat Part 1',
            description: 'Introduction au développement anti-cheat',
            url: 'courses/game-hacking/anticheat-dev-part1.html',
            category: 'anti-cheat'
        },
        {
            title: 'Anti-Cheat Part 2',
            description: 'Protection mémoire et détection de modifications',
            url: 'courses/game-hacking/anticheat-dev-part2.html',
            category: 'anti-cheat'
        }
    ];
}

// Données des cours d'OSINT
function getOSINTCourses() {
    return [
        {
            title: 'Réseaux Sociaux',
            description: 'Techniques d\'OSINT sur les plateformes de réseaux sociaux',
            url: 'courses/osint/social-media.html',
            category: 'social-media'
        },
        {
            title: 'Recherche de Domaines',
            description: 'Analyse de domaines et DNS pour l\'OSINT',
            url: 'courses/osint/domain-dns.html',
            category: 'domain-research'
        },
        {
            title: 'Dark Web OSINT',
            description: 'Techniques de recherche sur le Dark Web',
            url: 'courses/osint/dark-web-osint.html',
            category: 'dark-web'
        },
        {
            title: 'Intelligence d\'Affaires',
            description: 'OSINT appliqué au renseignement d\'entreprise',
            url: 'courses/osint/business-intel.html',
            category: 'business-intel'
        },
        {
            title: 'Traçage de Cryptomonnaies',
            description: 'Techniques pour tracer les transactions de cryptomonnaies',
            url: 'courses/osint/cryptocurrency-tracing.html',
            category: 'crypto-tracing'
        },
        {
            title: 'Reconnaissance par Email',
            description: 'Techniques d\'OSINT basées sur les emails',
            url: 'courses/osint/email-recon.html',
            category: 'email-recon'
        },
        {
            title: 'Métadonnées d\'Images',
            description: 'Extraction et analyse des métadonnées d\'images',
            url: 'courses/osint/image-metadata.html',
            category: 'image-metadata'
        },
        {
            title: 'Méthodologie OSINT',
            description: 'Approche structurée pour les investigations OSINT',
            url: 'courses/osint/osint-tools-methodology.html',
            category: 'social-media'
        }
    ];
}

// Données des cours de programmation
function getProgrammingCourses() {
    return [
        {
            title: 'Python Basics',
            description: 'Fondamentaux de la programmation Python',
            url: 'courses/programming/python-basics.html',
            category: 'python'
        },
        {
            title: 'Python Avancé',
            description: 'Techniques avancées en Python pour la sécurité',
            url: 'courses/programming/python-advanced.html',
            category: 'python'
        },
        {
            title: 'C++ Fondamentaux',
            description: 'Bases de la programmation C++ pour la sécurité',
            url: 'courses/programming/cpp-fundamentals.html',
            category: 'cpp'
        },
        {
            title: 'C++ Avancé',
            description: 'Techniques avancées en C++ pour le hacking',
            url: 'courses/programming/cpp-advanced.html',
            category: 'cpp'
        },
        {
            title: 'Java Basics',
            description: 'Introduction à Java pour la sécurité',
            url: 'courses/programming/java-basics.html',
            category: 'java'
        },
        {
            title: 'Java Avancé',
            description: 'Techniques avancées en Java pour la sécurité',
            url: 'courses/programming/java-advanced.html',
            category: 'java'
        }
    ];
}

// Données des cours de sécurité
function getSecurityCourses() {
    return [
        {
            title: 'Principes de Base',
            description: 'Fondamentaux de la sécurité informatique',
            url: 'courses/security/basics.html',
            category: 'web-security'
        },
        {
            title: 'Techniques Avancées',
            description: 'Techniques avancées de sécurité informatique',
            url: 'courses/security/advanced.html',
            category: 'web-security'
        },
        {
            title: 'Vulnérabilités Web',
            description: 'Identification et exploitation des vulnérabilités web',
            url: 'courses/security/web-vulnerabilities.html',
            category: 'web-security'
        },
        {
            title: 'Programmation Sécurisée',
            description: 'Techniques de développement sécurisé',
            url: 'courses/security/secure-coding.html',
            category: 'secure-coding'
        },
        {
            title: 'Pentest Web',
            description: 'Méthodologie de test d\'intrusion web',
            url: 'courses/security/pentesting.html',
            category: 'web-security'
        },
        {
            title: 'Protection Réseau',
            description: 'Techniques de sécurisation des réseaux',
            url: 'courses/security/network-security.html',
            category: 'network-security'
        },
        {
            title: 'Configuration Firewall',
            description: 'Configuration avancée de pare-feu',
            url: 'courses/security/firewall-config.html',
            category: 'firewall'
        }
    ];
}
