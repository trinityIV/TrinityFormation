class PracticeSystem {
    constructor() {
        this.currentExercise = null;
        this.editor = null;
    }

    async loadExercise(exerciseData) {
        this.currentExercise = exerciseData;
        await this.renderExercise();
        this.initializeCodeMirror();
    }

    async renderExercise() {
        const container = document.getElementById('practice-container');
        if (!container || !this.currentExercise) return;

        const html = `
            <div class="card bg-dark border-warning mb-4">
                <div class="card-header bg-dark border-warning d-flex justify-content-between align-items-center">
                    <h4 class="text-warning mb-0">
                        <i class="fas fa-laptop-code me-2"></i>${this.currentExercise.title}
                    </h4>
                    <span class="badge bg-warning text-dark">
                        <i class="fas fa-clock me-1"></i>${this.currentExercise.estimatedTime}
                    </span>
                </div>
                <div class="card-body">
                    <div class="description mb-4">
                        <h5 class="text-light">Description</h5>
                        <p>${this.currentExercise.description}</p>
                    </div>
                    
                    <div class="objectives mb-4">
                        <h5 class="text-light">Objectifs</h5>
                        <ul class="list-group list-group-flush bg-dark">
                            ${this.currentExercise.objectives.map(obj => `
                                <li class="list-group-item bg-dark text-light">
                                    <i class="fas fa-check-circle me-2 text-warning"></i>${obj}
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    <div class="starter-code mb-4">
                        <h5 class="text-light">Code de départ</h5>
                        <div id="code-editor" class="border rounded p-2">${this.currentExercise.starterCode}</div>
                    </div>

                    <div class="hints mb-4">
                        <h5 class="text-light">Indices</h5>
                        <div class="accordion" id="hintsAccordion">
                            ${this.currentExercise.hints.map((hint, index) => `
                                <div class="accordion-item bg-dark">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed bg-dark text-light" type="button" 
                                                data-bs-toggle="collapse" data-bs-target="#hint${index}">
                                            Indice ${index + 1}
                                        </button>
                                    </h2>
                                    <div id="hint${index}" class="accordion-collapse collapse" data-bs-parent="#hintsAccordion">
                                        <div class="accordion-body text-light">
                                            ${hint}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="validation mb-4">
                        <h5 class="text-light">Tests de validation</h5>
                        <div id="test-results"></div>
                        <button class="btn btn-warning" onclick="practiceSystem.runTests()">
                            <i class="fas fa-vial me-2"></i>Exécuter les tests
                        </button>
                    </div>

                    <div class="resources">
                        <h5 class="text-light">Ressources utiles</h5>
                        <ul class="list-group list-group-flush bg-dark">
                            ${this.currentExercise.resources.map(resource => `
                                <li class="list-group-item bg-dark">
                                    <a href="${resource.url}" target="_blank" class="text-info">
                                        <i class="fas fa-external-link-alt me-2"></i>${resource.title}
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>`;

        container.innerHTML = html;
    }

    initializeCodeMirror() {
        const editor = document.getElementById('code-editor');
        if (!editor) return;

        this.editor = CodeMirror(editor, {
            value: this.currentExercise.starterCode,
            mode: "javascript",
            theme: "dracula",
            lineNumbers: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            indentUnit: 4,
            tabSize: 4,
            lineWrapping: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "F11": function(cm) {
                    cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                },
                "Esc": function(cm) {
                    if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                }
            }
        });
    }

    async runTests() {
        if (!this.currentExercise || !this.editor) return;

        const code = this.editor.getValue();
        const resultsDiv = document.getElementById('test-results');
        resultsDiv.innerHTML = '<div class="alert alert-info">Exécution des tests...</div>';

        try {
            const testResults = await this.currentExercise.testCases.map(testCase => {
                try {
                    const testFunction = new Function('code', testCase.test);
                    return {
                        name: testCase.name,
                        passed: testFunction(code),
                        description: testCase.description
                    };
                } catch (e) {
                    return {
                        name: testCase.name,
                        passed: false,
                        error: e.message,
                        description: testCase.description
                    };
                }
            });

            this.displayTestResults(testResults);
        } catch (e) {
            resultsDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle me-2"></i>Erreur lors de l'exécution des tests: ${e.message}
                </div>`;
        }
    }

    displayTestResults(results) {
        const resultsDiv = document.getElementById('test-results');
        const passedTests = results.filter(r => r.passed).length;
        const totalTests = results.length;

        let html = `
            <div class="alert ${passedTests === totalTests ? 'alert-success' : 'alert-warning'} mb-3">
                <h6 class="alert-heading">
                    <i class="fas ${passedTests === totalTests ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2"></i>
                    Résultats: ${passedTests}/${totalTests} tests réussis
                </h6>
            </div>
            <div class="list-group mb-3">`;

        results.forEach(result => {
            html += `
                <div class="list-group-item bg-dark text-light">
                    <div class="d-flex justify-content-between align-items-center">
                        <span>
                            <i class="fas ${result.passed ? 'fa-check text-success' : 'fa-times text-danger'} me-2"></i>
                            ${result.name}
                        </span>
                        <span class="badge ${result.passed ? 'bg-success' : 'bg-danger'}">
                            ${result.passed ? 'Réussi' : 'Échoué'}
                        </span>
                    </div>
                    <p class="mb-0 mt-2 text-muted">${result.description}</p>
                    ${result.error ? `
                        <div class="alert alert-danger mt-2 mb-0">
                            <pre class="mb-0"><code>${result.error}</code></pre>
                        </div>
                    ` : ''}
                </div>`;
        });

        html += '</div>';
        resultsDiv.innerHTML = html;

        // Mettre à jour la progression si tous les tests sont passés
        if (passedTests === totalTests) {
            this.updateProgress();
        }
    }

    updateProgress() {
        const progressBar = document.getElementById('courseProgress');
        if (progressBar) {
            const currentProgress = parseInt(progressBar.style.width) || 0;
            const newProgress = Math.max(currentProgress, 75); // 75% pour l'exercice complété
            progressBar.style.width = `${newProgress}%`;
        }
    }
}
