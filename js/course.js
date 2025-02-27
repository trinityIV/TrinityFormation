// Gestion de l'intersection observer pour les animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observer toutes les sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Gestion du quiz
class QuizManager {
    constructor(quizData) {
        this.quizData = quizData;
        this.currentQuiz = null;
        this.score = 0;
        this.answeredQuestions = 0;
    }

    initializeQuiz(partId) {
        this.currentQuiz = this.quizData[partId];
        this.renderQuiz();
    }

    renderQuiz() {
        const container = document.getElementById('quiz-container');
        if (!container || !this.currentQuiz) return;

        const quizHTML = this.currentQuiz.questions.map((question, index) => `
            <div class="quiz-question" data-question="${index}">
                <h3>${question.question}</h3>
                <div class="quiz-options">
                    ${question.answers.map((answer, ansIndex) => `
                        <div class="quiz-option" data-index="${ansIndex}">
                            ${answer}
                        </div>
                    `).join('')}
                </div>
                <div class="quiz-explanation" style="display: none;">
                    ${question.explanation}
                </div>
            </div>
        `).join('');

        container.innerHTML = quizHTML;
        this.attachQuizListeners();
    }

    attachQuizListeners() {
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', (e) => this.handleAnswer(e));
        });
    }

    handleAnswer(e) {
        const option = e.target;
        const questionEl = option.closest('.quiz-question');
        const questionIndex = parseInt(questionEl.dataset.question);
        const answerIndex = parseInt(option.dataset.index);

        if (questionEl.classList.contains('answered')) return;

        const correct = this.currentQuiz.questions[questionIndex].correctAnswer === answerIndex;
        
        option.classList.add(correct ? 'correct' : 'incorrect');
        questionEl.classList.add('answered');
        
        const explanation = questionEl.querySelector('.quiz-explanation');
        explanation.style.display = 'block';

        if (correct) this.score++;
        this.answeredQuestions++;

        this.updateProgress();
    }

    updateProgress() {
        const progress = (this.answeredQuestions / this.currentQuiz.questions.length) * 100;
        // Mise à jour de la barre de progression si elle existe
        const progressBar = document.querySelector('.quiz-progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }
}

// Gestion des exercices pratiques
class PracticeManager {
    constructor(practiceData) {
        this.practiceData = practiceData;
        this.currentExercises = null;
    }

    initializePractice(partId) {
        this.currentExercises = this.practiceData[partId];
        this.renderPractice();
    }

    renderPractice() {
        const container = document.getElementById('practice-container');
        if (!container || !this.currentExercises) return;

        const practiceHTML = this.currentExercises.map(exercise => `
            <div class="practice-exercise">
                <h3>${exercise.title}</h3>
                <span class="practice-time">⏱️ ${exercise.estimatedTime}</span>
                <p>${exercise.description}</p>
                <h4>Objectifs :</h4>
                <ul class="practice-objectives">
                    ${exercise.objectives.map(obj => `<li>${obj}</li>`).join('')}
                </ul>
                <div class="code-example">
                    <pre><code class="language-cpp">${exercise.starterCode}</code></pre>
                </div>
                <h4>Conseils :</h4>
                <ul class="practice-hints">
                    ${exercise.hints.map(hint => `<li>${hint}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        container.innerHTML = practiceHTML;
        
        // Initialiser la coloration syntaxique si Prism est disponible
        if (window.Prism) {
            Prism.highlightAll();
        }
    }
}

// Gestion des ressources
class ResourceManager {
    constructor(resourcesData) {
        this.resourcesData = resourcesData;
        this.currentResources = null;
    }

    initializeResources(partId) {
        this.currentResources = this.resourcesData[partId];
        this.renderResources();
    }

    renderResources() {
        const container = document.getElementById('resources-container');
        if (!container || !this.currentResources) return;

        const categoriesHTML = Object.entries(this.currentResources).map(([category, items]) => `
            <div class="resources-section">
                <h3>${this.formatCategoryName(category)}</h3>
                <div class="resources-grid">
                    ${items.map(item => `
                        <div class="resource-card">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                            ${item.url ? `
                                <a href="${item.url}" class="resource-link" target="_blank">
                                    Voir la ressource →
                                </a>
                            ` : item.path ? `
                                <a href="${item.path}" class="resource-link">
                                    Voir l'exemple →
                                </a>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        container.innerHTML = categoriesHTML;
    }

    formatCategoryName(category) {
        return {
            'diagrams': 'Diagrammes',
            'code': 'Exemples de Code',
            'external': 'Ressources Externes',
            'videos': 'Vidéos',
            'papers': 'Articles Académiques'
        }[category] || category;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const quizManager = new QuizManager(window.quizData);
    const practiceManager = new PracticeManager(window.practiceData);
    const resourceManager = new ResourceManager(window.resourcesData);

    // Initialiser pour la partie 2
    quizManager.initializeQuiz('part2');
    practiceManager.initializePractice('part2');
    resourceManager.initializeResources('part2');
});

// Suivi de progression
let lastScrollPosition = window.pageYOffset;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Gestion du header
    if (currentScroll > lastScrollPosition) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    lastScrollPosition = currentScroll;

    // Calcul de la progression
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const progress = (currentScroll / (documentHeight - windowHeight)) * 100;

    // Mise à jour de la barre de progression si elle existe
    const progressBar = document.querySelector('.course-progress');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
});
