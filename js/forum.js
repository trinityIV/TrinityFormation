document.addEventListener('DOMContentLoaded', function() {
    // Initialisation du canvas de fond
    initBackgroundCanvas();
    
    // Gestion des modals
    setupModals();
    
    // Gestion des formulaires
    setupForms();
    
    // Simulation de données pour le forum
    loadForumData();
});

// Initialisation du canvas de fond (si pas déjà chargé par background.js)
function initBackgroundCanvas() {
    const canvas = document.getElementById('background-canvas');
    if (!canvas) return;
    
    // Vérifier si le canvas est déjà initialisé
    if (typeof window.matrixInitialized === 'undefined') {
        const ctx = canvas.getContext('2d');
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Paramètres de l'animation Matrix
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];
        
        // Initialisation des positions de départ
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
        
        // Caractères Matrix
        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
        
        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = matrix[Math.floor(Math.random() * matrix.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        
        // Animation loop
        setInterval(draw, 35);
        window.matrixInitialized = true;
    }
}

// Configuration des modals
function setupModals() {
    // Gestion du modal de connexion
    const loginForm = document.querySelector('#loginModal form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simulation de connexion
            if (username && password) {
                // Fermer le modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                modal.hide();
                
                // Afficher un message de succès
                showNotification('Connexion réussie', 'success');
                
                // Mettre à jour l'interface pour un utilisateur connecté
                updateUIForLoggedUser(username);
            } else {
                showNotification('Veuillez remplir tous les champs', 'danger');
            }
        });
    }
    
    // Gestion du modal de création de sujet
    const newTopicForm = document.querySelector('#newTopicModal form');
    if (newTopicForm) {
        newTopicForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('topicTitle').value;
            const category = document.getElementById('topicCategory').value;
            const content = document.getElementById('topicContent').value;
            
            // Vérification des champs
            if (title && category && content) {
                // Fermer le modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('newTopicModal'));
                modal.hide();
                
                // Créer un nouveau sujet
                createNewTopic(title, category, content);
                
                // Afficher un message de succès
                showNotification('Sujet créé avec succès', 'success');
            } else {
                showNotification('Veuillez remplir tous les champs', 'danger');
            }
        });
    }
    
    // Ajouter des écouteurs d'événements pour les boutons de soumission des modals
    document.querySelectorAll('.modal .btn-primary').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            const form = modal.querySelector('form');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        });
    });
}

// Configuration des formulaires
function setupForms() {
    // Gestion du formulaire de recherche
    const searchForm = document.querySelector('form.d-flex');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = this.querySelector('input[type="search"]').value;
            
            if (searchTerm) {
                // Simuler une recherche
                showNotification(`Recherche en cours pour: ${searchTerm}`, 'info');
                
                // Ici, vous pourriez implémenter une vraie recherche
                setTimeout(() => {
                    // Simuler des résultats de recherche
                    const resultsHTML = `
                        <div class="alert alert-info">
                            <h4>Résultats pour "${searchTerm}"</h4>
                            <p>3 résultats trouvés</p>
                        </div>
                        <div class="list-group">
                            <a href="#" class="list-group-item list-group-item-action bg-dark">
                                <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1">Résultat 1: ${searchTerm} dans Game Hacking</h5>
                                    <small>2 jours</small>
                                </div>
                                <p class="mb-1">Discussion mentionnant ${searchTerm}</p>
                            </a>
                            <a href="#" class="list-group-item list-group-item-action bg-dark">
                                <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1">Résultat 2: OSINT et ${searchTerm}</h5>
                                    <small>1 semaine</small>
                                </div>
                                <p class="mb-1">Analyse de ${searchTerm} dans le contexte OSINT</p>
                            </a>
                        </div>
                    `;
                    
                    // Insérer les résultats dans la page
                    const resultsContainer = document.createElement('div');
                    resultsContainer.className = 'search-results mb-5';
                    resultsContainer.innerHTML = resultsHTML;
                    
                    // Trouver l'endroit où insérer les résultats
                    const mainContent = document.querySelector('main');
                    const firstSection = mainContent.querySelector('section, .card');
                    mainContent.insertBefore(resultsContainer, firstSection);
                    
                    // Scroll vers les résultats
                    resultsContainer.scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
        });
    }
}

