class QuizSystem {
    constructor() {
        this.currentQuiz = null;
        this.score = 0;
        this.attempts = 0;
        this.maxAttempts = 3;
    }

    loadQuiz(quizData) {
        this.currentQuiz = quizData;
        this.score = 0;
        this.attempts = 0;
        this.renderQuiz();
    }

    renderQuiz() {
        const quizContainer = document.getElementById('quiz-container');
        if (!quizContainer || !this.currentQuiz) return;

        let html = `
            <div class="card bg-dark border-info mb-4">
                <div class="card-header bg-dark border-info">
                    <h4 class="text-info mb-0">
                        <i class="fas fa-question-circle me-2"></i>Quiz: ${this.currentQuiz.title}
                    </h4>
                </div>
                <div class="card-body">
                    <form id="quiz-form">`;

        this.currentQuiz.questions.forEach((question, qIndex) => {
            html += `
                <div class="question mb-4" data-question="${qIndex}">
                    <p class="fw-bold text-light">${question.question}</p>
                    <div class="answers">`;

            question.answers.forEach((answer, aIndex) => {
                html += `
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="radio" 
                                name="question${qIndex}" 
                                id="q${qIndex}a${aIndex}" 
                                value="${aIndex}">
                            <label class="form-check-label text-light" for="q${qIndex}a${aIndex}">
                                ${answer}
                            </label>
                        </div>`;
            });

            html += `
                    </div>
                    <div class="feedback mt-2 d-none"></div>
                </div>`;
        });

        html += `
                    <div class="d-flex justify-content-between align-items-center mt-4">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-check-circle me-2"></i>Vérifier les réponses
                        </button>
                        <span class="text-muted">Tentatives: <span id="attempts">0</span>/${this.maxAttempts}</span>
                    </div>
                </form>
                <div id="quiz-results" class="mt-3 d-none">
                    <div class="alert alert-success">
                        <h5 class="alert-heading">
                            <i class="fas fa-trophy me-2"></i>Félicitations!
                        </h5>
                        <p class="mb-0">Score final: <span id="final-score">0</span>/${this.currentQuiz.questions.length}</p>
                    </div>
                </div>
            </div>`;

        quizContainer.innerHTML = html;

        // Event listener pour la soumission du quiz
        document.getElementById('quiz-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.checkAnswers();
        });
    }

    checkAnswers() {
        if (this.attempts >= this.maxAttempts) return;

        this.attempts++;
        document.getElementById('attempts').textContent = this.attempts;

        let correctAnswers = 0;
        this.currentQuiz.questions.forEach((question, qIndex) => {
            const selectedAnswer = document.querySelector(`input[name="question${qIndex}"]:checked`);
            const questionDiv = document.querySelector(`[data-question="${qIndex}"]`);
            const feedbackDiv = questionDiv.querySelector('.feedback');

            if (selectedAnswer) {
                const answerIndex = parseInt(selectedAnswer.value);
                if (answerIndex === question.correctAnswer) {
                    correctAnswers++;
                    feedbackDiv.className = 'feedback mt-2 alert alert-success';
                    feedbackDiv.innerHTML = `<i class="fas fa-check-circle me-2"></i>${question.explanation || 'Correct!'}`;
                } else {
                    feedbackDiv.className = 'feedback mt-2 alert alert-danger';
                    feedbackDiv.innerHTML = `<i class="fas fa-times-circle me-2"></i>${question.explanation || 'Incorrect. Réessayez.'}`;
                }
                feedbackDiv.classList.remove('d-none');
            }
        });

        this.score = Math.max(this.score, correctAnswers);

        if (correctAnswers === this.currentQuiz.questions.length || this.attempts >= this.maxAttempts) {
            this.showResults();
        }

        // Sauvegarder la progression
        this.saveProgress();
    }

    showResults() {
        const form = document.getElementById('quiz-form');
        const results = document.getElementById('quiz-results');
        const finalScore = document.getElementById('final-score');

        form.querySelector('button[type="submit"]').disabled = true;
        results.classList.remove('d-none');
        finalScore.textContent = this.score;

        // Mettre à jour la barre de progression du cours si elle existe
        const progressBar = document.getElementById('courseProgress');
        if (progressBar) {
            const currentProgress = parseInt(progressBar.style.width) || 0;
            const quizProgress = (this.score / this.currentQuiz.questions.length) * 25; // 25% pour chaque quiz
            progressBar.style.width = `${Math.max(currentProgress, quizProgress)}%`;
        }
    }

    saveProgress() {
        const progress = {
            quizId: this.currentQuiz.id,
            score: this.score,
            attempts: this.attempts,
            completed: this.score === this.currentQuiz.questions.length || this.attempts >= this.maxAttempts
        };

        localStorage.setItem(`quiz_progress_${this.currentQuiz.id}`, JSON.stringify(progress));
    }

    loadProgress() {
        if (!this.currentQuiz) return null;
        const progress = localStorage.getItem(`quiz_progress_${this.currentQuiz.id}`);
        return progress ? JSON.parse(progress) : null;
    }
}
