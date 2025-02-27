// Données des quiz pour chaque partie du cours
const quizData = {
    part1: {
        id: 'anticheat_part1',
        title: 'Fondamentaux Anti-Cheat',
        questions: [
            {
                question: 'Quel type de cheat modifie directement la mémoire du jeu ?',
                answers: [
                    'Aimbot',
                    'Memory Hack',
                    'Packet Manipulation',
                    'Macro'
                ],
                correctAnswer: 1,
                explanation: 'Les Memory Hacks modifient directement les valeurs en mémoire du jeu pour obtenir des avantages.'
            },
            {
                question: 'Quelle est la première ligne de défense dans une architecture anti-cheat ?',
                answers: [
                    'Détection de signature',
                    'Validation côté serveur',
                    'Chiffrement des données',
                    'Analyse comportementale'
                ],
                correctAnswer: 1,
                explanation: 'La validation côté serveur est la première ligne de défense car elle ne fait pas confiance aux données du client.'
            },
            {
                question: 'Quelle méthode de détection est la plus efficace contre les aimbots ?',
                answers: [
                    'Validation des paquets réseau',
                    'Analyse de la mémoire',
                    'Analyse statistique du comportement',
                    'Vérification des fichiers'
                ],
                correctAnswer: 2,
                explanation: 'L\'analyse statistique du comportement peut détecter des mouvements de visée non naturels caractéristiques des aimbots.'
            },
            {
                question: 'Quelle technique est utilisée pour protéger les données sensibles en mémoire ?',
                answers: [
                    'Obfuscation',
                    'Chiffrement XOR',
                    'Compression',
                    'Base64 encoding'
                ],
                correctAnswer: 1,
                explanation: 'Le chiffrement XOR est une technique simple mais efficace pour protéger les données en mémoire contre la lecture directe.'
            },
            {
                question: 'Quel est l\'avantage principal d\'un anti-cheat basé sur le kernel ?',
                answers: [
                    'Meilleure performance',
                    'Plus facile à mettre à jour',
                    'Accès privilégié au système',
                    'Compatible avec tous les OS'
                ],
                correctAnswer: 2,
                explanation: 'Un anti-cheat kernel a un accès privilégié au système, lui permettant de détecter et bloquer les cheats au niveau le plus bas.'
            },
            {
                question: 'Comment peut-on détecter une injection de DLL malveillante ?',
                answers: [
                    'En vérifiant la taille du processus',
                    'En scannant la table des imports',
                    'En analysant le trafic réseau',
                    'En vérifiant la signature du code'
                ],
                correctAnswer: 1,
                explanation: 'La table des imports peut révéler des DLLs injectées qui ne font pas partie du jeu original.'
            },
            {
                question: 'Quelle approche est la plus efficace pour prévenir le speedhacking ?',
                answers: [
                    'Validation du temps côté client',
                    'Validation du temps côté serveur',
                    'Vérification des fichiers',
                    'Analyse de la mémoire'
                ],
                correctAnswer: 1,
                explanation: 'La validation du temps côté serveur est la seule méthode fiable car le client peut être manipulé.'
            },
            {
                question: 'Quel type de données doit être particulièrement protégé contre la manipulation ?',
                answers: [
                    'Textures du jeu',
                    'Fichiers audio',
                    'Variables de santé/munitions',
                    'Fichiers de configuration'
                ],
                correctAnswer: 2,
                explanation: 'Les variables critiques comme la santé et les munitions sont des cibles privilégiées pour les cheats.'
            }
        ]
    },
    part2: {
        id: 'anticheat_part2',
        title: 'Protection Mémoire',
        questions: [
            {
                question: 'Quelle API Windows permet de modifier les protections mémoire d\'une page ?',
                answers: [
                    'ProtectMemory',
                    'VirtualProtect',
                    'SetMemoryProtection',
                    'ChangePageAccess'
                ],
                correctAnswer: 1,
                explanation: 'VirtualProtect est l\'API Windows standard pour modifier les protections de pages mémoire.'
            },
            {
                question: 'Quel flag de protection mémoire est utilisé pour détecter les accès mémoire ?',
                answers: [
                    'PAGE_READONLY',
                    'PAGE_EXECUTE',
                    'PAGE_GUARD',
                    'PAGE_NOACCESS'
                ],
                correctAnswer: 2,
                explanation: 'PAGE_GUARD déclenche une exception lors du premier accès à la page, permettant la détection.'
            },
            {
                question: 'Quelle technique anti-debug utilise le registre fs:[30] ?',
                answers: [
                    'Hardware breakpoints',
                    'PEB BeingDebugged',
                    'Process checking',
                    'API hooking'
                ],
                correctAnswer: 1,
                explanation: 'Le PEB (Process Environment Block) est accessible via fs:[30] et contient le flag BeingDebugged.'
            },
            {
                question: 'Quelle est la meilleure approche pour protéger des données critiques en mémoire ?',
                answers: [
                    'Simple XOR',
                    'Chiffrement AES',
                    'Protection multicouche',
                    'Obfuscation'
                ],
                correctAnswer: 2,
                explanation: 'Une protection multicouche combinant chiffrement, checksums et monitoring est plus efficace.'
            },
            {
                question: 'Comment détecter un debugger attaché dynamiquement ?',
                answers: [
                    'IsDebuggerPresent',
                    'CheckRemoteDebuggerPresent',
                    'Vérification périodique',
                    'Toutes ces réponses'
                ],
                correctAnswer: 3,
                explanation: 'Une combinaison de toutes ces méthodes offre la meilleure détection des debuggers.'
            },
            {
                question: 'Quelle technique permet de détecter les breakpoints hardware ?',
                answers: [
                    'Vérification du PEB',
                    'Lecture des DR0-DR7',
                    'API Windows',
                    'Scan mémoire'
                ],
                correctAnswer: 1,
                explanation: 'Les registres DR0-DR7 contiennent les breakpoints hardware et peuvent être vérifiés.'
            },
            {
                question: 'Quel est l\'avantage principal des hooks mémoire ?',
                answers: [
                    'Performance',
                    'Facilité d\'implémentation',
                    'Détection en temps réel',
                    'Compatibilité'
                ],
                correctAnswer: 2,
                explanation: 'Les hooks permettent une détection immédiate des accès mémoire suspects.'
            },
            {
                question: 'Comment protéger un hook contre la détection ?',
                answers: [
                    'Obfuscation du code',
                    'Changement dynamique',
                    'Protection kernel',
                    'Toutes ces réponses'
                ],
                correctAnswer: 3,
                explanation: 'Une combinaison de ces techniques rend les hooks plus difficiles à détecter et à contourner.'
            },
            {
                question: 'Quelle technique protège contre la modification de la mémoire en temps réel ?',
                answers: [
                    'Code signing',
                    'Memory checksum',
                    'File verification',
                    'Network encryption'
                ],
                correctAnswer: 1,
                explanation: 'Les checksums mémoire permettent de détecter les modifications en temps réel des zones critiques.'
            },
            {
                question: 'Quel outil est souvent utilisé pour modifier la mémoire des jeux ?',
                answers: [
                    'Wireshark',
                    'Process Monitor',
                    'Cheat Engine',
                    'IDA Pro'
                ],
                correctAnswer: 2,
                explanation: 'Cheat Engine est l\'outil le plus couramment utilisé pour scanner et modifier la mémoire des jeux.'
            }
        ]
    },
    part3: {
        id: 'anticheat_part3',
        title: 'Sécurité Réseau',
        questions: [
            {
                question: 'Quelle technique empêche la réutilisation des paquets réseau ?',
                answers: [
                    'Encryption symétrique',
                    'Timestamps',
                    'Nonce',
                    'Checksum'
                ],
                correctAnswer: 2,
                explanation: 'Les nonces sont des nombres utilisés une seule fois qui empêchent la réutilisation des paquets.'
            }
        ]
    },
    part4: {
        id: 'anticheat_part4',
        title: 'Protection du Code',
        questions: [
            {
                question: 'Quelle technique rend le code plus difficile à comprendre ?',
                answers: [
                    'Obfuscation',
                    'Encryption',
                    'Compression',
                    'Minification'
                ],
                correctAnswer: 0,
                explanation: 'L\'obfuscation transforme le code en une version équivalente mais plus difficile à comprendre.'
            }
        ]
    },
    part5: {
        id: 'anticheat_part5',
        title: 'Projet Final',
        questions: [
            {
                question: 'Quelle est la meilleure approche pour un système anti-cheat efficace ?',
                answers: [
                    'Uniquement la détection côté client',
                    'Uniquement la validation serveur',
                    'Une approche en couches combinant plusieurs méthodes',
                    'Se concentrer sur un seul type de cheat'
                ],
                correctAnswer: 2,
                explanation: 'Une approche en couches combinant plusieurs méthodes de protection offre la meilleure défense.'
            }
        ]
    }
};
