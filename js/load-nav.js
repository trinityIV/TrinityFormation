document.addEventListener('DOMContentLoaded', function() {
    // Charger la navigation
    fetch('../includes/course-nav.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navigation-placeholder').innerHTML = data;
            
            // Mettre en surbrillance le lien actif
            const currentPage = window.location.pathname.split('/').pop();
            const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.classList.add('active');
                }
            });
        })
        .catch(error => console.error('Erreur lors du chargement de la navigation:', error));
});
