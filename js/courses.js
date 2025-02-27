document.addEventListener('DOMContentLoaded', function() {
    // Gestion des dropdowns de navigation
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdownMenu = dropdown.nextElementSibling;
            dropdownMenu.classList.toggle('show');
        });
    });

    // Fermer les dropdowns quand on clique ailleurs
    document.addEventListener('click', (e) => {
        if (!e.target.matches('.dropdown-toggle')) {
            const dropdowns = document.querySelectorAll('.dropdown-menu.show');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });

    // Animation des sections de cours
    const courseSections = document.querySelectorAll('.course-section');
    courseSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
    });

    // Fonction pour vérifier si un élément est visible
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Animation au scroll
    function handleScroll() {
        courseSections.forEach(section => {
            if (isElementInViewport(section)) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }

    // Initial check
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    // Gestion des accordéons
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
        });
    });

    // Highlight du code
    const codeBlocks = document.querySelectorAll('.code-block');
    codeBlocks.forEach(block => {
        block.innerHTML = block.innerHTML.replace(
            /(\/\/.*)|(\b(class|private|public|void|int|bool|std|vector|HANDLE|DWORD)\b)/g,
            match => {
                if (match.startsWith('//')) {
                    return `<span style="color: #6a9955">${match}</span>`;
                }
                return `<span style="color: #569cd6">${match}</span>`;
            }
        );
    });

    // Gestion de la table des matières
    const tocLinks = document.querySelectorAll('#toc a.nav-link');
    const sections = [];

    // Collecter toutes les sections référencées par la table des matières
    tocLinks.forEach(link => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                sections.push({
                    id: targetId.substring(1),
                    element: targetSection,
                    link: link
                });
            }
        }
    });

    // Fonction pour mettre à jour la table des matières en fonction du défilement
    function updateTOC() {
        // Trouver la section actuellement visible
        let currentSectionId = null;
        const scrollPosition = window.scrollY + 150; // Ajouter un offset pour une meilleure détection

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionTop = section.element.offsetTop;
            const sectionBottom = sectionTop + section.element.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionId = section.id;
                break;
            }
        }

        // Mettre à jour les classes des liens de la table des matières
        tocLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}`) {
                link.classList.add('active');
                link.style.color = '#ffffff';
                link.style.fontWeight = 'bold';
                link.style.borderLeft = '3px solid #0d6efd';
                link.style.paddingLeft = '10px';
            } else {
                link.classList.remove('active');
                link.style.color = '';
                link.style.fontWeight = '';
                link.style.borderLeft = '';
                link.style.paddingLeft = '';
            }
        });
    }

    // Ajouter des écouteurs d'événements pour les liens de la table des matières
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Faire défiler jusqu'à la section cible avec une animation fluide
                    window.scrollTo({
                        top: targetElement.offsetTop - 100, // Offset pour tenir compte de la navbar fixe
                        behavior: 'smooth'
                    });

                    // Mettre à jour l'URL avec le hash
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // Vérifier la position de défilement lors du chargement et du défilement
    updateTOC();
    window.addEventListener('scroll', updateTOC);
});
