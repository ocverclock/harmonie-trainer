# Harmonie Trainer

Application de formation musicale tactile pour iPhone, iPad et navigateurs modernes.

## Jouer
https://ocverclock.github.io/harmonie-trainer/

## Version en cours
- Clavier de piano réaliste : touches noires au-dessus des blanches, défilement horizontal sur téléphone.
- 28 accords de référence, 3 niveaux, sessions de 10 questions et correction musicale.
- Module « II–V–I secondaires » : répondre d'abord à la question, valider, voir la réponse et l'explication, puis les points colorés, leurs trajectoires, les voix isolables et le clavier de l'accord actif.
- 5 exercices secondaires : vers G majeur, D mineur, E mineur, A mineur et F majeur.
- Affichage adaptatif : deux étapes sur téléphone, trois sur grand écran.
- Son à la demande ; aucune requête audio automatique.
- Scores enregistrés localement, sans compte utilisateur.

## Développement
Aucune dépendance à installer pour la page elle-même. Les modules ES et le CSS sont sous `src/`. L'entrée est `index.html`.

Pour les tests de théorie :
```bash
npm test
```

GitHub Actions lance les tests à chaque push sur `main`.

## Limites et à vérifier
- Version de développement ; le comportement réel du clavier et de l'audio sur iPhone/iPad reste à valider sur appareils.
- La progression du module des II–V–I secondaires n'est pas encore conservée entre sessions.
- Les correspondances de voix sont des exemples pédagogiques explicites, sans calcul de voicings optimisés.
- La version actuelle n'est pas une application native App Store ; pas de garantie de disponibilité hors ligne.
- La publication GitHub Pages doit être activée dans Settings → Pages (Deploy from main /root).

## Documents de projet
- [Spécifications](https://docs.google.com/document/d/1NvPK5SX2wOk-WMPpHHmQ7TeAMdlAHomV5AcD_FoYZjc/edit)
- [Consignes de développement pour IA](https://docs.google.com/document/d/1NxDHTKqsd39_yGCiLv1mVcA8gNan3oXxYHmoTXdmSaY/edit)
