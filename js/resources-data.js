const resourcesData = {
    part1: {
        diagrams: [
            {
                id: 'architecture_overview',
                title: 'Vue d\'ensemble de l\'architecture anti-cheat',
                thumbnail: '../resources/diagrams/architecture_thumb.png',
                fullsize: '../resources/diagrams/architecture_full.png',
                description: 'Diagramme détaillant l\'architecture globale d\'un système anti-cheat moderne.'
            },
            {
                id: 'detection_flow',
                title: 'Flux de détection',
                thumbnail: '../resources/diagrams/detection_flow_thumb.png',
                fullsize: '../resources/diagrams/detection_flow_full.png',
                description: 'Schéma du processus de détection des cheats, de l\'analyse à la prise de décision.'
            },
            {
                id: 'memory_protection',
                title: 'Techniques de protection mémoire',
                thumbnail: '../resources/diagrams/memory_protection_thumb.png',
                fullsize: '../resources/diagrams/memory_protection_full.png',
                description: 'Vue d\'ensemble des différentes techniques de protection de la mémoire.'
            },
            {
                id: 'network_validation',
                title: 'Validation réseau',
                thumbnail: '../resources/diagrams/network_validation_thumb.png',
                fullsize: '../resources/diagrams/network_validation_full.png',
                description: 'Processus de validation des données réseau et détection des manipulations.'
            }
        ],
        examples: [
            {
                id: 'basic_detector',
                title: 'Détecteur de base',
                type: 'cpp',
                description: 'Implémentation d\'un détecteur anti-cheat basique en C++',
                downloadUrl: '../resources/examples/basic_detector.cpp',
                previewUrl: '../resources/examples/basic_detector.cpp'
            },
            {
                id: 'memory_scanner',
                title: 'Scanner de mémoire',
                type: 'cpp',
                description: 'Exemple de scanner mémoire pour la détection de modifications',
                downloadUrl: '../resources/examples/memory_scanner.cpp',
                previewUrl: '../resources/examples/memory_scanner.cpp'
            },
            {
                id: 'integrity_checker',
                title: 'Vérificateur d\'intégrité',
                type: 'cpp',
                description: 'Système de vérification de l\'intégrité des fichiers',
                downloadUrl: '../resources/examples/integrity_checker.cpp',
                previewUrl: '../resources/examples/integrity_checker.cpp'
            }
        ],
        external: [
            {
                title: 'Guide Anti-Cheat',
                type: 'documentation',
                url: 'https://docs.microsoft.com/en-us/windows/win32/memory/memory-protection',
                description: 'Documentation Microsoft sur la protection mémoire'
            },
            {
                title: 'Outils de développement',
                type: 'tool',
                url: 'https://github.com/cheat-engine/cheat-engine',
                description: 'Code source de Cheat Engine pour comprendre les techniques de cheat'
            },
            {
                title: 'Projet exemple sur GitHub',
                type: 'github',
                url: 'https://github.com/GameTechDev/PresentMon',
                description: 'Outil de monitoring des performances pour les jeux'
            },
            {
                title: 'Anti-Cheat Development Guide',
                type: 'article',
                url: 'https://www.unknowncheats.me/wiki/Anti-Cheat',
                description: 'Guide complet sur les techniques anti-cheat (point de vue défensif)'
            },
            {
                title: 'Game Security Research',
                type: 'research',
                url: 'https://www.gdcvault.com/play/102534/',
                description: 'Conférence GDC sur la sécurité des jeux'
            },
            {
                title: 'Windows Kernel Development',
                type: 'documentation',
                url: 'https://docs.microsoft.com/en-us/windows-hardware/drivers/',
                description: 'Documentation sur le développement de drivers kernel'
            }
        ],
        videos: [
            {
                title: 'Introduction à l\'Anti-Cheat',
                url: 'https://www.youtube.com/watch?v=example1',
                duration: '15:30',
                description: 'Vue d\'ensemble des concepts anti-cheat'
            },
            {
                title: 'Techniques de Protection Mémoire',
                url: 'https://www.youtube.com/watch?v=example2',
                duration: '23:45',
                description: 'Exploration des techniques de protection mémoire'
            },
            {
                title: 'Détection des Cheats',
                url: 'https://www.youtube.com/watch?v=example3',
                duration: '19:20',
                description: 'Méthodes de détection des cheats courants'
            }
        ],
        papers: [
            {
                title: 'Game Hacking Techniques',
                author: 'Security Research Team',
                url: 'https://example.com/paper1.pdf',
                year: 2024,
                description: 'Analyse approfondie des techniques de hacking de jeux'
            },
            {
                title: 'Anti-Cheat Systems Design',
                author: 'Game Security Institute',
                url: 'https://example.com/paper2.pdf',
                year: 2023,
                description: 'Architecture et design des systèmes anti-cheat modernes'
            }
        ]
    },
    part2: {
        diagrams: [
            {
                title: "Protection Mémoire",
                path: "resources/diagrams/memory_protection.svg",
                description: "Vue d'ensemble des techniques de protection mémoire"
            },
            {
                title: "Validation Réseau",
                path: "resources/diagrams/network_validation.svg",
                description: "Processus de validation réseau pour l'anti-cheat"
            },
            {
                title: "Techniques Anti-Debug",
                path: "resources/diagrams/anti_debug_techniques.svg",
                description: "Aperçu des différentes techniques anti-debug"
            },
            {
                title: "Hooks Mémoire",
                path: "resources/diagrams/memory_hooks.svg",
                description: "Fonctionnement des hooks mémoire"
            }
        ],
        code: [
            {
                title: "Protection Mémoire",
                path: "resources/examples/memory_protector.cpp",
                description: "Exemple de système de protection mémoire"
            },
            {
                title: "Anti-Debug",
                path: "resources/examples/anti_debug.cpp",
                description: "Système complet de détection et protection contre le débogage"
            }
        ],
        external: [
            {
                title: "Windows Memory Protection",
                url: "https://learn.microsoft.com/en-us/windows/win32/memory/memory-protection",
                description: "Documentation Microsoft sur la protection mémoire"
            },
            {
                title: "Anti-Debug Techniques",
                url: "https://anti-debug.checkpoint.com/",
                description: "Guide complet des techniques anti-debug"
            },
            {
                title: "Game Hacking: Developing Autonomous Bots",
                url: "https://nostarch.com/gamehacking",
                description: "Livre sur le game hacking et la protection"
            }
        ],
        videos: [
            {
                title: "Memory Protection Deep Dive",
                url: "https://www.youtube.com/watch?v=example1",
                description: "Analyse approfondie des techniques de protection mémoire"
            },
            {
                title: "Advanced Anti-Debug Techniques",
                url: "https://www.youtube.com/watch?v=example2",
                description: "Présentation des techniques anti-debug avancées"
            }
        ],
        papers: [
            {
                title: "Survey of Anti-Tamper Technologies",
                url: "https://example.com/paper1",
                description: "Étude académique des technologies anti-manipulation"
            },
            {
                title: "Memory Protection in Games",
                url: "https://example.com/paper2",
                description: "Recherche sur les techniques de protection mémoire dans les jeux"
            }
        ]
    }
}
