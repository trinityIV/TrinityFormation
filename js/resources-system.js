class ResourcesSystem {
    constructor() {
        this.currentResources = null;
    }

    loadResources(resourcesData) {
        this.currentResources = resourcesData;
        this.renderResources();
    }

    renderResources() {
        const container = document.getElementById('resources-container');
        if (!container || !this.currentResources) return;

        let html = `
            <div class="row">
                <!-- Schémas et Diagrammes -->
                <div class="col-md-6 mb-4">
                    <div class="card bg-dark border-info h-100">
                        <div class="card-header bg-dark border-info">
                            <h4 class="text-info mb-0">
                                <i class="fas fa-project-diagram me-2"></i>Schémas et Diagrammes
                            </h4>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                ${this.currentResources.diagrams.map(diagram => `
                                    <div class="col-md-6 mb-3">
                                        <div class="diagram-card">
                                            <img src="${diagram.thumbnail}" 
                                                 class="img-fluid rounded mb-2" 
                                                 alt="${diagram.title}"
                                                 data-bs-toggle="modal" 
                                                 data-bs-target="#diagramModal${diagram.id}">
                                            <h6 class="text-info">${diagram.title}</h6>
                                        </div>
                                    </div>
                                    
                                    <!-- Modal pour le diagramme -->
                                    <div class="modal fade" id="diagramModal${diagram.id}" tabindex="-1">
                                        <div class="modal-dialog modal-lg">
                                            <div class="modal-content bg-dark">
                                                <div class="modal-header border-info">
                                                    <h5 class="modal-title text-info">${diagram.title}</h5>
                                                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                                </div>
                                                <div class="modal-body">
                                                    <img src="${diagram.fullsize}" class="img-fluid" alt="${diagram.title}">
                                                    <p class="mt-3 text-light">${diagram.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Fichiers d'exemple -->
                <div class="col-md-6 mb-4">
                    <div class="card bg-dark border-success h-100">
                        <div class="card-header bg-dark border-success">
                            <h4 class="text-success mb-0">
                                <i class="fas fa-file-code me-2"></i>Fichiers d'exemple
                            </h4>
                        </div>
                        <div class="card-body">
                            <div class="list-group list-group-flush bg-dark">
                                ${this.currentResources.examples.map(example => `
                                    <div class="list-group-item bg-dark border-success">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <h6 class="text-success mb-0">
                                                <i class="fas ${this.getFileIcon(example.type)} me-2"></i>${example.title}
                                            </h6>
                                            <span class="badge bg-success">${example.type}</span>
                                        </div>
                                        <p class="text-light small mb-2">${example.description}</p>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <a href="${example.downloadUrl}" class="btn btn-sm btn-outline-success">
                                                <i class="fas fa-download me-2"></i>Télécharger
                                            </a>
                                            <button class="btn btn-sm btn-outline-info" 
                                                    onclick="resourcesSystem.previewCode('${example.id}')">
                                                <i class="fas fa-eye me-2"></i>Aperçu
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Liens externes -->
                <div class="col-12 mb-4">
                    <div class="card bg-dark border-warning">
                        <div class="card-header bg-dark border-warning">
                            <h4 class="text-warning mb-0">
                                <i class="fas fa-external-link-alt me-2"></i>Ressources externes
                            </h4>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                ${this.currentResources.external.map(resource => `
                                    <div class="col-md-4 mb-3">
                                        <a href="${resource.url}" target="_blank" 
                                           class="text-decoration-none">
                                            <div class="card bg-dark border-warning h-100">
                                                <div class="card-body">
                                                    <h5 class="text-warning">
                                                        <i class="fas ${this.getResourceIcon(resource.type)} me-2"></i>
                                                        ${resource.title}
                                                    </h5>
                                                    <p class="text-light mb-0">${resource.description}</p>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        container.innerHTML = html;
    }

    getFileIcon(type) {
        const icons = {
            'cpp': 'fa-file-code',
            'python': 'fa-python',
            'javascript': 'fa-js',
            'pdf': 'fa-file-pdf',
            'zip': 'fa-file-archive'
        };
        return icons[type] || 'fa-file';
    }

    getResourceIcon(type) {
        const icons = {
            'documentation': 'fa-book',
            'tutorial': 'fa-graduation-cap',
            'tool': 'fa-tools',
            'github': 'fa-github',
            'video': 'fa-video'
        };
        return icons[type] || 'fa-link';
    }

    async previewCode(exampleId) {
        const example = this.currentResources.examples.find(e => e.id === exampleId);
        if (!example) return;

        // Créer ou récupérer la modal
        let modal = document.getElementById(`codeModal${exampleId}`);
        if (!modal) {
            modal = document.createElement('div');
            modal.id = `codeModal${exampleId}`;
            modal.className = 'modal fade';
            modal.innerHTML = `
                <div class="modal-dialog modal-lg">
                    <div class="modal-content bg-dark">
                        <div class="modal-header border-info">
                            <h5 class="modal-title text-info">${example.title}</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="codePreview${exampleId}" style="height: 500px;"></div>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(modal);
        }

        // Afficher la modal
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();

        // Initialiser CodeMirror après l'affichage de la modal
        try {
            const response = await fetch(example.previewUrl);
            const code = await response.text();
            
            if (!this[`editor${exampleId}`]) {
                this[`editor${exampleId}`] = CodeMirror(
                    document.getElementById(`codePreview${exampleId}`),
                    {
                        value: code,
                        mode: this.getCodeMirrorMode(example.type),
                        theme: 'dracula',
                        lineNumbers: true,
                        readOnly: true,
                        viewportMargin: Infinity
                    }
                );
            } else {
                this[`editor${exampleId}`].setValue(code);
            }
        } catch (error) {
            console.error('Erreur lors du chargement du code:', error);
        }
    }

    getCodeMirrorMode(type) {
        const modes = {
            'cpp': 'text/x-c++src',
            'python': 'python',
            'javascript': 'javascript'
        };
        return modes[type] || 'text/plain';
    }
}
