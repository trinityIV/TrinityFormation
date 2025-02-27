# Trinity - Plateforme de Formation en Cybersécurité

Trinity est une plateforme éducative complète dédiée à la cybersécurité, au hacking de jeux, à l'OSINT et à la programmation. Ce projet est conçu pour être hébergé sur Cloudflare Pages.

## Structure du Projet

Le projet est organisé comme suit :

- `index.html` - Page d'accueil
- `404.html` - Page d'erreur personnalisée
- `cloudflare-pages.toml` - Configuration pour Cloudflare Pages
- `css/` - Fichiers CSS
- `js/` - Fichiers JavaScript
- `courses/` - Contenu des cours par catégorie
- `exercises/` - Exercices pratiques
- `forum/` - Forum de discussion
- `resources/` - Ressources et téléchargements
- `community/` - Pages de la communauté

## Fonctionnalités

- **Cours Dynamiques** : Chargement dynamique des cours par catégorie
- **Navigation Complète** : Système de navigation responsive
- **Forum Interactif** : Forum de discussion avec fonctionnalités de recherche
- **Exercices Pratiques** : Exercices interactifs avec solutions
- **Animation Matrix** : Effet visuel de fond inspiré de Matrix
- **Design Responsive** : Compatible avec tous les appareils

## Déploiement sur Cloudflare Pages

### Prérequis

- Un compte Cloudflare
- Git installé sur votre machine

### Étapes de déploiement

1. **Créer un dépôt Git**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Connecter à GitHub/GitLab**

   Poussez votre dépôt vers GitHub ou GitLab :

   ```bash
   git remote add origin <URL_DE_VOTRE_DÉPÔT>
   git push -u origin main
   ```

3. **Configurer Cloudflare Pages**

   - Connectez-vous à votre [tableau de bord Cloudflare](https://dash.cloudflare.com/)
   - Allez dans "Pages" et cliquez sur "Create a project"
   - Sélectionnez votre dépôt GitHub/GitLab
   - Configurez votre projet :
     - **Nom du projet** : Trinity
     - **Branche de production** : main
     - **Framework preset** : None
     - **Build command** : Laissez vide (site statique)
     - **Build output directory** : / (racine)
   - Cliquez sur "Save and Deploy"

4. **Configuration personnalisée**

   Le fichier `cloudflare-pages.toml` contient déjà les configurations nécessaires pour :
   - Les redirections (français/anglais)
   - Les en-têtes de sécurité
   - L'optimisation des ressources
   - La page d'erreur 404 personnalisée

5. **Domaine personnalisé (optionnel)**

   - Dans le tableau de bord de votre projet Cloudflare Pages
   - Allez dans "Custom domains"
   - Cliquez sur "Set up a custom domain"
   - Suivez les instructions pour configurer votre domaine

## Développement local

Pour tester le site localement, vous pouvez utiliser n'importe quel serveur web statique. Par exemple :

```bash
# Avec Python
python -m http.server

# Avec Node.js
npx serve
```

## Maintenance

### Mise à jour du contenu

1. Modifiez les fichiers HTML, CSS ou JavaScript selon vos besoins
2. Testez localement
3. Committez et poussez vos changements :

   ```bash
   git add .
   git commit -m "Description des changements"
   git push
   ```

4. Cloudflare Pages déploiera automatiquement les changements

### Ajout de nouveaux cours

Pour ajouter de nouveaux cours, modifiez les fichiers de données dans `js/courses-loader.js` en ajoutant de nouvelles entrées aux fonctions correspondantes.

## Sécurité

Le site est configuré avec des en-têtes de sécurité appropriés dans le fichier `cloudflare-pages.toml`. Ces en-têtes incluent :

- Content Security Policy (CSP)
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

## Licence

Voir le fichier [LICENSE.md](LICENSE.md) pour plus d'informations.
