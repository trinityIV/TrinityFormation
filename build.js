const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');
const svgo = require('svgo');

// Configuration
const config = {
    css: {
        src: 'css',
        dest: 'dist/css',
        files: ['style.css', 'prism.css']
    },
    js: {
        src: 'js',
        dest: 'dist/js',
        files: ['course.js', 'quiz-data.js', 'practice-data.js', 'resources-data.js']
    },
    svg: {
        src: 'courses/game-hacking/resources/diagrams',
        dest: 'dist/diagrams'
    }
};

// Créer les dossiers de destination
function createDirs() {
    const dirs = [
        config.css.dest,
        config.js.dest,
        config.svg.dest
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
}

// Minifier CSS
async function minifyCSS() {
    const cleanCSS = new CleanCSS({
        compatibility: '*',
        level: 2
    });

    config.css.files.forEach(file => {
        const source = fs.readFileSync(path.join(config.css.src, file), 'utf8');
        const minified = cleanCSS.minify(source);
        
        fs.writeFileSync(
            path.join(config.css.dest, file.replace('.css', '.min.css')),
            minified.styles
        );
        
        console.log(`CSS minifié : ${file}`);
    });
}

// Minifier JavaScript
async function minifyJS() {
    for (const file of config.js.files) {
        const source = fs.readFileSync(path.join(config.js.src, file), 'utf8');
        const minified = await minify(source, {
            compress: true,
            mangle: true
        });

        fs.writeFileSync(
            path.join(config.js.dest, file.replace('.js', '.min.js')),
            minified.code
        );

        console.log(`JS minifié : ${file}`);
    }
}

// Optimiser SVG
async function optimizeSVG() {
    const files = fs.readdirSync(config.svg.src).filter(file => file.endsWith('.svg'));

    files.forEach(file => {
        const source = fs.readFileSync(path.join(config.svg.src, file), 'utf8');
        const result = svgo.optimize(source, {
            multipass: true,
            plugins: [
                'removeDoctype',
                'removeXMLProcInst',
                'removeComments',
                'removeMetadata',
                'removeEditorsNSData',
                'cleanupAttrs',
                'mergeStyles',
                'inlineStyles',
                'minifyStyles'
            ]
        });

        fs.writeFileSync(
            path.join(config.svg.dest, file),
            result.data
        );

        console.log(`SVG optimisé : ${file}`);
    });
}

// Ajouter les métadonnées SEO
function addSEOMetadata() {
    const htmlFiles = [
        'courses/game-hacking/anticheat-dev-part1.html',
        'courses/game-hacking/anticheat-dev-part2.html'
    ];

    htmlFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        
        // Ajouter les métadonnées si elles n'existent pas déjà
        if (!content.includes('name="description"')) {
            const metaTags = `
    <meta name="description" content="Cours interactif sur le développement anti-cheat et la sécurité des jeux">
    <meta name="keywords" content="anti-cheat, sécurité, jeux vidéo, développement, protection mémoire">
    <meta name="author" content="Trinity Learning Platform">
    <meta property="og:title" content="Trinity - Cours Anti-Cheat">
    <meta property="og:description" content="Apprenez les techniques avancées de protection anti-cheat">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
`;
            content = content.replace('</head>', metaTags + '</head>');
            fs.writeFileSync(file, content);
            console.log(`SEO ajouté : ${file}`);
        }
    });
}

// Exécution principale
async function build() {
    try {
        console.log('Début de la construction...');
        createDirs();
        await minifyCSS();
        await minifyJS();
        await optimizeSVG();
        addSEOMetadata();
        console.log('Construction terminée avec succès !');
    } catch (error) {
        console.error('Erreur lors de la construction :', error);
        process.exit(1);
    }
}

build();
