// Données des exercices pratiques pour chaque partie du cours
const practiceData = {
    part1: [
        {
            id: 'basic_detector',
            title: "Implémentation d'une détection de base",
            estimatedTime: "45 minutes",
            description: "Dans cet exercice, vous allez implémenter une classe de détection basique pour un anti-cheat. Cette classe devra détecter des modifications suspectes de la mémoire du jeu.",
            objectives: [
                "Créer une classe BasicDetector",
                "Implémenter la détection de modification mémoire",
                "Ajouter des callbacks pour les événements de détection",
                "Gérer les faux positifs"
            ],
            starterCode: `class BasicDetector {
    constructor() {
        // TODO: Initialiser les propriétés nécessaires
    }

    // TODO: Implémenter checkMemoryModification()

    // TODO: Implémenter handleDetection()
}`,
            hints: [
                "Pensez à utiliser un système de checksums pour détecter les modifications",
                "Les callbacks peuvent être stockés dans un tableau et appelés lors d'une détection",
                "N'oubliez pas de vérifier la validité des modifications avant de déclencher une alerte"
            ],
            testCases: [
                {
                    name: "Initialisation",
                    description: "Vérifie que le détecteur est correctement initialisé",
                    test: `
                        return function(code) {
                            eval(code);
                            const detector = new BasicDetector();
                            return detector instanceof BasicDetector;
                        }
                    `
                },
                {
                    name: "Détection de modification",
                    description: "Vérifie que la méthode de détection fonctionne",
                    test: `
                        return function(code) {
                            eval(code);
                            const detector = new BasicDetector();
                            return typeof detector.checkMemoryModification === 'function';
                        }
                    `
                }
            ]
        },
        {
            id: 'memory_scanner',
            title: "Création d'un scanner de mémoire",
            estimatedTime: "60 minutes",
            description: "Développez un scanner de mémoire capable de détecter des patterns suspects dans la mémoire du processus.",
            objectives: [
                "Implémenter la lecture de mémoire du processus",
                "Créer un système de détection de patterns",
                "Gérer les faux positifs",
                "Optimiser les performances du scan"
            ],
            starterCode: `class MemoryScanner {
    constructor(processId) {
        this.processId = processId;
        // TODO: Initialiser le scanner
    }

    // TODO: Implémenter scanMemoryRegion()

    // TODO: Implémenter findPattern()

    // TODO: Implémenter reportDetection()
}`,
            hints: [
                "Utilisez les APIs système pour la lecture de mémoire",
                "Implémentez un algorithme de recherche de pattern efficace",
                "Pensez à la gestion des erreurs de lecture mémoire"
            ],
            testCases: [
                {
                    name: "Initialisation Scanner",
                    description: "Vérifie l'initialisation avec un PID",
                    test: `
                        return function(code) {
                            eval(code);
                            const scanner = new MemoryScanner(1234);
                            return scanner.processId === 1234;
                        }
                    `
                },
                {
                    name: "Détection Pattern",
                    description: "Vérifie la détection de pattern",
                    test: `
                        return function(code) {
                            eval(code);
                            const scanner = new MemoryScanner(1234);
                            return typeof scanner.findPattern === 'function';
                        }
                    `
                }
            ]
        },
        {
            id: 'integrity_checker',
            title: "Vérificateur d'intégrité de fichiers",
            estimatedTime: "30 minutes",
            description: "Créez un système de vérification d'intégrité des fichiers du jeu.",
            objectives: [
                "Implémenter le calcul de hash des fichiers",
                "Créer une base de données de références",
                "Détecter les modifications de fichiers",
                "Générer des rapports d'intégrité"
            ],
            starterCode: `class IntegrityChecker {
    constructor() {
        this.fileHashes = new Map();
    }

    // TODO: Implémenter calculateFileHash()

    // TODO: Implémenter verifyFileIntegrity()

    // TODO: Implémenter generateReport()
}`,
            hints: [
                "Utilisez des algorithmes de hash cryptographiques",
                "Stockez les hashes de référence de manière sécurisée",
                "Pensez à la performance pour les gros fichiers"
            ],
            testCases: [
                {
                    name: "Calcul Hash",
                    description: "Vérifie le calcul de hash",
                    test: `
                        return function(code) {
                            eval(code);
                            const checker = new IntegrityChecker();
                            return typeof checker.calculateFileHash === 'function';
                        }
                    `
                },
                {
                    name: "Vérification Intégrité",
                    description: "Vérifie la détection de modification",
                    test: `
                        return function(code) {
                            eval(code);
                            const checker = new IntegrityChecker();
                            return typeof checker.verifyFileIntegrity === 'function';
                        }
                    `
                }
            ]
        }
    ],
    part2: [
        {
            id: 'memory_protector',
            title: "Implémentation d'un protecteur mémoire",
            estimatedTime: "60 minutes",
            description: "Développez un système de protection mémoire utilisant les APIs Windows et les techniques de chiffrement.",
            objectives: [
                "Implémenter la protection de pages mémoire",
                "Ajouter le chiffrement XOR",
                "Gérer les exceptions PAGE_GUARD",
                "Implémenter la vérification d'intégrité"
            ],
            starterCode: `class MemoryProtector {
    private:
        // TODO: Définir les structures de données nécessaires

    public:
        // TODO: Implémenter protectRegion()

        // TODO: Implémenter unprotectRegion()

        // TODO: Implémenter verifyIntegrity()
}`,
            hints: [
                "Utilisez VirtualProtect pour gérer les protections de page",
                "Implémentez un système de callback pour les violations de page",
                "N'oubliez pas de gérer les alignements mémoire"
            ],
            testCases: [
                {
                    name: "Protection Mémoire",
                    description: "Vérifie l'application des protections",
                    test: `
                        return function(code) {
                            eval(code);
                            const protector = new MemoryProtector();
                            return typeof protector.protectRegion === 'function';
                        }
                    `
                },
                {
                    name: "Vérification Intégrité",
                    description: "Vérifie la détection de modification",
                    test: `
                        return function(code) {
                            eval(code);
                            const protector = new MemoryProtector();
                            return typeof protector.verifyIntegrity === 'function';
                        }
                    `
                }
            ]
        },
        {
            id: 'anti_debug',
            title: "Système Anti-Debug",
            estimatedTime: "45 minutes",
            description: "Créez un système anti-debug complet avec plusieurs méthodes de détection.",
            objectives: [
                "Implémenter la détection via PEB",
                "Ajouter la détection de processus",
                "Gérer les breakpoints hardware",
                "Implémenter des contre-mesures"
            ],
            starterCode: `class AntiDebugSystem {
    private:
        // TODO: Définir les méthodes de détection

    public:
        // TODO: Implémenter detectDebugger()

        // TODO: Implémenter takeAction()
}`,
            hints: [
                "Utilisez une combinaison de méthodes de détection",
                "Pensez à l'obfuscation de votre code",
                "Implémentez des réponses graduées"
            ],
            testCases: [
                {
                    name: "Détection Basique",
                    description: "Vérifie les méthodes de détection",
                    test: `
                        return function(code) {
                            eval(code);
                            const antiDebug = new AntiDebugSystem();
                            return typeof antiDebug.detectDebugger === 'function';
                        }
                    `
                },
                {
                    name: "Actions Défensives",
                    description: "Vérifie les contre-mesures",
                    test: `
                        return function(code) {
                            eval(code);
                            const antiDebug = new AntiDebugSystem();
                            return typeof antiDebug.takeAction === 'function';
                        }
                    `
                }
            ]
        },
        {
            id: 'hook_manager',
            title: "Gestionnaire de Hooks",
            estimatedTime: "75 minutes",
            description: "Développez un système de gestion de hooks mémoire pour la détection de modifications.",
            objectives: [
                "Implémenter l'installation de hooks",
                "Gérer les trampolines",
                "Protéger les hooks",
                "Implémenter la détection de modifications"
            ],
            starterCode: `class HookManager {
    private:
        // TODO: Définir les structures pour les hooks

    public:
        // TODO: Implémenter installHook()

        // TODO: Implémenter removeHook()

        // TODO: Implémenter handleHook()
}`,
            hints: [
                "Utilisez les techniques d'injection de code",
                "Pensez à sauvegarder le code original",
                "Gérez correctement la mémoire"
            ],
            testCases: [
                {
                    name: "Installation Hook",
                    description: "Vérifie l'installation des hooks",
                    test: `
                        return function(code) {
                            eval(code);
                            const manager = new HookManager();
                            return typeof manager.installHook === 'function';
                        }
                    `
                },
                {
                    name: "Gestion Hook",
                    description: "Vérifie la gestion des hooks",
                    test: `
                        return function(code) {
                            eval(code);
                            const manager = new HookManager();
                            return typeof manager.handleHook === 'function';
                        }
                    `
                }
            ]
        }
    ]
}