// Charger les données simulées du forum
function loadForumData() {
    // Simuler le chargement des catégories
    const categories = [
        { id: 'game-hacking', name: 'Game Hacking', topics: 150, posts: 1200, color: 'primary' },
        { id: 'osint', name: 'OSINT', topics: 120, posts: 980, color: 'success' },
        { id: 'security', name: 'Sécurité', topics: 200, posts: 1500, color: 'warning' },
        { id: 'programming', name: 'Programmation', topics: 180, posts: 1300, color: 'info' },
        { id: 'cybersecurity', name: 'Cybersécurité', topics: 220, posts: 1800, color: 'danger' }
    ];
    
    // Simuler le chargement des sujets récents
    const recentTopics = [
        { 
            id: 1, 
            title: 'Guide Cheat Engine Avancé', 
            category: 'game-hacking',
            author: 'User123',
            time: '3 heures',
            replies: 15,
            content: 'Discussion sur les techniques avancées de Cheat Engine'
        },
        { 
            id: 2, 
            title: 'Méthodologie OSINT 2025', 
            category: 'osint',
            author: 'OSINTMaster',
            time: '5 heures',
            replies: 23,
            content: 'Nouvelles techniques d\'OSINT pour 2025'
        },
        { 
            id: 3, 
            title: 'Anti-Debug Avancé', 
            category: 'security',
            author: 'SecurityPro',
            time: '8 heures',
            replies: 19,
            content: 'Techniques anti-debug modernes'
        },
        { 
            id: 4, 
            title: 'Analyse de Malware avec IDA Pro', 
            category: 'cybersecurity',
            author: 'MalwareHunter',
            time: '12 heures',
            replies: 27,
            content: 'Comment utiliser IDA Pro pour l\'analyse de malware'
        },
        { 
            id: 5, 
            title: 'Développement C++ pour Game Hacking', 
            category: 'programming',
            author: 'CodeMaster',
            time: '1 jour',
            replies: 31,
            content: 'Techniques de programmation C++ pour le game hacking'
        }
    ];
    
    // Simuler le chargement des utilisateurs actifs
    const activeUsers = [
        { id: 1, username: 'User123', posts: 150, avatar: 'user1.jpg' },
        { id: 2, username: 'OSINTMaster', posts: 230, avatar: 'user2.jpg' },
        { id: 3, username: 'SecurityPro', posts: 180, avatar: 'user3.jpg' },
        { id: 4, username: 'HackMaster', posts: 320, avatar: 'user4.jpg' },
        { id: 5, username: 'CodeMaster', posts: 210, avatar: 'user5.jpg' },
        { id: 6, username: 'MalwareHunter', posts: 175, avatar: 'user6.jpg' },
        { id: 7, username: 'NetworkNinja', posts: 290, avatar: 'user7.jpg' },
        { id: 8, username: 'CryptoKing', posts: 260, avatar: 'user8.jpg' }
    ];
    
    // Mettre à jour les statistiques du forum
    updateForumStats(categories, recentTopics, activeUsers);
}

