/* 
 * Trinity Pro - Particles.js
 * Effet de particules pour l'arrière-plan
 */

// Fonction principale pour initialiser les particules
function initParticlesJS(containerId, options) {
    // Créer le canvas
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    canvas.className = 'particles-js-canvas-el';
    container.appendChild(canvas);
    
    // Contexte de dessin
    const ctx = canvas.getContext('2d');
    
    // Paramètres par défaut
    const defaults = {
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
    };
    
    // Fusionner les options avec les paramètres par défaut
    const settings = Object.assign({}, defaults, options);
    
    // Tableau de particules
    let particles = [];
    
    // Dimensions du canvas
    let width = container.offsetWidth;
    let height = container.offsetHeight;
    
    // Redimensionner le canvas
    function resizeCanvas() {
        width = container.offsetWidth;
        height = container.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    // Créer une particule
    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: (settings.particles.size.random ? Math.random() : 1) * settings.particles.size.value,
            color: settings.particles.color.value,
            opacity: (settings.particles.opacity.random ? Math.random() : 1) * settings.particles.opacity.value,
            vx: (Math.random() - 0.5) * settings.particles.move.speed,
            vy: (Math.random() - 0.5) * settings.particles.move.speed,
            // Propriétés pour les animations
            size_status: false,
            vs: settings.particles.size.anim.speed / 100,
            opacity_status: false,
            vo: settings.particles.opacity.anim.speed / 100
        };
    }
    
    // Initialiser les particules
    function initParticles() {
        particles = [];
        const particleCount = settings.particles.number.value;
        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle());
        }
    }
    
    // Dessiner une particule
    function drawParticle(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 0, ${p.opacity})`;
        ctx.fill();
    }
    
    // Dessiner une ligne entre deux particules
    function drawLine(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist <= settings.particles.line_linked.distance) {
            const opacity = settings.particles.line_linked.opacity - (dist / settings.particles.line_linked.distance);
            if (opacity > 0) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 255, 0, ${opacity})`;
                ctx.lineWidth = settings.particles.line_linked.width;
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }
    
    // Mettre à jour les particules
    function updateParticles() {
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Déplacer la particule
            if (settings.particles.move.enable) {
                p.x += p.vx;
                p.y += p.vy;
            }
            
            // Rebondir sur les bords
            if (settings.particles.move.bounce) {
                if (p.x - p.radius < 0) {
                    p.vx = Math.abs(p.vx);
                } else if (p.x + p.radius > width) {
                    p.vx = -Math.abs(p.vx);
                }
                
                if (p.y - p.radius < 0) {
                    p.vy = Math.abs(p.vy);
                } else if (p.y + p.radius > height) {
                    p.vy = -Math.abs(p.vy);
                }
            } else {
                // Sortir et réapparaître de l'autre côté
                if (p.x < -p.radius) p.x = width + p.radius;
                else if (p.x > width + p.radius) p.x = -p.radius;
                
                if (p.y < -p.radius) p.y = height + p.radius;
                else if (p.y > height + p.radius) p.y = -p.radius;
            }
            
            // Animation de la taille
            if (settings.particles.size.anim.enable) {
                if (p.size_status) {
                    p.radius += p.vs;
                    if (p.radius >= settings.particles.size.value) {
                        p.size_status = false;
                    }
                } else {
                    p.radius = Math.max(settings.particles.size.anim.size_min, p.radius - p.vs);
                    if (p.radius <= settings.particles.size.anim.size_min) {
                        p.size_status = true;
                    }
                }
            }
            
            // Animation de l'opacité
            if (settings.particles.opacity.anim.enable) {
                if (p.opacity_status) {
                    p.opacity += p.vo;
                    if (p.opacity >= settings.particles.opacity.value) {
                        p.opacity_status = false;
                    }
                } else {
                    p.opacity -= p.vo;
                    if (p.opacity <= settings.particles.opacity.anim.opacity_min) {
                        p.opacity_status = true;
                    }
                }
            }
            
            // Dessiner la particule
            drawParticle(p);
            
            // Dessiner les lignes entre les particules
            if (settings.particles.line_linked.enable) {
                for (let j = i + 1; j < particles.length; j++) {
                    drawLine(p, particles[j]);
                }
            }
        }
    }
    
    // Boucle d'animation
    function animate() {
        ctx.clearRect(0, 0, width, height);
        updateParticles();
        requestAnimationFrame(animate);
    }
    
    // Initialisation
    function init() {
        resizeCanvas();
        initParticles();
        animate();
        
        // Redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });
        
        // Interactivité
        if (settings.interactivity.events.onhover.enable) {
            container.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                if (settings.interactivity.events.onhover.mode === 'grab') {
                    particles.forEach(p => {
                        const dx = p.x - mouseX;
                        const dy = p.y - mouseY;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        
                        if (dist <= settings.interactivity.modes.grab.distance) {
                            const opacity = settings.interactivity.modes.grab.line_linked.opacity - (dist / settings.interactivity.modes.grab.distance);
                            if (opacity > 0) {
                                ctx.beginPath();
                                ctx.strokeStyle = `rgba(0, 255, 0, ${opacity})`;
                                ctx.lineWidth = settings.particles.line_linked.width;
                                ctx.moveTo(p.x, p.y);
                                ctx.lineTo(mouseX, mouseY);
                                ctx.stroke();
                            }
                        }
                    });
                }
            });
        }
        
        if (settings.interactivity.events.onclick.enable) {
            container.addEventListener('click', (e) => {
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                if (settings.interactivity.events.onclick.mode === 'push') {
                    for (let i = 0; i < settings.interactivity.modes.push.particles_nb; i++) {
                        const p = createParticle();
                        p.x = mouseX;
                        p.y = mouseY;
                        particles.push(p);
                    }
                }
            });
        }
    }
    
    // Démarrer
    init();
}

// Fonction globale pour initialiser les particules
window.particlesJS = function(containerId, options) {
    initParticlesJS(containerId, options);
};
