document.addEventListener('DOMContentLoaded', function() {
    // Contenu de la navigation
    const navContent = `
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top py-3 navbar-blur">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="/index.html">
                <div class="logo-icon me-2">
                    <i class="fas fa-cube fa-lg text-success"></i>
                </div>
                <div class="logo-text">
                    <span class="fw-bold">Trinity</span><span class="text-success fw-bold">Pro</span>
                </div>
            </a>
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/index.html">
                            <i class="fas fa-home me-1"></i> Accueil
                        </a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle active" href="#" id="navbarDropdownCourses" role="button" data-bs-toggle="dropdown">
                            <i class="fas fa-graduation-cap me-1"></i> Cours
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-blur">
                            <li><a class="dropdown-item" href="/cours/index.html">Tous les cours</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><h6 class="dropdown-header">Cybersécurité</h6></li>
                            <li><a class="dropdown-item" href="/cours/cybersecurite/hacking-ethique.html">Hacking Éthique</a></li>
                            <li><a class="dropdown-item" href="/cours/cybersecurite/tests-intrusion.html">Tests d'Intrusion</a></li>
                            <li><a class="dropdown-item active" href="/cours/cybersecurite/developpement-exploits.html">Développement d'Exploits</a></li>
                            <li><a class="dropdown-item" href="/cours/cybersecurite/cadre-legal-ethique.html">Cadre Légal et Éthique</a></li>
                            <li><a class="dropdown-item" href="/cours/cybersecurite/documentation-rapports.html">Documentation et Rapports</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><h6 class="dropdown-header">Game Hacking</h6></li>
                            <li><a class="dropdown-item" href="/cours/game-hacking/cheat-engine-basics.html">Cheat Engine Basics</a></li>
                            <li><a class="dropdown-item" href="/cours/game-hacking/ida-pro-basics.html">IDA Pro Basics</a></li>
                            <li><a class="dropdown-item" href="/cours/game-hacking/anticheat/contournement-introduction.html">Contournement Anti-Cheat</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><h6 class="dropdown-header">Programmation</h6></li>
                            <li><a class="dropdown-item" href="/cours/programmation/cpp/fondamentaux.html">C++ Fondamentaux</a></li>
                            <li><a class="dropdown-item" href="/cours/programmation/cpp/avance.html">C++ Avancé</a></li>
                            <li><a class="dropdown-item" href="/cours/programmation/cpp/cpp-pour-anticheat.html">C++ pour Anti-Cheat</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><h6 class="dropdown-header">OSINT</h6></li>
                            <li><a class="dropdown-item" href="/cours/osint/introduction.html">Introduction</a></li>
                            <li><a class="dropdown-item" href="/cours/osint/reseaux-sociaux.html">Réseaux Sociaux</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            <i class="fas fa-book me-1"></i> Ressources
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-blur">
                            <li><a class="dropdown-item" href="/ressources/bibliotheque.html">Bibliothèque</a></li>
                            <li><a class="dropdown-item" href="/ressources/exercices.html">Exercices</a></li>
                            <li><a class="dropdown-item" href="/ressources/forum.html">Forum</a></li>
                            <li><a class="dropdown-item" href="/ressources/faq.html">FAQ</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><h6 class="dropdown-header">Téléchargements</h6></li>
                            <li><a class="dropdown-item" href="/ressources/cheatsheets.html">Cheatsheets</a></li>
                            <li><a class="dropdown-item" href="/ressources/templates.html">Templates</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            <i class="fas fa-tools me-1"></i> Outils
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-blur">
                            <li><h6 class="dropdown-header">Essentiels</h6></li>
                            <li><a class="dropdown-item" href="/outils/outils-gratuits.html">Outils Gratuits</a></li>
                            <li><a class="dropdown-item" href="/outils/outils-developpement.html">Outils de Développement</a></li>
                            <li><a class="dropdown-item" href="/outils/outils-pratiques.html">Outils Pratiques</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><h6 class="dropdown-header">Spécialisés</h6></li>
                            <li><a class="dropdown-item" href="/outils/game-hacking.html">Game Hacking</a></li>
                            <li><a class="dropdown-item" href="/outils/moteurs-jeux.html">Moteurs de Jeux</a></li>
                            <li><a class="dropdown-item" href="/outils/mobile-hacking.html">Mobile Hacking</a></li>
                            <li><a class="dropdown-item" href="/outils/protection.html">Protection</a></li>
                            <li><a class="dropdown-item" href="/outils/techniques-avancees.html">Techniques Avancées</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            <i class="fas fa-users me-1"></i> Communauté
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-blur">
                            <li><a class="dropdown-item" href="/communauté/evenements.html">Événements</a></li>
                            <li><a class="dropdown-item" href="/communauté/discord.html">Discord</a></li>
                            <li><a class="dropdown-item" href="/communauté/contribuer.html">Contribuer</a></li>
                            <li><a class="dropdown-item" href="/communauté/partenaires.html">Partenaires</a></li>
                            <li><a class="dropdown-item" href="/communauté/assistant-ia.html">Assistant IA</a></li>
                        </ul>
                    </li>
                    <li class="nav-item ms-lg-3">
                        <a class="btn btn-outline-success btn-glow" href="/connexion.html">
                            <i class="fas fa-sign-in-alt me-1"></i> Connexion
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `;

    // Insérer la navigation dans le placeholder
    const navigationPlaceholder = document.getElementById('navigation-placeholder');
    if (navigationPlaceholder) {
        navigationPlaceholder.innerHTML = navContent;
    }

    // Initialiser les dropdowns Bootstrap
    const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl);
    });
});
