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

## Synchronisation visuelle des voix (V0.3)

- **Temps vertical :** les trois accords du II–V–I sont placés en trois rangées, du haut vers le bas.
- **Hauteur horizontale :** chaque point est centré au-dessus de sa touche réelle, noire ou blanche.
- **Couleur et numéro fixes :** une même voix garde exactement sa couleur et son numéro dans les boules, les courbes et sur le clavier de l’accord sélectionné.
- **Un seul défilement tactile :** schéma et clavier bougent ensemble sur les petits écrans ; les boutons d’accord recentrent sur les notes concernées.
- **Conservation du clavier :** géométrie blanche/noire et aspect général inchangés.
- Géométrie partagée dans `src/piano-layout.js` ; tests de concordance dans `tests/music.test.js`.


## Nouveau mode : construire soi-même les voicings (V0.4)

**Le QCM existant est conservé.** Depuis l'accueil, la navigation « Mes voicings » ou une question de QCM, ouvrir le mode de création.

- Un objectif de II–V–I secondaire est proposé, avec les noms des trois accords à réaliser. Il s'agit d'un exercice de **voicing** et non d'identification du II/V/I, qui reste réservé au QCM.
- Pour chaque accord, choisir **quatre touches physiques** du piano (C3 et C4 sont deux notes distinctes) ; retour possible aux accords précédents avant validation globale.
- La correction, seulement après les trois accords, est fondée sur les quatre **classes de notes attendues**, indépendamment des renversements et des octaves. Le mode initial exige l'ensemble complet fondamentale, tierce, quinte, septième ; voicings rootless, omissions et tensions ne sont pas notés comme justes dans ce niveau.
- Après correction : détail des notes absentes/en trop/doublées, visualisation de « Mon voicing » et d'un « Exemple corrigé » avec les mêmes couleurs et centres de touches, comparaison pédagogique des mouvements.
- Les déplacements ne sont **pas** utilisés pour sanctionner une construction d'accord juste. Les positions grave → aigu servent de correspondances visibles entre étapes et ne revendiquent pas être un réarrangement algorithmique optimal.
- Le score (nombre d'accords justes sur trois) est enregistré localement, distinct des sessions d'accords. Les tests de théorie sont dans `tests/voicing.test.js`.


## Suivi des agents et validation

Les trois chantiers ont des issues distinctes et un journal pérenne : **[Journal des agents et décisions à valider](docs/AGENT_WORK_LOG.md)**. Les travaux de code doivent rester sur des branches/PR séparées jusqu'à la validation explicite de l'utilisateur ; chaque PR doit renseigner les tests, les choix et les blocages avant demande de fusion.
