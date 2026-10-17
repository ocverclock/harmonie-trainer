# Harmonie Trainer — prototype jouable

Application web autonome pour apprendre à construire des accords et visualiser la conduite des voix sur iPhone/iPad.

## Accès
GitHub Pages, après activation dans **Settings → Pages → Deploy from a branch → main → / (root)** :
https://ocverclock.github.io/harmonie-trainer/

## Fonctionnalités
- 28 accords de référence sur trois niveaux : triades, accords de septième, accords avancés.
- Sessions de dix questions, validation par classes de notes, retour pédagogique et score sur 100.
- Sauvegarde des scores dans le navigateur ; aucun compte.
- Vue conduite des voix Dm7 → G7 → Cmaj7, quatre trajectoires sur trois accords (une seule étape visible en largeur compacte).
- Clavier tactile, audio à la demande après interaction.
- Code sans dépendances dans `index.html`.

## Limites et état
Ceci est une version de démonstration initiale poussée dans le dépôt pour débloquer GitHub Pages. Elle n'est pas encore homologuée pour iOS ni comme PWA hors connexion. L'interface actuelle est volontairement légère ; la version source plus développée du prototype reste disponible dans l'archive créée dans la conversation ChatGPT du 17/10/2026. Ne pas présenter les tests Node antérieurs de l'archive comme des tests de cette version autonome.

## Consignes pour la suite
Les spécifications maîtres et instructions destinées à l'IA figurent dans Google Drive :
- [Cahier des charges](https://docs.google.com/document/d/1NvPK5SX2wOk-WMPpHHmQ7TeAMdlAHomV5AcD_FoYZjc/edit)
- [Instructions de développement](https://docs.google.com/document/d/1NxDHTKqsd39_yGCiLv1mVcA8gNan3oXxYHmoTXdmSaY/edit)

À faire : vérifier la première publication GitHub Pages, tester Safari iPhone/iPad, consolider le code modulaire et les tests, implémenter la PWA avec hors-ligne éprouvé.
