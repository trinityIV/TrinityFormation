document.addEventListener('DOMContentLoaded', function() {
    // Initialisation du canvas de fond
    initBackgroundCanvas();
    
    // Initialiser les boutons d'exercices
    initExerciseButtons();
    
    // Charger les données d'exercices
    loadExerciseData();
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

// Initialiser les boutons d'exercices
function initExerciseButtons() {
    // Ajouter des écouteurs d'événements pour les boutons d'exercices
    document.querySelectorAll('button[onclick^="loadExercise"]').forEach(button => {
        button.addEventListener('click', function() {
            // Extraire l'ID de l'exercice de l'attribut onclick
            const onclickAttr = this.getAttribute('onclick');
            const exerciseId = onclickAttr.match(/loadExercise\('(.+?)'\)/)[1];
            
            // Charger l'exercice
            loadExercise(exerciseId);
        });
    });
}

// Charger les données d'exercices
function loadExerciseData() {
    // Définir les exercices disponibles
    window.exercisesData = {
        'memory-scanner': {
            title: 'Memory Scanner',
            difficulty: 'Débutant',
            description: 'Dans cet exercice, vous allez créer un scanner de mémoire simple en C++ qui peut rechercher des valeurs dans la mémoire d\'un processus.',
            objectives: [
                'Comprendre les bases de la lecture de mémoire',
                'Implémenter un algorithme de recherche simple',
                'Gérer les erreurs de lecture mémoire',
                'Optimiser les performances du scan'
            ],
            estimatedTime: '45 minutes',
            starterCode: `#include <iostream>
#include <vector>
#include <Windows.h>

class MemoryScanner {
private:
    HANDLE processHandle;
    std::vector<DWORD> foundAddresses;

public:
    MemoryScanner(DWORD processId) {
        // TODO: Ouvrir le handle du processus
    }

    ~MemoryScanner() {
        // TODO: Fermer le handle du processus
    }

    bool scanForValue(int value) {
        // TODO: Implémenter la recherche de valeur en mémoire
        return false;
    }

    void printResults() {
        // TODO: Afficher les résultats
    }
};

int main() {
    // Exemple d'utilisation
    DWORD processId = 1234; // Remplacer par un vrai PID
    MemoryScanner scanner(processId);
    
    int valueToFind = 100;
    if (scanner.scanForValue(valueToFind)) {
        scanner.printResults();
    } else {
        std::cout << "Aucune adresse trouvée." << std::endl;
    }
    
    return 0;
}`,
            solution: `#include <iostream>
#include <vector>
#include <Windows.h>

class MemoryScanner {
private:
    HANDLE processHandle;
    std::vector<DWORD> foundAddresses;

public:
    MemoryScanner(DWORD processId) {
        processHandle = OpenProcess(PROCESS_VM_READ, FALSE, processId);
        if (processHandle == NULL) {
            std::cout << "Erreur lors de l'ouverture du processus. Code: " << GetLastError() << std::endl;
        }
    }

    ~MemoryScanner() {
        if (processHandle != NULL) {
            CloseHandle(processHandle);
        }
    }

    bool scanForValue(int value) {
        foundAddresses.clear();
        
        SYSTEM_INFO sysInfo;
        GetSystemInfo(&sysInfo);
        
        MEMORY_BASIC_INFORMATION memInfo;
        DWORD address = (DWORD)sysInfo.lpMinimumApplicationAddress;
        
        while (address < (DWORD)sysInfo.lpMaximumApplicationAddress) {
            if (VirtualQueryEx(processHandle, (LPVOID)address, &memInfo, sizeof(memInfo))) {
                if (memInfo.State == MEM_COMMIT && 
                    (memInfo.Type == MEM_PRIVATE || memInfo.Type == MEM_IMAGE) &&
                    (memInfo.Protect == PAGE_READWRITE || memInfo.Protect == PAGE_READONLY)) {
                    
                    DWORD buffer[4096];
                    SIZE_T bytesRead;
                    
                    for (DWORD currentAddress = (DWORD)memInfo.BaseAddress; 
                         currentAddress < (DWORD)memInfo.BaseAddress + memInfo.RegionSize; 
                         currentAddress += sizeof(buffer)) {
                        
                        if (ReadProcessMemory(processHandle, (LPVOID)currentAddress, &buffer, sizeof(buffer), &bytesRead)) {
                            for (SIZE_T i = 0; i < bytesRead / sizeof(int); i++) {
                                if (buffer[i] == (DWORD)value) {
                                    foundAddresses.push_back(currentAddress + i * sizeof(int));
                                }
                            }
                        }
                    }
                }
                
                address += memInfo.RegionSize;
            } else {
                address += 4096; // Taille de page par défaut
            }
        }
        
        return !foundAddresses.empty();
    }

    void printResults() {
        std::cout << "Adresses trouvées: " << foundAddresses.size() << std::endl;
        for (size_t i = 0; i < foundAddresses.size() && i < 10; i++) {
            std::cout << "0x" << std::hex << foundAddresses[i] << std::dec << std::endl;
        }
        
        if (foundAddresses.size() > 10) {
            std::cout << "..." << std::endl;
        }
    }
};

int main() {
    DWORD processId;
    std::cout << "Entrez le PID du processus à scanner: ";
    std::cin >> processId;
    
    MemoryScanner scanner(processId);
    
    int valueToFind;
    std::cout << "Entrez la valeur à rechercher: ";
    std::cin >> valueToFind;
    
    std::cout << "Scan en cours..." << std::endl;
    if (scanner.scanForValue(valueToFind)) {
        scanner.printResults();
    } else {
        std::cout << "Aucune adresse trouvée." << std::endl;
    }
    
    return 0;
}`
        },
        'pattern-scanner': {
            title: 'Pattern Scanner',
            difficulty: 'Intermédiaire',
            description: 'Implémentez un scanner de signatures qui peut trouver des patterns de bytes dans la mémoire d\'un processus.',
            objectives: [
                'Comprendre les signatures de bytes',
                'Implémenter l\'algorithme de Boyer-Moore',
                'Gérer les wildcards dans les signatures',
                'Optimiser les performances'
            ],
            estimatedTime: '60 minutes',
            starterCode: `#include <iostream>
#include <vector>
#include <string>
#include <Windows.h>

class PatternScanner {
private:
    HANDLE processHandle;
    std::vector<DWORD> foundAddresses;

public:
    PatternScanner(DWORD processId) {
        // TODO: Ouvrir le handle du processus
    }

    ~PatternScanner() {
        // TODO: Fermer le handle du processus
    }

    // Convertir une signature en bytes (ex: "48 8B 05 ?? ?? ?? ??")
    std::vector<std::pair<BYTE, bool>> parsePattern(const std::string& pattern) {
        // TODO: Implémenter la conversion de pattern
        return {};
    }

    bool scanForPattern(const std::string& pattern) {
        // TODO: Implémenter la recherche de pattern
        return false;
    }

    void printResults() {
        // TODO: Afficher les résultats
    }
};

int main() {
    // Exemple d'utilisation
    DWORD processId = 1234; // Remplacer par un vrai PID
    PatternScanner scanner(processId);
    
    std::string pattern = "48 8B 05 ?? ?? ?? ??"; // Exemple de pattern
    if (scanner.scanForPattern(pattern)) {
        scanner.printResults();
    } else {
        std::cout << "Aucune adresse trouvée." << std::endl;
    }
    
    return 0;
}`,
            solution: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <iomanip>
#include <Windows.h>

class PatternScanner {
private:
    HANDLE processHandle;
    std::vector<DWORD> foundAddresses;

public:
    PatternScanner(DWORD processId) {
        processHandle = OpenProcess(PROCESS_VM_READ, FALSE, processId);
        if (processHandle == NULL) {
            std::cout << "Erreur lors de l'ouverture du processus. Code: " << GetLastError() << std::endl;
        }
    }

    ~PatternScanner() {
        if (processHandle != NULL) {
            CloseHandle(processHandle);
        }
    }

    // Convertir une signature en bytes (ex: "48 8B 05 ?? ?? ?? ??")
    std::vector<std::pair<BYTE, bool>> parsePattern(const std::string& pattern) {
        std::vector<std::pair<BYTE, bool>> result;
        std::istringstream iss(pattern);
        std::string token;
        
        while (iss >> token) {
            if (token == "??") {
                // Wildcard
                result.push_back(std::make_pair(0, false));
            } else {
                // Byte valide
                BYTE byte = (BYTE)std::stoi(token, nullptr, 16);
                result.push_back(std::make_pair(byte, true));
            }
        }
        
        return result;
    }

    bool scanForPattern(const std::string& pattern) {
        foundAddresses.clear();
        
        auto parsedPattern = parsePattern(pattern);
        if (parsedPattern.empty()) {
            std::cout << "Pattern invalide." << std::endl;
            return false;
        }
        
        SYSTEM_INFO sysInfo;
        GetSystemInfo(&sysInfo);
        
        MEMORY_BASIC_INFORMATION memInfo;
        DWORD address = (DWORD)sysInfo.lpMinimumApplicationAddress;
        
        while (address < (DWORD)sysInfo.lpMaximumApplicationAddress) {
            if (VirtualQueryEx(processHandle, (LPVOID)address, &memInfo, sizeof(memInfo))) {
                if (memInfo.State == MEM_COMMIT && 
                    (memInfo.Type == MEM_PRIVATE || memInfo.Type == MEM_IMAGE) &&
                    (memInfo.Protect == PAGE_READWRITE || memInfo.Protect == PAGE_READONLY || 
                     memInfo.Protect == PAGE_EXECUTE_READ || memInfo.Protect == PAGE_EXECUTE_READWRITE)) {
                    
                    std::vector<BYTE> buffer(memInfo.RegionSize);
                    SIZE_T bytesRead;
                    
                    if (ReadProcessMemory(processHandle, memInfo.BaseAddress, buffer.data(), memInfo.RegionSize, &bytesRead)) {
                        // Recherche du pattern dans le buffer
                        for (SIZE_T i = 0; i <= bytesRead - parsedPattern.size(); i++) {
                            bool found = true;
                            
                            for (SIZE_T j = 0; j < parsedPattern.size(); j++) {
                                if (parsedPattern[j].second && buffer[i + j] != parsedPattern[j].first) {
                                    found = false;
                                    break;
                                }
                            }
                            
                            if (found) {
                                foundAddresses.push_back((DWORD)memInfo.BaseAddress + i);
                            }
                        }
                    }
                }
                
                address += memInfo.RegionSize;
            } else {
                address += 4096; // Taille de page par défaut
            }
        }
        
        return !foundAddresses.empty();
    }

    void printResults() {
        std::cout << "Adresses trouvées: " << foundAddresses.size() << std::endl;
        for (size_t i = 0; i < foundAddresses.size() && i < 10; i++) {
            std::cout << "0x" << std::hex << foundAddresses[i] << std::dec << std::endl;
        }
        
        if (foundAddresses.size() > 10) {
            std::cout << "..." << std::endl;
        }
    }
};

int main() {
    DWORD processId;
    std::cout << "Entrez le PID du processus à scanner: ";
    std::cin >> processId;
    
    PatternScanner scanner(processId);
    
    std::string pattern;
    std::cout << "Entrez le pattern à rechercher (ex: 48 8B 05 ?? ?? ?? ??): ";
    std::cin.ignore();
    std::getline(std::cin, pattern);
    
    std::cout << "Scan en cours..." << std::endl;
    if (scanner.scanForPattern(pattern)) {
        scanner.printResults();
    } else {
        std::cout << "Aucune adresse trouvée." << std::endl;
    }
    
    return 0;
}`
        },
        'social-analysis': {
            title: 'Social Media Analysis',
            difficulty: 'Débutant',
            description: 'Apprenez à analyser les profils sociaux pour extraire des informations utiles.',
            objectives: [
                'Comprendre les techniques d\'OSINT sur les réseaux sociaux',
                'Extraire des informations à partir de profils publics',
                'Analyser les métadonnées des images',
                'Établir des connexions entre différents profils'
            ],
            estimatedTime: '30 minutes',
            starterCode: `// Exercice pratique: Analyse de profil social
// Suivez les instructions ci-dessous

/*
1. Accédez au profil fictif: https://example.com/osint-training/profile1
2. Répondez aux questions suivantes:
   - Quelles informations personnelles sont visibles?
   - Quels lieux apparaissent dans les photos?
   - Quelles connexions professionnelles sont mentionnées?
3. Utilisez un outil d'extraction de métadonnées sur les images
4. Documentez vos découvertes ci-dessous
*/

// Documentez vos découvertes ici:
const findings = {
    personalInfo: [
        // TODO: Listez les informations personnelles trouvées
    ],
    locations: [
        // TODO: Listez les lieux identifiés
    ],
    connections: [
        // TODO: Listez les connexions professionnelles
    ],
    metadata: {
        // TODO: Documentez les métadonnées extraites
    },
    conclusion: ""
};`,
            solution: `// Exercice pratique: Analyse de profil social
// Solution

const findings = {
    personalInfo: [
        "Nom: John Smith",
        "Âge: 34 ans",
        "Profession: Consultant en cybersécurité",
        "Email: j.smith@example.com (visible dans la section contact)",
        "Téléphone: +1-555-123-4567 (visible sur une carte de visite postée)",
        "Éducation: Université de Boston, Master en Sécurité Informatique"
    ],
    locations: [
        "Domicile: Boston, MA (mentionné dans la bio)",
        "Bureau: Downtown Boston (géolocalisation d'une photo)",
        "Voyage récent: San Francisco (check-in à l'aéroport SFO)",
        "Conférence: Las Vegas (photo de badge de la conférence DefCon)"
    ],
    connections: [
        "Employeur actuel: CyberShield Inc.",
        "Ancien employeur: SecureTech Solutions",
        "Collègue: Sarah Johnson (taguée dans plusieurs photos)",
        "Mentor: Dr. Robert Chen (mentionné dans un post)",
        "Connexions LinkedIn: 500+ (visible sur le widget LinkedIn)"
    ],
    metadata: {
        "Photo1.jpg": {
            "Date": "2024-01-15",
            "Appareil": "iPhone 13 Pro",
            "Coordonnées GPS": "42.3601° N, 71.0589° W (Boston)",
            "Logiciel d'édition": "Adobe Lightroom"
        },
        "Photo2.jpg": {
            "Date": "2024-02-20",
            "Appareil": "Canon EOS R5",
            "Coordonnées GPS": "37.7749° N, 122.4194° W (San Francisco)",
            "Logiciel d'édition": "Aucun"
        }
    },
    conclusion: "Le sujet est un professionnel de la cybersécurité basé à Boston, avec des connexions dans l'industrie. Il voyage fréquemment pour des conférences et partage beaucoup d'informations personnelles et professionnelles. Les métadonnées des images révèlent ses déplacements récents et les appareils qu'il utilise. Ces informations pourraient être utilisées pour des attaques d'ingénierie sociale ou de phishing ciblé."
};

// Analyse des risques de sécurité
const securityRisks = [
    "Divulgation excessive d'informations personnelles",
    "Géolocalisation précise du domicile et du lieu de travail",
    "Informations sur les déplacements permettant de déterminer les absences",
    "Métadonnées non supprimées des images partagées",
    "Informations sur l'employeur pouvant faciliter des attaques ciblées"
];

// Recommandations
const recommendations = [
    "Limiter les informations personnelles visibles publiquement",
    "Désactiver la géolocalisation lors de la prise de photos",
    "Supprimer les métadonnées des images avant de les partager",
    "Éviter de publier en temps réel les déplacements",
    "Revoir les paramètres de confidentialité sur tous les réseaux sociaux"
];`
        },
        'anti-debug': {
            title: 'Anti-Debug Techniques',
            difficulty: 'Intermédiaire',
            description: 'Implémentez différentes techniques anti-debug pour protéger votre application.',
            objectives: [
                'Comprendre les techniques de détection de debugger',
                'Implémenter la détection via PEB',
                'Utiliser les API Windows pour la détection',
                'Implémenter des contre-mesures'
            ],
            estimatedTime: '45 minutes',
            starterCode: `#include <iostream>
#include <Windows.h>

class AntiDebugSystem {
private:
    // TODO: Définir les méthodes de détection

public:
    AntiDebugSystem() {
        // Initialisation
    }

    bool isBeingDebugged() {
        // TODO: Implémenter la détection de debugger
        return false;
    }

    void takeAction() {
        // TODO: Implémenter les contre-mesures
    }
};

int main() {
    AntiDebugSystem antiDebug;
    
    if (antiDebug.isBeingDebugged()) {
        std::cout << "Debugger détecté!" << std::endl;
        antiDebug.takeAction();
    } else {
        std::cout << "Aucun debugger détecté." << std::endl;
        // Code normal de l'application
    }
    
    return 0;
}`,
            solution: `#include <iostream>
#include <Windows.h>
#include <winternl.h>
#include <vector>

// Définition de la structure PEB si non disponible
#ifndef _PEB_DEFINED
typedef struct _PEB {
    BYTE Reserved1[2];
    BYTE BeingDebugged;
    BYTE Reserved2[1];
    PVOID Reserved3[2];
    PPEB_LDR_DATA Ldr;
    PVOID ProcessParameters;
    PVOID Reserved4[3];
    PVOID AtlThunkSListPtr;
    PVOID Reserved5;
    ULONG Reserved6;
    PVOID Reserved7;
    ULONG Reserved8;
    ULONG AtlThunkSListPtr32;
    PVOID Reserved9[45];
    BYTE Reserved10[96];
    PVOID PostProcessInitRoutine;
    BYTE Reserved11[128];
    PVOID Reserved12[1];
    ULONG SessionId;
} PEB, *PPEB;
#define _PEB_DEFINED
#endif

class AntiDebugSystem {
private:
    // Méthodes de détection
    bool checkPEB() {
        // Accès direct au PEB
        PPEB pPeb = (PPEB)__readgsqword(0x60);
        return pPeb->BeingDebugged;
    }
    
    bool checkIsDebuggerPresent() {
        return IsDebuggerPresent();
    }
    
    bool checkRemoteDebugger() {
        BOOL isDebuggerPresent = FALSE;
        CheckRemoteDebuggerPresent(GetCurrentProcess(), &isDebuggerPresent);
        return isDebuggerPresent;
    }
    
    bool checkDebugPort() {
        DWORD debugPort = 0;
        NTSTATUS status = NtQueryInformationProcess(
            GetCurrentProcess(),
            ProcessDebugPort,
            &debugPort,
            sizeof(debugPort),
            NULL
        );
        
        return NT_SUCCESS(status) && debugPort != 0;
    }
    
    bool checkProcessDebugFlags() {
        DWORD noDebugInherit = 0;
        NTSTATUS status = NtQueryInformationProcess(
            GetCurrentProcess(),
            ProcessDebugFlags,
            &noDebugInherit,
            sizeof(noDebugInherit),
            NULL
        );
        
        return NT_SUCCESS(status) && noDebugInherit == 0;
    }
    
    bool checkHardwareBreakpoints() {
        CONTEXT context = {};
        context.ContextFlags = CONTEXT_DEBUG_REGISTERS;
        
        if (!GetThreadContext(GetCurrentThread(), &context)) {
            return false;
        }
        
        return context.Dr0 != 0 || context.Dr1 != 0 || context.Dr2 != 0 || context.Dr3 != 0;
    }
    
    bool checkDebuggerWindow() {
        return FindWindowA("OLLYDBG", NULL) || 
               FindWindowA("WinDbgFrameClass", NULL) || 
               FindWindowA("ID", NULL) || 
               FindWindowA("IDA", NULL) || 
               FindWindowA("IDA64", NULL);
    }
    
    bool checkTimingAttack() {
        LARGE_INTEGER frequency, start, end;
        QueryPerformanceFrequency(&frequency);
        QueryPerformanceCounter(&start);
        
        // Code qui sera exécuté plus lentement sous un debugger
        OutputDebugString("Anti-Debug Check");
        
        QueryPerformanceCounter(&end);
        double elapsed = (end.QuadPart - start.QuadPart) * 1000.0 / frequency.QuadPart;
        
        return elapsed > 1.0; // Seuil arbitraire, à ajuster
    }

public:
    AntiDebugSystem() {
        // Initialisation
    }

    bool isBeingDebugged() {
        std::vector<bool> results = {
            checkPEB(),
            checkIsDebuggerPresent(),
            checkRemoteDebugger(),
            checkDebugPort(),
            checkProcessDebugFlags(),
            checkHardwareBreakpoints(),
            checkDebuggerWindow(),
            checkTimingAttack()
        };
        
        // Si au moins une méthode détecte un debugger
        for (bool result : results) {
            if (result) return true;
        }
        
        return false;
    }

    void takeAction() {
        // Actions possibles en cas de détection
        
        // 1. Terminer le processus
        // ExitProcess(0);
        
        // 2. Corruption de données
        // CorruptImportantData();
        
        // 3. Comportement erratique
        // while(true) Sleep(rand() % 1000);
        
        // 4. Fausses informations
        std::cout << "Exécution normale..." << std::endl;
        // Mais en réalité, le programme fait autre chose
        
        // 5. Pour cet exemple, on se contente d'afficher un message
        std::cout << "Action anti-debug déclenchée!" << std::endl;
    }
    
    // Fonction pour tester les différentes méthodes individuellement
    void testAllMethods() {
        std::cout << "Test des méthodes anti-debug:" << std::endl;
        std::cout << "1. PEB Check: " << (checkPEB() ? "Détecté" : "Non détecté") << std::endl;
        std::cout << "2. IsDebuggerPresent: " << (checkIsDebuggerPresent() ? "Détecté" : "Non détecté") << std::endl;
        std::cout << "3. CheckRemoteDebuggerPresent: " << (checkRemoteDebugger() ? "Détecté" : "Non détecté") << std::endl;
        std::cout << "4. Debug Port: " << (checkDebugPort() ? "Détecté" : "Non détecté") << std::endl;
        std::cout << "5. Process Debug Flags: " << (checkProcessDebugFlags() ? "Détecté" : "Non détecté") << std::endl;
        std::cout << "6. Hardware Breakpoints: " << (checkHardwareBreakpoints() ? "Détecté" : "Non détecté") << std::endl;
        std::cout << "7. Debugger Window: " << (checkDebuggerWindow() ? "Détecté" : "Non détecté") << std::endl;
        std::cout << "8. Timing Attack: " << (checkTimingAttack() ? "Détecté" : "Non détecté") << std::endl;
    }
};

int main() {
    AntiDebugSystem antiDebug;
    
    // Pour tester toutes les méthodes individuellement
    // antiDebug.testAllMethods();
    
    if (antiDebug.isBeingDebugged()) {
        std::cout << "Debugger détecté!" << std::endl;
        antiDebug.takeAction();
    } else {
        std::cout << "Aucun debugger détecté." << std::endl;
        // Code normal de l'application
        std::cout << "Exécution normale de l'application..." << std::endl;
    }
    
    return 0;
}`
        }
    };
}

// Charger un exercice spécifique
function loadExercise(exerciseId) {
    // Vérifier si l'exercice existe
    if (!window.exercisesData || !window.exercisesData[exerciseId]) {
        showNotification('Exercice non trouvé', 'danger');
        return;
    }
    
    const exercise = window.exercisesData[exerciseId];
    
    // Créer le contenu de l'exercice
    const exerciseHTML = `
        <div class="exercise-content active" id="exercise-${exerciseId}">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>${exercise.title}</h2>
                <span class="badge bg-${getDifficultyColor(exercise.difficulty)}">${exercise.difficulty}</span>
            </div>
            
            <p class="lead">${exercise.description}</p>
            
            <div class="card bg-dark border-secondary mb-4">
                <div class="card-header bg-secondary bg-opacity-25">
                    <h3 class="h5 mb-0">Objectifs</h3>
                </div>
                <div class="card-body">
                    <ul class="mb-0">
                        ${exercise.objectives.map(obj => `<li>${obj}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3>Code de départ</h3>
                <span class="text-muted">Temps estimé: ${exercise.estimatedTime}</span>
            </div>
            
            <div class="code-editor mb-4">
                <pre><code>${exercise.starterCode}</code></pre>
            </div>
            
            <div class="d-flex justify-content-between mb-5">
                <button class="btn btn-secondary" onclick="resetExercise('${exerciseId}')">
                    <i class="fas fa-undo"></i> Réinitialiser
                </button>
                <button class="btn btn-success" onclick="showSolution('${exerciseId}')">
                    <i class="fas fa-lightbulb"></i> Voir la solution
                </button>
            </div>
            
            <div class="solution-container" id="solution-${exerciseId}" style="display: none;">
                <h3>Solution</h3>
                <div class="code-editor">
                    <pre><code>${exercise.solution}</code></pre>
                </div>
            </div>
        </div>
    `;
    
    // Trouver le conteneur principal
    const mainContainer = document.querySelector('main');
    if (!mainContainer) return;
    
    // Créer un élément pour le contenu de l'exercice
    const exerciseContainer = document.createElement('div');
    exerciseContainer.className = 'exercise-container';
    exerciseContainer.innerHTML = exerciseHTML;
    
    // Remplacer le contenu principal
    mainContainer.innerHTML = '';
    mainContainer.appendChild(exerciseContainer);
    
    // Ajouter un bouton de retour
    const backButton = document.createElement('button');
    backButton.className = 'btn btn-primary mt-4';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Retour aux exercices';
    backButton.addEventListener('click', function() {
        location.reload();
    });
    
    mainContainer.appendChild(backButton);
    
    // Scroll vers le haut
    window.scrollTo(0, 0);
}

// Réinitialiser un exercice
function resetExercise(exerciseId) {
    // Recharger l'exercice
    loadExercise(exerciseId);
    
    // Afficher une notification
    showNotification('Exercice réinitialisé', 'info');
}

// Afficher la solution d'un exercice
function showSolution(exerciseId) {
    // Trouver le conteneur de solution
    const solutionContainer = document.getElementById(`solution-${exerciseId}`);
    if (!solutionContainer) return;
    
    // Afficher la solution
    solutionContainer.style.display = 'block';
    
    // Scroll vers la solution
    solutionContainer.scrollIntoView({ behavior: 'smooth' });
    
    // Afficher une notification
    showNotification('Solution affichée', 'info');
}

// Obtenir la couleur en fonction de la difficulté
function getDifficultyColor(difficulty) {
    switch (difficulty) {
        case 'Débutant':
            return 'success';
        case 'Intermédiaire':
            return 'warning';
        case 'Expert':
            return 'danger';
        default:
            return 'primary';
    }
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
window.loadExercise = loadExercise;
window.resetExercise = resetExercise;
window.showSolution = showSolution;
window.showNotification = showNotification;