// Mettre à jour les statistiques du forum
function updateForumStats(categories, recentTopics, activeUsers) {
    // Calculer les statistiques globales
    const totalTopics = categories.reduce((sum, cat) => sum + cat.topics, 0);
    const totalPosts = categories.reduce((sum, cat) => sum + cat.posts, 0);
    const totalUsers = activeUsers.length;
    
    // Créer un élément pour les statistiques
    const statsHTML = `
        <div class="card bg-dark border-info mb-5">
            <div class="card-header bg-info bg-opacity-25 text-info">
                <h2 class="h5 mb-0"><i class="fas fa-chart-bar"></i> Statistiques du Forum</h2>
            </div>
            <div class="card-body">
                <div class="row text-center">
                    <div class="col-md-3">
                        <h3 class="h2">${totalTopics}</h3>
                        <p>Sujets</p>
                    </div>
                    <div class="col-md-3">
                        <h3 class="h2">${totalPosts}</h3>
                        <p>Messages</p>
                    </div>
                    <div class="col-md-3">
                        <h3 class="h2">${totalUsers}</h3>
                        <p>Membres</p>
                    </div>
                    <div class="col-md-3">
                        <h3 class="h2">${activeUsers[0].username}</h3>
                        <p>Membre le plus actif</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insérer les statistiques après la barre de recherche
    const searchBar = document.querySelector('.card.bg-dark.border-info.mb-5');
    if (searchBar) {
        searchBar.insertAdjacentHTML('afterend', statsHTML);
    }
    
    // Mettre à jour les catégories
    updateCategories(categories);
}

// Mettre à jour les catégories du forum
function updateCategories(categories) {
    // Trouver le conteneur des catégories
    const categoryRow = document.querySelector('.row.mb-5');
    if (!categoryRow) return;
    
    // Vider le conteneur
    categoryRow.innerHTML = '';
    
    // Ajouter chaque catégorie
    categories.forEach(category => {
        const categoryHTML = `
            <div class="col-md-4 mb-4">
                <div class="card bg-dark border-${category.color}">
                    <div class="card-body">
                        <h2 class="h5 text-${category.color}">${category.name}</h2>
                        <p class="mb-2">Discussions sur ${category.name}</p>
                        <div class="d-flex justify-content-between">
                            <span>Topics: ${category.topics}</span>
                            <span>Posts: ${category.posts}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        categoryRow.insertAdjacentHTML('beforeend', categoryHTML);
    });
}

// Créer un nouveau sujet
function createNewTopic(title, category, content) {
    // Créer un nouvel élément de sujet
    const newTopicHTML = `
        <a href="#" class="list-group-item list-group-item-action bg-dark">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${title}</h5>
                <small>À l'instant</small>
            </div>
            <p class="mb-1">${content.substring(0, 100)}${content.length > 100 ? '...' : ''}</p>
            <small>Par: Vous | Réponses: 0</small>
        </a>
    `;
    
    // Trouver la liste des sujets récents
    const recentTopicsList = document.querySelector('section .list-group');
    if (recentTopicsList) {
        // Ajouter le nouveau sujet au début de la liste
        recentTopicsList.insertAdjacentHTML('afterbegin', newTopicHTML);
    }
}

// Mettre à jour l'interface pour un utilisateur connecté
function updateUIForLoggedUser(username) {
    // Trouver le bouton de connexion
    const loginButton = document.querySelector('button[data-bs-target="#loginModal"]');
    if (loginButton) {
        // Remplacer par un message de bienvenue
        const welcomeHTML = `
            <div class="dropdown">
                <button class="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user"></i> ${username}
                </button>
                <ul class="dropdown-menu dropdown-menu-dark">
                    <li><a class="dropdown-item" href="#">Mon profil</a></li>
                    <li><a class="dropdown-item" href="#">Mes messages</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()">Déconnexion</a></li>
                </ul>
            </div>
        `;
        
        loginButton.outerHTML = welcomeHTML;
    }
}

// Fonction de déconnexion
function logout() {
    // Recharger la page pour réinitialiser l'état
    location.reload();
}

// Afficher une notification
function showNotification(message, type = 'info') {
    // Créer un élément de notification
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification`;
    notification.innerHTML = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    
    // Ajouter la notification au document
    document.body.appendChild(notification);
    
    // Supprimer la notification après 3 secondes
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Exposer les fonctions globalement
window.logout = logout;
window.showNotification = showNotification;
