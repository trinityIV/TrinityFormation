/**
 * Trinity Pro - Script d'authentification
 * Gère les fonctionnalités d'inscription et de connexion
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les formulaires
    initSignupForm();
    initLoginForm();
    initPasswordToggle();
    initPasswordStrength();
});

/**
 * Initialise le formulaire d'inscription
 */
function initSignupForm() {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Vérifier la validité du formulaire
        if (!this.checkValidity()) {
            e.stopPropagation();
            this.classList.add('was-validated');
            return;
        }
        
        // Vérifier que les mots de passe correspondent
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity('Les mots de passe ne correspondent pas');
            this.classList.add('was-validated');
            return;
        } else {
            confirmPassword.setCustomValidity('');
        }
        
        // Vérifier le captcha
        const captchaInput = document.getElementById('captchaInput');
        const captchaValue = captchaInput.dataset.captcha;
        
        if (captchaInput.value !== captchaValue) {
            captchaInput.setCustomValidity('Code captcha incorrect');
            this.classList.add('was-validated');
            return;
        } else {
            captchaInput.setCustomValidity('');
        }
        
        // Simuler l'inscription réussie
        showSuccessMessage();
    });
    
    // Initialiser le captcha
    if (typeof refreshCaptcha === 'function') {
        refreshCaptcha();
    }
}

/**
 * Initialise le formulaire de connexion
 */
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Vérifier la validité du formulaire
        if (!this.checkValidity()) {
            e.stopPropagation();
            this.classList.add('was-validated');
            return;
        }
        
        // Simuler la connexion réussie
        // Dans une implémentation réelle, cela enverrait une requête au serveur
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe')?.checked;
        
        console.log('Tentative de connexion:', { username, password: '********', rememberMe });
        
        // Rediriger vers la page d'accueil (simulation de connexion réussie)
        window.location.href = 'index.html';
    });
}

/**
 * Initialise les boutons de basculement de visibilité du mot de passe
 */
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const inputId = this.getAttribute('data-target') || this.previousElementSibling.id;
            const input = document.getElementById(inputId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

/**
 * Initialise la vérification de force du mot de passe
 */
function initPasswordStrength() {
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;
    
    const progressBar = document.querySelector('.password-strength .progress-bar');
    const feedback = document.querySelector('.password-feedback');
    
    if (!progressBar || !feedback) return;
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        let message = '';
        
        // Critères de force du mot de passe
        if (password.length >= 8) strength += 25;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
        if (password.match(/\d/)) strength += 25;
        if (password.match(/[^a-zA-Z\d]/)) strength += 25;
        
        // Mettre à jour la barre de progression
        progressBar.style.width = strength + '%';
        
        // Définir la classe et le message en fonction de la force
        if (strength < 25) {
            progressBar.className = 'progress-bar bg-danger';
            message = 'Très faible';
        } else if (strength < 50) {
            progressBar.className = 'progress-bar bg-warning';
            message = 'Faible';
        } else if (strength < 75) {
            progressBar.className = 'progress-bar bg-info';
            message = 'Moyen';
        } else if (strength < 100) {
            progressBar.className = 'progress-bar bg-primary';
            message = 'Fort';
        } else {
            progressBar.className = 'progress-bar bg-success';
            message = 'Très fort';
        }
        
        feedback.textContent = message;
    });
    
    // Vérification de correspondance des mots de passe
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value !== passwordInput.value) {
                this.setCustomValidity('Les mots de passe ne correspondent pas');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

/**
 * Affiche un message de succès après l'inscription
 */
function showSuccessMessage() {
    const form = document.getElementById('signupForm');
    if (!form) return;
    
    form.innerHTML = `
        <div class="text-center py-5">
            <div class="mb-4">
                <i class="fas fa-check-circle text-success fa-5x"></i>
            </div>
            <h3 class="text-success mb-3">Inscription réussie!</h3>
            <p class="mb-4">Votre compte a été créé avec succès. Un e-mail de confirmation a été envoyé à votre adresse.</p>
            <div class="d-grid gap-2">
                <a href="connexion.html" class="btn btn-primary">
                    <i class="fas fa-sign-in-alt me-2"></i>Se connecter
                </a>
                <a href="index.html" class="btn btn-outline-light">
                    <i class="fas fa-home me-2"></i>Retour à l'accueil
                </a>
            </div>
        </div>
    `;
}

/**
 * Génère un nouveau captcha
 */
function refreshCaptcha() {
    const captchaText = document.querySelector('.captcha-text');
    if (!captchaText) return;
    
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captcha = '';
    const colors = ['text-primary', 'text-success', 'text-warning', 'text-danger', 'text-info'];
    
    captchaText.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        const span = document.createElement('span');
        span.textContent = randomChar;
        span.className = colors[i];
        captchaText.appendChild(span);
        captcha += randomChar;
    }
    
    // Stocker le captcha pour vérification
    const captchaInput = document.getElementById('captchaInput');
    if (captchaInput) {
        captchaInput.dataset.captcha = captcha;
    }
}
